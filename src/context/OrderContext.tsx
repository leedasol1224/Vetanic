import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { Product } from '../types/product';
import { OrderItem, OrderSubmission, OrderRecord, DeliveryMethod, PricingSummary } from '../types/order';
import { getSavedCart, saveCart, clearCart } from '../lib/storage';
import { submitOrderRequest } from '../lib/supabase';
import { calculateOrderPricing } from '../lib/pricing';
import { 
  getProductStock as getStockFromInventory, 
  syncInventoryWithSupabase, 
  subscribeToInventory 
} from '../lib/inventory';

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
  getProductStock: (productId: string) => number;
  getRemainingStock: (productId: string) => number;
  isMaxStockReached: (productId: string) => boolean;
  getStockLimitMessage: (productId: string) => string | null;
  inventoryVersion: number;
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
  const [inventoryVersion, setInventoryVersion] = useState<number>(0);

  // Sync inventory authoritatively with Supabase on mount and listen for real-time inventory updates
  useEffect(() => {
    syncInventoryWithSupabase().then(() => {
      setInventoryVersion((v) => v + 1);
    });

    const unsubscribe = subscribeToInventory(() => {
      setInventoryVersion((v) => v + 1);
    });

    return () => unsubscribe();
  }, []);

  // Sync items to local storage
  useEffect(() => {
    saveCart(items);
  }, [items]);

  // Reconcile cart items if inventory limits drop below cart quantity
  useEffect(() => {
    setItems((prevItems) => {
      let changed = false;
      const reconciled = prevItems.map((item) => {
        const stock = getStockFromInventory(item.product.id);
        if (item.quantity > stock) {
          changed = true;
          return { ...item, quantity: Math.max(0, stock) };
        }
        return item;
      }).filter((item) => item.quantity > 0);

      return changed ? reconciled : prevItems;
    });
  }, [inventoryVersion]);

  const totalItemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const pricingSummary = useMemo(() => {
    return calculateOrderPricing(items, deliveryMethod);
  }, [items, deliveryMethod]);

  const getProductStock = useCallback((productId: string): number => {
    return getStockFromInventory(productId);
  }, [inventoryVersion]);

  const getItemQuantity = useCallback((productId: string): number => {
    const item = items.find((item) => item.product.id === productId);
    return item ? item.quantity : 0;
  }, [items]);

  const getRemainingStock = useCallback((productId: string): number => {
    const stock = getStockFromInventory(productId);
    const inCart = getItemQuantity(productId);
    return Math.max(0, stock - inCart);
  }, [inventoryVersion, getItemQuantity]);

  const isMaxStockReached = useCallback((productId: string): boolean => {
    const stock = getStockFromInventory(productId);
    const inCart = getItemQuantity(productId);
    return inCart >= stock;
  }, [inventoryVersion, getItemQuantity]);

  const getStockLimitMessage = useCallback((productId: string): string | null => {
    const stock = getStockFromInventory(productId);
    const inCart = getItemQuantity(productId);
    if (stock > 0 && inCart >= stock) {
      return `Only ${stock} available in stock.`;
    }
    return null;
  }, [inventoryVersion, getItemQuantity]);

  const addToOrder = (product: Product, quantity: number = 1) => {
    const stock = getStockFromInventory(product.id);
    if (quantity <= 0 || !product.isAvailable || product.salesChannel === 'veterinary_only' || stock <= 0) return;

    const currentQty = getItemQuantity(product.id);
    const remainingAllowed = Math.max(0, stock - currentQty);

    if (remainingAllowed <= 0) {
      // Reached maximum limit; do not add
      return;
    }

    const actualQuantityToAdd = Math.min(quantity, remainingAllowed);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = Math.min(stock, updated[existingIndex].quantity + actualQuantityToAdd);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty
        };
        return updated;
      } else {
        return [...prevItems, { product, quantity: actualQuantityToAdd }];
      }
    });

    setLastAddedProduct({ product, quantity: actualQuantityToAdd });
    setShowAddedToast(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromOrder(productId);
      return;
    }

    const stock = getStockFromInventory(productId);
    const clampedQuantity = Math.min(quantity, stock);

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: clampedQuantity } : item
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
    // Validate that order quantities do not exceed available stock in Supabase
    for (const item of submission.items) {
      const available = getStockFromInventory(item.productId);
      if (item.quantity > available) {
        throw new Error(
          `Only ${available} available in stock for ${item.productName}. Please adjust your quantity before submitting.`
        );
      }
    }

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
        getProductStock,
        getRemainingStock,
        isMaxStockReached,
        getStockLimitMessage,
        inventoryVersion,
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
