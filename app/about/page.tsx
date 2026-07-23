import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why Pepthea exists: the peptide category is full of hype and gray-market risk. We built the transparent, tested alternative.",
};

export default function AboutPage() {
  return (
    <>
      <section className="section">
        <div className="wrap" style={{ maxWidth: "48rem" }}>
          <Reveal>
            <p className="eyebrow">About {site.name}</p>
            <h1 className="display">The peptide category has a trust problem. We&apos;re the fix.</h1>
            <div style={{ display: "grid", gap: "1.2rem", marginTop: "2rem", color: "var(--ink-soft)", fontSize: "1.05rem" }}>
              <p>
                Search &quot;peptides&quot; and you&apos;ll find two worlds. One is glossy skincare that
                won&apos;t tell you the concentration of the ingredient on the front of the box.
                The other is gray-market vials &quot;for research use only&quot; with no oversight at
                all. Neither respects you.
              </p>
              <p>
                Pepthea is the third option: cosmetic and dietary peptides with the dose on
                the label, formulas built to the published studies, and a third-party lab
                report for every batch — findable by the lot number on your unit.
              </p>
              <p>
                We launched in 2026 as a small, honest operation. No fabricated reviews, no
                miracle claims, no &quot;proprietary complexes&quot; hiding a 0.01% sprinkle. If that
                sounds like skincare made by people who read the studies — it is.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-tight" style={{ background: "var(--bg-soft)" }}>
        <div className="wrap grid cols-3">
          {[
            ["Doses from the literature", "If the study used 2%, we use 2% — or we don't make the product."],
            ["Tested, then published", "Identity, microbial, and heavy-metal screens per lot, COAs public."],
            ["Claims we can defend", "Appearance claims for cosmetics, authorized claims for supplements. Nothing else."],
          ].map(([t, d], i) => (
            <Reveal key={t} delay={i * 70} className="card">
              <h3 className="display">{t}</h3>
              <p className="muted" style={{ marginTop: "0.6rem" }}>{d}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ textAlign: "center" }}>
          <Reveal>
            <h2 className="display">See it in the products.</h2>
            <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", marginTop: "1.5rem", flexWrap: "wrap" }}>
              <Link href="/shop" className="btn btn-primary">Shop the line</Link>
              <Link href="/quality" className="btn btn-ghost">Read a lab report</Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
