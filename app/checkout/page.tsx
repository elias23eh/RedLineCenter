"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { useCart } from "@/lib/supabase/CartProvider";

type PaymentMethod = "cash_on_delivery" | "bank_transfer";
type DeliveryMethod = "deliver" | "pickup";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, total, refresh } = useCart();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [authLoading, user, router]);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("deliver");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("cash_on_delivery");
  const [notes, setNotes] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return null;
  }

  if (items.length === 0) {
    return (
      <div style={{ paddingTop: "calc(60px + env(safe-area-inset-top, 0px) + 8px)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>YOUR CART IS EMPTY</p>
      </div>
    );
  }

  async function confirmOrder() {
    if (!name.trim() || !phone.trim()) { setError("Please enter your name and phone number"); return; }
    if (deliveryMethod === "deliver" && !address.trim()) { setError("Please enter your delivery address"); return; }

    setError(null);
    setPlacing(true);
    const supabase = createClient();

    const deliveryAddr = deliveryMethod === "pickup"
      ? "PICKUP FROM STORE — BEIRUT"
      : `${address.trim()}, ${city.trim()}`;

    const { data: order, error: orderError } = await supabase.from("orders").insert({
      user_id: user!.id,
      status: "pending",
      subtotal: total,
      total,
      payment_method: payment,
      delivery_name: name.trim(),
      delivery_phone: phone.trim(),
      delivery_address: deliveryAddr,
      notes: notes.trim() || null,
    }).select().single();

    if (orderError || !order) {
      setError("Failed to place order. Please try again.");
      setPlacing(false);
      return;
    }

    const { error: itemsError } = await supabase.from("order_items").insert(
      items.map(i => ({
        order_id: order.id,
        product_id: i.product_id,
        product_name: i.products?.name ?? "Product",
        product_image: i.products?.image ?? null,
        quantity: i.quantity,
        price_at_purchase: i.products?.price ?? 0,
      }))
    );

    if (itemsError) {
      setError("Order created but items failed to save. Please contact us.");
      setPlacing(false);
      return;
    }

    await supabase.from("cart_items").delete().eq("user_id", user!.id);
    await refresh();
    router.push(`/orders?placed=${order.id}`);
  }

  return (
    <div style={{ paddingTop: "calc(60px + env(safe-area-inset-top, 0px) + 8px)", minHeight: "100vh", maxWidth: 700, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "0.5rem" }}>// CHECKOUT</div>
      <h1 style={{ fontFamily: "var(--heading)", fontSize: "2.5rem", fontWeight: 800, marginBottom: "2rem" }}>Complete Order</h1>

      <div style={{ border: "1px solid var(--border)", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <label style={labelStyle}>FULL NAME</label>
        <input value={name} onChange={e => setName(e.target.value)} style={inputStyle} />

        <label style={{ ...labelStyle, marginTop: "1rem", display: "block" }}>PHONE</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" style={inputStyle} />
      </div>

      <div style={{ border: "1px solid var(--border)", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <label style={labelStyle}>DELIVERY METHOD</label>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          {(["deliver", "pickup"] as DeliveryMethod[]).map(m => (
            <button key={m} onClick={() => setDeliveryMethod(m)} style={toggleBtnStyle(deliveryMethod === m)}>
              {m === "deliver" ? "DELIVER TO ME" : "PICKUP FROM STORE"}
            </button>
          ))}
        </div>

        {deliveryMethod === "deliver" && (
          <>
            <label style={{ ...labelStyle, marginTop: "1.25rem", display: "block" }}>ADDRESS</label>
            <input value={address} onChange={e => setAddress(e.target.value)} style={inputStyle} />
            <label style={{ ...labelStyle, marginTop: "1rem", display: "block" }}>CITY</label>
            <input value={city} onChange={e => setCity(e.target.value)} style={inputStyle} />
          </>
        )}
      </div>

      <div style={{ border: "1px solid var(--border)", padding: "1.5rem", marginBottom: "1.5rem" }}>
        <label style={labelStyle}>PAYMENT METHOD</label>
        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
          <button onClick={() => setPayment("cash_on_delivery")} style={toggleBtnStyle(payment === "cash_on_delivery")}>CASH ON DELIVERY</button>
          <button onClick={() => setPayment("bank_transfer")} style={toggleBtnStyle(payment === "bank_transfer")}>BANK TRANSFER</button>
        </div>

        <label style={{ ...labelStyle, marginTop: "1.25rem", display: "block" }}>NOTES (OPTIONAL)</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ ...inputStyle, resize: "vertical" }} />
      </div>

      {error && <div style={{ color: "var(--red)", fontFamily: "var(--mono)", fontSize: "0.7rem", marginBottom: "1rem" }}>{error}</div>}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-dim)", letterSpacing: "2px" }}>TOTAL</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "1.6rem", fontWeight: 900, color: "var(--red)" }}>${total.toFixed(2)}</span>
      </div>

      <button
        onClick={confirmOrder}
        disabled={placing}
        style={{
          width: "100%", padding: "1rem",
          backgroundColor: "var(--red)", color: "var(--bg)", border: "none",
          fontFamily: "var(--mono)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "2px",
          cursor: "pointer", clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
        }}
      >
        {placing ? "PLACING ORDER..." : "PLACE ORDER"}
      </button>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "2px", color: "var(--text-dim)" };
const inputStyle: React.CSSProperties = {
  width: "100%", marginTop: "0.5rem", padding: "0.75rem",
  backgroundColor: "var(--bg-card)", border: "1px solid var(--border-bright)",
  color: "var(--text)", fontFamily: "var(--mono)", fontSize: "0.75rem", outline: "none",
};
function toggleBtnStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1, padding: "0.65rem", fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "1px",
    backgroundColor: active ? "var(--red)" : "var(--bg-card)",
    color: active ? "var(--bg)" : "var(--text-muted)",
    border: `1px solid ${active ? "var(--red)" : "var(--border-bright)"}`,
    cursor: "pointer",
  };
}
