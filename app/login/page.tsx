"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    router.push("/products");
  }

  return (
    <div style={{ paddingTop: "calc(60px + env(safe-area-inset-top, 0px) + 8px)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "6rem 1.5rem" }}>
      <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 400, border: "1px solid var(--border)", backgroundColor: "var(--bg-panel)", padding: "2.5rem" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "0.5rem" }}>// SIGN_IN</div>
        <h1 style={{ fontFamily: "var(--heading)", fontSize: "2rem", fontWeight: 800, marginBottom: "2rem" }}>Welcome back</h1>

        <label style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "2px", color: "var(--text-dim)" }}>EMAIL</label>
        <input
          type="email" required value={email} onChange={e => setEmail(e.target.value)}
          style={inputStyle}
        />

        <label style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "2px", color: "var(--text-dim)", marginTop: "1.25rem", display: "block" }}>PASSWORD</label>
        <input
          type="password" required value={password} onChange={e => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && <div style={{ color: "var(--red)", fontFamily: "var(--mono)", fontSize: "0.7rem", marginTop: "1rem" }}>{error}</div>}

        <button type="submit" disabled={loading} style={{
          width: "100%", marginTop: "2rem", padding: "0.9rem",
          backgroundColor: "var(--red)", color: "var(--bg)", border: "none",
          fontFamily: "var(--mono)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2px",
          cursor: "pointer", clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
        }}>
          {loading ? "SIGNING IN..." : "SIGN IN"}
        </button>

        <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--text-dim)" }}>No account? </span>
          <Link href="/signup" style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--red)", textDecoration: "none" }}>SIGN UP</Link>
        </div>
      </form>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", marginTop: "0.5rem", padding: "0.75rem",
  backgroundColor: "var(--bg-card)", border: "1px solid var(--border-bright)",
  color: "var(--text)", fontFamily: "var(--mono)", fontSize: "0.75rem", outline: "none",
};
