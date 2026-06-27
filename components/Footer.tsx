"use client";

import Link from "next/link";
import Image from "next/image";
import { Share2, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", backgroundColor: "var(--bg-panel)", padding: "3rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: 1400, margin: "0 auto" }}>

        {/* Top row */}
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "3rem", marginBottom: "3rem" }}>

          {/* Brand */}
          <div>
            <div style={{ marginBottom: "1rem" }}>
              <svg width="0" height="0" style={{ position: "absolute" }}>
                <defs>
                  <filter id="remove-white-footer">
                    <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1 -1 -1 3 0" />
                  </filter>
                </defs>
              </svg>
              <Image
                src="/redline-logo.png"
                alt="Redline Center"
                width={110}
                height={42}
                style={{ filter: "url(#remove-white-footer)", objectFit: "contain", width: 90, height: "auto" }}
              />
            </div>
            <p style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-dim)", lineHeight: 1.8, maxWidth: 220 }}>
              Lebanon&apos;s performance &amp; tuning specialists. Built for drivers who demand more.
            </p>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              {[
                { href: "https://www.instagram.com/redlinecenter", icon: <Share2 size={13} />, label: "IG" },
                { href: "https://www.facebook.com/REDLINECENTER", icon: <ExternalLink size={13} />, label: "FB" },
              ].map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: 30, height: 30, border: "1px solid var(--border-bright)",
                  color: "var(--text-dim)", textDecoration: "none",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "rgba(227,28,28,0.3)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "var(--text-dim)"; e.currentTarget.style.borderColor = "var(--border-bright)"; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Nav */}
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "1rem" }}>NAV_MAP</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {[{ href: "/", label: "HOME" }, { href: "/products", label: "ALL PARTS" }, { href: "/#about", label: "ABOUT" }, { href: "/#contact", label: "CONTACT" }].map((l, i) => (
                <Link key={l.href} href={l.href} style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "1.5px", display: "flex", gap: "0.6rem", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--red)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
                >
                  <span style={{ color: "var(--border-bright)" }}>/0{i + 1}</span>{l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "1rem" }}>SYSTEMS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              {["Engine System", "Turbo Accessories", "Exhaust System", "Fuel System", "Suspension", "Interior"].map(c => (
                <Link key={c} href={`/products?category=${c.toLowerCase().replace(/ /g, "-")}`} style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-dim)", textDecoration: "none", letterSpacing: "1px", transition: "color 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--red)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "1rem" }}>COMMS</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              {[
                { label: "TEL", val: "70-155599 / 70-907977" },
                { label: "WAP", val: "+961 70 155 599" },
                { label: "MAIL", val: "info@redlinecenter.com" },
                { label: "LOC", val: "Dora Hwy, Beirut LB" },
              ].map(item => (
                <div key={item.label} style={{ display: "flex", gap: "0.75rem" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.55rem", color: "var(--red)", letterSpacing: "1px", width: 30, flexShrink: 0, paddingTop: "0.05rem" }}>{item.label}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-dim)", lineHeight: 1.5 }}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-dim)", letterSpacing: "2px" }}>
            © {new Date().getFullYear()} REDLINE_CENTER // ALL_RIGHTS_RESERVED
          </span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-dim)", letterSpacing: "2px" }}>
            BUILT_FOR_DRIVERS_WHO_DEMAND_MORE
          </span>
        </div>
      </div>
    </footer>
  );
}
