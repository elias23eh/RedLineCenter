"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function RevealSection({ children, className, style }: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lightRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(() => {
    if (!wrapRef.current || !barRef.current) return;
    const lights = lightRefs.current.filter((l): l is HTMLDivElement => l !== null);

    const tl = gsap.timeline({
      scrollTrigger: { trigger: wrapRef.current, start: "top 82%", once: true },
    });

    // Show lights bar
    tl.set(barRef.current, { opacity: 1 });

    // Light up each dot sequentially
    lights.forEach((light, i) => {
      tl.to(light, {
        backgroundColor: "#e31c1c",
        boxShadow: "0 0 10px #e31c1c, 0 0 22px rgba(227,28,28,0.5)",
        duration: 0.13,
        ease: "none",
      }, i * 0.22);
    });

    // Hold all lit
    tl.to({}, { duration: 0.4 });

    // All off at once — like F1 GO signal
    tl.to(lights, { backgroundColor: "#0a0000", boxShadow: "none", duration: 0.07, ease: "none" });

    // Bar fades out upward
    tl.to(barRef.current, { opacity: 0, y: -8, duration: 0.3, ease: "power2.in" }, "+=0.05");

  }, { scope: wrapRef });

  return (
    <div ref={wrapRef} className={className} style={{ position: "relative", ...style }}>
      {/* F1 start lights bar */}
      <div ref={barRef} style={{
        position: "absolute", top: 22, left: "50%", transform: "translateX(-50%)",
        display: "flex", alignItems: "center", gap: 10,
        zIndex: 30, pointerEvents: "none", opacity: 0,
      }}>
        <div style={{ width: 18, height: 1, background: "rgba(227,28,28,0.3)" }} />
        {[0, 1, 2].map(i => (
          <div key={i} ref={el => { lightRefs.current[i] = el; }} style={{
            width: 10, height: 10, borderRadius: "50%",
            backgroundColor: "#0a0000",
            border: "1px solid rgba(227,28,28,0.35)",
            flexShrink: 0,
          }} />
        ))}
        <div style={{ width: 18, height: 1, background: "rgba(227,28,28,0.3)" }} />
      </div>

      {children}
    </div>
  );
}
