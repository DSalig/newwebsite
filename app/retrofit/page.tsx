import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import RoiCalculator from "@/components/RoiCalculator";
import ProductCard from "@/components/ProductCard";
import DesignerConcierge from "@/components/DesignerConcierge";
import { productsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Turnkey LED Retrofit Program — Disposal to Rebates to 5-Year Service",
  description:
    "Complete LED lighting conversion: old bulb disposal, new installation, financial analysis, utility rebate filing, and five years of included service.",
};

export default function RetrofitPage() {
  const kits = productsByCategory("retrofit-kits");

  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div
          className="glow-orb breathe"
          style={{ width: 500, height: 500, background: "rgba(111,174,155,0.09)", top: -180, right: "-6%" }}
          aria-hidden="true"
        />
        <div className="container" style={{ position: "relative" }}>
          <Reveal><span className="eyebrow">Turnkey LED conversion program</span></Reveal>
          <Reveal delay={80}>
            <h1 className="h-xl" style={{ marginTop: 18, maxWidth: "17ch" }}>
              We don&apos;t sell lightbulbs. We deliver{" "}
              <span className="italic-accent">finished conversions.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ marginTop: 22 }}>
              Our turnkey retrofit program provides everything you need to
              convert incandescent or fluorescent lighting into an
              energy-efficient LED system — consistency, support, and safety
              for your business, with the worry and hassle taken entirely off
              your hands.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="hero-actions">
              <Link href="/contact?interest=retrofit" className="btn btn-primary btn-lg">
                Request a free site audit
              </Link>
              <a href="#calculator" className="btn btn-ghost btn-lg">
                Run the ROI calculator ↓
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* what's included */}
      <section className="section-tight">
        <div className="container">
          <div className="section-head">
            <Reveal><span className="eyebrow">Everything included</span></Reveal>
            <Reveal delay={80}>
              <h2 className="h-lg">One contract. Six deliverables. Zero hassle.</h2>
            </Reveal>
          </div>
          <div className="grid-3">
            {[
              ["Site audit & photometric plan", "Fixture-by-fixture survey, light-level mapping, and a conversion plan that improves light quality — not just wattage."],
              ["Financial analysis", "Metered baseline, projected savings, cash-flow model, and financing options. You see the numbers before you sign."],
              ["Old bulb & ballast disposal", "Lamps, ballasts, and PCB-era components removed and recycled with full documentation and manifests."],
              ["New LED installation", "Licensed crews install DLC-listed equipment on your schedule — nights and weekends for zero downtime."],
              ["Rebate identification & filing", "We find every utility and state incentive you qualify for and file the paperwork on your behalf."],
              ["Five years of service", "Included service plan: warranty handling, replacements, dimming recalibration, and an annual light-level check."],
            ].map(([title, body], i) => (
              <Reveal key={title} delay={i * 60}>
                <div className="card card-lit" style={{ minHeight: 190 }}>
                  <span className="mono-note" style={{ display: "block", marginBottom: 12 }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 style={{ fontSize: 19 }}>{title}</h3>
                  <p style={{ marginTop: 8 }}>{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ROI calculator */}
      <section className="section" id="calculator" style={{ background: "var(--bg-2)", borderBlock: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <Reveal><span className="eyebrow">Do the math</span></Reveal>
            <Reveal delay={80}>
              <h2 className="h-lg">What would your conversion return?</h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lede">
                Drag the sliders to your building. Estimates use conservative
                industry equipment and labor figures — your proposal replaces
                them with metered numbers.
              </p>
            </Reveal>
          </div>
          <Reveal delay={180}>
            <RoiCalculator />
          </Reveal>
        </div>
      </section>

      {/* retrofit kits */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <Reveal><span className="eyebrow">Retrofit systems</span></Reveal>
            <Reveal delay={80}>
              <h2 className="h-lg">The hardware behind the program</h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="lede">
                Every kit is DLC-listed where applicable (rebate-eligible),
                flicker-free, and chosen because we service what we install
                for five years.
              </p>
            </Reveal>
          </div>
          <div className="grid-3">
            {kits.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* network routing for out-of-area / design-led projects */}
      <section className="section-tight" style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)" }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <Reveal>
            <DesignerConcierge
              context={{ kind: "retrofit" }}
              heading="Outside our service area — or want design-led scope?"
              sub="Our designer network covers projects we can't reach ourselves. Tell us where the building is and we'll hand-match you with a vetted local partner who runs the conversion with our program, products, and rebate support behind them."
            />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight" style={{ textAlign: "center" }}>
        <div className="container">
          <Reveal>
            <h2 className="h-lg" style={{ maxWidth: "22ch", margin: "0 auto 24px" }}>
              Start with a free audit — keep the analysis either way.
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <Link href="/contact?interest=retrofit" className="btn btn-primary btn-lg">
              Book the site audit
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
