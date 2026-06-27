"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const TOTAL_DESKTOP = 73;
const W = 960;
const H = 960;
const BG = "#bab7aa";

function isMobileDevice() {
  if (typeof window === "undefined") return false;
  return window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

export default function ManifoldScrollSection() {
  const outerRef   = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const framesRef  = useRef<HTMLImageElement[]>([]);
  const bitmapsRef = useRef<(ImageBitmap | null)[]>([]);
  const idxRef     = useRef(0);
  const stepRef    = useRef(1);
  const totalRef   = useRef(TOTAL_DESKTOP);

  const [loadPct, setLoadPct] = useState(0);
  const [ready, setReady]     = useState(false);

  // ── 1. Preload — mobile-aware ─────────────────────────────────────────
  useEffect(() => {
    const mobile = isMobileDevice();
    const step   = mobile ? 2 : 1;
    const total  = Math.ceil(TOTAL_DESKTOP / step); // 37 mobile, 73 desktop
    stepRef.current  = step;
    totalRef.current = total;

    let loaded = 0;
    bitmapsRef.current = new Array(total).fill(null);
    framesRef.current  = Array.from({ length: total }, (_, i) => {
      const frameNum = i * step + 1;
      const img = new Image();
      img.src = `/manifolds/f${String(frameNum).padStart(3, "0")}.jpg`;
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

  // ── 2. Draw — contain mode ────────────────────────────────────────────
  function draw(canvas: HTMLCanvasElement, idx: number) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.min(cw / W, ch / H);
    const dw = W * scale;
    const dh = H * scale;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, cw, ch);
    const bm = bitmapsRef.current[idx];
    if (bm) {
      ctx.drawImage(bm, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    } else {
      const img = framesRef.current[idx];
      if (!img?.complete || !img.naturalWidth) return;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
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
        }
      },
    });

    return () => { st.kill(); };
  }, [ready]);

  return (
    <div ref={outerRef} style={{ height: "220vh", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, height: "100vh", backgroundColor: BG, overflow: "hidden" }}>

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to bottom, #080808, transparent)", zIndex: 4, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 100, background: "linear-gradient(to top, #080808, transparent)", zIndex: 4, pointerEvents: "none" }} />

        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", display: "block" }} />

        {!ready && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, backgroundColor: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: "0.6rem", color: "#555", letterSpacing: "3px" }}>LOADING — {loadPct}%</div>
            <div style={{ width: 160, height: 2, backgroundColor: "#888", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${loadPct}%`, backgroundColor: "#e31c1c", transition: "width 0.1s" }} />
            </div>
          </div>
        )}

        {ready && idxRef.current < 5 && (
          <div style={{ position: "absolute", bottom: 110, left: "50%", transform: "translateX(-50%)", fontFamily: "var(--mono)", fontSize: "0.52rem", color: "rgba(255,255,255,0.5)", letterSpacing: "3px", zIndex: 5, textAlign: "center" }}>
            ↓ SCROLL
          </div>
        )}
      </div>
    </div>
  );
}
