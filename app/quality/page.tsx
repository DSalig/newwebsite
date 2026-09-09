import type { Metadata } from "next";
import { Suspense } from "react";
import Reveal from "@/components/Reveal";
import BatchLookup from "./BatchLookup";

export const metadata: Metadata = {
  title: "Testing & Certificates of Analysis",
  description:
    "Every Pepthea batch is third-party tested for identity, purity, and heavy metals. Look up your lot number and read the certificate.",
};

const steps = [
  { n: "01", t: "Raw material verification", d: "Every peptide raw material arrives with a supplier COA, which we re-verify by identity testing before it enters production." },
  { n: "02", t: "cGMP manufacturing", d: "Formulas are compounded in U.S. cGMP-registered facilities with full lot traceability from raw material to finished unit." },
  { n: "03", t: "Third-party finished-product testing", d: "An independent ISO 17025 lab tests each finished lot: microbial safety for all products, plus heavy metals (Pb, As, Cd, Hg) for every ingestible." },
  { n: "04", t: "Published, per lot", d: "The certificate of analysis is published under the lot number printed on your unit. If a lot's COA isn't up yet, it isn't shipping yet." },
];

export default function QualityPage() {
  return (
    <>
      <section className="section">
        <div className="wrap">
          <Reveal>
            <p className="eyebrow">Testing &amp; COAs</p>
            <h1 className="display">Find your batch. Read the lab report.</h1>
            <p className="lede" style={{ margin: "1.2rem 0 2rem" }}>
              The lot number is printed on the bottom or crimp of every unit. Enter it below to
              pull the certificate of analysis for exactly the product in your hand.
            </p>
          </Reveal>
          <Suspense>
            <BatchLookup />
          </Suspense>
        </div>
      </section>

      <section className="section-tight" style={{ background: "var(--bg-soft)" }}>
        <div className="wrap">
          <Reveal><h2 className="display">How a Pepthea product gets made</h2></Reveal>
          <div className="grid cols-4" style={{ marginTop: "2rem" }}>
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 70} className="card">
                <p className="stat-num">{s.n}</p>
                <h3 style={{ margin: "0.6rem 0 0.4rem" }}>{s.t}</h3>
                <p className="small muted">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
