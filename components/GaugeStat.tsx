"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const R = 36;
const C = 2 * Math.PI * R;
const ARC = C * 0.72; // ~260° sweep

interface Props {
  num: number;
  suffix: string;
  label: string;
  pct: number;   // 0–100, how full the arc fills
  delay?: number;
}

export default function GaugeStat({ num, suffix, label, pct, delay = 0 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);

  useGSAP(() => {
    if (!wrapRef.current || !numRef.current || !arcRef.current) return;

    const filled = ARC * (pct / 100);
    gsap.set(arcRef.current, { strokeDashoffset: ARC });

    const tl = gsap.timeline({
      delay,
      scrollTrigger: { trigger: wrapRef.current, start: "top 90%", once: true },
    });

    const obj = { v: 0 };
    tl.to(obj, {
      v: num,
      duration: 1.8,
      ease: "power2.out",
      onUpdate() { if (numRef.current) numRef.current.textContent = Math.round(obj.v).toString(); },
    }, 0);

    tl.to(arcRef.current, {
      strokeDashoffset: ARC - filled,
      duration: 1.8,
      ease: "power2.out",
    }, 0);
  }, { scope: wrapRef });

  return (
    <div ref={wrapRef} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: 88, height: 88 }}>
        <svg width="88" height="88" style={{ position: "absolute", inset: 0, transform: "rotate(-234deg)" }}>
          {/* Track arc */}
          <circle cx="44" cy="44" r={R} fill="none"
            stroke="rgba(227,28,28,0.12)" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={`${ARC} ${C}`} />
          {/* Fill arc */}
          <circle ref={arcRef} cx="44" cy="44" r={R} fill="none"
            stroke="#e31c1c" strokeWidth="2.5" strokeLinecap="round"
            strokeDasharray={`${ARC} ${C}`} strokeDashoffset={ARC}
            style={{ filter: "drop-shadow(0 0 5px rgba(227,28,28,0.7))" }} />
        </svg>
        {/* Number centered */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontFamily: "var(--mono)", fontWeight: 900, color: "var(--red)", lineHeight: 1 }}>
            <span ref={numRef} style={{ fontSize: "1.45rem" }}>0</span>
            <span style={{ fontSize: "0.6rem" }}>{suffix}</span>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: "var(--mono)", fontSize: "0.55rem", color: "var(--text-dim)", marginTop: "0.35rem", letterSpacing: "2px", textAlign: "center" }}>
        {label}
      </div>
    </div>
  );
}
