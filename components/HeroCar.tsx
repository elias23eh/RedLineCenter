"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HeroCar() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Subtle idle: slow scale breathe on the photo
    gsap.to(".drift-photo", {
      scale: 1.05,
      duration: 6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Scroll: whole block drifts right as user scrolls away
    gsap.to(wrapRef.current, {
      x: "70%",
      ease: "none",
      scrollTrigger: {
        trigger: "#hero-section",
        start: "20% top",
        end: "90% top",
        scrub: 1.8,
      },
    });

    // HUD scan line pulse
    gsap.to(".hud-scanline", {
      opacity: 0.18,
      duration: 1.4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Corner brackets flash in
    gsap.from(".img-bracket", {
      opacity: 0,
      scale: 0.85,
      duration: 0.6,
      ease: "expo.out",
      stagger: 0.08,
      delay: 0.5,
    });

    // Overlay data flicker
    gsap.from(".hud-data-line", {
      opacity: 0,
      x: 10,
      duration: 0.5,
      stagger: 0.12,
      ease: "power2.out",
      delay: 0.7,
    });
  }, { scope: wrapRef });

  return (
    <div
      ref={wrapRef}
      style={{
        position: "relative",
        width: "100%",
        height: 380,
        overflow: "hidden",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      {/* ── Photo ── */}
      <Image
        className="drift-photo"
        src="/drift-car.png"
        alt="Redline Center Formula Drift Car"
        fill
        priority
        sizes="520px"
        style={{
          objectFit: "cover",
          objectPosition: "center 40%",
          transformOrigin: "center center",
        }}
      />

      {/* ── Left gradient fade (blends into dark bg) ── */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(to right, #080808 0%, rgba(8,8,8,0.5) 22%, transparent 50%)",
      }} />

      {/* ── Top vignette ── */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 80, zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(8,8,8,0.7) 0%, transparent 100%)",
      }} />

      {/* ── Bottom vignette + red glow ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 100, zIndex: 2, pointerEvents: "none",
        background: "linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.3) 60%, transparent 100%)",
      }} />
      <div style={{
        position: "absolute", bottom: -8, left: "20%", right: "10%", height: 28, zIndex: 2, pointerEvents: "none",
        background: "rgba(227,28,28,0.22)",
        filter: "blur(22px)",
      }} />

      {/* ── HUD scan-line overlay ── */}
      <div className="hud-scanline" style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.12) 3px, rgba(0,0,0,0.12) 4px)",
        opacity: 0.25,
      }} />

      {/* ── HUD corner brackets ── */}
      {/* Top-left */}
      <div className="img-bracket" style={{ position: "absolute", top: 10, left: 10, width: 18, height: 18, zIndex: 4, borderTop: "2px solid var(--red)", borderLeft: "2px solid var(--red)", opacity: 0.7 }} />
      {/* Top-right */}
      <div className="img-bracket" style={{ position: "absolute", top: 10, right: 10, width: 18, height: 18, zIndex: 4, borderTop: "2px solid var(--red)", borderRight: "2px solid var(--red)", opacity: 0.7 }} />
      {/* Bottom-left */}
      <div className="img-bracket" style={{ position: "absolute", bottom: 10, left: 10, width: 18, height: 18, zIndex: 4, borderBottom: "2px solid var(--red)", borderLeft: "2px solid var(--red)", opacity: 0.7 }} />
      {/* Bottom-right */}
      <div className="img-bracket" style={{ position: "absolute", bottom: 10, right: 10, width: 18, height: 18, zIndex: 4, borderBottom: "2px solid var(--red)", borderRight: "2px solid var(--red)", opacity: 0.7 }} />

      {/* ── HUD data overlay ── */}
      <div style={{ position: "absolute", bottom: 18, left: 18, zIndex: 5 }}>
        <div className="hud-data-line" style={{ fontFamily: "var(--mono)", fontSize: "0.58rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "0.3rem" }}>
          FORMULA_DRIFT // UNIT_#42
        </div>
        <div className="hud-data-line" style={{ fontFamily: "var(--mono)", fontSize: "0.55rem", letterSpacing: "2px", color: "rgba(255,255,255,0.45)" }}>
          REDLINE_CENTER // POWERED_BY_HKS
        </div>
      </div>

      {/* ── Top-right target reticle ── */}
      <div style={{ position: "absolute", top: 14, right: 34, zIndex: 5 }}>
        <div className="hud-data-line" style={{ fontFamily: "var(--mono)", fontSize: "0.52rem", letterSpacing: "2px", color: "rgba(227,28,28,0.7)", textAlign: "right" }}>
          LIVE_FEED
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", justifyContent: "flex-end" }}>
          <div className="pulse-dot" style={{ width: 5, height: 5 }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: "0.5rem", color: "rgba(255,255,255,0.35)", letterSpacing: "1px" }}>REC</span>
        </div>
      </div>

      {/* ── Red accent border at bottom ── */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2, zIndex: 5,
        background: "linear-gradient(to right, transparent, var(--red) 30%, var(--red) 70%, transparent)",
        opacity: 0.6,
      }} />
    </div>
  );
}
