"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import { submitLead } from "@/lib/supabase";

const topics = ["Product question", "Order support", "Batch / COA question", "Wholesale", "Press", "Something else"];

export default function ContactClient() {
  const [form, setForm] = useState({ name: "", email: "", topic: topics[0], message: "" });
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    const ok = await submitLead({ ...form, source: "contact-page" });
    if (!ok) {
      const body = encodeURIComponent(`${form.message}\n\n— ${form.name} <${form.email}>`);
      window.location.href = `mailto:${site.email.support}?subject=${encodeURIComponent(form.topic)}&body=${body}`;
    }
    setState("done");
  }

  return (
    <section className="section">
      <div className="wrap grid cols-2" style={{ gap: "3rem", alignItems: "start" }}>
        <Reveal>
          <p className="eyebrow">Contact</p>
          <h1 className="display">Talk to a human.</h1>
          <p className="lede" style={{ margin: "1rem 0 2rem" }}>
            Product questions, order help, or a COA you want walked through — we reply within
            one business day.
          </p>
          <div style={{ display: "grid", gap: "0.5rem" }}>
            <p><span className="mono muted">GENERAL</span> — <a href={`mailto:${site.email.hello}`} style={{ textDecoration: "underline" }}>{site.email.hello}</a></p>
            <p><span className="mono muted">SUPPORT</span> — <a href={`mailto:${site.email.support}`} style={{ textDecoration: "underline" }}>{site.email.support}</a></p>
            <p><span className="mono muted">WHOLESALE</span> — <a href={`mailto:${site.email.wholesale}`} style={{ textDecoration: "underline" }}>{site.email.wholesale}</a></p>
          </div>
        </Reveal>

        <Reveal delay={80} className="card">
          {state === "done" ? (
            <>
              <h3 className="display">Message received. ✓</h3>
              <p className="muted" style={{ marginTop: "0.6rem" }}>We&apos;ll get back to you within one business day.</p>
            </>
          ) : (
            <form onSubmit={submit}>
              <div className="field">
                <label htmlFor="c-name">Name</label>
                <input id="c-name" type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="c-email">Email</label>
                <input id="c-email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field">
                <label htmlFor="c-topic">Topic</label>
                <select id="c-topic" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                  {topics.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="c-msg">Message</label>
                <textarea id="c-msg" rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
              </div>
              <button className="btn btn-primary btn-block" disabled={state === "busy"}>
                {state === "busy" ? "Sending…" : "Send"}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
