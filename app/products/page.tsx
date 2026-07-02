"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Search, MessageCircle, ShoppingCart, X, ArrowRight, ChevronRight, Car } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Suspense } from "react";
import { fetchProducts, fetchCategories, WebsiteProduct, WebsiteCategory } from "@/lib/supabase/queries";
import { useCart } from "@/lib/supabase/CartProvider";
import { useAuth } from "@/lib/supabase/AuthProvider";
import { useGarage } from "@/lib/garage/GarageProvider";
import { getFitmentStatus, carLabel } from "@/lib/garage/matching";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function ProductCard({ product, index, onAdd }: { product: WebsiteProduct; index: number; onAdd: (id: string) => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGPathElement>(null);
  const { activeCar } = useGarage();
  const fitment = activeCar ? getFitmentStatus(product.compatibleCars, activeCar) : "na";

  function onEnter() {
    if (cardRef.current) gsap.to(cardRef.current, { borderColor: "rgba(227,28,28,0.45)", boxShadow: "0 0 24px rgba(227,28,28,0.07), inset 0 0 24px rgba(227,28,28,0.03)", duration: 0.2 });
    if (arcRef.current) gsap.to(arcRef.current, { strokeDashoffset: 0, duration: 0.55, ease: "power2.out" });
  }
  function onLeave() {
    if (cardRef.current) gsap.to(cardRef.current, { borderColor: "var(--border)", boxShadow: "none", duration: 0.25 });
    if (arcRef.current) gsap.to(arcRef.current, { strokeDashoffset: 100, duration: 0.35, ease: "power2.in" });
  }

  return (
    <div
      ref={cardRef}
      className="p-card"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        opacity: 0,
        transform: "translateY(30px)",
        cursor: "default",
      }}
    >
      {/* Corner brackets */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 10, height: 10, borderTop: "1px solid rgba(227,28,28,0.4)", borderLeft: "1px solid rgba(227,28,28,0.4)", zIndex: 3 }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 10, height: 10, borderTop: "1px solid rgba(227,28,28,0.4)", borderRight: "1px solid rgba(227,28,28,0.4)", zIndex: 3 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 10, height: 10, borderBottom: "1px solid rgba(227,28,28,0.4)", borderLeft: "1px solid rgba(227,28,28,0.4)", zIndex: 3 }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderBottom: "1px solid rgba(227,28,28,0.4)", borderRight: "1px solid rgba(227,28,28,0.4)", zIndex: 3 }} />

      {/* Image area */}
      <div style={{
        height: 180, backgroundColor: "#0d0d0d",
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)",
        flexShrink: 0,
      }}>
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="220px"
            style={{ objectFit: "contain", padding: "0.75rem" }}
          />
        ) : (
          <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: "2px" }}>NO_IMAGE</div>
        )}
        {/* bottom gradient */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 40, background: "linear-gradient(transparent, #0d0d0d)", pointerEvents: "none" }} />
        {/* fitment badge */}
        {fitment !== "na" && (
          <div style={{
            position: "absolute", bottom: 8, left: 10,
            fontFamily: "var(--mono)", fontSize: "0.5rem", letterSpacing: "1px",
            padding: "0.15rem 0.4rem",
            display: "flex", alignItems: "center", gap: "0.3rem",
            backgroundColor: fitment === "confirmed" ? "rgba(22,163,74,0.12)" : fitment === "universal" ? "rgba(150,150,150,0.1)" : "rgba(227,28,28,0.08)",
            border: `1px solid ${fitment === "confirmed" ? "rgba(22,163,74,0.35)" : fitment === "universal" ? "var(--border-bright)" : "rgba(227,28,28,0.25)"}`,
            color: fitment === "confirmed" ? "#16a34a" : fitment === "universal" ? "var(--text-muted)" : "rgba(227,28,28,0.7)",
          }}>
            <Car size={9} />
            {fitment === "confirmed" ? "FITS_YOUR_CAR" : fitment === "universal" ? "UNIVERSAL" : "NO_FIT"}
          </div>
        )}
        {/* unit number */}
        <div style={{ position: "absolute", top: 8, left: 10, fontFamily: "var(--mono)", fontSize: "0.52rem", color: "var(--text-dim)", letterSpacing: "2px" }}>
          #{String(index + 1).padStart(3, "0")}
        </div>
        {/* stock badge */}
        <div style={{
          position: "absolute", top: 8, right: 10,
          fontFamily: "var(--mono)", fontSize: "0.5rem", letterSpacing: "1px",
          padding: "0.15rem 0.4rem",
          backgroundColor: product.inStock ? "rgba(22,163,74,0.1)" : "rgba(100,100,100,0.1)",
          border: `1px solid ${product.inStock ? "rgba(22,163,74,0.3)" : "var(--border)"}`,
          color: product.inStock ? "#16a34a" : "var(--text-dim)",
        }}>
          {product.inStock ? "IN_STOCK" : "OOS"}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "1rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.52rem", color: "var(--red)", letterSpacing: "2px", marginBottom: "0.4rem" }}>
          {product.category.replace(/-/g, "_").toUpperCase()}
        </div>
        <h3 style={{ fontSize: "0.85rem", fontWeight: 700, lineHeight: 1.3, marginBottom: "0.4rem", color: "var(--text)", flex: 1 }}>
          {product.name}
        </h3>
        <p style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-dim)", lineHeight: 1.6, marginBottom: "0.9rem" }}>
          {product.description}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "0.75rem", marginTop: "auto" }}>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.48rem", color: "var(--text-dim)", marginBottom: "0.1rem" }}>PRICE_USD</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: "1.1rem", fontWeight: 900, color: "var(--red)", lineHeight: 1 }}>${product.price}</div>
          </div>
          <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
            <button
              onClick={() => onAdd(product.id)}
              disabled={!product.inStock}
              style={{
                fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "1.5px",
                color: "var(--bg)", backgroundColor: product.inStock ? "var(--red)" : "var(--border)",
                padding: "0.4rem 0.65rem", border: "none", cursor: product.inStock ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", gap: "0.3rem",
                clipPath: "polygon(4px 0%, 100% 0%, calc(100% - 4px) 100%, 0% 100%)",
                transition: "background 0.15s",
              }}
            >
              <ShoppingCart size={11} />
            </button>
            <a
              href={`https://wa.me/96170155599?text=Hi%2C%20I%27m%20interested%20in%20the%20${encodeURIComponent(product.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "1.5px",
                color: "var(--text)", backgroundColor: "transparent",
                padding: "0.4rem 0.65rem", textDecoration: "none",
                display: "flex", alignItems: "center",
                border: "1px solid var(--border-bright)",
              }}
            >
              <MessageCircle size={11} />
            </a>
          </div>
        </div>
      </div>

      {/* Tachometer arc — sweeps in on hover */}
      <svg style={{ position: "absolute", bottom: 0, right: 0, pointerEvents: "none", zIndex: 2 }}
        width="65" height="65" viewBox="0 0 65 65">
        <path
          ref={arcRef}
          d="M 65 0 A 65 65 0 0 0 0 65"
          fill="none"
          stroke="#e31c1c"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray="100 100"
          strokeDashoffset="100"
          style={{ filter: "drop-shadow(0 0 5px rgba(227,28,28,0.6))" }}
        />
      </svg>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialCategory = searchParams.get("category") || "all";
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { activeCar, openGarage } = useGarage();

  const [allProducts, setAllProducts] = useState<WebsiteProduct[]>([]);
  const [categories, setCategories] = useState<WebsiteCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [garageOnly, setGarageOnly] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProducts().then(setAllProducts);
    fetchCategories().then(setCategories);
  }, []);

  // Garage filter applies before category/search so tab counts stay honest
  const products = useMemo(() => {
    if (!garageOnly || !activeCar) return allProducts;
    return allProducts.filter(p => {
      const s = getFitmentStatus(p.compatibleCars, activeCar);
      return s === "confirmed" || s === "universal";
    });
  }, [allProducts, garageOnly, activeCar]);

  function handleAdd(productId: string) {
    if (!user) { router.push("/login"); return; }
    addToCart(productId);
  }

  const CATS = useMemo(() => [
    { id: "all", name: "ALL PARTS", count: products.length },
    ...categories.map((c) => ({
      id: c.id,
      name: c.name.toUpperCase(),
      count: products.filter((p) => p.category === c.id).length,
    })).filter((c) => c.count > 0),
  ], [products, categories]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === "all" || p.category === selectedCategory;
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, search]);

  // Group products by category when showing all
  const grouped = useMemo(() => {
    if (selectedCategory !== "all" || search) return null;
    return CATS.filter((c) => c.id !== "all").map((cat) => ({
      cat,
      products: products.filter((p) => p.category === cat.id),
    })).filter((g) => g.products.length > 0);
  }, [products, CATS, selectedCategory, search]);

  const animateCards = useCallback(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll<HTMLElement>(".p-card");
    gsap.killTweensOf(cards);
    gsap.fromTo(cards,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.04, ease: "power2.out", clearProps: "transform" }
    );
  }, []);

  useEffect(() => {
    const t = setTimeout(animateCards, 60);
    return () => clearTimeout(t);
  }, [filtered, animateCards]);

  // Header entrance
  useGSAP(() => {
    gsap.from(".products-hud-header", { y: -20, opacity: 0, duration: 0.6, ease: "power3.out" });
    gsap.from(".cat-tabs-bar", { y: 20, opacity: 0, duration: 0.5, ease: "power3.out", delay: 0.15 });
  }, { scope: pageRef });

  const currentCat = CATS.find((c) => c.id === selectedCategory);

  return (
    <div ref={pageRef} style={{ paddingTop: "calc(60px + env(safe-area-inset-top, 0px) + 8px)", minHeight: "100vh", backgroundColor: "var(--bg)" }}>

      {/* ── HUD PAGE HEADER ── */}
      <div className="products-hud-header" style={{ backgroundColor: "var(--bg-panel)", borderBottom: "1px solid var(--border)", padding: "3rem 1.5rem 2rem", position: "relative", overflow: "hidden" }}>
        {/* Grid bg */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(227,28,28,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(227,28,28,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: "20%", width: 600, height: 300, background: "radial-gradient(ellipse, rgba(227,28,28,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1400, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
            <div className="pulse-dot" />
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "3px", color: "var(--red)" }}>// PARTS_CATALOG</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "var(--text-dim)", letterSpacing: "2px" }}>— {products.length} UNITS INDEXED</span>
          </div>

          <h1 style={{ fontFamily: "var(--heading)", fontSize: "clamp(2.5rem, 6vw, 5rem)", fontWeight: 900, lineHeight: 0.9, letterSpacing: "-1px", marginBottom: "1.5rem" }}>
            {currentCat?.id === "all" ? (
              <><span style={{ color: "var(--text)" }}>ALL</span><br /><span className="text-glow">PARTS</span></>
            ) : (
              <><span style={{ color: "var(--text)" }}>{currentCat?.name.split(" ")[0]}</span>
              {currentCat?.name.split(" ").length! > 1 && <><br /><span className="text-glow">{currentCat?.name.split(" ").slice(1).join(" ")}</span></>}</>
            )}
          </h1>

          {/* Search bar */}
          <div style={{ position: "relative", maxWidth: 480 }}>
            <Search size={14} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
            <input
              type="text"
              placeholder="SEARCH_PARTS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%", paddingLeft: 38, paddingRight: search ? 36 : 14,
                paddingTop: "0.65rem", paddingBottom: "0.65rem",
                backgroundColor: "var(--bg-card)", border: "1px solid var(--border-bright)",
                color: "var(--text)", fontFamily: "var(--mono)", fontSize: "0.7rem",
                letterSpacing: "1px", outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(227,28,28,0.4)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-bright)")}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", display: "flex" }}>
                <X size={14} />
              </button>
            )}
          </div>

          {/* Garage fitment controls */}
          <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {activeCar ? (
              <>
                <button
                  onClick={openGarage}
                  style={{
                    fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "1.5px",
                    color: "var(--red)", backgroundColor: "rgba(227,28,28,0.07)",
                    border: "1px solid rgba(227,28,28,0.35)", padding: "0.45rem 0.8rem",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "0.45rem",
                  }}
                >
                  <Car size={12} />
                  {activeCar.make.toUpperCase()} {carLabel(activeCar).toUpperCase()}
                </button>
                <button
                  onClick={() => setGarageOnly(!garageOnly)}
                  style={{
                    fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "1.5px",
                    color: garageOnly ? "var(--bg)" : "var(--text-muted)",
                    backgroundColor: garageOnly ? "var(--red)" : "transparent",
                    border: `1px solid ${garageOnly ? "var(--red)" : "var(--border-bright)"}`,
                    padding: "0.45rem 0.8rem", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "0.45rem",
                    transition: "all 0.15s",
                    clipPath: garageOnly ? "polygon(5px 0%, 100% 0%, calc(100% - 5px) 100%, 0% 100%)" : "none",
                  }}
                >
                  {garageOnly ? "✓ FITS MY CAR" : "SHOW ONLY MY CAR"}
                </button>
              </>
            ) : (
              <button
                onClick={openGarage}
                style={{
                  fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "1.5px",
                  color: "var(--text-muted)", backgroundColor: "transparent",
                  border: "1px dashed var(--border-bright)", padding: "0.45rem 0.8rem",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: "0.45rem",
                  transition: "color 0.15s, border-color 0.15s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--red)"; e.currentTarget.style.borderColor = "rgba(227,28,28,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--border-bright)"; }}
              >
                <Car size={12} />
                + SELECT YOUR CAR — FILTER PARTS THAT FIT
              </button>
            )}
          </div>

          {/* Result count */}
          {search && (
            <div style={{ marginTop: "0.75rem", fontFamily: "var(--mono)", fontSize: "0.62rem", color: "var(--text-dim)", letterSpacing: "2px" }}>
              {filtered.length} RESULTS FOR &ldquo;{search}&rdquo;
            </div>
          )}
        </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div className="cat-tabs-bar" ref={tabsRef} style={{ backgroundColor: "var(--bg-panel)", borderBottom: "1px solid var(--border)", overflowX: "auto", scrollbarWidth: "none" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 1.5rem", display: "flex", alignItems: "stretch", gap: 0, minWidth: "max-content" }}>
          {CATS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setSearch(""); }}
              style={{
                fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "2px",
                padding: "0.9rem 1.2rem", border: "none", borderBottom: `2px solid ${selectedCategory === cat.id ? "var(--red)" : "transparent"}`,
                backgroundColor: "transparent", cursor: "pointer", whiteSpace: "nowrap",
                color: selectedCategory === cat.id ? "var(--red)" : "var(--text-dim)",
                transition: "color 0.15s, border-color 0.15s",
                display: "flex", alignItems: "center", gap: "0.5rem",
              }}
              onMouseEnter={(e) => { if (selectedCategory !== cat.id) e.currentTarget.style.color = "var(--text-muted)"; }}
              onMouseLeave={(e) => { if (selectedCategory !== cat.id) e.currentTarget.style.color = "var(--text-dim)"; }}
            >
              {cat.name}
              <span style={{
                fontSize: "0.5rem", padding: "0.1rem 0.4rem",
                backgroundColor: selectedCategory === cat.id ? "rgba(227,28,28,0.15)" : "var(--bg-card)",
                border: `1px solid ${selectedCategory === cat.id ? "rgba(227,28,28,0.3)" : "var(--border)"}`,
                color: selectedCategory === cat.id ? "var(--red)" : "var(--text-dim)",
              }}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "3rem 1.5rem 6rem" }}>

        {/* GROUPED VIEW — all categories, no search */}
        {grouped && !search ? (
          <div ref={gridRef}>
            {grouped.map((group) => (
              <div key={group.cat.id} style={{ marginBottom: "5rem" }}>
                {/* Category section header */}
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem", paddingBottom: "1rem", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "0.3rem" }}>// {group.cat.id.replace(/-/g, "_").toUpperCase()}</div>
                    <h2 style={{ fontFamily: "var(--heading)", fontSize: "clamp(1.4rem, 2.5vw, 2rem)", fontWeight: 800 }}>{group.cat.name}</h2>
                  </div>
                  <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
                  <button
                    onClick={() => setSelectedCategory(group.cat.id)}
                    style={{
                      fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "2px",
                      color: "var(--red)", background: "none", border: "1px solid rgba(227,28,28,0.3)",
                      padding: "0.4rem 0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(227,28,28,0.07)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    VIEW ALL {group.products.length} <ChevronRight size={11} />
                  </button>
                </div>

                {/* Show first 8 products in this category */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1px", border: "1px solid var(--border)", backgroundColor: "var(--border)" }}>
                  {group.products.slice(0, 8).map((p, i) => (
                    <ProductCard key={p.id} product={p} index={i} onAdd={handleAdd} />
                  ))}
                </div>

                {group.products.length > 8 && (
                  <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
                    <button
                      onClick={() => setSelectedCategory(group.cat.id)}
                      style={{
                        fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "2px",
                        color: "var(--text-muted)", background: "none",
                        border: "1px solid var(--border-bright)",
                        padding: "0.6rem 1.5rem", cursor: "pointer",
                        display: "inline-flex", alignItems: "center", gap: "0.5rem",
                        transition: "border-color 0.15s, color 0.15s",
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(227,28,28,0.4)"; e.currentTarget.style.color = "var(--red)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-bright)"; e.currentTarget.style.color = "var(--text-muted)"; }}
                    >
                      +{group.products.length - 8} MORE IN {group.cat.name} <ArrowRight size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* FILTERED VIEW — single category or search */
          filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
              <div style={{ fontFamily: "var(--heading)", fontSize: "4rem", color: "rgba(227,28,28,0.1)", marginBottom: "1rem" }}>404</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "0.65rem", color: "var(--text-dim)", letterSpacing: "3px" }}>NO_RESULTS_FOUND</div>
            </div>
          ) : (
            <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1px", border: "1px solid var(--border)", backgroundColor: "var(--border)" }}>
              {filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} onAdd={handleAdd} />
              ))}
            </div>
          )
        )}
      </div>

      <style>{`
        .p-card { transition: border-color 0.2s; }
        .p-card:hover { border-color: rgba(227,28,28,0.35) !important; }
        .cat-tabs-bar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense>
      <ProductsContent />
    </Suspense>
  );
}
