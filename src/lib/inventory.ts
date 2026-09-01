import * as XLSX from 'xlsx';
import { PRODUCTS } from '../data/products';
import { 
  InventoryMovement, 
  InventoryMovementType, 
  ProductInventory, 
  ProductSalesSummary, 
  StockStatus 
} from '../types/inventory';
import { OrderRecord } from '../types/order';

const INVENTORY_MOVEMENTS_STORAGE_KEY = 'vetanic_inventory_movements_v2';
const PRODUCT_THRESHOLDS_STORAGE_KEY = 'vetanic_product_thresholds_v1';

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
    return JSON.parse(raw);
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
 * Reconcile and calculate live product inventory from movement ledger
 */
export function getProductInventoryList(): ProductInventory[] {
  const movements = getInventoryMovements();
  const thresholds = getProductThresholds();

  return PRODUCTS.map((product) => {
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

    // Current Stock = Initial Stock + Stock Received + Positive Adjustments - Units Sold - Negative Adjustments
    const netCalculated = initialStock + stockAdded + positiveAdjustments - unitsSold - negativeAdjustments;
    // Ensure not negative
    const currentStock = Math.max(0, netCalculated);

    const threshold = thresholds[product.id] ?? product.lowStockThreshold ?? 5;

    let stockStatus: StockStatus = 'In Stock';
    if (currentStock === 0 || !product.isAvailable) {
      stockStatus = 'Out of Stock';
    } else if (currentStock <= threshold) {
      stockStatus = 'Low Stock';
    }

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
  // Only count Paid, Preparing, Ready for Collection, Out for Delivery, Completed
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
      'SKU': item.sku,
      'Product Name': item.productName,
      'Category': item.categoryName,
      'Initial Stock': item.initialStock,
      'Stock Added': item.stockAdded,
      'Units Sold': item.unitsSold,
      'Positive Adjustments': item.positiveAdjustments,
      'Negative Adjustments': item.negativeAdjustments,
      'Current Stock': item.currentStock,
      'Low Stock Threshold': item.lowStockThreshold,
      'Stock Status': item.stockStatus,
      'Regular Price (SGD)': item.regularPrice,
      'Launch Price (SGD)': item.launchPrice,
      'Estimated Retail Value (SGD)': item.estimatedRetailValue
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    ws['!cols'] = [
      { wch: 15 }, { wch: 30 }, { wch: 16 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 14 }, { wch: 18 },
      { wch: 14 }, { wch: 18 }, { wch: 18 }, { wch: 26 }
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
  });

  // Seed sample stock received & sale records for demo
  movements.push({
    id: `mvt-demo-sale-1`,
    productId: 'fresh-omega-3-premium',
    productName: 'Fresh Omega-3 Premium',
    sku: 'VET-OMG-PREM',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    movementType: 'Sale',
    quantityChange: -3,
    stockBefore: 30,
    stockAfter: 27,
    orderReference: 'VET-2026-6210',
    reason: 'Sale from Order VET-2026-6210',
    internalNote: 'Samantha Wong (PayNow verified)'
  });

  movements.push({
    id: `mvt-demo-sale-2`,
    productId: 'sweet-potato-pumpkin-treats',
    productName: 'Sweet Potato & Pumpkin Treats',
    sku: 'VET-TRT-PUMP',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
    movementType: 'Sale',
    quantityChange: -1,
    stockBefore: 50,
    stockAfter: 49,
    orderReference: 'VET-2026-6210',
    reason: 'Sale from Order VET-2026-6210',
    internalNote: 'Samantha Wong (PayNow verified)'
  });

  movements.push({
    id: `mvt-demo-sale-3`,
    productId: 'urena-clear',
    productName: 'Urena Clear',
    sku: 'VET-CAT-UREN',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 70).toISOString(),
    movementType: 'Sale',
    quantityChange: -3,
    stockBefore: 20,
    stockAfter: 17,
    orderReference: 'VET-2026-4882',
    reason: 'Sale from Order VET-2026-4882',
    internalNote: 'Karen Ng (Completed collection)'
  });

  try {
    localStorage.setItem(INVENTORY_MOVEMENTS_STORAGE_KEY, JSON.stringify(movements));
  } catch (e) {
    console.error('Failed to seed movements', e);
  }

  return movements;
}
