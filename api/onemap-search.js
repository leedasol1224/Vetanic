// Vercel Serverless Function: Singapore OneMap Address Lookup Proxy
// GET /api/onemap-search?postal=XXXXXX

// In-memory cache for hot queries during serverless instance lifetime
const memoryCache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

// Dynamic token management for OneMap authenticated tier (if configured)
let cachedAuthToken = null;
let authTokenExpiry = 0;

async function getOneMapAuthToken() {
  const directToken = process.env.ONEMAP_TOKEN || process.env.ONEMAP_API_KEY || process.env.ONEMAP_ACCESS_TOKEN;
  if (directToken) {
    return directToken;
  }

  const email = process.env.ONEMAP_EMAIL;
  const password = process.env.ONEMAP_PASSWORD;
  if (!email || !password) {
    return null;
  }

  // Check cached token
  const now = Date.now();
  if (cachedAuthToken && authTokenExpiry > now + 60000) {
    return cachedAuthToken;
  }

  try {
    const res = await fetch("https://www.onemap.gov.sg/api/auth/post/getToken", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    if (data && data.access_token) {
      cachedAuthToken = data.access_token;
      authTokenExpiry = data.expiryTimestamp ? Number(data.expiryTimestamp) * 1000 : now + 1000 * 60 * 60 * 24 * 2;
      return cachedAuthToken;
    }
  } catch (err) {
    // Non-fatal, fallback to direct query
  }

  return null;
}

function toTitleCase(str) {
  if (!str || str === "NIL") return "";
  return str
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(word => {
      if (["hdb", "sg", "cbd", "mrt", "lrt", "cte", "pie", "aye", "ecp", "kpe", "sle", "tpe", "bke"].includes(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function formatAddressResult(item) {
  const rawBlk = item.BLK_NO && item.BLK_NO !== "NIL" ? item.BLK_NO.trim() : "";
  const road = toTitleCase(item.ROAD_NAME);
  const building = toTitleCase(item.BUILDING);

  // Determine block formatting
  let blockStr = rawBlk;

  const streetParts = [blockStr, road].filter(Boolean).join(" ");
  const parts = [];

  if (streetParts) {
    parts.push(streetParts);
  }

  // Include building name if distinct from street
  if (
    building && 
    building !== "Nil" && 
    building.toLowerCase() !== road.toLowerCase() && 
    !streetParts.toLowerCase().includes(building.toLowerCase())
  ) {
    parts.push(building);
  }

  const formattedAddress = parts.join(", ");

  return {
    formattedAddress: formattedAddress || item.ADDRESS || "",
    block: rawBlk,
    road: road,
    building: (building && building !== "Nil") ? building : "",
    postal: item.POSTAL || ""
  };
}

export default async function handler(req, res) {
  // Set CORS and security headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { postal } = req.query || {};
  const cleanPostal = (postal || "").trim().replace(/\D/g, "");

  if (!cleanPostal || cleanPostal.length !== 6) {
    return res.status(400).json({
      success: false,
      found: false,
      error: "Please provide a valid 6-digit Singapore postal code"
    });
  }

  // Check in-memory cache
  const cached = memoryCache.get(cleanPostal);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).json(cached.data);
  }

  try {
    const token = await getOneMapAuthToken();
    const headers = {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json"
    };

    if (token) {
      headers["Authorization"] = token.startsWith("Bearer ") ? token : `Bearer ${token}`;
    }

    const apiUrl = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(cleanPostal)}&returnGeom=N&getAddrDetails=Y&pageNum=1`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers,
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(200).json({
        success: true,
        found: false,
        fallback: true,
        message: "Postal code lookup service is temporarily busy. Please enter your address manually."
      });
    }

    const rawText = await response.text();
    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return res.status(200).json({
        success: true,
        found: false,
        fallback: true,
        message: "We couldn't find this postal code automatically. Please enter your address manually."
      });
    }

    if (data && data.found > 0 && Array.isArray(data.results) && data.results.length > 0) {
      const match = data.results.find(r => (r.POSTAL || "").trim() === cleanPostal) || data.results[0];
      const parsed = formatAddressResult(match);

      const resultPayload = {
        success: true,
        found: true,
        address: parsed.formattedAddress,
        details: {
          block: parsed.block,
          road: parsed.road,
          building: parsed.building,
          postal: cleanPostal
        }
      };

      memoryCache.set(cleanPostal, {
        timestamp: Date.now(),
        data: resultPayload
      });

      res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
      return res.status(200).json(resultPayload);
    }

    const notFoundPayload = {
      success: true,
      found: false,
      message: "We couldn't find this postal code automatically. Please enter your address manually."
    };

    memoryCache.set(cleanPostal, {
      timestamp: Date.now(),
      data: notFoundPayload
    });

    return res.status(200).json(notFoundPayload);
  } catch (err) {
    return res.status(200).json({
      success: true,
      found: false,
      fallback: true,
      message: "We couldn't reach the address search service. Please enter your address manually."
    });
  }
}
