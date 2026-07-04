import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "The Company — A Vertically Integrated Architectural Lighting Platform",
  description:
    "Four decades of lighting design, product distribution, and proprietary LED solutions through one vertically integrated operating model serving residential, hospitality, and commercial clients.",
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
              A vertically integrated <span className="italic-accent">platform for light.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ marginTop: 22 }}>
              Lumenwright is an established architectural lighting platform —
              a unique combination of lighting design, product distribution,
              and proprietary LED product solutions under one operating model.
              From design and specification through procurement, delivery, and
              project implementation, one team is accountable for the light.
            </p>
          </Reveal>
        </div>
      </section>

      {/* pillars */}
      <section className="section-tight">
        <div className="container grid-3">
          {[
            ["Design & specification", "In-house lighting designers serving residential, hospitality, and commercial clients — from a single room to full-building photometric packages."],
            ["Distribution & procurement", "Established manufacturer relationships and project logistics: we specify, procure, stage, and deliver so projects hit their dates."],
            ["Proprietary product — Vela Series", "Our own LED line, born from an unmet need inside our projects, validated across our portfolio, and manufactured by a trusted third-party partner."],
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
              <span className="eyebrow">Four decades in</span>
              <h2 className="h-lg" style={{ margin: "16px 0" }}>
                Reputation is the moat.
              </h2>
              <p style={{ color: "var(--text-dim)", marginBottom: 16 }}>
                More than forty years of combined industry experience have
                built a reputation for technical expertise, design excellence,
                and customer service — and with it, long-standing relationships
                with architects, designers, developers, contractors, and end
                users who bring us back project after project.
              </p>
              <p style={{ color: "var(--text-dim)" }}>
                That trust shows up as a diversified revenue base and an active
                pipeline of projects extending several years into the future,
                carried by an experienced team with deep industry knowledge.
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
                our own installs a truly seamless, dot-free line of warm light.
                So we engineered one — then a downlight, a cove optic, a façade
                grazer, and a scene engine. Every product was proven on our own
                jobs before we offered it for specification.
              </p>
              <p style={{ color: "var(--text-dim)" }}>
                Product sales have historically been driven by our internal
                projects; the opportunity ahead is third-party growth through
                specification-driven demand, distribution partnerships, and
                broader market penetration.
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
            <Reveal><span className="eyebrow">The opportunity</span></Reveal>
            <Reveal delay={80}>
              <h2 className="h-lg" style={{ maxWidth: "24ch" }}>
                Low overhead. High potential. Multiple ways to grow.
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lede">
                An integrated platform, established market position, recognized
                reputation, and several distinct growth avenues — a compelling
                position for an entrepreneur or designer with electrical
                aptitude, and for strategic or financial partners seeking entry
                into specialized architectural lighting.
              </p>
            </Reveal>
          </div>
          <div className="grid-4">
            {[
              ["Vela third-party sales", "Marketing, spec-driven demand, and distribution partnerships beyond our own projects."],
              ["Turnkey retrofit scale", "Recurring commercial conversions with five-year service relationships attached."],
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
