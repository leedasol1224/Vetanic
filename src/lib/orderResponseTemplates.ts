import { OrderRecord } from '../types/order';
import { TemplateType } from '../types/communication';

export interface TemplateParams {
  order: OrderRecord;
  availableItemIds?: string[];
  unavailableItemIds?: string[];
  customPaymentMethod?: string;
  customCollectionNotes?: string;
}

export function formatOrderItemsList(order: OrderRecord): string {
  return order.items
    .map((item) => `${item.productName} × ${item.quantity}`)
    .join('\n');
}

export function formatDetailedItemBreakdown(order: OrderRecord): string {
  return order.items
    .map((item) => `• ${item.productName} (${item.packageSize}) × ${item.quantity} — S$${(item.unitPrice * item.quantity).toFixed(2)}`)
    .join('\n');
}

export function formatPaymentInstructions(order: OrderRecord): string {
  if (order.paymentPreference === 'paynow') {
    return `PayNow Instructions:
• Mobile Number: 8882 8621
• Reference: ${order.orderReference}
• Amount: S$${(order.pricing?.estimatedTotal || 0).toFixed(2)}`;
  }

  return `Bank Transfer Instructions:
• Bank: DBS Bank Singapore
• Account Name: VETANIC PTE. LTD.
• Account No: 072-903456-1
• Reference: ${order.orderReference}
• Amount: S$${(order.pricing?.estimatedTotal || 0).toFixed(2)}`;
}

export function formatDeliverySummary(order: OrderRecord): string {
  if (order.delivery.deliveryMethod === 'express') {
    return `Express Delivery to: ${order.delivery.deliveryAddress || ''} (S${order.delivery.postalCode || ''})`;
  }
  return `Standard Delivery to: ${order.delivery.deliveryAddress || ''} (S${order.delivery.postalCode || ''})`;
}

export function generateOrderResponse(type: TemplateType, params: TemplateParams): string {
  const { order, availableItemIds, unavailableItemIds } = params;
  const customerName = order.customer.fullName.trim();
  const orderRef = order.orderReference;
  const productTotal = (order.pricing?.productTotal || 0).toFixed(2);
  const finalTotal = (order.pricing?.estimatedTotal || 0).toFixed(2);

  switch (type) {
    case 'order_confirmed': {
      const availableItems = availableItemIds && availableItemIds.length > 0
        ? order.items.filter((i) => availableItemIds.includes(i.productId))
        : order.items;

      const availableItemsList = availableItems
        .map((item) => `${item.productName} × ${item.quantity}`)
        .join('\n');

      const itemsBreakdown = order.items
        .map((item) => `• ${item.productName} (${item.packageSize}) × ${item.quantity} — S$${(item.unitPrice * item.quantity).toFixed(2)}`)
        .join('\n');

      const deliveryFeeFormatted = (order.pricing?.deliveryFee || 0) === 0
        ? 'S$0.00 (FREE)'
        : `S$${(order.pricing?.deliveryFee || 0).toFixed(2)}`;

      return `Hi ${customerName}! Thank you for your VETANIC order 🐾

We're happy to confirm that the following items are available:

${availableItemsList}

Order Summary:
${itemsBreakdown}

Product Total: S$${productTotal}
Delivery: ${deliveryFeeFormatted}
Total: S$${finalTotal}

Your order reference is:
${orderRef}

You may proceed with payment via PayNow:

PayNow to Mobile Number
• Mobile Number: 8882 8621
• Reference: ${orderRef}
• Amount: S$${finalTotal}

Once payment has been made, please send us the payment confirmation screenshot and we'll proceed with your order.

Thank you for supporting VETANIC! ☺️`;
    }

    case 'partially_available': {
      const availableItems = availableItemIds && availableItemIds.length > 0
        ? order.items.filter((i) => availableItemIds.includes(i.productId))
        : order.items.slice(0, 1);

      const unavailableItems = unavailableItemIds && unavailableItemIds.length > 0
        ? order.items.filter((i) => unavailableItemIds.includes(i.productId))
        : order.items.filter((i) => !availableItems.some((a) => a.productId === i.productId));

      const availableItemsList = availableItems
        .map((i) => `• ${i.productName} × ${i.quantity} (S$${(i.unitPrice * i.quantity).toFixed(2)})`)
        .join('\n');

      const unavailableItemsList = unavailableItems
        .map((i) => `• ${i.productName} × ${i.quantity}`)
        .join('\n');

      const availableSubtotal = availableItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
      const delivery = availableSubtotal >= 50 ? 0 : 4.50;
      const updatedTotal = (availableSubtotal + delivery).toFixed(2);

      return `Hi ${customerName}, thank you for your VETANIC order 🐾

We've checked your order and unfortunately some items are currently unavailable.

Available:
${availableItemsList || '• (Please check available products)'}

Currently unavailable:
${unavailableItemsList || '• (Item pending restock)'}

We can proceed with the available items for:

S$${updatedTotal}

Please let us know if you would like to:

1. Proceed with the available items
2. Change the unavailable item to another product
3. Cancel the order

Sorry for the inconvenience and thank you for your understanding.`;
    }

    case 'out_of_stock': {
      const oosItems = unavailableItemIds && unavailableItemIds.length > 0
        ? order.items.filter((i) => unavailableItemIds.includes(i.productId))
        : order.items;

      const oosList = oosItems
        .map((i) => `• ${i.productName} × ${i.quantity}`)
        .join('\n');

      return `Hi ${customerName}, thank you for your interest in VETANIC 🐾

We're sorry, but the following item(s) from your order are currently out of stock:

${oosList}

Because of this, we're unable to confirm your full order at the moment.

Please let us know if you would like us to recommend an alternative product or update you when the item becomes available again.

We apologise for the inconvenience and thank you for your understanding.`;
    }

    case 'payment_received': {
      return `Hi ${customerName}! We've received your payment for order ${orderRef}.

Thank you ❤️

Your order is now being prepared.

Order Total:
S$${finalTotal}

Delivery Method:
${formatDeliverySummary(order)}

We'll update you again once your order is on the way.

Thank you!`;
    }

    case 'preparing_for_delivery': {
      return `Hi ${customerName}! Your VETANIC order ${orderRef} is now being prepared 🐾

We'll update you again once your order is out for delivery.

Thank you for your order!`;
    }

    case 'out_for_delivery': {
      const address = order.delivery.deliveryAddress
        ? `${order.delivery.deliveryAddress}${order.delivery.postalCode ? `, Singapore ${order.delivery.postalCode}` : ''}`
        : 'Address on file';

      return `Hi ${customerName}! Your VETANIC order ${orderRef} is on the way 🐾

Delivery address:
${address}

We'll let you know once your order has been delivered.

Thank you!`;
    }

    case 'order_delivered': {
      return `Hi ${customerName}! Your VETANIC order ${orderRef} has been delivered 🐾

We hope your companion enjoys their VETANIC products.

If you have any questions, feel free to reach us on Instagram @vetanic_global.

Thank you for choosing VETANIC!`;
    }

    default:
      return `Hi ${customerName}! Thank you for choosing VETANIC Singapore for order ${orderRef}.`;
  }
}
