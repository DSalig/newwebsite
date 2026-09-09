import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "The Science of Peptides",
  description:
    "What peptides are, which ones have real cosmetic evidence, and how we grade it — including what we won't claim.",
};

const glossary = [
  {
    name: "GHK-Cu (Copper Tripeptide-1)",
    grade: "Strong cosmetic evidence",
    body: "A naturally occurring tripeptide-copper complex studied since the 1970s. Multiple published split-face and biopsy studies report improvements in the appearance of skin firmness, density, and fine lines over 8–12 weeks of topical use, typically at 1–2%.",
    inProducts: ["copper-renewal-serum", "daily-peptide-complex"],
  },
  {
    name: "Matrixyl 3000 (Palmitoyl Tri/Tetrapeptides)",
    grade: "Moderate — vendor-run trials",
    body: "The most famous 'signal peptide' duo. Manufacturer-sponsored clinical studies at 3% report a softened look of wrinkles vs. placebo over 8 weeks. Independent replication is limited — worth knowing before you buy anyone's Matrixyl product, including ours.",
    inProducts: ["smooth-signal-serum"],
  },
  {
    name: "Argireline (Acetyl Hexapeptide-8)",
    grade: "Moderate — small trials",
    body: "Marketed as 'topical Botox,' which overstates it. Small published trials at 5–10% show a modest reduction in the look of expression lines. It will not stop muscle movement; nothing topical does.",
    inProducts: ["smooth-signal-serum"],
  },
  {
    name: "Eyeseryl (Acetyl Tetrapeptide-5)",
    grade: "Moderate — small trials",
    body: "Small placebo-controlled studies at 2% report reduced look of under-eye puffiness within 4–8 weeks. One of the few eye-area peptides with any published human data.",
    inProducts: ["eye-revival-cream"],
  },
  {
    name: "Capixyl & Redensyl",
    grade: "Early — cosmetic studies only",
    body: "Both complexes have vendor-run studies (3–4 months, daily use) reporting improved look of hair density vs. placebo. These are cosmetic results on cosmetic endpoints. For medical hair loss, minoxidil and finasteride have drug-level evidence — see a dermatologist.",
    inProducts: ["hair-density-serum"],
  },
  {
    name: "Hydrolyzed Collagen Peptides (oral)",
    grade: "Strong for skin elasticity/hydration",
    body: "Multiple randomized, placebo-controlled trials of 2.5–10 g/day report measurable improvements in skin elasticity and hydration after 8–12 weeks. Effects are real but gradual, and stop when you stop.",
    inProducts: ["collagen-peptides-powder", "marine-collagen-sachets"],
  },
];

export default function SciencePage() {
  return (
    <>
      <section className="section">
        <div className="wrap" style={{ maxWidth: "50rem" }}>
          <Reveal>
            <p className="eyebrow">The Science</p>
            <h1 className="display">Peptides, graded honestly.</h1>
            <p className="lede" style={{ margin: "1.2rem 0" }}>
              Peptides are short chains of amino acids — fragments of the proteins (like
              collagen) your skin is built from. In cosmetics they act as <em>signals</em>:
              applied topically, certain sequences are associated with a firmer, smoother
              look. The research quality varies enormously by peptide, so we grade it.
            </p>
          </Reveal>
          <Reveal delay={80} className="notice">
            <strong>Our claim policy:</strong> we describe effects on the <em>appearance</em> of
            skin and hair, at the doses the studies used. We don&apos;t claim drug effects, we
            don&apos;t sell injectables or &quot;research-use-only&quot; compounds, and where the evidence
            is thin we say so — on the product page itself.
          </Reveal>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap" style={{ display: "grid", gap: "1.2rem", maxWidth: "50rem" }}>
          {glossary.map((g, i) => (
            <Reveal key={g.name} delay={(i % 3) * 60} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <h3 className="display">{g.name}</h3>
                <span className={`badge ${g.grade.startsWith("Strong") ? "green" : ""}`}>{g.grade}</span>
              </div>
              <p style={{ margin: "0.8rem 0", color: "var(--ink-soft)" }}>{g.body}</p>
              <p className="small">
                In:{" "}
                {g.inProducts.map((slug, j) => (
                  <span key={slug}>
                    {j > 0 && " · "}
                    <Link href={`/products/${slug}`} style={{ textDecoration: "underline" }}>
                      {slug.replaceAll("-", " ")}
                    </Link>
                  </span>
                ))}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: "50rem" }}>
          <Reveal className="card-dark">
            <h2 className="display" style={{ color: "#f0ede4" }}>A word on injectable &quot;research peptides.&quot;</h2>
            <p className="muted" style={{ margin: "1rem 0" }}>
              You&apos;ve seen them online: vials of BPC-157, semaglutide, and similar sold &quot;for
              research use only.&quot; Those are unapproved drugs when sold for human use — untested
              for purity or sterility at the seller level, and outside FDA oversight. We think
              the peptide category deserves better, which is why Pepthea is strictly cosmetic
              and dietary, with published lab reports. If a compound needs a syringe, it needs
              a doctor.
            </p>
            <Link href="/quality" className="btn btn-light">See how we test</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
