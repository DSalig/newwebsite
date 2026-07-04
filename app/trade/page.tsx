import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Trade & Partners — Architects, Designers, Developers, Contractors",
  description:
    "Specification support, trade pricing, and project logistics for architects, interior designers, developers, and electrical contractors.",
};

const PARTNERS = [
  {
    who: "Architects & lighting designers",
    what: "Spec-grade cut sheets, IES files, photometric support, and a proprietary LED line (Vela Series) engineered for details that off-the-shelf product can't hold.",
    cta: "Request spec binder",
  },
  {
    who: "Interior designers",
    what: "Trade pricing on the full collection, custom finishes to your schemes, and a restoration bench for the estate pieces your clients inherit.",
    cta: "Open a trade account",
  },
  {
    who: "Developers & GCs",
    what: "Package pricing, staged delivery to site, licensed installation crews, and one accountable partner from spec through punch list.",
    cta: "Discuss your pipeline",
  },
  {
    who: "Electrical contractors",
    what: "Retrofit kits with volume pricing, commissioning support, and rebate paperwork handled — you install, we back you for five years.",
    cta: "Get contractor pricing",
  },
];

export default function TradePage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div
          className="glow-orb breathe"
          style={{ width: 460, height: 460, background: "rgba(111,174,155,0.08)", top: -180, right: "0%" }}
          aria-hidden="true"
        />
        <div className="container" style={{ position: "relative" }}>
          <Reveal><span className="eyebrow">Trade &amp; partners</span></Reveal>
          <Reveal delay={80}>
            <h1 className="h-xl" style={{ marginTop: 18, maxWidth: "16ch" }}>
              The partner behind the <span className="italic-accent">spec.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ marginTop: 22 }}>
              Long-standing relationships with architects, designers,
              developers, and contractors are the foundation of this business.
              Here&apos;s what working with the atelier looks like from your
              side of the drawings.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-tight">
        <div className="container grid-2">
          {PARTNERS.map((p, i) => (
            <Reveal key={p.who} delay={i * 70}>
              <div className="card card-lit" style={{ minHeight: 230, display: "flex", flexDirection: "column" }}>
                <h3 className="h-md" style={{ marginBottom: 10 }}>{p.who}</h3>
                <p style={{ flex: 1 }}>{p.what}</p>
                <div style={{ marginTop: 20 }}>
                  <Link href={`/contact?interest=trade`} className="btn btn-ghost">
                    {p.cta} →
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)", textAlign: "center" }}>
        <div className="container">
          <Reveal>
            <p className="big-quote" style={{ margin: "0 auto 26px" }}>
              “Spec it once. We handle procurement, delivery, install, and the
              call five years later.”
            </p>
          </Reveal>
          <Reveal delay={100}>
            <Link href="/contact?interest=trade" className="btn btn-primary btn-lg">
              Start a trade relationship
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
