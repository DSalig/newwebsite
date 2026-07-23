"use client";

// The Routine Builder: five questions → a sequenced AM/PM routine
// from the catalog, with layering warnings. Recommendations are
// deterministic rules (auditable, no hallucinated claims); sessions
// are logged to Supabase for CRM follow-up when an email is left.

import Link from "next/link";
import { useMemo, useState } from "react";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getProduct, type Product } from "@/lib/products";
import { submitQuizSession } from "@/lib/supabase";
import { useCart } from "@/lib/cart";

interface Question {
  id: string;
  prompt: string;
  options: { value: string; label: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: "goal",
    prompt: "What's the #1 thing you want to change?",
    options: [
      { value: "lines", label: "Fine lines & firmness" },
      { value: "tired", label: "Tired-looking eyes" },
      { value: "dry", label: "Dryness & rough texture" },
      { value: "hair", label: "Hair that looks thinner" },
      { value: "overall", label: "Overall skin quality" },
    ],
  },
  {
    id: "skin",
    prompt: "How does your skin behave by mid-day?",
    options: [
      { value: "oily", label: "Shiny / oily" },
      { value: "dry", label: "Tight / dry" },
      { value: "combo", label: "Both, depending on zone" },
      { value: "sensitive", label: "Easily irritated" },
    ],
  },
  {
    id: "experience",
    prompt: "How deep is your current routine?",
    options: [
      { value: "minimal", label: "Cleanser and vibes" },
      { value: "basic", label: "Cleanser + moisturizer + SPF" },
      { value: "full", label: "Actives, essences, the works" },
    ],
  },
  {
    id: "acids",
    prompt: "Do you regularly use strong exfoliating acids or retinoids?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "No" },
      { value: "sometimes", label: "Sometimes" },
    ],
  },
  {
    id: "ingestible",
    prompt: "Open to a daily collagen supplement?",
    options: [
      { value: "yes", label: "Yes" },
      { value: "no", label: "Topicals only" },
    ],
  },
];

interface Routine {
  am: Product[];
  pm: Product[];
  daily: Product[];
  warnings: string[];
}

function buildRoutine(a: Record<string, string>): Routine {
  const p = (slug: string) => getProduct(slug)!;
  const am: Product[] = [];
  const pm: Product[] = [];
  const daily: Product[] = [];
  const warnings: string[] = [];

  // Hero serum by goal
  if (a.goal === "lines") {
    if (a.skin === "sensitive" || a.experience === "minimal") {
      am.push(p("smooth-signal-serum"));
      pm.push(p("smooth-signal-serum"));
    } else {
      am.push(p("smooth-signal-serum"));
      pm.push(p("copper-renewal-serum"));
    }
  } else if (a.goal === "tired") {
    am.push(p("eye-revival-cream"));
    pm.push(p("eye-revival-cream"), p("daily-peptide-complex"));
  } else if (a.goal === "dry") {
    am.push(p("daily-peptide-complex"));
    pm.push(p("daily-peptide-complex"));
  } else if (a.goal === "hair") {
    daily.push(p("hair-density-serum"));
    am.push(p("daily-peptide-complex"));
  } else {
    am.push(p("daily-peptide-complex"));
    pm.push(p("daily-peptide-complex"));
  }

  // Moisturizer by skin type
  const moisturizer = a.skin === "oily" || a.skin === "combo"
    ? p("peptide-gel-moisturizer")
    : p("peptide-barrier-cream");
  am.push(moisturizer);
  pm.push(a.skin === "dry" || a.skin === "sensitive" ? p("peptide-barrier-cream") : moisturizer);

  // Collagen if open to it
  if (a.ingestible === "yes") daily.push(p("collagen-peptides-powder"));

  // Warnings
  if (a.acids !== "no" && pm.some((x) => x.slug === "copper-renewal-serum")) {
    warnings.push(
      "Keep strong direct acids (glycolic, lactic below pH 3.5) on alternate nights from the Copper Renewal Serum."
    );
  }
  warnings.push("Every morning routine assumes you finish with SPF 30+. Peptides don't replace sunscreen.");
  if (a.skin === "sensitive") {
    warnings.push("Introduce one new product per week so you can attribute any reaction.");
  }

  const dedupe = (list: Product[]) => list.filter((x, i) => list.findIndex((y) => y.slug === x.slug) === i);
  return { am: dedupe(am), pm: dedupe(pm), daily: dedupe(daily), warnings };
}

