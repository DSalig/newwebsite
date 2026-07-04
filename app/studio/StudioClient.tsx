"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { getProduct } from "@/lib/products";
import type { Analysis } from "@/app/api/analyze/route";

const ROOM_TYPES = [
  ["living-room", "Living room"],
  ["kitchen", "Kitchen"],
  ["bedroom", "Bedroom"],
  ["dining-room", "Dining room"],
  ["office", "Office / workspace"],
  ["restaurant", "Restaurant / bar"],
  ["retail", "Retail"],
  ["other", "Something else"],
] as const;

export default function StudioClient() {
  const [image, setImage] = useState<string | null>(null);
  const [roomType, setRoomType] = useState<string>("living-room");
  const [goals, setGoals] = useState("");
  const [drag, setDrag] = useState(false);
  const [phase, setPhase] = useState<"input" | "analyzing" | "result">("input");
  const [result, setResult] = useState<Analysis | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const readFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  async function analyze() {
    setPhase("analyzing");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ image, roomType, goals }),
      });
      const data: Analysis = await res.json();
      setResult(data);
      setPhase("result");
    } catch {
      setPhase("input");
    }
  }

  const recommendedSlugs = result
    ? [...new Set(result.layers.flatMap((l) => l.productSlugs))]
    : [];

  return (
    <>
      <section className="hero" style={{ paddingBottom: 36 }}>
        <div
          className="glow-orb breathe"
          style={{ width: 520, height: 520, background: "rgba(255,180,84,0.12)", top: -200, right: "-4%" }}
          aria-hidden="true"
        />
        <div className="container" style={{ position: "relative" }}>
          <Reveal><span className="eyebrow">AI Lighting Studio</span></Reveal>
          <Reveal delay={80}>
            <h1 className="h-xl" style={{ marginTop: 18, maxWidth: "16ch" }}>
              One photo. A <span className="italic-accent">personal</span> lighting plan.
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ marginTop: 22 }}>
              Photograph your space and the studio reads its architecture,
              natural light, and mood — then drafts a three-layer plan with
              specific pieces from our collection. Every AI plan is reviewed
              by a human designer before your consultation.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-tight">
        <div className="container" style={{ maxWidth: 880 }}>
          {phase === "input" && (
            <div style={{ display: "grid", gap: 28 }}>
              {/* dropzone */}
              <div
                className="dropzone"
                data-drag={drag}
                onClick={() => fileRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  const f = e.dataTransfer.files?.[0];
                  if (f) readFile(f);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                aria-label="Upload a photo of your space"
              >
                {image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="Your uploaded space" />
                    <p className="mono-note">TAP TO REPLACE PHOTO</p>
                  </>
                ) : (
                  <>
                    <p style={{ fontSize: 40, marginBottom: 10 }}>✦</p>
                    <h2 className="h-md" style={{ marginBottom: 8 }}>Drop a photo of your space</h2>
                    <p style={{ color: "var(--text-dim)", fontSize: 15 }}>
                      or tap to choose one — any room, any light, phone photos welcome
                    </p>
                    <p className="mono-note" style={{ marginTop: 16 }}>
                      PHOTOS ARE USED ONLY TO GENERATE YOUR PLAN
                    </p>
                  </>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) readFile(f);
                  }}
                />
              </div>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="st-room">What kind of space?</label>
                  <select id="st-room" value={roomType} onChange={(e) => setRoomType(e.target.value)}>
                    {ROOM_TYPES.map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="st-goals">What should the light do? (optional)</label>
                  <input
                    id="st-goals"
                    placeholder="cozy evenings, brighter workspace, showcase art…"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <button className="btn btn-primary btn-lg" onClick={analyze}>
                  ✦ Generate my lighting plan
                </button>
                <span className="mono-note">
                  {image ? "PHOTO ATTACHED" : "NO PHOTO? WE'LL DRAFT FROM YOUR ROOM TYPE"}
                </span>
              </div>
            </div>
          )}

          {phase === "analyzing" && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div className="scan-wrap" style={{ maxWidth: 460, margin: "0 auto 28px" }}>
                {image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={image} alt="Analyzing your space" style={{ width: "100%", display: "block" }} />
                ) : (
                  <div style={{ height: 240, background: "var(--surface-2)" }} />
                )}
              </div>
              <h2 className="h-md">Reading your space…</h2>
              <p style={{ color: "var(--text-dim)", marginTop: 8 }}>
                Architecture · existing fixtures · natural light · mood
              </p>
            </div>
          )}

          {phase === "result" && result && (
            <div style={{ display: "grid", gap: 34 }}>
              <div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
                  <span className="chip">
                    {result.source === "ai" ? "AI VISION ANALYSIS" : "STUDIO DRAFT PLAN"}
                  </span>
                  <span className="chip-quiet chip">DESIGNER-REVIEWED BEFORE QUOTE</span>
                </div>
                <h2 className="h-lg" style={{ marginBottom: 8 }}>Your lighting plan</h2>
                {result.source === "demo" && (
                  <p className="mono-note">
                    DRAFTED FROM YOUR ROOM PROFILE — CONNECT A PHOTO CONSULT FOR A FULLY CUSTOM READ
                  </p>
                )}
              </div>

              <dl>
                <div className="analysis-line">
                  <dt>Space read</dt><dd>{result.spaceRead}</dd>
                </div>
                <div className="analysis-line">
                  <dt>Natural light</dt><dd>{result.naturalLight}</dd>
                </div>
                <div className="analysis-line">
                  <dt>Mood</dt><dd>{result.mood}</dd>
                </div>
                {result.layers.map((l) => (
                  <div className="analysis-line" key={l.layer}>
                    <dt>{l.layer}</dt><dd>{l.recommendation}</dd>
                  </div>
                ))}
                <div className="analysis-line">
                  <dt>Color temp</dt><dd>{result.cct}</dd>
                </div>
                <div className="analysis-line">
                  <dt>Controls</dt><dd>{result.controls}</dd>
                </div>
                <div className="analysis-line" style={{ borderBottom: 0 }}>
                  <dt>Next step</dt><dd>{result.nextStep}</dd>
                </div>
              </dl>

              {recommendedSlugs.length > 0 && (
                <div>
                  <h3 className="h-md" style={{ marginBottom: 20 }}>Pieces in this plan</h3>
                  <div className="grid-3">
                    {recommendedSlugs.map((slug) => {
                      const p = getProduct(slug);
                      return p ? <ProductCard key={slug} product={p} /> : null;
                    })}
                  </div>
                </div>
              )}

              <div className="card" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <h3 style={{ fontSize: 19, marginBottom: 4 }}>Make it real</h3>
                  <p style={{ color: "var(--text-dim)", fontSize: 14.5 }}>
                    Book a free consultation and a designer walks this plan with
                    you — sizing, budget, and installation.
                  </p>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href="/contact?interest=ai-plan" className="btn btn-primary">
                    Book the consultation
                  </Link>
                  <button className="btn btn-ghost" onClick={() => { setPhase("input"); setResult(null); }}>
                    Analyze another space
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* how it works */}
      <section className="section" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <Reveal><span className="eyebrow">How it works</span></Reveal>
            <Reveal delay={80}><h2 className="h-lg">Behind the studio</h2></Reveal>
          </div>
          <div className="grid-3">
            <Reveal>
              <div className="card">
                <span className="mono-note">01 · VISION</span>
                <h3 style={{ margin: "12px 0 8px" }}>The photo is read, not stored</h3>
                <p>
                  AI vision identifies ceiling height, windows, existing
                  fixtures, finishes, and furniture layout. Your photo is used
                  to generate the plan — nothing more.
                </p>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="card">
                <span className="mono-note">02 · DESIGN RULES</span>
                <h3 style={{ margin: "12px 0 8px" }}>Trained on our design language</h3>
                <p>
                  Recommendations follow the same three-layer method our
                  designers use — ambient, task, accent — with warm-dim color
                  science and glare control baked in.
                </p>
              </div>
            </Reveal>
            <Reveal delay={160}>
              <div className="card">
                <span className="mono-note">03 · HUMAN REVIEW</span>
                <h3 style={{ margin: "12px 0 8px" }}>A designer signs every plan</h3>
                <p>
                  Before anything is quoted or ordered, a Lumenwright designer
                  reviews the AI draft against your photo and adjusts sizing,
                  budget, and code requirements.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
