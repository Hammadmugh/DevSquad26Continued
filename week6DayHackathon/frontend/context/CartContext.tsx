"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
  id: number;          // product id
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
}

const VALID_PROMO_CODE = "SHOP20";
const PROMO_DISCOUNT_RATE = 0.20;

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: number, size: string, color: string) => void;
  updateQty: (id: number, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  totalCount: number;
  /** Promo code state */
  promoApplied: boolean;
  promoCode: string;
  setPromoCode: (code: string) => void;
  applyPromo: () => boolean;
  removePromo: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoCode, setPromoCode] = useState("");

  function addItem(item: Omit<CartItem, "quantity">) {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.size === item.size && i.color === item.color
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.size === item.size && i.color === item.color
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }

  function removeItem(id: number, size: string, color: string) {
    setItems((prev) =>
      prev.filter((i) => !(i.id === id && i.size === size && i.color === color))
    );
  }

  function updateQty(id: number, size: string, color: string, qty: number) {
    if (qty < 1) { removeItem(id, size, color); return; }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id && i.size === size && i.color === color
          ? { ...i, quantity: qty }
          : i
      )
    );
  }

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0);

  function clearCart() {
    setItems([]);
  }

  function applyPromo(): boolean {
    if (promoCode.trim().toUpperCase() === VALID_PROMO_CODE) {
      setPromoApplied(true);
      return true;
    }
    return false;
  }

  function removePromo() {
    setPromoApplied(false);
    setPromoCode("");
  }

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQty, clearCart, totalCount,
      promoApplied, promoCode, setPromoCode, applyPromo, removePromo,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
