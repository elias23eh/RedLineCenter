"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmEmailSent, setConfirmEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName } },
    });
    if (error) { setLoading(false); setError(error.message); return; }

    if (data.user && phone) {
      await supabase.from("user_profiles").update({ phone }).eq("id", data.user.id);
    }
    setLoading(false);

    if (data.session) {
      router.push("/products");
    } else {
      // Project requires email confirmation before a session is issued
      setConfirmEmailSent(true);
    }
  }

  if (confirmEmailSent) {
    return (
      <div style={{ paddingTop: "calc(60px + env(safe-area-inset-top, 0px) + 8px)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 1.5rem" }}>
        <div style={{ width: "100%", maxWidth: 400, border: "1px solid var(--border)", backgroundColor: "var(--bg-panel)", padding: "2.5rem", textAlign: "center" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "0.5rem" }}>// CONFIRM_EMAIL</div>
          <h1 style={{ fontFamily: "var(--heading)", fontSize: "1.75rem", fontWeight: 800, marginBottom: "1rem" }}>Check your inbox</h1>
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
            We sent a confirmation link to <span style={{ color: "var(--text)" }}>{email}</span>. Confirm your email, then sign in.
          </p>
          <Link href="/login" style={{
            display: "inline-block", marginTop: "1.5rem",
            fontFamily: "var(--mono)", fontSize: "0.7rem", letterSpacing: "2px", fontWeight: 700,
            color: "var(--bg)", backgroundColor: "var(--red)", padding: "0.75rem 1.5rem", textDecoration: "none",
          }}>GO TO SIGN IN</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: "calc(60px + env(safe-area-inset-top, 0px) + 8px)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 1.5rem" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400, border: "1px solid var(--border)", backgroundColor: "var(--bg-panel)", padding: "2.5rem" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "0.5rem" }}>// CREATE_ACCOUNT</div>
        <h1 style={{ fontFamily: "var(--heading)", fontSize: "2rem", fontWeight: 800, marginBottom: "2rem" }}>Join RedLine</h1>

        <label style={labelStyle}>FULL NAME</label>
        <input required value={fullName} onChange={e => setFullName(e.target.value)} style={inputStyle} />

        <label style={{ ...labelStyle, marginTop: "1.25rem", display: "block" }}>EMAIL</label>
        <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />

        <label style={{ ...labelStyle, marginTop: "1.25rem", display: "block" }}>PHONE</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} style={inputStyle} />

        <label style={{ ...labelStyle, marginTop: "1.25rem", display: "block" }}>PASSWORD</label>
        <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />

        {error && <div style={{ color: "var(--red)", fontFamily: "var(--mono)", fontSize: "0.7rem", marginTop: "1rem" }}>{error}</div>}

        <button type="submit" disabled={loading} style={{
          width: "100%", marginTop: "2rem", padding: "0.9rem",
          backgroundColor: "var(--red)", color: "var(--bg)", border: "none",
          fontFamily: "var(--mono)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2px",
          cursor: "pointer", clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
        }}>
          {loading ? "CREATING..." : "CREATE ACCOUNT"}
        </button>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--text-dim)" }}>Already have an account? </span>
          <Link href="/login" style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--red)", textDecoration: "none" }}>SIGN IN</Link>
        </div>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "2px", color: "var(--text-dim)" };
const inputStyle: React.CSSProperties = {
  width: "100%", marginTop: "0.5rem", padding: "0.75rem",
  backgroundColor: "var(--bg-card)", border: "1px solid var(--border-bright)",
  color: "var(--text)", fontFamily: "var(--mono)", fontSize: "0.75rem", outline: "none",
};
