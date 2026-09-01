export type InventoryMovementType =
  | 'Initial Stock'
  | 'Stock Received'
  | 'Sale'
  | 'Cancellation Restock'
  | 'Manual Addition'
  | 'Manual Reduction'
  | 'Stock Correction';

export interface InventoryMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  createdAt: string;
  movementType: InventoryMovementType;
  quantityChange: number; // positive or negative
  stockBefore: number;
  stockAfter: number;
  orderId?: string;
  orderReference?: string;
  reason: string;
  internalNote?: string;
  adminUser?: string;
}

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface ProductInventory {
  productId: string;
  sku: string;
  productName: string;
  categoryName: string;
  imageUrl: string;
  initialStock: number;
  stockAdded: number;
  unitsSold: number;
  positiveAdjustments: number;
  negativeAdjustments: number;
  currentStock: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
  regularPrice: number;
  launchPrice: number;
  estimatedRetailValue: number;
}

export interface ProductSalesSummary {
  productId: string;
  sku: string;
  productName: string;
  categoryName: string;
  unitsSold: number;
  orderCount: number;
  grossSales: number;
  discountAmount: number;
  netSales: number;
  avgSellingPrice: number;
  currentStock: number;
}
