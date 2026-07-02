"use client";

import { useEffect, useRef, useState } from "react";
import { X, Plus, Trash2, Check, ChevronLeft, Car } from "lucide-react";
import gsap from "gsap";
import { useGarage } from "@/lib/garage/GarageProvider";
import { carLabel } from "@/lib/garage/matching";
import { MAKES, modelsForMake, type VehicleModel } from "@/lib/garage/vehicles";

type Step = "list" | "make" | "model" | "year";

const mono: React.CSSProperties = { fontFamily: "var(--mono)" };

export default function GarageSelector() {
  const { cars, activeCar, isOpen, closeGarage, addCar, removeCar, setActiveCar } = useGarage();
  const [step, setStep] = useState<Step>("list");
  const [make, setMake] = useState<string | null>(null);
  const [model, setModel] = useState<VehicleModel | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(cars.length === 0 ? "make" : "list");
      if (panelRef.current && backdropRef.current) {
        gsap.fromTo(panelRef.current, { x: "100%" }, { x: 0, duration: 0.45, ease: "expo.out" });
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  async function pickYear(year: number) {
    if (!make || !model) return;
    await addCar({ make, model: model.name, year, nickname: null });
    setMake(null); setModel(null);
    setStep("list");
  }

  function stepBack() {
    if (step === "year") setStep("model");
    else if (step === "model") setStep("make");
    else setStep("list");
  }

  const years = model
    ? Array.from({ length: model.years[1] - model.years[0] + 1 }, (_, i) => model.years[1] - i)
    : [];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300 }}>
      {/* Backdrop */}
      <div ref={backdropRef} onClick={closeGarage} style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(3px)" }} />

      {/* Panel */}
      <div ref={panelRef} className="scanlines" style={{
        position: "absolute", top: 0, right: 0, bottom: 0,
        width: "min(420px, 100vw)",
        backgroundColor: "var(--bg-panel)", borderLeft: "1px solid rgba(227,28,28,0.3)",
        display: "flex", flexDirection: "column", overflow: "hidden",
      }}>
        {/* Hazard stripe top */}
        <div style={{ height: 4, background: "repeating-linear-gradient(-45deg, var(--red) 0 10px, transparent 10px 20px)" }} />

        {/* Header */}
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ ...mono, fontSize: "0.58rem", letterSpacing: "3px", color: "var(--red)", marginBottom: "0.25rem" }}>// MY_GARAGE</div>
            <div style={{ fontFamily: "var(--heading)", fontSize: "1.5rem", fontWeight: 900, letterSpacing: "0.5px" }}>
              {step === "list" ? "YOUR UNITS" : step === "make" ? "SELECT MAKE" : step === "model" ? "SELECT MODEL" : "SELECT YEAR"}
            </div>
          </div>
          <button onClick={closeGarage} style={{ background: "none", border: "1px solid var(--border-bright)", color: "var(--text)", padding: "0.4rem", cursor: "pointer", display: "flex" }}>
            <X size={16} />
          </button>
        </div>

        {/* Breadcrumb when adding */}
        {step !== "list" && (
          <div style={{ padding: "0.6rem 1.5rem", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button onClick={stepBack} style={{ ...mono, background: "none", border: "none", color: "var(--text-dim)", fontSize: "0.6rem", letterSpacing: "1px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <ChevronLeft size={12} /> BACK
            </button>
            <span style={{ ...mono, fontSize: "0.6rem", letterSpacing: "1.5px", color: "var(--text-muted)" }}>
              {make ?? "…"} {model ? `// ${model.name.toUpperCase()}` : ""}
            </span>
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem" }}>

          {step === "list" && (
            <>
              {cars.map(car => {
                const active = activeCar?.id === car.id;
                return (
                  <div key={car.id} onClick={() => setActiveCar(car.id)} style={{
                    border: `1px solid ${active ? "rgba(227,28,28,0.5)" : "var(--border)"}`,
                    backgroundColor: active ? "rgba(227,28,28,0.06)" : "var(--bg-card)",
                    padding: "0.9rem 1rem", marginBottom: "0.6rem", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "0.9rem",
                    clipPath: "polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)",
                    transition: "border-color 0.15s, background-color 0.15s",
                  }}>
                    <Car size={18} color={active ? "var(--red)" : "var(--text-dim)"} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)" }}>
                        {car.make} {car.model}{car.year ? ` — ${car.year}` : ""}
                      </div>
                      <div style={{ ...mono, fontSize: "0.55rem", letterSpacing: "1.5px", color: active ? "var(--red)" : "var(--text-dim)", marginTop: "0.2rem" }}>
                        {active ? "▸ ACTIVE UNIT" : "TAP TO ACTIVATE"}
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); removeCar(car.id); }}
                      style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", display: "flex", padding: "0.3rem" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "var(--red)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "var(--text-dim)")}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}

              {activeCar && (
                <button onClick={() => setActiveCar(null)} style={{
                  ...mono, width: "100%", fontSize: "0.58rem", letterSpacing: "2px",
                  color: "var(--text-dim)", background: "none", border: "1px dashed var(--border)",
                  padding: "0.55rem", cursor: "pointer", marginBottom: "0.6rem",
                }}>
                  BROWSE WITHOUT A CAR
                </button>
              )}

              <button onClick={() => setStep("make")} style={{
                ...mono, width: "100%", fontSize: "0.65rem", letterSpacing: "2px",
                color: "var(--bg)", backgroundColor: "var(--red)", border: "none",
                padding: "0.8rem", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem",
                clipPath: "polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%)",
              }}>
                <Plus size={14} /> ADD UNIT
              </button>
            </>
          )}

          {step === "make" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", border: "1px solid var(--border)", backgroundColor: "var(--border)" }}>
              {MAKES.map(m => (
                <button key={m} onClick={() => { setMake(m); setStep("model"); }} style={{
                  fontFamily: "var(--heading)", fontSize: "1rem", fontWeight: 800, letterSpacing: "1px",
                  color: "var(--text)", backgroundColor: "var(--bg-card)", border: "none",
                  padding: "1.1rem 0.5rem", cursor: "pointer", transition: "background-color 0.15s, color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(227,28,28,0.08)"; e.currentTarget.style.color = "var(--red)"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--bg-card)"; e.currentTarget.style.color = "var(--text)"; }}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {step === "model" && make && (
            <>
              {modelsForMake(make).map(m => (
                <button key={m.id} onClick={() => { setModel(m); setStep("year"); }} style={{
                  width: "100%", textAlign: "left",
                  backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
                  padding: "0.8rem 1rem", marginBottom: "0.45rem", cursor: "pointer",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  transition: "border-color 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(227,28,28,0.45)")}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
                >
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--text)" }}>{m.name}</span>
                  <span style={{ ...mono, fontSize: "0.55rem", letterSpacing: "1px", color: "var(--text-dim)" }}>
                    {m.years[0]}–{m.years[1]}
                  </span>
                </button>
              ))}
            </>
          )}

          {step === "year" && model && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", border: "1px solid var(--border)", backgroundColor: "var(--border)" }}>
              {years.map(y => (
                <button key={y} onClick={() => pickYear(y)} style={{
                  ...mono, fontSize: "0.75rem", fontWeight: 700,
                  color: "var(--text)", backgroundColor: "var(--bg-card)", border: "none",
                  padding: "0.85rem 0.25rem", cursor: "pointer", transition: "background-color 0.15s, color 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = "rgba(227,28,28,0.08)"; e.currentTarget.style.color = "var(--red)"; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = "var(--bg-card)"; e.currentTarget.style.color = "var(--text)"; }}
                >
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer status */}
        <div style={{ padding: "0.8rem 1.5rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <div className="pulse-dot" style={{ width: 6, height: 6 }} />
          <span style={{ ...mono, fontSize: "0.55rem", letterSpacing: "2px", color: "var(--text-dim)" }}>
            {activeCar
              ? <>FITMENT LOCKED: <span style={{ color: "var(--red)" }}>{carLabel(activeCar).toUpperCase()}</span></>
              : "NO ACTIVE UNIT — SHOWING ALL PARTS"}
          </span>
          {activeCar && <Check size={12} color="var(--red)" style={{ marginLeft: "auto" }} />}
        </div>
      </div>
    </div>
  );
}
