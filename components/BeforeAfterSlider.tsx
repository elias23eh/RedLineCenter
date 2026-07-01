"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";

interface Props {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export default function BeforeAfterSlider({
  beforeSrc, afterSrc, beforeLabel = "STOCK", afterLabel = "MODDED",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    function onMove(e: MouseEvent | TouchEvent) {
      if (!dragging.current) return;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      updateFromClientX(clientX);
    }
    function onUp() { dragging.current = false; }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchend", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchend", onUp);
    };
  }, [updateFromClientX]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative", width: "100%", aspectRatio: "3 / 2",
        overflow: "hidden", userSelect: "none", cursor: "ew-resize",
        border: "1px solid var(--border-bright)",
      }}
      onMouseDown={(e) => { dragging.current = true; updateFromClientX(e.clientX); }}
      onTouchStart={(e) => { dragging.current = true; updateFromClientX(e.touches[0].clientX); }}
    >
      {/* Corner brackets */}
      <div style={{ position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTop: "2px solid var(--red)", borderLeft: "2px solid var(--red)", zIndex: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: 0, right: 0, width: 16, height: 16, borderTop: "2px solid var(--red)", borderRight: "2px solid var(--red)", zIndex: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 16, height: 16, borderBottom: "2px solid var(--red)", borderLeft: "2px solid var(--red)", zIndex: 4, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottom: "2px solid var(--red)", borderRight: "2px solid var(--red)", zIndex: 4, pointerEvents: "none" }} />

      {/* AFTER (full size, base layer) */}
      <Image src={afterSrc} alt={afterLabel} fill sizes="(max-width: 900px) 100vw, 900px" style={{ objectFit: "cover", pointerEvents: "none" }} draggable={false} priority />

      {/* BEFORE (same full size, clipped via clip-path to reveal only the slider portion) */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        clipPath: `inset(0 ${100 - pos}% 0 0)`,
      }}>
        <Image src={beforeSrc} alt={beforeLabel} fill sizes="(max-width: 900px) 100vw, 900px" style={{ objectFit: "cover" }} draggable={false} priority />
      </div>

      {/* Labels */}
      <div style={{
        position: "absolute", top: 14, left: 14, zIndex: 3,
        fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "2px", fontWeight: 700,
        color: "var(--text)", backgroundColor: "rgba(8,8,8,0.75)", padding: "0.35rem 0.7rem",
        border: "1px solid var(--border-bright)",
        opacity: pos > 12 ? 1 : 0, transition: "opacity 0.15s",
      }}>
        {beforeLabel}
      </div>
      <div style={{
        position: "absolute", top: 14, right: 14, zIndex: 3,
        fontFamily: "var(--mono)", fontSize: "0.62rem", letterSpacing: "2px", fontWeight: 700,
        color: "var(--bg)", backgroundColor: "var(--red)", padding: "0.35rem 0.7rem",
        opacity: pos < 88 ? 1 : 0, transition: "opacity 0.15s",
      }}>
        {afterLabel}
      </div>

      {/* Divider line + handle */}
      <div style={{
        position: "absolute", top: 0, bottom: 0, left: `${pos}%`,
        width: 2, backgroundColor: "var(--red)", zIndex: 3, pointerEvents: "none",
        boxShadow: "0 0 12px rgba(227,28,28,0.7)",
      }} />
      <div style={{
        position: "absolute", top: "50%", left: `${pos}%`, transform: "translate(-50%, -50%)",
        width: 40, height: 40, borderRadius: "50%",
        backgroundColor: "var(--red)", display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 3, pointerEvents: "none", boxShadow: "0 0 20px rgba(227,28,28,0.6)",
      }}>
        <ArrowLeftRight size={18} color="var(--bg)" />
      </div>
    </div>
  );
}
