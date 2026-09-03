export type TemplateType =
  | 'order_confirmed'
  | 'partially_available'
  | 'out_of_stock'
  | 'payment_received'
  | 'ready_for_collection'
  | 'out_for_delivery'
  | 'custom';

export type CommunicationChannel = 'WhatsApp' | 'Email' | 'Telegram' | 'Instagram' | 'SMS' | 'Other';

export interface CommunicationLog {
  id: string;
  orderId: string;
  orderReference: string;
  templateType: TemplateType | string;
  channel: CommunicationChannel;
  message: string;
  createdAt: string;
  adminUser: string;
  status: 'Sent' | 'Copied' | 'Logged';
}
