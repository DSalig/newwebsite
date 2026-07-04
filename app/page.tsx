import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS } from "@/lib/products";

const FEATURED_SLUGS = [
  "aurora-cascade-36",
  "1908-beaux-arts-basket",
  "vela-linea-channel",
  "ember-globe-pendant",
];

export default function HomePage() {
  const featured = PRODUCTS.filter((p) => FEATURED_SLUGS.includes(p.slug));

  return (
    <>
      {/* ── HERO ── */}
      <section className="hero">
        <div
          className="glow-orb breathe"
          style={{ width: 560, height: 560, background: "rgba(255,180,84,0.14)", top: -180, right: "-8%" }}
          aria-hidden="true"
        />
        <div
          className="glow-orb"
          style={{ width: 380, height: 380, background: "rgba(226,98,43,0.08)", bottom: -160, left: "-6%" }}
          aria-hidden="true"
        />
        <div className="container" style={{ position: "relative" }}>
          <Reveal>
            <span className="eyebrow">The Light Atelier · Est. on four decades of craft</span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="h-hero" style={{ marginTop: 22, maxWidth: "14ch" }}>
              Light, made to
              <br />
              <span className="italic-accent">measure.</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="lede" style={{ marginTop: 26 }}>
              Lumenwright designs one-of-a-kind lighting installations, rescues
              and rewires rare vintage fixtures, and converts entire buildings
              to modern LED — turnkey, from photo to finished light. Snap a
              picture of your space and our AI studio drafts a personalized
              lighting plan in minutes.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <div className="hero-actions">
              <Link href="/studio" className="btn btn-primary btn-lg">
                ✦ Get AI lighting recommendations
              </Link>
              <Link href="/products" className="btn btn-ghost btn-lg">
                Browse the collection
              </Link>
            </div>
          </Reveal>
          <Reveal delay={400}>
            <div className="hero-badges">
              <span className="chip-quiet chip">Residential</span>
              <span className="chip-quiet chip">Hospitality</span>
              <span className="chip-quiet chip">Commercial</span>
              <span className="chip">5-year service on every project</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section-tight">
        <div className="container">
          <Reveal>
            <div className="stat-row">
              <div className="stat">
                <b>40+</b>
                <span>years of combined industry craft</span>
              </div>
              <div className="stat">
                <b>1,200+</b>
                <span>fixtures restored, retrofitted or built</span>
              </div>
              <div className="stat">
                <b>62%</b>
                <span>average energy reduction after LED conversion</span>
              </div>
              <div className="stat">
                <b>5 yrs</b>
                <span>of included service on every turnkey project</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SERVICES BENTO ── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <Reveal>
              <span className="eyebrow">What we do</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="h-xl">
                One studio, <span className="italic-accent">every era</span> of light
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lede">
                From an 1890 gas lantern to a tunable façade system — design,
                fabrication, restoration, and conversion under one roof.
              </p>
            </Reveal>
          </div>

          <div className="grid-2">
            <Reveal>
              <Link href="/services" className="card card-lit" style={{ display: "block", minHeight: 260 }}>
                <span className="chip" style={{ marginBottom: 18 }}>Signature</span>
                <h3 className="h-md">Custom lighting installations</h3>
                <p>
                  Statement chandeliers, sculptural pendants, and architectural
                  systems designed around your space — modeled in 3D, built in
                  our shop, installed and commissioned by our crew.
                </p>
                <p className="mono-note" style={{ marginTop: 18 }}>DESIGN → FABRICATE → INSTALL →</p>
              </Link>
            </Reveal>
            <Reveal delay={100}>
              <Link href="/services#restoration" className="card card-lit" style={{ display: "block", minHeight: 260 }}>
                <span className="chip" style={{ marginBottom: 18 }}>Rare craft</span>
                <h3 className="h-md">Vintage rehabilitation &amp; chandelier repair</h3>
                <p>
                  Rare and antique fixtures rescued, documented, rewired to
                  modern code, and relamped with warm-dim LED that honors the
                  original flame.
                </p>
                <p className="mono-note" style={{ marginTop: 18 }}>ASSESS → RESTORE → RELIGHT →</p>
              </Link>
            </Reveal>
            <Reveal delay={150}>
              <Link href="/retrofit" className="card card-lit" style={{ display: "block", minHeight: 260 }}>
                <span className="chip" style={{ marginBottom: 18 }}>Turnkey program</span>
                <h3 className="h-md">Complete LED conversion</h3>
                <p>
                  We don&apos;t sell lightbulbs. Old-lamp disposal, new
                  installation, financial analysis, utility rebate filing, and
                  five years of service — the whole conversion, handled.
                </p>
                <p className="mono-note" style={{ marginTop: 18 }}>AUDIT → CONVERT → SERVICE ×5YRS →</p>
              </Link>
            </Reveal>
            <Reveal delay={200}>
              <Link href="/studio" className="card card-lit" style={{ display: "block", minHeight: 260 }}>
                <span className="chip" style={{ marginBottom: 18 }}>AI-powered</span>
                <h3 className="h-md">Photo-to-plan lighting studio</h3>
                <p>
                  Photograph any room and our AI reads the architecture, light
                  levels, and mood — then recommends layered lighting from our
                  collection, sized to your space.
                </p>
                <p className="mono-note" style={{ marginTop: 18 }}>SNAP → ANALYZE → RECOMMEND →</p>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── AI CALLOUT ── */}
      <section className="section" style={{ background: "var(--bg-2)", borderBlock: "1px solid var(--line)" }}>
        <div className="container grid-2" style={{ alignItems: "center", gap: 56 }}>
          <Reveal>
            <div>
              <span className="eyebrow">2026-ready · AI-native design</span>
              <h2 className="h-xl" style={{ margin: "18px 0" }}>
                Your room, <span className="italic-accent">read by light.</span>
              </h2>
              <p className="lede" style={{ marginBottom: 26 }}>
                Upload one photo. The studio identifies your room type, ceiling
                condition, natural light, and existing fixtures — then drafts a
                three-layer lighting plan (ambient, task, accent) with specific
                pieces from our collection, target lumens, and color
                temperature. A designer reviews every AI plan before your
                consultation.
              </p>
              <ul className="kicker-list" style={{ marginBottom: 30 }}>
                <li>Personalized recommendations in under a minute</li>
                <li>Warm-dim and control strategy matched to how you live</li>
                <li>Every plan human-reviewed by a lighting designer</li>
              </ul>
              <Link href="/studio" className="btn btn-primary btn-lg">
                Try the AI studio
              </Link>
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="card" style={{ padding: 34 }}>
              <p className="mono-note" style={{ marginBottom: 18 }}>SAMPLE ANALYSIS · LIVING ROOM, 14&apos; CEILING</p>
              <dl>
                <div className="analysis-line">
                  <dt>Space read</dt>
                  <dd>Double-height living room, north-facing glazing, dark evenings</dd>
                </div>
                <div className="analysis-line">
                  <dt>Ambient</dt>
                  <dd>Aurora Cascade 36 at stair void — 2200–3000K warm-dim</dd>
                </div>
                <div className="analysis-line">
                  <dt>Task</dt>
                  <dd>Vela Punto minis over reading zone, 2× Gallery picture lights</dd>
                </div>
                <div className="analysis-line">
                  <dt>Accent</dt>
                  <dd>Vela Arco cove wash to lift the ceiling plane at night</dd>
                </div>
                <div className="analysis-line" style={{ borderBottom: 0 }}>
                  <dt>Scenes</dt>
                  <dd>Evening / Entertain / Away — one keypad, astronomical clock</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="section">
        <div className="container">
          <div className="section-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 20, maxWidth: "none" }}>
            <div>
              <Reveal>
                <span className="eyebrow">The collection</span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="h-xl" style={{ marginTop: 14 }}>Made to order, never warehoused</h2>
              </Reveal>
            </div>
            <Reveal delay={140}>
              <Link href="/products" className="btn btn-ghost">
                View all {PRODUCTS.length} pieces →
              </Link>
            </Reveal>
          </div>
          <div className="grid-4">
            {featured.map((p, i) => (
              <Reveal key={p.slug} delay={i * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <p className="mono-note" style={{ marginTop: 26, textAlign: "center" }}>
              EVERY PIECE MANUFACTURER-FULFILLED ON ORDER · CUSTOM OPTIONS ON EVERY SKU
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── RETROFIT STRIP ── */}
      <section className="section" style={{ background: "var(--bg-2)", borderBlock: "1px solid var(--line)" }}>
        <div className="container">
          <div className="grid-2" style={{ alignItems: "center", gap: 56 }}>
            <Reveal>
              <div>
                <span className="eyebrow">Turnkey LED retrofit</span>
                <h2 className="h-xl" style={{ margin: "18px 0" }}>
                  We don&apos;t sell lightbulbs.
                </h2>
                <p className="lede">
                  We provide consistency, support, and safety for your
                  business. Our complete conversion program takes incandescent
                  and fluorescent infrastructure to efficient LED — and takes
                  the worry off your hands entirely.
                </p>
                <div className="hero-actions">
                  <Link href="/retrofit" className="btn btn-primary">
                    See the program &amp; ROI calculator
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <ul className="kicker-list card" style={{ padding: 30 }}>
                <li>Site audit, photometric plan &amp; financial analysis</li>
                <li>Old lamp &amp; ballast disposal — fully documented</li>
                <li>New LED installation by licensed crews</li>
                <li>Utility rebate identification and filing, done for you</li>
                <li>Five years of included service and warranty support</li>
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── QUOTE / TRUST ── */}
      <section className="section">
        <div className="container grid-2" style={{ alignItems: "center", gap: 56 }}>
          <Reveal>
            <p className="big-quote">
              “They lit our lobby with a chandelier from 1908 and cut our
              energy bill by half in the same project. Nobody else does both.”
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <p style={{ color: "var(--text-dim)", marginBottom: 22 }}>
                Long-standing relationships with architects, designers,
                developers, contractors, and end users — built on technical
                expertise, design excellence, and showing up for year five the
                way we showed up on day one.
              </p>
              <Link href="/trade" className="btn btn-ghost">
                Partner with the atelier →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="section" style={{ textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div
          className="glow-orb breathe"
          style={{ width: 620, height: 320, background: "rgba(255,180,84,0.12)", top: "40%", left: "50%", transform: "translate(-50%,-50%)" }}
          aria-hidden="true"
        />
        <div className="container" style={{ position: "relative" }}>
          <Reveal>
            <h2 className="h-xl" style={{ maxWidth: "18ch", margin: "0 auto" }}>
              Ready to see your space <span className="italic-accent">in a new light?</span>
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <div className="hero-actions" style={{ justifyContent: "center" }}>
              <Link href="/studio" className="btn btn-primary btn-lg">
                Start with a photo
              </Link>
              <Link href="/contact" className="btn btn-ghost btn-lg">
                Book a consultation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
