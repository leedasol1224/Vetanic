import * as XLSX from 'xlsx';
import { PRODUCTS } from '../data/products';
import { 
  InventoryMovement, 
  InventoryMovementType, 
  ProductInventory, 
  ProductSalesSummary, 
  StockStatus,
  ExpiryStatus
} from '../types/inventory';
import { OrderRecord } from '../types/order';
import { fetchStorefrontInventoryFromSupabase } from './supabase';

type InventoryListener = () => void;
const inventoryListeners = new Set<InventoryListener>();

export function subscribeToInventory(listener: InventoryListener): () => void {
  inventoryListeners.add(listener);
  return () => {
    inventoryListeners.delete(listener);
  };
}

export function notifyInventoryListeners(): void {
  inventoryListeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // Ignore listener error
    }
  });
}

/**
 * Confirmed stock quantities and expiry dates
 */
export const INITIAL_INVENTORY_DATA: Record<string, { currentStock: number; expiryDate: string }> = {
  'complete-v': { currentStock: 150, expiryDate: '15 Mar 2028' },
  'urena-clear': { currentStock: 22, expiryDate: '10 Jul 2027' },
  'hairball-care': { currentStock: 6, expiryDate: '13 Jul 2027' },
  'probiotics': { currentStock: 8, expiryDate: '23 Mar 2028' },
  'clear-eyes': { currentStock: 11, expiryDate: '21 Jan 2028' },
  'sweet-potato-pumpkin-treats': { currentStock: 4, expiryDate: '5 May 2027' },
  'freeze-dried-vegetables': { currentStock: 26, expiryDate: '14 Dec 2027' },
  'soft-dental-chew': { currentStock: 30, expiryDate: '12 Nov 2027' },
  'fresh-omega-3-mini': { currentStock: 101, expiryDate: '2 Jul 2028' },
  'fresh-omega-3-premium': { currentStock: 34, expiryDate: '26 Feb 2028' },
  'joint-support': { currentStock: 0, expiryDate: '—' },
};

const INVENTORY_RECORDS_STORAGE_KEY = 'vetanic_inventory_records_v4';
const INVENTORY_MOVEMENTS_STORAGE_KEY = 'vetanic_inventory_movements_v4';
const PRODUCT_THRESHOLDS_STORAGE_KEY = 'vetanic_product_thresholds_v1';

// Purge legacy demo movements & old inventory keys if present in browser storage
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    localStorage.removeItem('vetanic_inventory_movements_v1');
    localStorage.removeItem('vetanic_inventory_movements_v2');
    localStorage.removeItem('vetanic_inventory_movements_v3');
    localStorage.removeItem('vetanic_inventory_items_v1');
    localStorage.removeItem('vetanic_inventory_records_v1');
    localStorage.removeItem('vetanic_inventory_records_v2');
    localStorage.removeItem('vetanic_inventory_records_v3');
  } catch {
    // Ignore storage errors
  }
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Robust date parser supporting YYYY-MM-DD, D MMM YYYY, and standard formats
 */
export function parseCustomDate(str?: string | null): Date | null {
  if (!str || str === '—' || str.trim() === '') return null;
  const trimmed = str.trim();
  // Check YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const [y, m, d] = trimmed.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  // Check "D MMM YYYY" or "DD MMM YYYY"
  const m = trimmed.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})$/);
  if (m) {
    const day = parseInt(m[1], 10);
    const monthIdx = MONTH_NAMES.findIndex((mo) => mo.toLowerCase() === m[2].toLowerCase());
    const year = parseInt(m[3], 10);
    if (monthIdx >= 0) {
      return new Date(year, monthIdx, day);
    }
  }
  const fallback = new Date(trimmed);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Formats date into readable string, e.g. "15 Mar 2028"
 */
