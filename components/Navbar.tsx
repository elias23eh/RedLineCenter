"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const NAV = [
  { href: "/", label: "HOME" },
  { href: "/products", label: "PARTS" },
  { href: "/#about", label: "ABOUT" },
  { href: "/#contact", label: "CONTACT" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");
  const navRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!navRef.current) return;
    gsap.from(navRef.current, {
      y: -80, opacity: 0, duration: 0.8, ease: "expo.out", delay: 0.1,
    });
  });

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
    <header ref={navRef} style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      height: "calc(60px + env(safe-area-inset-top, 0px) + 8px)",
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)",
      backgroundColor: scrolled ? "rgba(8,8,8,0.97)" : "rgba(8,8,8,0.8)",
      borderBottom: `1px solid ${scrolled ? "rgba(227,28,28,0.2)" : "var(--border)"}`,
      backdropFilter: "blur(16px)",
      transition: "all 0.3s",
    }}>
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 1rem", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>

        {/* SVG filter to strip white background from logo */}
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <filter id="remove-white" x="0" y="0" width="100%" height="100%">
              <feColorMatrix
                type="matrix"
                values="1  0  0  0  0
                        0  1  0  0  0
                        0  0  1  0  0
                       -1 -1 -1  3  0"
              />
            </filter>
          </defs>
        </svg>

        {/* Left: Logo */}
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", flexShrink: 0 }}>
          <Image
            src="/redline-logo.png"
            alt="Redline Center"
            width={100}
            height={38}
            priority
            style={{ filter: "url(#remove-white)", objectFit: "contain", width: 100, height: "auto" }}
          />
        </Link>

        {/* Center: Nav */}
        <nav className="nav-desktop" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          {NAV.map((item, i) => (
            <Link key={item.href} href={item.href} style={{
              fontFamily: "var(--mono)", fontSize: "0.68rem", letterSpacing: "2px",
              color: "var(--text-muted)", textDecoration: "none",
              padding: "0.4rem 0.9rem",
              border: "1px solid transparent",
              borderRadius: 2,
              transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: "0.4rem",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.color = "var(--red)";
                e.currentTarget.style.borderColor = "rgba(227,28,28,0.2)";
                e.currentTarget.style.backgroundColor = "rgba(227,28,28,0.05)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.borderColor = "transparent";
                e.currentTarget.style.backgroundColor = "transparent";
              }}
            >
              <span style={{ color: "var(--text-dim)", fontSize: "0.6rem" }}>/{String(i + 1).padStart(2, "0")}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right: HUD data + CTA */}
        <div className="nav-right" style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
          {/* Live clock */}
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "2px" }} className="nav-clock">
            {time}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: "var(--border-bright)" }} className="nav-clock" />

          {/* WhatsApp CTA */}
          <a
            href="https://wa.me/96170155599"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-wa-btn"
            style={{
              fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "2px",
              color: "var(--bg)", backgroundColor: "var(--red)",
              padding: "0.45rem 1rem", textDecoration: "none",
              display: "flex", alignItems: "center", gap: "0.5rem",
              clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
              transition: "background 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--red-dark)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--red)")}
          >
            <div className="pulse-dot" style={{ width: 5, height: 5 }} />
            <span className="nav-wa-text">WHATSAPP</span>
          </a>

          {/* Mobile toggle */}
          <button
            className="nav-toggle"
            onClick={() => setOpen(!open)}
            style={{
              background: "none", border: "1px solid var(--border-bright)", color: "var(--text)",
              padding: "0.35rem", cursor: "pointer", display: "none",
            }}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nav-desktop { display: none !important; }
          .nav-toggle  { display: flex !important; }
          .nav-clock   { display: none !important; }
        }
        @media (max-width: 640px) {
          .nav-wa-text { display: none !important; }
          .nav-wa-btn  {
            padding: 0.4rem 0.55rem !important;
            clip-path: none !important;
            border-radius: 3px !important;
          }
        }
        @media (max-width: 380px) {
          .nav-wa-btn { display: none !important; }
        }
      `}</style>
    </header>

    {/* Mobile menu — rendered outside header to avoid iOS Safari clipping */}
    {open && (
      <div style={{
        position: "fixed",
        top: "calc(60px + env(safe-area-inset-top, 0px) + 8px)",
        left: 0, right: 0, bottom: 0,
        backgroundColor: "#080808",
        borderTop: "1px solid rgba(227,28,28,0.3)",
        padding: "2rem 1.5rem",
        display: "flex", flexDirection: "column", gap: "0",
        zIndex: 99,
        overflowY: "auto",
      }}>
        <div style={{ width: 40, height: 2, background: "var(--red)", marginBottom: "2rem" }} />

        {NAV.map((item, i) => (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{
            fontFamily: "var(--heading)", fontSize: "2rem", fontWeight: 800, letterSpacing: "1px",
            color: "var(--text)", textDecoration: "none",
            padding: "0.9rem 0", borderBottom: "1px solid #1a1a1a",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            transition: "color 0.15s",
          }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--red)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text)")}
          >
            {item.label}
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: "2px" }}>
              /{String(i + 1).padStart(2, "0")}
            </span>
          </Link>
        ))}

        <div style={{ marginTop: "auto", paddingTop: "2rem" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-dim)", letterSpacing: "2px", marginBottom: "0.5rem" }}>TEL</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>70-155599 / 70-907977</div>
        </div>
      </div>
    )}
    </>
  );
}
