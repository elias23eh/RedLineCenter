"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/AuthProvider";
import type { Order } from "@/lib/types";

function OrdersContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const justPlaced = searchParams.get("placed");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    const supabase = createClient();
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders((data as Order[]) ?? []);
        setLoading(false);
      });
  }, [user]);

  return (
    <div style={{ paddingTop: "calc(60px + env(safe-area-inset-top, 0px) + 8px)", minHeight: "100vh", maxWidth: 800, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "0.5rem" }}>// ORDER_HISTORY</div>
      <h1 style={{ fontFamily: "var(--heading)", fontSize: "2.5rem", fontWeight: 800, marginBottom: "2rem" }}>My Orders</h1>

      {justPlaced && (
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", border: "1px solid rgba(22,163,74,0.3)", backgroundColor: "rgba(22,163,74,0.08)", padding: "1rem 1.5rem", marginBottom: "2rem" }}>
          <CheckCircle size={18} color="#16a34a" />
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "#16a34a" }}>Order placed successfully — we&apos;ll be in touch to confirm.</span>
        </div>
      )}

      {authLoading || loading ? (
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-dim)" }}>LOADING...</div>
      ) : !user ? (
        <div style={{ textAlign: "center", padding: "5rem 1rem", border: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>SIGN IN TO VIEW YOUR ORDERS</p>
          <Link href="/login" style={{
            fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "2px", fontWeight: 700,
            color: "var(--bg)", backgroundColor: "var(--red)", padding: "0.75rem 1.5rem", textDecoration: "none",
          }}>SIGN IN</Link>
        </div>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 1rem", border: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>NO ORDERS YET</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: "1px solid var(--border)", padding: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: "1px" }}>
                    #{order.id.slice(0, 8).toUpperCase()} · {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--red)", letterSpacing: "1px", marginTop: "0.25rem" }}>
                    {order.status.toUpperCase()}
                  </div>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", fontWeight: 900, color: "var(--red)" }}>${order.total.toFixed(2)}</div>
              </div>
              {order.order_items?.map(item => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "var(--text-muted)", padding: "0.35rem 0" }}>
                  <span>{item.product_name} ×{item.quantity}</span>
                  <span style={{ fontFamily: "var(--mono)" }}>${(item.price_at_purchase * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <Suspense>
      <OrdersContent />
    </Suspense>
  );
}