export function formatDateDisplay(d: Date | string | undefined | null): string {
  if (!d) return '—';
  const dateObj = typeof d === 'string' ? parseCustomDate(d) : d;
  if (!dateObj || isNaN(dateObj.getTime())) return typeof d === 'string' && d.trim() ? d : '—';
  return `${dateObj.getDate()} ${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}

/**
 * Formats date into input date value, e.g. "2028-03-15"
 */
export function formatDateInput(d: Date | string | undefined | null): string {
  if (!d) return '';
  const dateObj = typeof d === 'string' ? parseCustomDate(d) : d;
  if (!dateObj || isNaN(dateObj.getTime())) return '';
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/**
 * Stock Status Logic:
 * - In Stock — more than 10 units
 * - Low Stock — 1 to 10 units
 * - Out of Stock — 0 units
 */
export function calculateStockStatus(currentStock: number, isAvailable: boolean = true): StockStatus {
  if (currentStock <= 0 || !isAvailable) {
    return 'Out of Stock';
  }
  if (currentStock <= 10) {
    return 'Low Stock';
  }
  return 'In Stock';
}

/**
 * Expiry Status Logic:
 * - Normal — more than 6 months remaining
 * - Monitor — 3 to 6 months remaining
 * - Short-Dated — less than 3 months remaining
 * - Expired — expiry date has passed
 */
export function calculateExpiryStatus(expiryStr?: string | null, now: Date = new Date()): {
  status: ExpiryStatus | '—';
  daysRemaining?: number;
} {
  if (!expiryStr || expiryStr === '—' || expiryStr.trim() === '') {
    return { status: '—' };
  }

  const expiry = parseCustomDate(expiryStr);
  if (!expiry) {
    return { status: '—' };
  }

  // End of day for expiry, start of day for now
  const expiryTime = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate(), 23, 59, 59).getTime();
  const nowTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).getTime();

  if (expiryTime < nowTime) {
    return { status: 'Expired', daysRemaining: Math.floor((expiryTime - nowTime) / (1000 * 60 * 60 * 24)) };
  }

  const msRemaining = expiryTime - nowTime;
  const daysRemaining = Math.ceil(msRemaining / (1000 * 60 * 60 * 24));

  // 3 months and 6 months thresholds based on calendar
  const threeMonths = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate(), 23, 59, 59).getTime();
  const sixMonths = new Date(now.getFullYear(), now.getMonth() + 6, now.getDate(), 23, 59, 59).getTime();

  if (expiryTime < threeMonths) {
    return { status: 'Short-Dated', daysRemaining };
  } else if (expiryTime <= sixMonths) {
    return { status: 'Monitor', daysRemaining };
  } else {
    return { status: 'Normal', daysRemaining };
  }
}

export interface StoredProductInventory {
  currentStock: number;
  expiryDate: string;
  lastUpdated: string;
}

/**
 * Get stored product inventory records, initializing with confirmed stock and expiries if needed
 */
export function getStoredInventoryRecords(): Record<string, StoredProductInventory> {
  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem(INVENTORY_RECORDS_STORAGE_KEY) : null;
    let records: Record<string, StoredProductInventory> = raw ? JSON.parse(raw) : {};

    let needsSave = false;
    Object.entries(INITIAL_INVENTORY_DATA).forEach(([pid, initial]) => {
      if (!records[pid] || typeof records[pid].currentStock !== 'number') {
        records[pid] = {
          currentStock: initial.currentStock,
          expiryDate: initial.expiryDate,
          lastUpdated: new Date().toISOString()
        };
        needsSave = true;
      }
    });

    if (needsSave && typeof window !== 'undefined') {
      localStorage.setItem(INVENTORY_RECORDS_STORAGE_KEY, JSON.stringify(records));
    }

    return records;
  } catch (e) {
    console.error('Failed to load inventory records', e);
    const defaults: Record<string, StoredProductInventory> = {};
    Object.entries(INITIAL_INVENTORY_DATA).forEach(([pid, initial]) => {
      defaults[pid] = {
        currentStock: initial.currentStock,
        expiryDate: initial.expiryDate,
        lastUpdated: new Date().toISOString()
      };
    });
    return defaults;
  }
}

/**
 * Save inventory records to storage and notify subscribers
 */
export function saveStoredInventoryRecords(records: Record<string, StoredProductInventory>): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(INVENTORY_RECORDS_STORAGE_KEY, JSON.stringify(records));
    }
    notifyInventoryListeners();
  } catch (e) {
    console.error('Failed to save inventory records', e);
  }
}

let isSyncingWithSupabase = false;

/**
 * Authoritatively sync inventory with Supabase.
 * Loads latest stock from Supabase / serverless inventory endpoint and updates records.
 */
export async function syncInventoryWithSupabase(): Promise<Record<string, StoredProductInventory>> {
  if (isSyncingWithSupabase) {
    return getStoredInventoryRecords();
  }
  isSyncingWithSupabase = true;

  try {
    const remoteData = await fetchStorefrontInventoryFromSupabase();
    if (remoteData) {
      const records = getStoredInventoryRecords();
      let hasChanges = false;

      Object.entries(remoteData).forEach(([pid, item]) => {
        if (!records[pid] || records[pid].currentStock !== item.currentStock) {
          records[pid] = {
            currentStock: item.currentStock,
            expiryDate: item.expiryDate || records[pid]?.expiryDate || '—',
            lastUpdated: new Date().toISOString()
          };
          hasChanges = true;
        }
      });

      if (hasChanges) {
        saveStoredInventoryRecords(records);
      }
      return records;
    }
  } catch (err) {
    console.warn('Inventory sync notice:', err);
  } finally {
    isSyncingWithSupabase = false;
  }

  return getStoredInventoryRecords();
}

/**
 * Directly update product current stock and/or expiry date
 */
export function updateProductInventory(
  productId: string,
  updates: { currentStock?: number; expiryDate?: string; reason?: string }
): ProductInventory | undefined {
  const records = getStoredInventoryRecords();
  const current = records[productId] || {
    currentStock: INITIAL_INVENTORY_DATA[productId]?.currentStock ?? 0,
    expiryDate: INITIAL_INVENTORY_DATA[productId]?.expiryDate ?? '—',
    lastUpdated: new Date().toISOString()
  };

  const oldStock = current.currentStock;
  const newStock = updates.currentStock !== undefined ? Math.max(0, updates.currentStock) : oldStock;
  const newExpiry = updates.expiryDate !== undefined ? formatDateDisplay(updates.expiryDate) : current.expiryDate;

  records[productId] = {
    currentStock: newStock,
    expiryDate: newExpiry,
    lastUpdated: new Date().toISOString()
  };

  saveStoredInventoryRecords(records);

  // If stock quantity changed, log an audit movement
  if (updates.currentStock !== undefined && oldStock !== newStock) {
    const diff = newStock - oldStock;
    const prod = PRODUCTS.find((p) => p.id === productId);
    const movement: InventoryMovement = {
      id: `mvt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      productId,
      productName: prod ? prod.name : productId,
      sku: prod ? prod.sku : 'VET-SKU',
      createdAt: new Date().toISOString(),
      movementType: 'Stock Correction',
      quantityChange: diff,
      stockBefore: oldStock,
      stockAfter: newStock,
      reason: updates.reason || 'Admin direct stock update',
      adminUser: 'VETANIC Admin'
    };
    const movements = getInventoryMovements();
    movements.unshift(movement);
    saveInventoryMovements(movements);
  }

  return getProductInventory(productId);
}

