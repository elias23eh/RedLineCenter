"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, MessageCircle, Phone, Mail, MapPin, CheckCircle, ShoppingCart } from "lucide-react";
import { fetchProducts, fetchCategories, WebsiteProduct, WebsiteCategory } from "@/lib/supabase/queries";
import { useCart } from "@/lib/supabase/CartProvider";
import { useAuth } from "@/lib/supabase/AuthProvider";
import HeroCar from "@/components/HeroCar";
import GaugeStat from "@/components/GaugeStat";
import RevealSection from "@/components/RevealSection";
import HKSScrollSection from "@/components/HKSScrollSection";
import ManifoldScrollSection from "@/components/ManifoldScrollSection";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Home() {
  const heroRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();

  function handleAddToCart(productId: string) {
    if (!user) { router.push("/login"); return; }
    addToCart(productId);
  }
  const [products, setProducts] = useState<WebsiteProduct[]>([]);
  const [categories, setCategories] = useState<WebsiteCategory[]>([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
    fetchCategories().then(setCategories);
  }, []);

  const featured = products.filter(p => p.featured).slice(0, 4);

  useGSAP(() => {
    ScrollTrigger.batch(".cat-cell", {
      onEnter: els => gsap.fromTo(els,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.06, ease: "power2.out" }
      ),
      start: "top 88%",
      once: true,
    });
    ScrollTrigger.batch(".product-card", {
      onEnter: els => gsap.fromTo(els,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "expo.out" }
      ),
      start: "top 88%",
      once: true,
    });
  }, { scope: pageRef, dependencies: [categories, products] });

  useGSAP(() => {
    // ── HERO: entrance animations ──────────────────────────────────────
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // HUD top bar
    tl.from(".hud-topbar", { y: -20, opacity: 0, duration: 0.6 }, 0);

    // Headline words stagger in from left with slight blur
    tl.from(".hero-word", {
      x: -60,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "expo.out",
    }, 0.2);

    // Paragraph lines
    tl.from(".hero-para", { y: 24, opacity: 0, duration: 0.6 }, 0.55);

    // CTA buttons bounce in
    tl.from(".hero-cta", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "back.out(1.4)",
    }, 0.75);


    // Telemetry panel slides in from right
    tl.from(".telemetry-panel", { x: 60, opacity: 0, duration: 0.8, ease: "expo.out" }, 0.3);

    // Telemetry bars fill from 0
    tl.fromTo(".hero-bar-fill", { width: "0%" },
      { width: (i: number, el: Element) => el.getAttribute("data-pct") + "%", duration: 1.4, stagger: 0.1, ease: "power2.out" },
      0.6
    );

    // Bottom HUD ticker
    tl.from(".hud-ticker span", { opacity: 0, stagger: 0.08, duration: 0.4 }, 1.0);

    // Section headers
    gsap.utils.toArray<HTMLElement>(".section-header").forEach(el => {
      gsap.from(el, {
        x: -30, opacity: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });

    // ── ABOUT: bars fill on scroll ─────────────────────────────────────
    gsap.from(".about-text", {
      y: 30, opacity: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: ".about-text", start: "top 82%", once: true },
    });

    gsap.from(".about-point", {
      x: -20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out",
      scrollTrigger: { trigger: ".about-point", start: "top 85%", once: true },
    });

    gsap.fromTo(".about-bar-fill",
      { width: "0%" },
      {
        width: (i: number, el: Element) => el.getAttribute("data-pct") + "%",
        duration: 1.5,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: { trigger: ".about-bars", start: "top 80%", once: true },
      }
    );

    // ── CONTACT CARDS: cascade ─────────────────────────────────────────
    ScrollTrigger.batch(".contact-card", {
      onEnter: els => gsap.fromTo(els,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "back.out(1.2)" }
      ),
      start: "top 88%",
      once: true,
    });

    gsap.from(".contact-hours", {
      opacity: 0, y: 20, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: ".contact-hours", start: "top 90%", once: true },
    });

  }, { scope: pageRef });

  return (
    <div ref={pageRef}>
      {/* ═══════════════════════════════════════ HERO ══ */}
      <section id="hero-section" ref={heroRef} style={{ minHeight: "100vh", position: "relative", display: "flex", alignItems: "center", paddingTop: "calc(60px + env(safe-area-inset-top, 0px) + 8px)", overflow: "hidden" }} className="hud-grid scanlines">

        {/* Ambient garage/dyno background photo */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "url(/hero-bg.png)",
          backgroundSize: "cover",
          backgroundPosition: "center 35%",
          opacity: 0.5,
        }} />
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          background: "linear-gradient(to right, var(--bg) 0%, rgba(8,8,8,0.75) 40%, rgba(8,8,8,0.4) 100%), linear-gradient(to top, var(--bg) 0%, transparent 25%)",
        }} />

        <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)", width: 800, height: 800, background: "radial-gradient(circle, rgba(227,28,28,0.07) 0%, transparent 65%)", pointerEvents: "none" }} />

        {/* HUD top bar */}
        <div className="hud-topbar hero-hud-topbar" style={{ position: "absolute", top: 72, left: 0, right: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.5rem 1.5rem", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <div className="pulse-dot" />
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "2px", color: "var(--text-dim)" }}>SYS.ONLINE</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-dim)" }} className="hero-hud-right">|</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "2px", color: "var(--text-dim)" }} className="hero-hud-right">DORA_HWY // BEIRUT</span>
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "2px", color: "var(--text-dim)" }} className="hero-hud-right">
            REV.{new Date().getFullYear()} // UNIT_001
          </div>
        </div>

        <div className="hero-section-inner" style={{ maxWidth: 1400, margin: "0 auto", padding: "4rem 1.5rem", width: "100%", zIndex: 2, position: "relative" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 520px", gap: "2.5rem", alignItems: "center" }}>

            {/* Left */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
                <div style={{ width: 24, height: 1, background: "var(--red)" }} />
                <span className="section-tag">// PERFORMANCE DIVISION</span>
                <div style={{ width: 24, height: 1, background: "var(--red)" }} />
              </div>

              <h1 className="hero-h1" style={{ fontSize: "clamp(3.5rem, 9vw, 8rem)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-1px", marginBottom: "2rem", fontFamily: "var(--heading)" }}>
                {["PUSH", "YOUR", "LIMIT"].map(word => (
                  <div key={word} className="hero-word" style={{ display: "block", color: word === "LIMIT" ? "transparent" : "var(--text)", WebkitTextStroke: word === "LIMIT" ? "1px var(--red)" : undefined }}>
                    {word === "LIMIT"
                      ? <span className="text-glow" style={{ WebkitTextStroke: 0 }}>{word}</span>
                      : word}
                  </div>
                ))}
              </h1>

              <p className="hero-para" style={{ fontFamily: "var(--mono)", fontSize: "0.8rem", letterSpacing: "1px", color: "var(--text-muted)", lineHeight: 1.8, maxWidth: 480, marginBottom: "3rem" }}>
                {">"} Lebanon's premier source for performance &<br />
                {">"} tuning parts. Turbos. Intercoolers. Exhausts.<br />
                {">"} Suspension. Everything your build needs.
              </p>

              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                <Link href="/products" className="hero-cta" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.6rem",
                  backgroundColor: "var(--red)", color: "var(--bg)",
                  padding: "0.85rem 1.75rem", textDecoration: "none",
                  fontFamily: "var(--mono)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "2px",
                  clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                  transition: "background 0.2s, transform 0.15s",
                }}
                  onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.04, duration: 0.2, ease: "power2.out" })}
                  onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.2, ease: "power2.out" })}
                >
                  ENTER STORE <ArrowRight size={14} />
                </Link>
                <a href="https://wa.me/96170155599" target="_blank" rel="noopener noreferrer" className="hero-cta" style={{
                  display: "inline-flex", alignItems: "center", gap: "0.6rem",
                  backgroundColor: "transparent", color: "var(--text)",
                  padding: "0.85rem 1.75rem", textDecoration: "none",
                  fontFamily: "var(--mono)", fontSize: "0.72rem", letterSpacing: "2px",
                  border: "1px solid var(--border-bright)",
                  transition: "border-color 0.2s, color 0.2s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--red)"; (e.currentTarget as HTMLElement).style.color = "var(--red)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-bright)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                >
                  <MessageCircle size={14} /> WHATSAPP
                </a>
              </div>

              {/* Stats — speedometer gauges */}
              <div className="hero-stats" style={{ display: "flex", gap: "1.5rem", marginTop: "3rem", flexWrap: "wrap" }}>
                <GaugeStat num={500} suffix="+" label="PRODUCTS"   pct={80} delay={0.9} />
                <GaugeStat num={9}   suffix=""  label="CATEGORIES" pct={90} delay={1.0} />
                <GaugeStat num={10}  suffix="+" label="YRS EXP"    pct={95} delay={1.1} />
              </div>
            </div>

            {/* Right column: drift photo + telemetry */}
            <div className="hero-right-col" style={{ display: "flex", flexDirection: "column", gap: "1.25rem", alignItems: "stretch", overflow: "visible" }}>

              {/* ── DRIFT CAR ── */}
              <HeroCar />

              {/* ── Telemetry panel ── */}
              <div className="telemetry-panel" style={{ width: "100%", flexShrink: 0 }}>
                <div style={{ border: "1px solid rgba(227,28,28,0.25)", padding: "1.25rem", position: "relative" }}>
                  <div style={{ position: "absolute", top: -1, left: -1, width: 12, height: 12, borderTop: "2px solid var(--red)", borderLeft: "2px solid var(--red)" }} />
                  <div style={{ position: "absolute", top: -1, right: -1, width: 12, height: 12, borderTop: "2px solid var(--red)", borderRight: "2px solid var(--red)" }} />
                  <div style={{ position: "absolute", bottom: -1, left: -1, width: 12, height: 12, borderBottom: "2px solid var(--red)", borderLeft: "2px solid var(--red)" }} />
                  <div style={{ position: "absolute", bottom: -1, right: -1, width: 12, height: 12, borderBottom: "2px solid var(--red)", borderRight: "2px solid var(--red)" }} />

                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "1rem" }}>STORE_TELEMETRY</div>

                  {[
                    { label: "PRODUCTS", value: "500+", pct: 80 },
                    { label: "CATEGORIES", value: "9", pct: 90 },
                    { label: "IN_STOCK", value: `${products.filter(p => p.inStock).length}`, pct: 75 },
                    { label: "EXPERIENCE", value: "10+ YRS", pct: 95 },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom: "0.9rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "2px", color: "var(--text-dim)" }}>{item.label}</span>
                        <span style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--red)", fontWeight: 700 }}>{item.value}</span>
                      </div>
                      <div className="data-bar">
                        <div className="data-bar-fill hero-bar-fill" data-pct={item.pct} style={{ width: 0 }} />
                      </div>
                    </div>
                  ))}

                  <div style={{ marginTop: "1rem", paddingTop: "0.8rem", borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-dim)", letterSpacing: "1px", lineHeight: 1.8 }}>
                      <div>LOC: DORA HWY // BEIRUT</div>
                      <div>TEL: +961 70 155 599</div>
                      <div>HRS: MON-SAT 09:00-18:00</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom HUD ticker */}
          <div className="hud-ticker hero-ticker" style={{ marginTop: "4rem", display: "flex", alignItems: "center", gap: "2rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
            <div style={{ display: "flex", gap: "2rem" }}>
              {["ENGINE SYSTEM", "TURBO", "EXHAUST", "SUSPENSION", "FUEL SYSTEM"].map((cat, i) => (
                <span key={cat} style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "2px", color: i === 0 ? "var(--red)" : "var(--text-dim)" }}>{cat}</span>
              ))}
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "2px", color: "var(--text-dim)" }}>SCROLL TO EXPLORE</span>
              <div style={{ width: 1, height: 12, background: "var(--red)" }} />
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hero-right-col { display: none !important; }
          }
          @media (max-width: 1200px) {
            .hero-right-col { gap: 1rem; }
          }
        `}</style>
      </section>

      {/* ═══════════════════════════════════════ MANIFOLD SHOWCASE ══ */}
      <ManifoldScrollSection />

      {/* ═══════════════════════════════════════ CATEGORIES ══ */}
      <section className="mobile-section" style={{ padding: "6rem 1.5rem", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="section-header" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--text-dim)" }}>/02</div>
            <div style={{ width: 1, height: 32, background: "var(--border-bright)" }} />
            <div>
              <div className="section-tag" style={{ marginBottom: "0.3rem" }}>// PARTS_CATALOG</div>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "0px", fontFamily: "var(--heading)" }}>Shop by System</h2>
            </div>
            <div style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-dim)", letterSpacing: "2px" }}>
              {categories.length} SYSTEMS AVAILABLE
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1px", border: "1px solid var(--border)", backgroundColor: "var(--border)" }}>
            {categories.map((cat, i) => {
              const maxTypes = Math.max(...categories.map(c => c.subcategories.length), 1);
              const typePct = Math.round((cat.subcategories.length / maxTypes) * 100);
              return (
              <Link key={cat.id} href={`/products?category=${cat.id}`} className="cat-cell hud-card" style={{
                display: "block", padding: "1.5rem",
                backgroundColor: "var(--bg-panel)", textDecoration: "none",
                position: "relative", overflow: "hidden",
                border: "1px solid var(--border)",
                opacity: 0,
              }}
                onMouseEnter={e => {
                  const el = e.currentTarget;
                  gsap.to(el, { y: -4, duration: 0.25, ease: "power2.out" });
                  gsap.to(el.querySelector(".cat-cell-bg"), { opacity: 0.35, scale: 1.04, duration: 0.4, ease: "power2.out" });
                  gsap.to(el.querySelectorAll(".cat-bracket"), { opacity: 1, duration: 0.25, stagger: 0.03 });
                  gsap.to(el.querySelector(".cat-accent"), { scaleX: 1, duration: 0.3, ease: "power2.out" });
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget;
                  gsap.to(el, { y: 0, duration: 0.25, ease: "power2.out" });
                  gsap.to(el.querySelector(".cat-cell-bg"), { opacity: 0.12, scale: 1, duration: 0.4, ease: "power2.out" });
                  gsap.to(el.querySelectorAll(".cat-bracket"), { opacity: 0, duration: 0.2 });
                  gsap.to(el.querySelector(".cat-accent"), { scaleX: 0, duration: 0.25, ease: "power2.in" });
                }}
              >
                {/* Background category photo */}
                <div className="cat-cell-bg" style={{
                  position: "absolute", inset: 0,
                  backgroundImage: `url(/categories/${cat.id}.png)`,
                  backgroundSize: "cover", backgroundPosition: "center",
                  opacity: 0.12, transition: "none",
                }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, var(--bg-panel) 0%, rgba(13,13,13,0.85) 35%, var(--bg-panel) 100%)" }} />

                {/* Ghost index number */}
                <div style={{
                  position: "absolute", top: -8, right: -6,
                  fontFamily: "var(--heading)", fontSize: "4.5rem", fontWeight: 900, lineHeight: 1,
                  color: "transparent", WebkitTextStroke: "1px rgba(227,28,28,0.15)",
                  pointerEvents: "none",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* HUD corner brackets */}
                <div className="cat-bracket" style={{ position: "absolute", top: 6, left: 6, width: 12, height: 12, borderTop: "2px solid var(--red)", borderLeft: "2px solid var(--red)", opacity: 0 }} />
                <div className="cat-bracket" style={{ position: "absolute", top: 6, right: 6, width: 12, height: 12, borderTop: "2px solid var(--red)", borderRight: "2px solid var(--red)", opacity: 0 }} />
                <div className="cat-bracket" style={{ position: "absolute", bottom: 6, left: 6, width: 12, height: 12, borderBottom: "2px solid var(--red)", borderLeft: "2px solid var(--red)", opacity: 0 }} />
                <div className="cat-bracket" style={{ position: "absolute", bottom: 6, right: 6, width: 12, height: 12, borderBottom: "2px solid var(--red)", borderRight: "2px solid var(--red)", opacity: 0 }} />

                {/* Accent bar draw-in */}
                <div className="cat-accent" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--red)", transform: "scaleX(0)", transformOrigin: "left", }} />

                <div style={{ position: "relative" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "2px", marginBottom: "1rem" }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 style={{ fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.5px", marginBottom: "0.4rem", color: "var(--text)" }}>{cat.name}</h3>
                  <p style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-dim)", lineHeight: 1.6, marginBottom: "1rem" }}>{cat.description}</p>

                  <div style={{ marginBottom: "0.6rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.55rem", color: "var(--text-dim)", letterSpacing: "1.5px" }}>TYPES</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--red)", fontWeight: 700 }}>{cat.subcategories.length}</span>
                    </div>
                    <div className="data-bar">
                      <div className="data-bar-fill" style={{ width: `${typePct}%` }} />
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <ArrowRight size={12} color="var(--text-dim)" />
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ DIVIDER ══ */}
      <div style={{
        position: "relative", height: 130, borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
        backgroundImage: "url(/section-texture.png)", backgroundSize: "cover", backgroundPosition: "center",
        display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, var(--bg) 0%, transparent 15%, transparent 85%, var(--bg) 100%)" }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", letterSpacing: "6px", color: "var(--text)", opacity: 0.7, position: "relative" }}>
          PERFORMANCE // ENGINEERED
        </span>
      </div>

      {/* ═══════════════════════════════════════ FEATURED ══ */}
      <section className="mobile-section" style={{ padding: "6rem 1.5rem", borderTop: "1px solid var(--border)", backgroundColor: "var(--bg-panel)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="section-header" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--text-dim)" }}>/03</div>
            <div style={{ width: 1, height: 32, background: "var(--border-bright)" }} />
            <div>
              <div className="section-tag" style={{ marginBottom: "0.3rem" }}>// SELECTED_UNITS</div>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "0px", fontFamily: "var(--heading)" }}>Featured Parts</h2>
            </div>
            <Link href="/products" style={{ marginLeft: "auto", fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--red)", textDecoration: "none", letterSpacing: "2px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              ALL PARTS <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1px", border: "1px solid var(--border)", backgroundColor: "var(--border)" }}>
            {featured.map((p, i) => (
              <div key={p.id} className="product-card" style={{
                backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
                position: "relative", overflow: "hidden", opacity: 0,
                cursor: "pointer",
              }}
                onMouseEnter={e => gsap.to(e.currentTarget, { y: -6, boxShadow: "0 20px 60px rgba(227,28,28,0.15)", duration: 0.3, ease: "power2.out" })}
                onMouseLeave={e => gsap.to(e.currentTarget, { y: 0, boxShadow: "none", duration: 0.3, ease: "power2.out" })}
              >
                <div style={{ height: 200, backgroundColor: "var(--bg-panel)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderBottom: "1px solid var(--border)", overflow: "hidden" }}>
                  {p.image ? (
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="280px"
                      style={{ objectFit: "contain", padding: "1rem" }}
                    />
                  ) : (
                    <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-dim)", textAlign: "center", letterSpacing: "2px" }}>
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "rgba(227,28,28,0.15)" }}>◈</div>
                      NO_IMAGE
                    </div>
                  )}
                  <div style={{ position: "absolute", top: 10, left: 10, fontFamily: "var(--mono)", fontSize: "0.55rem", letterSpacing: "2px", color: "var(--text-dim)" }}>
                    UNIT_{String(i + 1).padStart(3, "0")}
                  </div>
                  <div style={{
                    position: "absolute", top: 10, right: 10,
                    fontFamily: "var(--mono)", fontSize: "0.55rem", letterSpacing: "1px",
                    padding: "0.2rem 0.5rem",
                    backgroundColor: p.inStock ? "rgba(22,163,74,0.1)" : "rgba(100,100,100,0.1)",
                    border: `1px solid ${p.inStock ? "rgba(22,163,74,0.3)" : "var(--border)"}`,
                    color: p.inStock ? "#16a34a" : "var(--text-dim)",
                  }}>
                    {p.inStock ? "IN_STOCK" : "OOS"}
                  </div>
                </div>
                <div style={{ padding: "1.25rem" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-dim)", letterSpacing: "2px", marginBottom: "0.4rem" }}>
                    {p.category.replace(/-/g, "_").toUpperCase()}
                  </div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, marginBottom: "0.5rem", letterSpacing: "0.3px" }}>{p.name}</h3>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6, marginBottom: "1.25rem" }}>{p.description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                    <div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "0.55rem", color: "var(--text-dim)", marginBottom: "0.15rem" }}>PRICE_USD</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: "1.2rem", fontWeight: 900, color: "var(--red)" }}>${p.price}</div>
                    </div>
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <button
                        onClick={e => {
                          handleAddToCart(p.id);
                          gsap.fromTo(e.currentTarget, { scale: 0.93 }, { scale: 1, duration: 0.3, ease: "back.out(2)" });
                        }}
                        disabled={!p.inStock}
                        style={{
                          fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "2px",
                          color: "var(--bg)", backgroundColor: p.inStock ? "var(--red)" : "var(--border)",
                          padding: "0.5rem 1rem", border: "none", cursor: p.inStock ? "pointer" : "not-allowed",
                          clipPath: "polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)",
                          transition: "background 0.2s",
                          display: "flex", alignItems: "center", gap: "0.4rem",
                        }}
                      >
                        <ShoppingCart size={12} /> CART
                      </button>
                      <a
                        href={`https://wa.me/96170155599?text=Hi, I'm interested in the ${encodeURIComponent(p.name)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{
                          fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "2px",
                          color: "var(--text)", backgroundColor: "transparent",
                          padding: "0.5rem 0.75rem", textDecoration: "none",
                          border: "1px solid var(--border-bright)",
                        }}
                      >
                        ASK
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ BEFORE / AFTER ══ */}
      <section className="mobile-section" style={{ padding: "6rem 1.5rem", borderTop: "1px solid var(--border)", backgroundColor: "var(--bg-panel)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="section-header" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--text-dim)" }}>/04</div>
            <div style={{ width: 1, height: 32, background: "var(--border-bright)" }} />
            <div>
              <div className="section-tag" style={{ marginBottom: "0.3rem" }}>// THE_TRANSFORMATION</div>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "0px", fontFamily: "var(--heading)" }}>See The Difference</h2>
            </div>
          </div>
          <p style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text-muted)", letterSpacing: "0.5px", marginBottom: "2rem", maxWidth: 560 }}>
            {">"} Drag the slider. Same car, same garage — one runs stock parts, the other runs ours.
          </p>
          <BeforeAfterSlider beforeSrc="/build-compare/stock.jpg" afterSrc="/build-compare/modded.jpg" />
        </div>
      </section>

      {/* ═══════════════════════════════════════ HKS SHOWCASE ══ */}
      <HKSScrollSection />

      {/* ═══════════════════════════════════════ ABOUT ══ */}
      <section id="about" className="mobile-section" style={{ padding: "6rem 1.5rem", borderTop: "1px solid var(--border)" }}>
        <RevealSection>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="section-header" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "4rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--text-dim)" }}>/05</div>
            <div style={{ width: 1, height: 32, background: "var(--border-bright)" }} />
            <div>
              <div className="section-tag" style={{ marginBottom: "0.3rem" }}>// ABOUT_UNIT</div>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "0px", fontFamily: "var(--heading)" }}>Who We Are</h2>
            </div>
          </div>

          {/* ── Text + Bars ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "start", marginBottom: "5rem" }}>
            <div className="about-text">
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "1.25rem" }}>// ABOUT_US</div>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.9, marginBottom: "1.1rem", fontSize: "0.95rem" }}>
                Give your car the look it deserves and the performance it needs! We are your supplier for any engine upgrades, stylish modifications or a complete overhaul.
              </p>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.9, marginBottom: "1.1rem", fontSize: "0.95rem" }}>
                Our products will suit all of your needs within your budget and are compatible for all road, race, rally and drift applications.
              </p>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.9, marginBottom: "1.1rem", fontSize: "0.95rem" }}>
                We are specialized in car parts for European cars, especially BMW. We also carry a wide range of products for Japanese car brands.
              </p>

              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "1rem", marginTop: "2rem" }}>// OUR_TEAM</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {[
                  "Passionate about cars — following the latest trends in the performance parts industry",
                  "Excellent customer service with accurate product information",
                  "Fast order processing with great after-sales support",
                  "Regular attendance at domestic & international trade events",
                  "Exclusive distributors for key brands — imported directly from USA, Asia & Europe",
                  "Over 100 popular quality brands available in one place",
                ].map(pt => (
                  <div key={pt} className="about-point" style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                    <CheckCircle size={14} color="var(--red)" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text-muted)", letterSpacing: "0.3px", lineHeight: 1.7 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="about-bars" style={{ border: "1px solid rgba(227,28,28,0.2)", padding: "2rem", position: "relative" }}>
              <div style={{ position: "absolute", top: -1, left: -1, width: 16, height: 16, borderTop: "2px solid var(--red)", borderLeft: "2px solid var(--red)" }} />
              <div style={{ position: "absolute", top: -1, right: -1, width: 16, height: 16, borderTop: "2px solid var(--red)", borderRight: "2px solid var(--red)" }} />
              <div style={{ position: "absolute", bottom: -1, left: -1, width: 16, height: 16, borderBottom: "2px solid var(--red)", borderLeft: "2px solid var(--red)" }} />
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 16, height: 16, borderBottom: "2px solid var(--red)", borderRight: "2px solid var(--red)" }} />

              <div className="section-tag" style={{ marginBottom: "1.5rem" }}>INVENTORY_COVERAGE</div>

              {[
                { label: "ENGINE_SYSTEM", pct: 90 },
                { label: "TURBO_ACCESSORIES", pct: 85 },
                { label: "EXHAUST_SYSTEM", pct: 80 },
                { label: "SUSPENSION", pct: 75 },
                { label: "FUEL_SYSTEM", pct: 70 },
                { label: "INTAKE_SYSTEM", pct: 78 },
              ].map(item => (
                <div key={item.label} style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "1.5px", color: "var(--text-dim)" }}>{item.label}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--red)", fontWeight: 700 }}>{item.pct}%</span>
                  </div>
                  <div className="data-bar">
                    <div className="data-bar-fill about-bar-fill" data-pct={item.pct} style={{ width: 0 }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "1rem" }}>FOUNDED_BY</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.8 }}>
                  Raffi Meguerditchian<br />
                  Vatche Meguerditchian
                </div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-dim)", marginTop: "0.5rem", letterSpacing: "1px" }}>BEIRUT, LEBANON // EST. 2009</div>
              </div>
            </div>
          </div>

          {/* ── History Timeline ── */}
          <div style={{ marginBottom: "4rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)" }}>// HISTORY_LOG</div>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>
            <div className="history-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1px", border: "1px solid var(--border)", backgroundColor: "var(--border)" }}>
              {[
                {
                  year: "2009",
                  tag: "THE_BEGINNING",
                  text: "RedLine Center was founded in Beirut by Raffi & Vatche Meguerditchian. Started as a small retail shop while still operating their regular jobs.",
                },
                {
                  year: "2014",
                  tag: "THE_SUCCESS",
                  text: "Moved to a new warehouse with showroom, office space and storage. Five years later, expanded with a second floor for additional storage.",
                },
                {
                  year: "2017",
                  tag: "TO_BE_CONTINUED",
                  text: "Moved to our current location — larger showroom, 240m² storage, expanded webshop. Now one of the Middle East's largest distributors of aftermarket tuning parts.",
                },
              ].map(card => (
                <div key={card.year} className="about-point" style={{ backgroundColor: "var(--bg-panel)", padding: "2rem", position: "relative" }}>
                  <div style={{ fontFamily: "var(--heading)", fontSize: "clamp(3rem, 6vw, 4.5rem)", fontWeight: 900, color: "transparent", WebkitTextStroke: "1px rgba(227,28,28,0.25)", lineHeight: 1, marginBottom: "0.75rem" }}>
                    {card.year}
                  </div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "0.75rem" }}>{card.tag}</div>
                  <p style={{ fontFamily: "var(--mono)", fontSize: "0.68rem", color: "var(--text-muted)", lineHeight: 1.8 }}>{card.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Main Brands ── */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)" }}>// MAIN_BRANDS</div>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", color: "var(--text-dim)", letterSpacing: "2px" }}>100+ BRANDS AVAILABLE</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {["RRP", "SABELT", "AEM", "SNOW PERFORMANCE", "WISECO", "TIAL", "PRECISION", "TURBONETICS", "WALLBROW", "SEBRING", "BLOX", "ATL", "HKS", "GReddy", "K&N", "ARP", "LINK ECU", "OMP"].map(brand => (
                <div key={brand} style={{
                  fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "2px",
                  padding: "0.4rem 0.8rem", border: "1px solid var(--border-bright)",
                  color: "var(--text-dim)",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(227,28,28,0.4)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-bright)"; (e.currentTarget as HTMLElement).style.color = "var(--text-dim)"; }}
                >
                  {brand}
                </div>
              ))}
            </div>
          </div>
        </div>
        </RevealSection>
      </section>

      {/* ═══════════════════════════════════════ CONTACT ══ */}
      <section id="contact" className="mobile-section" style={{ padding: "6rem 1.5rem", borderTop: "1px solid var(--border)", backgroundColor: "var(--bg-panel)" }}>
        <RevealSection>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="section-header" style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--text-dim)" }}>/06</div>
            <div style={{ width: 1, height: 32, background: "var(--border-bright)" }} />
            <div>
              <div className="section-tag" style={{ marginBottom: "0.3rem" }}>// COMMS_LINK</div>
              <h2 style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)", fontWeight: 800, letterSpacing: "0px", fontFamily: "var(--heading)" }}>Get in Touch</h2>
            </div>
          </div>

          <div className="contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1px", border: "1px solid var(--border)", backgroundColor: "var(--border)", marginBottom: "1.5rem" }}>
            {[
              { icon: <Phone size={18} color="var(--red)" />, label: "VOICE_LINK", lines: ["70-155599", "70-907977"], href: "tel:+96170155599" },
              { icon: <MessageCircle size={18} color="var(--red)" />, label: "WHATSAPP", lines: ["+961 70 155 599", "Fast reply guaranteed"], href: "https://wa.me/96170155599" },
              { icon: <Mail size={18} color="var(--red)" />, label: "DATA_LINK", lines: ["info@redlinecenter.com"], href: "mailto:info@redlinecenter.com" },
              { icon: <MapPin size={18} color="var(--red)" />, label: "COORDINATES", lines: ["Dora Highway, Beirut", "Kaprielian Bldg, GF-A"], href: "https://maps.google.com/?q=Dora+Highway+Lebanon" },
            ].map(card => (
              <a key={card.label} href={card.href}
                target={card.href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="contact-card"
                style={{
                  display: "block", padding: "1.75rem",
                  backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
                  textDecoration: "none", opacity: 0,
                }}
                onMouseEnter={e => gsap.to(e.currentTarget, { y: -5, borderColor: "rgba(227,28,28,0.4)", duration: 0.25, ease: "power2.out" })}
                onMouseLeave={e => gsap.to(e.currentTarget, { y: 0, borderColor: "var(--border)", duration: 0.25, ease: "power2.out" })}
              >
                <div style={{ marginBottom: "1rem" }}>{card.icon}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "2px", color: "var(--red)", marginBottom: "0.75rem" }}>{card.label}</div>
                {card.lines.map(l => (
                  <div key={l} style={{ fontFamily: "var(--mono)", fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: 1.8 }}>{l}</div>
                ))}
              </a>
            ))}
          </div>

          <div className="contact-hours" style={{
            border: "1px solid rgba(227,28,28,0.2)", padding: "1rem 1.5rem",
            display: "flex", alignItems: "center", gap: "1.5rem", flexWrap: "wrap", opacity: 0,
          }}>
            <div className="pulse-dot" />
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "2px", color: "var(--red)" }}>OPERATIONAL_HOURS</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "2px", color: "var(--text-dim)" }}>//</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", letterSpacing: "2px", color: "var(--text-muted)" }}>MON–FRI &nbsp; 09:00 — 18:00 AST</span>
          </div>
        </div>
        </RevealSection>
      </section>
    </div>
  );
}
