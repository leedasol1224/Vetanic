import { OrderStatus } from '../types/order';

export type CustomerOrderStatus =
  | 'Order Submitted'
  | 'Order Confirmed'
  | 'Preparing for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface CustomerStatusInfo {
  customerStatus: CustomerOrderStatus;
  koreanMeaning: string;
  stepIndex: number; // 1 to 4 (or 0 for Cancelled)
  badgeClass: string;
  description: string;
  whatsNext: string;
}

export const CUSTOMER_STATUS_STAGES: Array<{
  key: CustomerOrderStatus;
  label: string;
  korean: string;
  step: number;
}> = [
  { key: 'Order Submitted', label: 'Order Submitted', korean: '주문 요청 완료', step: 1 },
  { key: 'Order Confirmed', label: 'Order Confirmed', korean: '주문 접수', step: 2 },
  { key: 'Preparing for Delivery', label: 'Preparing for Delivery', korean: '배송 준비중', step: 3 },
  { key: 'Delivered', label: 'Delivered', korean: '배송 완료', step: 4 }
];

export function mapToCustomerStatus(internalStatus: OrderStatus | string): CustomerStatusInfo {
  switch (internalStatus) {
    case 'Pending Confirmation':
      return {
        customerStatus: 'Order Submitted',
        koreanMeaning: '주문 요청 완료',
        stepIndex: 1,
        badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
        description: "We've received your order request. Stock has not yet been confirmed and payment has not been requested.",
        whatsNext: "We're checking product availability. Once confirmed, we'll send you the final order amount and payment instructions."
      };

    case 'Confirmed':
    case 'Awaiting Payment':
      return {
        customerStatus: 'Order Confirmed',
        koreanMeaning: '주문 접수',
        stepIndex: 2,
        badgeClass: 'bg-blue-50 text-blue-900 border-blue-200',
        description: 'VETANIC has checked availability and accepted your order request.',
        whatsNext: "Your order has been confirmed. We'll send you the payment instructions through your selected contact method."
      };

    case 'Paid':
    case 'Preparing':
    case 'Ready for Collection':
    case 'Out for Delivery':
      return {
        customerStatus: 'Preparing for Delivery',
        koreanMeaning: '배송 준비중',
        stepIndex: 3,
        badgeClass: 'bg-purple-50 text-purple-900 border-purple-200',
        description: 'Payment and order review are complete. Your order is now being packed and prepared for dispatch.',
        whatsNext: 'Your VETANIC order is being prepared. We will notify you once courier dispatch is underway.'
      };

    case 'Completed':
      return {
        customerStatus: 'Delivered',
        koreanMeaning: '배송 완료',
        stepIndex: 4,
        badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        description: 'Your order has been successfully delivered.',
        whatsNext: 'Your order has been delivered. Thank you for choosing VETANIC! ❤️'
      };

    case 'Cancelled':
      return {
        customerStatus: 'Cancelled',
        koreanMeaning: '주문 취소',
        stepIndex: 0,
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
        description: 'This order request has been cancelled.',
        whatsNext: 'If you have any questions, please reach out to us on Instagram @vetanic_global.'
      };

    default:
      return {
        customerStatus: 'Order Submitted',
        koreanMeaning: '주문 요청 완료',
        stepIndex: 1,
        badgeClass: 'bg-amber-50 text-amber-900 border-amber-200',
        description: "We've received your order request.",
        whatsNext: "We're checking product availability."
      };
  }
}