/**
 * Update stock quantity only
 */
export function updateProductStock(productId: string, newStock: number, reason?: string): ProductInventory | undefined {
  return updateProductInventory(productId, { currentStock: newStock, reason });
}

/**
 * Update expiry date only
 */
export function updateProductExpiryDate(productId: string, newExpiryDate: string): ProductInventory | undefined {
  return updateProductInventory(productId, { expiryDate: newExpiryDate });
}

/**
 * Load low stock thresholds from storage
 */
export function getProductThresholds(): Record<string, number> {
  try {
    const raw = localStorage.getItem(PRODUCT_THRESHOLDS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save custom low stock threshold
 */
export function updateProductThreshold(productId: string, threshold: number): void {
  try {
    const current = getProductThresholds();
    current[productId] = Math.max(0, threshold);
    localStorage.setItem(PRODUCT_THRESHOLDS_STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.error('Failed to update threshold', e);
  }
}

/**
 * Get all chronological inventory movements
 */
export function getInventoryMovements(): InventoryMovement[] {
  try {
    const raw = localStorage.getItem(INVENTORY_MOVEMENTS_STORAGE_KEY);
    if (!raw || JSON.parse(raw).length === 0) {
      return seedInitialInventoryMovements();
    }
    const movements: InventoryMovement[] = JSON.parse(raw);

    // Ensure all active consumer products with initial stock are present in movements
    let updated = false;
    const baseTime = Date.now() - 1000 * 60 * 60 * 24 * 7;
    PRODUCTS.forEach((p, idx) => {
      if (p.salesChannel === 'veterinary_only') return;
      const hasMovement = movements.some((m) => m.productId === p.id);
      if (!hasMovement && (p.initialStock ?? 0) > 0) {
        const initQty = p.initialStock ?? 30;
        movements.push({
          id: `mvt-init-${p.id}`,
          productId: p.id,
          productName: p.name,
          sku: p.sku,
          createdAt: new Date(baseTime + idx * 1000 * 60).toISOString(),
          movementType: 'Initial Stock',
          quantityChange: initQty,
          stockBefore: 0,
          stockAfter: initQty,
          reason: 'Initial stock intake for Singapore launch',
          internalNote: 'Singapore Pet Festival & launch batch inventory'
        });
        updated = true;
      }
    });

    if (updated) {
      saveInventoryMovements(movements);
    }

    return movements;
  } catch (e) {
    console.error('Failed to load inventory movements', e);
    return seedInitialInventoryMovements();
  }
}

/**
 * Save inventory movements
 */
function saveInventoryMovements(movements: InventoryMovement[]): void {
  try {
    localStorage.setItem(INVENTORY_MOVEMENTS_STORAGE_KEY, JSON.stringify(movements));
  } catch (e) {
    console.error('Failed to save inventory movements', e);
  }
}

/**
 * Reconcile and calculate live product inventory from stored records & movement ledger
 */
export function getProductInventoryList(): ProductInventory[] {
  const records = getStoredInventoryRecords();
  const movements = getInventoryMovements();
  const thresholds = getProductThresholds();

  return PRODUCTS.map((product) => {
    const stored = records[product.id] || {
      currentStock: INITIAL_INVENTORY_DATA[product.id]?.currentStock ?? (product.initialStock ?? 0),
      expiryDate: INITIAL_INVENTORY_DATA[product.id]?.expiryDate ?? '—',
      lastUpdated: new Date().toISOString()
    };

    const currentStock = Math.max(0, stored.currentStock);
    const expiryDate = stored.expiryDate || '—';
    const expiryInfo = calculateExpiryStatus(expiryDate);
    const stockStatus = calculateStockStatus(currentStock, product.isAvailable !== false);

    const productMovements = movements.filter((m) => m.productId === product.id);

    let initialStock = 0;
    let stockAdded = 0;
    let unitsSold = 0;
    let positiveAdjustments = 0;
    let negativeAdjustments = 0;

    productMovements.forEach((m) => {
      switch (m.movementType) {
        case 'Initial Stock':
          initialStock += m.quantityChange;
          break;
        case 'Stock Received':
        case 'Manual Addition':
          stockAdded += m.quantityChange;
          positiveAdjustments += m.quantityChange;
          break;
        case 'Sale':
          unitsSold += Math.abs(m.quantityChange);
          break;
        case 'Cancellation Restock':
          // Restock reduces net units sold or counts as positive adjustment
          unitsSold = Math.max(0, unitsSold - Math.abs(m.quantityChange));
          positiveAdjustments += m.quantityChange;
          break;
        case 'Manual Reduction':
          negativeAdjustments += Math.abs(m.quantityChange);
          break;
        case 'Stock Correction':
          if (m.quantityChange >= 0) {
            positiveAdjustments += m.quantityChange;
          } else {
            negativeAdjustments += Math.abs(m.quantityChange);
          }
          break;
      }
    });

    const threshold = thresholds[product.id] ?? 10;
    const estimatedRetailValue = currentStock * product.regularPrice;

    return {
      productId: product.id,
      sku: product.sku,
      productName: product.name,
      categoryName: product.categoryName,
      imageUrl: product.imageUrl,
      initialStock,
      stockAdded,
      unitsSold,
      positiveAdjustments,
      negativeAdjustments,
      currentStock,
      lowStockThreshold: threshold,
      stockStatus,
      expiryDate,
      expiryStatus: expiryInfo.status,
      daysToExpiry: expiryInfo.daysRemaining,
      lastUpdated: stored.lastUpdated,
      regularPrice: product.regularPrice,
      launchPrice: product.launchPrice,
      estimatedRetailValue
    };
  });
}

/**
 * Get inventory summary for a single product
 */
export function getProductInventory(productId: string): ProductInventory | undefined {
  const list = getProductInventoryList();
  return list.find((p) => p.productId === productId);
}

/**
 * Get current stock count for a product
 */
export function getProductStock(productId: string): number {
  const inv = getProductInventory(productId);
  return inv ? inv.currentStock : 0;
}

/**
 * Check if a product is currently in stock
 */
export function isProductInStock(productId: string): boolean {
  const inv = getProductInventory(productId);
  if (!inv) return true;
  return inv.currentStock > 0;
}

/**
 * Sort products dynamically: in-stock consumer products first, 
 * veterinary clinic exclusive products cleanly positioned (not marked sold-out),
 * and sold-out consumer items moved to the bottom.
 * Preserves natural display order within each group.
 */
export function sortProductsByStockAvailability<T extends { id: string; displayOrder?: number; isAvailable?: boolean; salesChannel?: 'consumer' | 'veterinary_only' }>(
  products: T[]
): T[] {
  const inStockList: T[] = [];
  const veterinaryList: T[] = [];
  const outOfStockList: T[] = [];

  for (const product of products) {
    if (product.salesChannel === 'veterinary_only') {
      // Veterinary-only products are clinic-exclusive and must NOT be treated as sold out
      veterinaryList.push(product);
    } else {
      const stock = getProductStock(product.id);
      const inStock = stock > 0 && product.isAvailable !== false;
      if (inStock) {
        inStockList.push(product);
      } else {
        outOfStockList.push(product);
      }
    }
  }

  // Preserve existing displayOrder within each group
  inStockList.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  veterinaryList.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
  outOfStockList.sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));

  return [...inStockList, ...veterinaryList, ...outOfStockList];
}

/**
 * Append a manual stock adjustment to the ledger
 */
export function addStockMovement(data: {
  productId: string;
  movementType: InventoryMovementType;
  quantityChange: number;
  reason: string;
  internalNote?: string;
  adminUser?: string;
  orderId?: string;
  orderReference?: string;
}): InventoryMovement {
  const currentInv = getProductInventory(data.productId);
  const stockBefore = currentInv ? currentInv.currentStock : 0;
  const stockAfter = Math.max(0, stockBefore + data.quantityChange);

  const prod = PRODUCTS.find((p) => p.id === data.productId);
  const productName = prod ? prod.name : data.productId;
  const sku = prod ? prod.sku : 'VET-SKU';

  const newMovement: InventoryMovement = {
    id: `mvt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    productId: data.productId,
    productName,
    sku,
    createdAt: new Date().toISOString(),
    movementType: data.movementType,
    quantityChange: data.quantityChange,
    stockBefore,
    stockAfter,
    orderId: data.orderId,
    orderReference: data.orderReference,
    reason: data.reason,
    internalNote: data.internalNote,
    adminUser: data.adminUser || 'VETANIC Admin'
  };

  const movements = getInventoryMovements();
  movements.unshift(newMovement);
  saveInventoryMovements(movements);

  // Sync stored inventory record
  const records = getStoredInventoryRecords();
  if (records[data.productId]) {
    records[data.productId].currentStock = stockAfter;
    records[data.productId].lastUpdated = new Date().toISOString();
  } else {
    records[data.productId] = {
      currentStock: stockAfter,
      expiryDate: INITIAL_INVENTORY_DATA[data.productId]?.expiryDate ?? '—',
      lastUpdated: new Date().toISOString()
    };
  }
  saveStoredInventoryRecords(records);

  return newMovement;
}

/**
 * Handle Order Stock Deduction on order status transition to 'Paid'
 */
export function deductOrderStockOnPayment(order: OrderRecord): void {
  if (order.inventoryDeducted) {
    return; // Prevent duplicate deductions
  }

  order.items.forEach((item) => {
    addStockMovement({
      productId: item.productId,
      movementType: 'Sale',
      quantityChange: -item.quantity,
      reason: `Sale from Order ${order.orderReference}`,
      orderId: order.id,
      orderReference: order.orderReference,
      internalNote: `Customer: ${order.customer.fullName} (${order.paymentPreference.toUpperCase()})`
    });
  });
}

/**
 * Handle Order Stock Restoration on order cancellation if previously deducted
 */
export function restoreOrderStockOnCancellation(order: OrderRecord): void {
  if (!order.inventoryDeducted || order.inventoryRestored) {
    return; // Only restore if deducted and not yet restored
  }

  order.items.forEach((item) => {
    addStockMovement({
      productId: item.productId,
      movementType: 'Cancellation Restock',
      quantityChange: item.quantity,
      reason: `Restocked from cancelled order ${order.orderReference}`,
      orderId: order.id,
      orderReference: order.orderReference,
      internalNote: `Order ${order.orderReference} cancelled by admin`
    });
  });
}

/**
 * Calculate Sales Summary per product from paid/completed orders
 */
export function getProductSalesSummary(
  orders: OrderRecord[],
  filter?: { fromDate?: string; toDate?: string }
): ProductSalesSummary[] {
  // Only count Paid, Preparing, Out for Delivery, Completed
  const eligibleOrders = orders.filter((o) => {
    if (o.status === 'Cancelled' || o.status === 'Pending Confirmation' || o.status === 'Awaiting Payment') {
      return false;
    }
    const orderTime = new Date(o.createdAt).getTime();
    if (filter?.fromDate && orderTime < new Date(filter.fromDate).getTime()) return false;
    if (filter?.toDate && orderTime > new Date(filter.toDate).getTime()) return false;
    return true;
  });

  const inventoryList = getProductInventoryList();

  return PRODUCTS.map((product) => {
    const inv = inventoryList.find((i) => i.productId === product.id);
    let unitsSold = 0;
    let orderCount = 0;
    let grossSales = 0;

    eligibleOrders.forEach((ord) => {
      const line = ord.items.find((i) => i.productId === product.id);
      if (line) {
        unitsSold += line.quantity;
        orderCount += 1;
        grossSales += line.unitPrice * line.quantity;
      }
    });

    const avgSellingPrice = unitsSold > 0 ? grossSales / unitsSold : product.launchPrice;

    return {
      productId: product.id,
      sku: product.sku,
      productName: product.name,
      categoryName: product.categoryName,
      unitsSold,
      orderCount,
      grossSales,
      discountAmount: 0,
      netSales: grossSales,
      avgSellingPrice,
      currentStock: inv ? inv.currentStock : 0
    };
  });
}

/**
 * Export to real Excel (.xlsx) file with sheet formatting
 */
export function exportToExcel(
  type: 'summary' | 'sales' | 'movements',
  options?: {
    orders?: OrderRecord[];
    dateRangeName?: string;
    fromDate?: string;
    toDate?: string;
  }
): void {
  const wb = XLSX.utils.book_new();
  const dateStr = new Date().toISOString().split('T')[0];

  if (type === 'summary') {
    const inventory = getProductInventoryList();
    const rows = inventory.map((item) => ({
      'Product Name': item.productName,
      'SKU': item.sku,
      'Category': item.categoryName,
      'Current Stock': item.currentStock,
      'Expiry Date': item.expiryDate || '—',
      'Stock Status': item.stockStatus,
      'Expiry Status': item.expiryStatus || '—',
      'Last Updated': item.lastUpdated ? new Date(item.lastUpdated).toLocaleString('en-SG') : '—',
      'Initial Stock': item.initialStock,
      'Stock Added': item.stockAdded,
      'Units Sold': item.unitsSold,
      'Positive Adjustments': item.positiveAdjustments,
      'Negative Adjustments': item.negativeAdjustments,
      'Regular Price (SGD)': item.regularPrice,
      'Launch Price (SGD)': item.launchPrice,
      'Estimated Retail Value (SGD)': item.estimatedRetailValue
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 30 }, { wch: 15 }, { wch: 16 }, { wch: 14 }, { wch: 16 },
      { wch: 14 }, { wch: 14 }, { wch: 22 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 26 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Inventory Summary');
    XLSX.writeFile(wb, `VETANIC_Inventory_${dateStr}.xlsx`);
  } else if (type === 'sales') {
    const sales = getProductSalesSummary(options?.orders || [], {
      fromDate: options?.fromDate,
      toDate: options?.toDate
    });

    const rows = sales.map((item) => ({
      'SKU': item.sku,
      'Product Name': item.productName,
      'Category': item.categoryName,
      'Units Sold': item.unitsSold,
      'Number of Orders': item.orderCount,
      'Gross Product Sales (SGD)': item.grossSales,
      'Net Product Sales (SGD)': item.netSales,
      'Average Selling Price (SGD)': Number(item.avgSellingPrice.toFixed(2)),
      'Current Stock': item.currentStock
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 15 }, { wch: 30 }, { wch: 16 }, { wch: 12 }, { wch: 16 },
      { wch: 24 }, { wch: 22 }, { wch: 26 }, { wch: 14 }
    ];

    const rangeTag = options?.dateRangeName ? `_${options.dateRangeName}` : '';
    XLSX.utils.book_append_sheet(wb, ws, 'Product Sales');
    XLSX.writeFile(wb, `VETANIC_Product_Sales_${dateStr}${rangeTag}.xlsx`);
  } else if (type === 'movements') {
    let movements = getInventoryMovements();
    if (options?.fromDate || options?.toDate) {
      movements = movements.filter((m) => {
        const time = new Date(m.createdAt).getTime();
        if (options.fromDate && time < new Date(options.fromDate).getTime()) return false;
        if (options.toDate && time > new Date(options.toDate).getTime()) return false;
        return true;
      });
    }

    const rows = movements.map((m) => ({
      'Date': new Date(m.createdAt).toLocaleDateString('en-SG'),
      'Time': new Date(m.createdAt).toLocaleTimeString('en-SG', { hour: '2-digit', minute: '2-digit' }),
      'SKU': m.sku,
      'Product Name': m.productName,
      'Movement Type': m.movementType,
      'Quantity Change': m.quantityChange,
      'Stock Before': m.stockBefore,
      'Stock After': m.stockAfter,
      'Order Reference': m.orderReference || '—',
      'Reason': m.reason,
      'Internal Note': m.internalNote || '—'
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 14 }, { wch: 10 }, { wch: 15 }, { wch: 28 }, { wch: 20 },
      { wch: 16 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 35 }, { wch: 35 }
    ];

    XLSX.utils.book_append_sheet(wb, ws, 'Stock Movements');
    XLSX.writeFile(wb, `VETANIC_Stock_Movements_${dateStr}.xlsx`);
  }
}

/**
 * Initial Seeding for Movements Ledger
 */
function seedInitialInventoryMovements(): InventoryMovement[] {
  const movements: InventoryMovement[] = [];
  const baseTime = Date.now() - 1000 * 60 * 60 * 24 * 7; // 7 days ago

  PRODUCTS.forEach((p, idx) => {
    if (p.salesChannel === 'veterinary_only') return;
    const initial = INITIAL_INVENTORY_DATA[p.id];
    const initQty = initial ? initial.currentStock : (p.initialStock ?? 0);
    movements.push({
      id: `mvt-init-${p.id}`,
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      createdAt: new Date(baseTime + idx * 1000 * 60).toISOString(),
      movementType: 'Initial Stock',
      quantityChange: initQty,
      stockBefore: 0,
      stockAfter: initQty,
      reason: 'Initial stock intake for Singapore launch',
      internalNote: 'Singapore Pet Festival & launch batch inventory'
    });
  });

  try {
    localStorage.setItem(INVENTORY_MOVEMENTS_STORAGE_KEY, JSON.stringify(movements));
  } catch (e) {
    console.error('Failed to seed movements', e);
  }

  return movements;
}
