import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import ProductVisual from "@/components/ProductVisual";
import Newsletter from "@/components/Newsletter";
import { getProduct } from "@/lib/products";
import { getMergedProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

// ISR so console catalog edits reach the home page within a minute.
export const revalidate = 60;

const trustItems = [
  "Third-party tested, every batch",
  "Concentrations on the label",
  "Fragrance-free formulas",
  "Cosmetic & dietary peptides only",
  "COAs published per lot",
  "Made in cGMP facilities",
  "Free U.S. shipping over $50",
];

export default async function HomePage() {
  const merged = await getMergedProducts(true);
  const featured = merged.filter((x) => x.featured);
  const hero = merged.find((x) => x.slug === "copper-renewal-serum") ?? getProduct("copper-renewal-serum")!;

  return (
    <>
      {/* ---- hero ---- */}
      <section className="section">
        <div className="wrap grid cols-2" style={{ alignItems: "center", gap: "3rem" }}>
          <Reveal>
            <p className="eyebrow">Peptide skincare &amp; wellness</p>
            <h1 className="display">
              Peptides that say <em>exactly</em> what they are.
            </h1>
            <p className="lede" style={{ margin: "1.4rem 0 2rem" }}>
              Clinically-dosed topical peptides and collagen, with the concentration on the
              front of the label and the lab report one click away. No hype. No gray market.
            </p>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <Link href="/shop" className="btn btn-primary">Shop all</Link>
              <Link href="/quiz" className="btn btn-ghost">Build my routine →</Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Link href={`/products/${hero.slug}`} aria-label={hero.name}>
              <ProductVisual product={hero} />
            </Link>
            <p className="mono muted" style={{ marginTop: "0.7rem", textAlign: "center" }}>
              {hero.name} · lot {hero.batch.lot} · COA on file
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- trust marquee ---- */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...trustItems, ...trustItems].map((t, i) => (
            <span key={i}>{t} ·</span>
          ))}
        </div>
      </div>

      {/* ---- bento: why pepthea ---- */}
      <section className="section">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">The Pepthea standard</p>
            <h2 className="display">Radical transparency is the whole brand.</h2>
          </Reveal>
          <div className="bento" style={{ marginTop: "2.5rem" }}>
            <Reveal className="card span-3">
              <h3 className="display">Doses from the studies, not the marketing.</h3>
              <p className="muted" style={{ marginTop: "0.8rem" }}>
                If the published research used 2% GHK-Cu, we use 2% — and print it on the
                front. Every active&apos;s percentage is disclosed on every product page.
              </p>
            </Reveal>
            <Reveal className="card-dark span-3" delay={80}>
              <h3 className="display" style={{ color: "#f0ede4" }}>Every batch, lab-verified.</h3>
              <p className="muted" style={{ marginTop: "0.8rem" }}>
                Identity, purity, and heavy-metal screening on every production lot, with the
                certificate of analysis published under its lot number.
              </p>
              <Link href="/quality" className="btn btn-light" style={{ marginTop: "1.2rem" }}>
                Look up your batch
              </Link>
            </Reveal>
            <Reveal className="card" delay={40}>
              <span className="badge green">Honest claims</span>
              <p style={{ marginTop: "0.8rem" }}>
                Cosmetic and dietary peptides only — we tell you what the evidence supports,
                and what it doesn&apos;t.
              </p>
            </Reveal>
            <Reveal className="card" delay={80}>
              <span className="badge">Routine-first</span>
              <p style={{ marginTop: "0.8rem" }}>
                Products designed to layer. The AI Routine Builder sequences them for your
                skin in 60 seconds.
              </p>
            </Reveal>
            <Reveal className="card" delay={120}>
              <span className="badge blue">Subscribe &amp; save 15%</span>
              <p style={{ marginTop: "0.8rem" }}>
                Skincare works on consistency. Subscriptions ship on your schedule, pause
                anytime, no gotchas.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---- featured products ---- */}
      <section className="section" style={{ background: "var(--bg-soft)" }}>
        <div className="wrap">
          <Reveal>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <p className="eyebrow">Bestsellers</p>
                <h2 className="display">Start here.</h2>
              </div>
              <Link href="/shop" className="btn btn-ghost">View all products</Link>
            </div>
          </Reveal>
          <div className="grid cols-3" style={{ marginTop: "2rem" }}>
            {featured.slice(0, 6).map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
          <p className="small muted" style={{ marginTop: "1.2rem" }}>*{site.fdaDisclaimer}</p>
        </div>
      </section>

      {/* ---- routine builder callout ---- */}
      <section className="section">
        <div className="wrap">
          <Reveal className="card-dark" style={{ padding: "clamp(2rem, 5vw, 4rem)" }}>
            <div className="grid cols-2" style={{ alignItems: "center", gap: "2.5rem" }}>
              <div>
                <p className="eyebrow">AI Routine Builder</p>
                <h2 className="display" style={{ color: "#f0ede4" }}>
                  Answer five questions. Get a routine that <em>layers correctly</em>.
                </h2>
                <p className="muted" style={{ margin: "1rem 0 1.6rem" }}>
                  Peptides are forgiving, but sequencing still matters. The builder maps your
                  skin goals to a morning and evening routine — and tells you what <i>not</i> to
                  combine.
                </p>
                <Link href="/quiz" className="btn btn-copper">Build my routine</Link>
              </div>
              <div className="card" style={{ background: "rgba(255,253,249,0.06)", border: "1px solid rgba(255,255,255,0.14)" }}>
                <p className="mono" style={{ color: "#b9c4ba" }}>SAMPLE OUTPUT</p>
                <hr className="hr" style={{ borderColor: "rgba(255,255,255,0.14)" }} />
                <p style={{ color: "#e8ecdf" }}>AM — Daily Peptide Complex → Gel Moisturizer → SPF</p>
                <p style={{ color: "#e8ecdf", margin: "0.6rem 0" }}>PM — Copper Renewal Serum → Barrier Cream</p>
                <p style={{ color: "#e8ecdf" }}>Daily — Collagen Peptides, one scoop</p>
                <hr className="hr" style={{ borderColor: "rgba(255,255,255,0.14)" }} />
                <p className="small" style={{ color: "#97a698" }}>
                  ⚠ Skip strong direct acids the same night as copper peptides.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- honest launch + newsletter ---- */}
      <section className="section-tight">
        <div className="wrap grid cols-2" style={{ alignItems: "center", gap: "2.5rem" }}>
          <Reveal>
            <p className="eyebrow">A note on being new</p>
            <h2 className="display">No fake reviews. Ever.</h2>
            <p className="muted" style={{ marginTop: "1rem", maxWidth: "34rem" }}>
              We just launched, so you won&apos;t see 10,000 five-star reviews here — and you
              won&apos;t see purchased ones either. What you will see: our formulas, our doses,
              and our lab reports. Reviews will appear as real customers write them.
            </p>
          </Reveal>
          <Reveal delay={100} className="card">
            <h3 className="display">Get the launch letter</h3>
            <p className="muted" style={{ margin: "0.6rem 0 1rem" }}>
              Formulation notes, evidence round-ups, and early access to new batches.
            </p>
            <Newsletter />
          </Reveal>
        </div>
      </section>
    </>
  );
}
