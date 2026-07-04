import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "The Company — A New Atelier Built on an Old Craft",
  description:
    "Lighting design, product distribution, and a proprietary LED line under one vertically integrated operating model — a new venture serving residential, hospitality, and commercial clients.",
};

export default function AboutPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div
          className="glow-orb breathe"
          style={{ width: 520, height: 520, background: "rgba(201,151,77,0.1)", top: -200, left: "40%" }}
          aria-hidden="true"
        />
        <div className="container" style={{ position: "relative" }}>
          <Reveal><span className="eyebrow">The company</span></Reveal>
          <Reveal delay={80}>
            <h1 className="h-xl" style={{ marginTop: 18, maxWidth: "18ch" }}>
              A new atelier built on an <span className="italic-accent">old craft.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ marginTop: 22 }}>
              Lumenwright is a young company with a deliberate design: lighting
              design, product distribution, and a proprietary LED line combined
              under one vertically integrated operating model. From design and
              specification through procurement, delivery, and project
              implementation, one team is accountable for the light.
            </p>
          </Reveal>
        </div>
      </section>

      {/* pillars */}
      <section className="section-tight">
        <div className="container grid-3">
          {[
            ["Design & specification", "Lighting design for residential, hospitality, and commercial clients — from a single room to full-building photometric packages."],
            ["Distribution & procurement", "Vetted manufacturing partners and project logistics: we specify, procure, stage, and deliver so projects hit their dates."],
            ["Proprietary product — Vela Series", "Our own LED line, engineered with a third-party manufacturing partner around details off-the-shelf product couldn't hold."],
          ].map(([t, b], i) => (
            <Reveal key={t} delay={i * 80}>
              <div className="card card-lit" style={{ minHeight: 220 }}>
                <span className="mono-note">PILLAR {String(i + 1).padStart(2, "0")}</span>
                <h3 style={{ margin: "12px 0 8px", fontSize: 20 }}>{t}</h3>
                <p>{b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* story */}
      <section className="section" style={{ background: "var(--bg-2)", borderBlock: "1px solid var(--line)" }}>
        <div className="container grid-2" style={{ gap: 56 }}>
          <Reveal>
            <div>
              <span className="eyebrow">Why we exist</span>
              <h2 className="h-lg" style={{ margin: "16px 0" }}>
                The gap we&apos;re here to fill.
              </h2>
              <p style={{ color: "var(--text-dim)", marginBottom: 16 }}>
                Nobody serves this market whole: design studios don&apos;t
                touch wiring, electricians don&apos;t restore crystal, and
                retrofit outfits sell wattage instead of light. Lumenwright was
                founded to do all of it under one roof — custom design, vintage
                rehabilitation, rare chandelier repair, and turnkey LED
                conversion.
              </p>
              <p style={{ color: "var(--text-dim)" }}>
                We&apos;re earning our reputation the only way it can be
                earned: one documented restoration, one commissioned install,
                one five-year service promise at a time. Every dossier, every
                rebate filing, every dimming curve is built to make the second
                project inevitable.
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <span className="eyebrow">The Vela story</span>
              <h2 className="h-lg" style={{ margin: "16px 0" }}>
                We built the product our projects demanded.
              </h2>
              <p style={{ color: "var(--text-dim)", marginBottom: 16 }}>
                The Vela Series began when no channel on the market could give
                our installs a truly seamless, dot-free line of warm light at a
                price a real project could carry. So we engineered one with our
                manufacturing partner — then a downlight, a cove optic, a
                façade grazer, and a scene engine.
              </p>
              <p style={{ color: "var(--text-dim)" }}>
                Every Vela piece is proven on our own jobs before it&apos;s
                offered for specification, and the line will grow the same way:
                project first, product second, spec sheet last.
              </p>
              <div style={{ marginTop: 22 }}>
                <Link href="/products?cat=vela-series" className="btn btn-ghost">
                  Explore the Vela Series →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* growth / investor strip */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <Reveal><span className="eyebrow">The road ahead</span></Reveal>
            <Reveal delay={80}>
              <h2 className="h-lg" style={{ maxWidth: "24ch" }}>
                Low overhead. High potential. Multiple ways to grow.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lede">
                The business is deliberately built lean — made-to-order
                inventory, manufacturing partners, no warehouse — with four
                distinct avenues to scale as the atelier earns its market. This
                is where we&apos;re headed.
              </p>
            </Reveal>
          </div>
          <div className="grid-4">
            {[
              ["Vela third-party sales", "Grow the line beyond our own projects through spec-driven demand and distribution partnerships."],
              ["Turnkey retrofit scale", "Commercial conversions that each attach a five-year service relationship."],
              ["AI-led acquisition", "The photo-to-plan studio turns site visitors into design consultations around the clock."],
              ["Restoration niche", "Rare-chandelier and vintage work with almost no credible competition."],
            ].map(([t, b], i) => (
              <Reveal key={t} delay={i * 60}>
                <div className="card" style={{ minHeight: 180 }}>
                  <h3 style={{ fontSize: 17, marginBottom: 8 }}>{t}</h3>
                  <p style={{ fontSize: 14.5 }}>{b}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <div style={{ textAlign: "center", marginTop: 48 }}>
              <Link href="/contact?interest=partnership" className="btn btn-primary btn-lg">
                Talk to us about partnership
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
