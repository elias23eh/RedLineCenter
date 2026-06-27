"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_DESKTOP = 121;
const W = 1244;
const H = 1664;

// Stage thresholds in absolute frame numbers (0-based)
const STAGES = [
  { from: 0,   label: "SSQV4",       sub: "Sequential Blow Off Valve" },
  { from: 35,  label: "SQVFLT",      sub: "Flanged Type" },
  { from: 62,  label: "SSBOV",       sub: "Stainless Steel Series" },
  { from: 88,  label: "RSSSQV",      sub: "Return Signal Series" },
  { from: 107, label: "SSQV Type S", sub: "Type S — Recirculation" },
];

function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export default function HKSScrollSection() {
  const outerRef   = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const framesRef  = useRef<HTMLImageElement[]>([]);
  const bitmapsRef = useRef<(ImageBitmap | null)[]>([]);
  const idxRef     = useRef(0);
  const stepRef    = useRef(1);   // 1 = all frames, 2 = every other
  const totalRef   = useRef(TOTAL_DESKTOP);

  const [loadPct, setLoadPct]   = useState(0);
  const [ready, setReady]       = useState(false);
  const [stageIdx, setStageIdx] = useState(0);

  // ── 1. Preload — mobile-aware ─────────────────────────────────────────
  useEffect(() => {
    const mobile = isMobileDevice();
    const step   = mobile ? 2 : 1;
    const total  = Math.ceil(TOTAL_DESKTOP / step); // 61 mobile, 121 desktop
    stepRef.current  = step;
    totalRef.current = total;

    let loaded = 0;
    bitmapsRef.current = new Array(total).fill(null);
    framesRef.current  = Array.from({ length: total }, (_, i) => {
      const frameNum = i * step + 1;
      const img = new Image();
      img.src = `/hks/f${String(frameNum).padStart(3, "0")}.jpg`;
      img.onload = () => {
        loaded++;
        setLoadPct(Math.round((loaded / total) * 100));
        // ImageBitmap only on desktop — mobile crashes from GPU texture memory
        if (!mobile && "createImageBitmap" in window) {
          createImageBitmap(img).then(bm => { bitmapsRef.current[i] = bm; });
        }
        if (loaded === total) setReady(true);
      };
      img.onerror = () => { loaded++; if (loaded === total) setReady(true); };
      return img;
    });
  }, []);

  // ── 2. Draw ───────────────────────────────────────────────────────────
  function draw(canvas: HTMLCanvasElement, idx: number) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / W, ch / H);
    const dw = W * scale;
    const dh = H * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    const bm = bitmapsRef.current[idx];
    if (bm) {
      ctx.drawImage(bm, dx, dy, dw, dh);
    } else {
      const img = framesRef.current[idx];
      if (!img?.complete || !img.naturalWidth) return;
      ctx.drawImage(img, dx, dy, dw, dh);
    }
  }

  // ── 3. Resize ─────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      draw(canvas, idxRef.current);
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [ready]);

  // ── 4. ScrollTrigger ──────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || !outerRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const total  = totalRef.current;
    const step   = stepRef.current;
    draw(canvas, 0);

    const st = ScrollTrigger.create({
      trigger: outerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate(self) {
        const idx = Math.min(Math.round(self.progress * (total - 1)), total - 1);
        if (idx !== idxRef.current) {
          idxRef.current = idx;
          draw(canvas, idx);
          // Convert array index back to absolute frame number for stage detection
          const absoluteFrame = idx * step;
          let s = 0;
          for (let i = STAGES.length - 1; i >= 0; i--) {
            if (absoluteFrame >= STAGES[i].from) { s = i; break; }
          }
          setStageIdx(s);
        }
      },
    });

    return () => { st.kill(); };
  }, [ready]);

  const stage = STAGES[stageIdx];

  return (
    <div ref={outerRef} style={{ height: "250vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", backgroundColor: "#d5d4cc", overflow: "hidden" }}>

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to bottom, #080808, transparent)", zIndex: 4, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 90, background: "linear-gradient(to top, #0d0d0d, transparent)", zIndex: 4, pointerEvents: "none" }} />

        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

        {!ready && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, backgroundColor: "#d5d4cc", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "#555", letterSpacing: "3px" }}>LOADING_HKS_LINEUP — {loadPct}%</div>
            <div style={{ width: 180, height: 2, backgroundColor: "#aaa", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${loadPct}%`, backgroundColor: "#e31c1c", transition: "width 0.1s" }} />
            </div>
          </div>
        )}

        {ready && (
          <>
            <div style={{ position: "absolute", top: 100, left: "5%", zIndex: 5, fontFamily: "var(--mono)" }}>
              <div style={{ fontSize: "0.55rem", letterSpacing: "3px", color: "#e31c1c", marginBottom: "0.35rem" }}>// HKS</div>
              <div style={{ fontSize: "clamp(1.1rem, 3vw, 1.6rem)", fontWeight: 800, color: "#111", fontFamily: "var(--heading)", lineHeight: 1 }}>
                BLOW OFF<br />VALVE LINEUP
              </div>
            </div>

            <div style={{ position: "absolute", right: "5%", top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: "0.85rem", zIndex: 5 }}>
              {STAGES.map((s, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.65rem", justifyContent: "flex-end" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "0.5rem", letterSpacing: "1.5px", color: i <= stageIdx ? "#333" : "#ccc", transition: "color 0.3s", textAlign: "right" }}>
                    {i <= stageIdx ? s.label : ""}
                  </div>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", flexShrink: 0, backgroundColor: i <= stageIdx ? "#e31c1c" : "#ccc", boxShadow: i <= stageIdx ? "0 0 8px rgba(227,28,28,0.5)" : "none", transition: "all 0.3s" }} />
                </div>
              ))}
            </div>

            <div style={{ position: "absolute", bottom: 100, left: "50%", transform: "translateX(-50%)", textAlign: "center", zIndex: 5 }}>
              <div key={stage.label} style={{ fontFamily: "var(--mono)", animation: "hks-fadein 0.3s ease" }}>
                <div style={{ fontSize: "clamp(0.85rem, 2.5vw, 1.1rem)", fontWeight: 800, color: "#111", letterSpacing: "2px", fontFamily: "var(--heading)" }}>{stage.label}</div>
                <div style={{ fontSize: "0.58rem", color: "#666", letterSpacing: "2px", marginTop: "0.2rem" }}>{stage.sub}</div>
              </div>
            </div>

            {stageIdx === 0 && (
              <div style={{ position: "absolute", bottom: 60, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--mono)", fontSize: "0.52rem", color: "#999", letterSpacing: "3px", zIndex: 5, textAlign: "center" }}>
                ↓ SCROLL TO REVEAL
              </div>
            )}
          </>
        )}

        <style>{`
          @keyframes hks-fadein { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:translateY(0); } }
        `}</style>
      </div>
    </div>
  );
}
