import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Services — Custom Installations, Restoration & Chandelier Repair",
  description:
    "Custom-designed lighting installations, vintage lighting rehabilitation, rare chandelier repair, and modern-technology retrofits for older fixtures.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div
          className="glow-orb breathe"
          style={{ width: 460, height: 460, background: "rgba(255,180,84,0.1)", top: -160, right: "-4%" }}
          aria-hidden="true"
        />
        <div className="container" style={{ position: "relative" }}>
          <Reveal><span className="eyebrow">Services</span></Reveal>
          <Reveal delay={80}>
            <h1 className="h-xl" style={{ marginTop: 18, maxWidth: "16ch" }}>
              Every service a light can <span className="italic-accent">need.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ marginTop: 22 }}>
              Design, fabrication, restoration, repair, and modernization —
              vertically integrated so one team owns your project from first
              sketch to fifth-year service call.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Custom installations */}
      <section className="section" id="custom">
        <div className="container grid-2" style={{ gap: 56 }}>
          <Reveal>
            <div>
              <span className="eyebrow">01 · Signature work</span>
              <h2 className="h-lg" style={{ margin: "16px 0" }}>Custom-designed lighting installations</h2>
              <p style={{ color: "var(--text-dim)", marginBottom: 18 }}>
                One-of-a-kind pieces engineered for your architecture. We begin
                with your plans or a site visit (or a photo, via the{" "}
                <Link href="/studio" style={{ color: "var(--candela)" }}>AI studio</Link>),
                model the fixture in 3D within your actual room, and iterate
                with you before a single part is cut. Fabrication runs through
                our shop and vetted manufacturing partners; installation and
                dimming commissioning are done by our own crews.
              </p>
              <ul className="kicker-list">
                <li>Entry &amp; stairwell statement chandeliers</li>
                <li>Hospitality and restaurant feature lighting</li>
                <li>Architectural systems: coves, channels, façades</li>
                <li>Structural review, blocking, and permits handled</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="card" style={{ padding: 34, alignSelf: "start" }}>
              <p className="mono-note" style={{ marginBottom: 16 }}>TYPICAL ENGAGEMENT</p>
              <div className="process">
                <div className="process-step">
                  <span className="process-num">1</span>
                  <div><h3>Design consult</h3><p>Site visit or AI photo analysis; concept sketches and budget band.</p></div>
                </div>
                <div className="process-step">
                  <span className="process-num">2</span>
                  <div><h3>3D model &amp; quote</h3><p>The piece rendered in your space; fixed quote and lead time.</p></div>
                </div>
                <div className="process-step">
                  <span className="process-num">3</span>
                  <div><h3>Fabrication</h3><p>Built in-shop and by manufacturing partners; weekly photo updates.</p></div>
                </div>
                <div className="process-step">
                  <span className="process-num">4</span>
                  <div><h3>Install &amp; commission</h3><p>Licensed installation, dimming curves tuned on site, scene setup.</p></div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Restoration */}
      <section className="section" id="restoration" style={{ background: "var(--bg-2)", borderBlock: "1px solid var(--line)" }}>
        <div className="container grid-2" style={{ gap: 56 }}>
          <Reveal>
            <div>
              <span className="eyebrow">02 · Rare craft</span>
              <h2 className="h-lg" style={{ margin: "16px 0" }}>Vintage lighting rehabilitation</h2>
              <p style={{ color: "var(--text-dim)", marginBottom: 18 }}>
                Estate finds, family heirlooms, architectural salvage — we
                bring fixtures from the gas and early-electric eras safely back
                into service. Every piece is disassembled, documented,
                structurally restored, rewired to current code, and relamped
                with warm-dim LED calibrated to the color of its original
                flame. You receive a full restoration dossier with provenance
                notes.
              </p>
              <ul className="kicker-list">
                <li>Period-correct crystal, glass &amp; finish sourcing</li>
                <li>UL-standard rewiring with discreet LED conversion</li>
                <li>Conservation-grade work for museum pieces</li>
                <li>Insured white-glove crating both directions</li>
              </ul>
              <div style={{ marginTop: 26 }}>
                <Link href="/products/restoration-commission" className="btn btn-primary">
                  Commission a restoration
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div>
              <span className="eyebrow" id="chandelier">03 · Specialist bench</span>
              <h2 className="h-lg" style={{ margin: "16px 0" }}>Rare chandelier repair</h2>
              <p style={{ color: "var(--text-dim)", marginBottom: 18 }}>
                Bent frames, missing strands, failed sockets, crumbling
                insulation — our bench handles repairs most shops refuse.
                We re-pin and re-string crystal, re-silver and replate
                frames, blow replacement glass to match, and rebuild wiring
                without erasing a fixture&apos;s history.
              </p>
              <ul className="kicker-list">
                <li>Crystal re-stringing and replacement matching</li>
                <li>Frame straightening, re-silvering, replating</li>
                <li>Socket, arm &amp; canopy rebuilds to code</li>
                <li>On-site cleaning &amp; maintenance contracts</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Retrofit teaser */}
      <section className="section" id="retrofit">
        <div className="container">
          <Reveal>
            <div className="card card-lit" style={{ padding: "clamp(32px, 5vw, 60px)", textAlign: "center" }}>
              <span className="eyebrow" style={{ justifyContent: "center" }}>04 · Modernization</span>
              <h2 className="h-lg" style={{ margin: "16px auto", maxWidth: "22ch" }}>
                Retrofitting older devices with modern technology
              </h2>
              <p className="lede" style={{ margin: "0 auto 28px" }}>
                LED conversion, flicker-free dimming, wireless scene control,
                and circadian tuning — added to the fixtures and buildings you
                already own. For whole buildings, our turnkey program covers
                everything from disposal to rebates to five years of service.
              </p>
              <div className="hero-actions" style={{ justifyContent: "center" }}>
                <Link href="/retrofit" className="btn btn-primary btn-lg">
                  Explore the turnkey retrofit program
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
