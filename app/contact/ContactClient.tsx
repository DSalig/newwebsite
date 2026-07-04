"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Reveal from "@/components/Reveal";
import { submitLead } from "@/lib/supabase";

const CONTACT_EMAIL = "hello@lumenwright.example";

const INTERESTS = [
  ["consultation", "Design consultation"],
  ["custom", "Custom fixture commission"],
  ["restoration", "Restoration / chandelier repair"],
  ["retrofit", "Turnkey LED retrofit (site audit)"],
  ["ai-plan", "Review my AI lighting plan"],
  ["trade", "Trade / partner account"],
  ["partnership", "Business partnership / investment"],
  ["other", "Something else"],
] as const;

export default function ContactClient() {
  const params = useSearchParams();
  const preset = params.get("interest") ?? "consultation";
  const product = params.get("product");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<string>(
    INTERESTS.some(([v]) => v === preset) ? preset : "consultation"
  );
  const [message, setMessage] = useState(
    product ? `I'm interested in: ${product}\n\n` : ""
  );
  const [state, setState] = useState<"idle" | "sending" | "done" | "fallback">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const ok = await submitLead({
      name,
      email,
      phone,
      interest,
      message,
      source: product ? `product:${product}` : "contact-page",
    });
    if (ok) {
      setState("done");
    } else {
      const body = `Interest: ${interest}\nPhone: ${phone}\n\n${message}\n\n— ${name} <${email}>`;
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        `Consultation request — ${interest}`
      )}&body=${encodeURIComponent(body)}`;
      setState("fallback");
    }
  }

  return (
    <>
      <section className="hero" style={{ paddingBottom: 36 }}>
        <div
          className="glow-orb breathe"
          style={{ width: 460, height: 460, background: "rgba(255,180,84,0.1)", top: -180, left: "50%" }}
          aria-hidden="true"
        />
        <div className="container" style={{ position: "relative" }}>
          <Reveal><span className="eyebrow">Contact</span></Reveal>
          <Reveal delay={80}>
            <h1 className="h-xl" style={{ marginTop: 18, maxWidth: "16ch" }}>
              Let&apos;s talk about <span className="italic-accent">your light.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ marginTop: 22 }}>
              Consultations are free and unhurried. Tell us what you&apos;re
              dreaming about — or what&apos;s broken, flickering, or costing
              too much to run.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-tight">
        <div className="container grid-2" style={{ gap: 56, alignItems: "start" }}>
          <Reveal>
            {state === "done" ? (
              <div className="notice">
                <strong>Thank you — we received your note.</strong> A designer
                will reach out within one business day. If your project is
                urgent, mention it and we&apos;ll prioritize scheduling.
              </div>
            ) : (
              <form onSubmit={submit} className="form-grid">
                <div className="field">
                  <label htmlFor="ct-name">Name</label>
                  <input id="ct-name" required value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="ct-email">Email</label>
                  <input id="ct-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="ct-phone">Phone (optional)</label>
                  <input id="ct-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="field">
                  <label htmlFor="ct-interest">I&apos;m here about</label>
                  <select id="ct-interest" value={interest} onChange={(e) => setInterest(e.target.value)}>
                    {INTERESTS.map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <div className="field field-full">
                  <label htmlFor="ct-msg">Tell us about the project</label>
                  <textarea
                    id="ct-msg"
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="The space, the problem, the dream — photos can come later."
                  />
                </div>
                <div className="field-full">
                  <button className="btn btn-primary btn-lg" disabled={state === "sending"}>
                    {state === "sending" ? "Sending…" : "Send it"}
                  </button>
                </div>
                {state === "fallback" && (
                  <p className="notice notice-warn field-full">
                    Our inbox service is momentarily offline — we opened your
                    email client with the message pre-filled instead.
                  </p>
                )}
              </form>
            )}
          </Reveal>

          <Reveal delay={120}>
            <div style={{ display: "grid", gap: 22 }}>
              <div className="card">
                <p className="mono-note" style={{ marginBottom: 10 }}>FASTEST PATH</p>
                <h3 style={{ fontSize: 19, marginBottom: 6 }}>Start with a photo</h3>
                <p style={{ fontSize: 14.5 }}>
                  The <a href="/studio" style={{ color: "var(--candela)" }}>AI studio</a>{" "}
                  drafts your lighting plan before we even talk — bring it to
                  the consultation and we start at step three.
                </p>
              </div>
              <div className="card">
                <p className="mono-note" style={{ marginBottom: 10 }}>RESTORATIONS</p>
                <h3 style={{ fontSize: 19, marginBottom: 6 }}>Shipping a fixture?</h3>
                <p style={{ fontSize: 14.5 }}>
                  Don&apos;t crate anything yet. Send photos first — we assess
                  from images, quote the work, then arrange insured white-glove
                  transport both directions.
                </p>
              </div>
              <div className="card">
                <p className="mono-note" style={{ marginBottom: 10 }}>COMMERCIAL RETROFITS</p>
                <h3 style={{ fontSize: 19, marginBottom: 6 }}>Free site audit</h3>
                <p style={{ fontSize: 14.5 }}>
                  20+ fixtures? The audit, photometric plan, and financial
                  analysis are free — and yours to keep regardless.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
