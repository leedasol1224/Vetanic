export type NotificationType = 'new_order' | 'inventory_low' | 'payment_received';

export interface AdminNotification {
  id: string;
  orderId: string;
  orderReference: string;
  customerName: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  read: boolean;
  type: NotificationType;
  message?: string;
}
