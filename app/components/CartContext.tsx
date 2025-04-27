"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<number|null>(null);

  // On mount, fetch the logged-in user and set customerId
  useEffect(() => {
    async function fetchUser() {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const user = await res.json();
        // Only set if role is customer
        if (user && user.role === 'customer') {
          setCustomerId(user.id);
        } else {
          setCustomerId(null);
        }
      } else {
        setCustomerId(null);
      }
    }
    fetchUser();
  }, []);

  // syncCartFromBackend is only declared here, not below
  const syncCartFromBackend = async () => {
    if (!customerId) return;
    try {
      const res = await fetch(`/api/cart?customerId=${customerId}`);
      if (res.ok) {
        const backendCart = await res.json();
        if (backendCart && backendCart.cartItems) {
          setItems(
            backendCart.cartItems.map((ci: any) => ({
              id: String(ci.productId),
              name: ci.product?.name || '',
              price: Number(ci.product?.price || 0),
              imageUrl: ci.product?.imageUrl || ci.product?.image_url || '',
              quantity: ci.quantity,
            }))
          );
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (customerId) {
      syncCartFromBackend();
    }
    // eslint-disable-next-line
  }, [customerId]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);



  const addToCart = async (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    if (!customerId) return alert('You must be logged in to add to cart');
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.id === item.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { ...item, quantity }];
    });
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: Number(customerId), productId: Number(item.id), quantity: Number(quantity) })
      });
      await syncCartFromBackend();
    } catch (e) {
      // Optionally show error toast
    }
  };

  const removeFromCart = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (!customerId) return;
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: Number(customerId), productId: Number(id) })
      });
      await syncCartFromBackend();
    } catch (e) {}
  };

  const updateQuantity = async (id: string, quantity: number) => {
    setItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity } : i));
    if (!customerId) return;
    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: Number(customerId), productId: Number(id), quantity: Number(quantity) })
      });
      await syncCartFromBackend();
    } catch (e) {}
  };

  const clearCart = async () => {
    if (!customerId) return alert('You must be logged in to checkout');
    try {
      await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId, items, total })
      });
    } catch (e) {
      // Optionally show error toast
    }
    setItems([]);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}
