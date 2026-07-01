"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/supabase/CartProvider";
import { useAuth } from "@/lib/supabase/AuthProvider";

export default function CartPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, total, loading, updateQty, removeItem } = useCart();

  return (
    <div style={{ paddingTop: "calc(60px + env(safe-area-inset-top, 0px) + 8px)", minHeight: "100vh", maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "0.5rem" }}>// YOUR_CART</div>
      <h1 style={{ fontFamily: "var(--heading)", fontSize: "2.5rem", fontWeight: 800, marginBottom: "2rem" }}>Cart</h1>

      {!authLoading && !user ? (
        <div style={{ textAlign: "center", padding: "5rem 1rem", border: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>SIGN IN TO VIEW YOUR CART</p>
          <Link href="/login" style={{
            fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "2px", fontWeight: 700,
            color: "var(--bg)", backgroundColor: "var(--red)", padding: "0.75rem 1.5rem", textDecoration: "none",
          }}>SIGN IN</Link>
        </div>
      ) : loading ? (
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-dim)" }}>LOADING...</div>
      ) : items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 1rem", border: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>YOUR CART IS EMPTY</p>
          <Link href="/products" style={{
            fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "2px", fontWeight: 700,
            color: "var(--bg)", backgroundColor: "var(--red)", padding: "0.75rem 1.5rem", textDecoration: "none",
          }}>BROWSE PARTS</Link>
        </div>
      ) : (
        <>
          <div style={{ border: "1px solid var(--border)" }}>
            {items.map(item => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", borderBottom: "1px solid var(--border)" }}>
                <div style={{ width: 64, height: 64, backgroundColor: "var(--bg-panel)", flexShrink: 0, position: "relative" }}>
                  {item.products?.image && (
                    <Image src={item.products.image} alt={item.products.name} fill sizes="64px" style={{ objectFit: "contain" }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.25rem" }}>{item.products?.name}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--red)" }}>${item.products?.price.toFixed(2)}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} style={qtyBtnStyle}><Minus size={12} /></button>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", minWidth: 20, textAlign: "center" }}>{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} style={qtyBtnStyle}><Plus size={12} /></button>
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.85rem", fontWeight: 700, minWidth: 70, textAlign: "right" }}>
                  ${((item.products?.price ?? 0) * item.quantity).toFixed(2)}
                </div>
                <button onClick={() => removeItem(item.id)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: "2px" }}>TOTAL</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "1.8rem", fontWeight: 900, color: "var(--red)" }}>${total.toFixed(2)}</div>
            </div>
            <button
              onClick={() => router.push("/checkout")}
              style={{
                display: "flex", alignItems: "center", gap: "0.5rem",
                fontFamily: "var(--mono)", fontSize: "0.75rem", letterSpacing: "2px", fontWeight: 700,
                color: "var(--bg)", backgroundColor: "var(--red)", padding: "1rem 2rem", border: "none", cursor: "pointer",
                clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
              }}
            >
              CHECKOUT <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const qtyBtnStyle: React.CSSProperties = {
  width: 26, height: 26, display: "flex", alignItems: "center", justifyContent: "center",
  backgroundColor: "var(--bg-card)", border: "1px solid var(--border-bright)", color: "var(--text)", cursor: "pointer",
};
