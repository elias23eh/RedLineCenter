"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "./client";
import { useAuth } from "./AuthProvider";
import type { CartItem } from "@/lib/types";

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  loading: boolean;
  addToCart: (productId: string) => Promise<void>;
  updateQty: (id: string, qty: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextValue>({
  items: [], count: 0, total: 0, loading: false,
  addToCart: async () => {}, updateQty: async () => {}, removeItem: async () => {}, refresh: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setItems([]); return; }
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("cart_items")
      .select("*, products(*)")
      .eq("user_id", user.id);
    setItems((data as CartItem[]) ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  async function addToCart(productId: string) {
    if (!user) return;
    const supabase = createClient();
    const existing = items.find(i => i.product_id === productId);
    if (existing) {
      await supabase.from("cart_items").update({ quantity: existing.quantity + 1 }).eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({ user_id: user.id, product_id: productId, quantity: 1 });
    }
    await refresh();
  }

  async function updateQty(id: string, qty: number) {
    const supabase = createClient();
    if (qty < 1) return removeItem(id);
    await supabase.from("cart_items").update({ quantity: qty }).eq("id", id);
    await refresh();
  }

  async function removeItem(id: string) {
    const supabase = createClient();
    await supabase.from("cart_items").delete().eq("id", id);
    await refresh();
  }

  const count = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + (i.products?.price ?? 0) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, count, total, loading, addToCart, updateQty, removeItem, refresh }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
