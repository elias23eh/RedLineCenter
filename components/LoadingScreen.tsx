"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export default function LoadingScreen() {
  const [done, setDone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!overlayRef.current) return;

    const tl = gsap.timeline();

    // Lights turn on one by one (left to right)
    lightsRef.current.forEach((light, i) => {
      tl.to(light, {
        backgroundColor: "#e31c1c",
        boxShadow: "0 0 30px #e31c1c, 0 0 60px rgba(227,28,28,0.6), 0 0 100px rgba(227,28,28,0.3)",
        duration: 0.18,
        ease: "power2.in",
      }, i * 0.28);
    });

    // Hold all 5 lights on
    tl.to({}, { duration: 0.55 });

    // All lights go off at once — RACE START
    tl.to(lightsRef.current, {
      backgroundColor: "#1a0000",
      boxShadow: "0 0 0px transparent",
      duration: 0.08,
      stagger: 0,
    });

    // Brief white flash across the screen
    tl.to(".rl-flash", {
      opacity: 1,
      duration: 0.06,
      ease: "none",
    });
    tl.to(".rl-flash", {
      opacity: 0,
      duration: 0.35,
      ease: "power2.out",
    });

    // Slide the whole overlay up and out
    tl.to(overlayRef.current, {
      yPercent: -100,
      duration: 0.55,
      ease: "power3.inOut",
      onComplete: () => setDone(true),
    }, "-=0.1");

  }, { scope: overlayRef });

  if (done) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#080808",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "3rem",
        overflow: "hidden",
      }}
    >
      {/* White flash layer */}
      <div
        className="rl-flash"
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "white",
          opacity: 0,
          pointerEvents: "none",
          zIndex: 2,
        }}
      />

      {/* Logo / brand */}
      <div style={{ textAlign: "center", zIndex: 3 }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", letterSpacing: "4px", color: "var(--text-dim)", marginBottom: "0.5rem" }}>
          // INITIALIZING
        </div>
        <div style={{ fontFamily: "var(--heading)", fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 900, color: "var(--text)", letterSpacing: "2px" }}>
          REDLINE<span style={{ color: "var(--red)" }}>.</span>CENTER
        </div>
      </div>

      {/* ── Racing lights gantry ── */}
      <div style={{ zIndex: 3, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
        {/* Gantry bar */}
        <div style={{
          width: "min(340px, 90vw)",
          backgroundColor: "#111",
          border: "1px solid #222",
          padding: "1.25rem 2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "clamp(12px, 3vw, 20px)",
          position: "relative",
        }}>
          {/* Gantry top rail */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "#1e1e1e" }} />

          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              ref={el => { lightsRef.current[i] = el; }}
              style={{
                width: "clamp(32px, 7vw, 44px)",
                height: "clamp(32px, 7vw, 44px)",
                borderRadius: "50%",
                backgroundColor: "#1a0000",
                border: "2px solid #2a0000",
                boxShadow: "0 0 0px transparent",
                transition: "border-color 0.1s",
                flexShrink: 0,
              }}
            />
          ))}

          {/* Gantry bottom rail */}
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "#1e1e1e" }} />
        </div>

        <div style={{ fontFamily: "var(--mono)", fontSize: "0.55rem", letterSpacing: "3px", color: "#333" }}>
          LIGHTS_OUT // RACE_START
        </div>
      </div>

      {/* Scanlines */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.15) 3px, rgba(0,0,0,0.15) 4px)",
      }} />
    </div>
  );
}
