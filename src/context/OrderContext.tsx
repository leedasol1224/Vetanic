import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { Product } from '../types/product';
import { OrderItem, OrderSubmission, OrderRecord, DeliveryMethod, PricingSummary } from '../types/order';
import { getSavedCart, saveCart, clearCart } from '../lib/storage';
import { submitOrderRequest } from '../lib/supabase';
import { calculateOrderPricing } from '../lib/pricing';

interface OrderContextType {
  items: OrderItem[];
  totalItemCount: number;
  deliveryMethod: DeliveryMethod;
  setDeliveryMethod: (method: DeliveryMethod) => void;
  pricingSummary: PricingSummary;
  addToOrder: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromOrder: (productId: string) => void;
  clearOrder: () => void;
  isItemInOrder: (productId: string) => boolean;
  getItemQuantity: (productId: string) => number;
  lastAddedProduct: { product: Product; quantity: number } | null;
  showAddedToast: boolean;
  dismissToast: () => void;
  submitOrder: (submission: OrderSubmission) => Promise<OrderRecord>;
  lastSubmittedOrder: OrderRecord | null;
  setLastSubmittedOrder: (order: OrderRecord | null) => void;
  activeProductModal: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;
  isCartDrawerOpen: boolean;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<OrderItem[]>(() => getSavedCart());
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('standard');
  const [lastAddedProduct, setLastAddedProduct] = useState<{ product: Product; quantity: number } | null>(null);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [lastSubmittedOrder, setLastSubmittedOrder] = useState<OrderRecord | null>(null);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    saveCart(items);
  }, [items]);

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const pricingSummary = useMemo(() => {
    return calculateOrderPricing(items, deliveryMethod);
  }, [items, deliveryMethod]);

  const addToOrder = (product: Product, quantity: number = 1) => {
    if (quantity <= 0 || !product.isAvailable) return;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      } else {
        return [...prevItems, { product, quantity }];
      }
    });

    setLastAddedProduct({ product, quantity });
    setShowAddedToast(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromOrder = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  };

  const clearOrder = () => {
    setItems([]);
    clearCart();
  };

  const isItemInOrder = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = items.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const dismissToast = () => {
    setShowAddedToast(false);
  };

  const openCartDrawer = () => {
    setIsCartDrawerOpen(true);
  };

  const closeCartDrawer = () => {
    setIsCartDrawerOpen(false);
  };

  const submitOrder = async (submission: OrderSubmission): Promise<OrderRecord> => {
    const orderRecord = await submitOrderRequest({
      ...submission,
      pricing: {
        subtotal: pricingSummary.productSubtotal,
        bundleDiscount: pricingSummary.bundleDiscount,
        productTotal: pricingSummary.productTotal,
        deliveryFee: pricingSummary.deliveryFee,
        estimatedTotal: pricingSummary.estimatedTotal
      }
    });
    setLastSubmittedOrder(orderRecord);
    clearOrder();
    return orderRecord;
  };

  const openProductModal = (product: Product) => {
    setActiveProductModal(product);
  };

  const closeProductModal = () => {
    setActiveProductModal(null);
  };

  return (
    <OrderContext.Provider
      value={{
        items,
        totalItemCount,
        deliveryMethod,
        setDeliveryMethod,
        pricingSummary,
        addToOrder,
        updateQuantity,
        removeFromOrder,
        clearOrder,
        isItemInOrder,
        getItemQuantity,
        lastAddedProduct,
        showAddedToast,
        dismissToast,
        submitOrder,
        lastSubmittedOrder,
        setLastSubmittedOrder,
        activeProductModal,
        openProductModal,
        closeProductModal,
        isCartDrawerOpen,
        openCartDrawer,
        closeCartDrawer
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};