export default function QuizClient() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [emailState, setEmailState] = useState<"idle" | "busy" | "done">("idle");
  const { add } = useCart();
  const [addedAll, setAddedAll] = useState(false);

  const done = step >= QUESTIONS.length;
  const routine = useMemo(() => (done ? buildRoutine(answers) : null), [done, answers]);
  const uniqueProducts = useMemo(() => {
    if (!routine) return [];
    const all = [...routine.am, ...routine.pm, ...routine.daily];
    return all.filter((x, i) => all.findIndex((y) => y.slug === x.slug) === i);
  }, [routine]);

  function answer(q: Question, value: string) {
    const next = { ...answers, [q.id]: value };
    setAnswers(next);
    const nextStep = step + 1;
    setStep(nextStep);
    if (nextStep >= QUESTIONS.length) {
      // fire-and-forget session log (anonymous at this point)
      const r = buildRoutine(next);
      const slugs = [...r.am, ...r.pm, ...r.daily].map((x) => x.slug);
      submitQuizSession({ answers: next, routine_slugs: slugs });
    }
  }

  async function saveEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!routine) return;
    setEmailState("busy");
    await submitQuizSession({
      answers,
      routine_slugs: uniqueProducts.map((x) => x.slug),
      email,
    });
    setEmailState("done");
  }

  if (!done) {
    const q = QUESTIONS[step];
    return (
      <section className="section">
        <div className="wrap" style={{ maxWidth: "44rem" }}>
          <p className="eyebrow">Routine Builder · {step + 1} of {QUESTIONS.length}</p>
          <div className="progress-track" style={{ margin: "0.6rem 0 2rem" }}>
            <div className="progress-fill" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
          </div>
          <h1 className="display" style={{ fontSize: "clamp(1.7rem, 4vw, 2.6rem)" }}>{q.prompt}</h1>
          <div style={{ display: "grid", gap: "0.8rem", marginTop: "2rem" }}>
            {q.options.map((o) => (
              <button key={o.value} className="card" style={{ textAlign: "left", fontSize: "1.05rem", cursor: "pointer" }} onClick={() => answer(q, o.value)}>
                {o.label}
              </button>
            ))}
          </div>
          {step > 0 && (
            <button className="small muted" style={{ background: "none", border: 0, marginTop: "1.5rem", textDecoration: "underline" }} onClick={() => setStep(step - 1)}>
              ← Back
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="wrap">
        <Reveal>
          <p className="eyebrow">Your routine</p>
          <h1 className="display">Built for your skin, sequenced to layer.</h1>
        </Reveal>

        <div className="grid cols-3" style={{ marginTop: "2.5rem" }}>
          {(
            [
              ["Morning", routine!.am, "Finish with SPF 30+"],
              ["Evening", routine!.pm, "Apply thinnest to thickest"],
              ["Daily", routine!.daily, "Consistency beats intensity"],
            ] as const
          ).map(([title, list, note], col) =>
            list.length === 0 ? null : (
              <Reveal key={title} delay={col * 80} className="card">
                <h3 className="display">{title}</h3>
                <p className="small muted" style={{ marginBottom: "1rem" }}>{note}</p>
                <ol style={{ marginLeft: "1.2rem", display: "grid", gap: "0.6rem" }}>
                  {list.map((x) => (
                    <li key={x.slug}>
                      <Link href={`/products/${x.slug}`} style={{ textDecoration: "underline" }}>
                        {x.shortName}
                      </Link>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )
          )}
        </div>

        <Reveal className="notice" style={{ margin: "1.5rem 0" }}>
          {routine!.warnings.map((w) => <p key={w} style={{ margin: "0.25rem 0" }}>⚠ {w}</p>)}
        </Reveal>

        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", margin: "1.5rem 0 3rem" }}>
          <button
            className="btn btn-copper"
            onClick={() => {
              uniqueProducts.forEach((x) => add(x.slug, 1, false));
              setAddedAll(true);
            }}
          >
            {addedAll ? "Added to cart ✓" : "Add full routine to cart"}
          </button>
          <button className="btn btn-ghost" onClick={() => { setStep(0); setAnswers({}); setAddedAll(false); }}>
            Start over
          </button>
        </div>

        <div className="grid cols-3">
          {uniqueProducts.map((x, i) => (
            <Reveal key={x.slug} delay={i * 60}><ProductCard product={x} /></Reveal>
          ))}
        </div>

        <Reveal className="card" style={{ marginTop: "3rem", maxWidth: "34rem" }}>
          {emailState === "done" ? (
            <p style={{ fontWeight: 600 }}>Routine saved — check your inbox. ✓</p>
          ) : (
            <>
              <h3 className="display">Email me this routine</h3>
              <form onSubmit={saveEmail} style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem", flexWrap: "wrap" }}>
                <input type="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{ flex: "1 1 12rem" }} aria-label="Email address" />
                <button className="btn btn-primary" disabled={emailState === "busy"}>
                  {emailState === "busy" ? "…" : "Save it"}
                </button>
              </form>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
