"use client";

// The human-service interjection block. Rendered at the moments
// a visitor has already decided fixture type and area — after an
// AI plan, mid product order, or on the retrofit page — and hands
// the project to a person: we match a vetted local designer by
// hand within one business day. Honest by design: no directory
// size claims, and every referral lands in Supabase (or the
// owner's inbox via mailto fallback) for manual matching.

import { useState } from "react";
import Link from "next/link";
import { submitDesignerReferral } from "@/lib/supabase";
import { describeContext, type ReferralContext } from "@/lib/network";
import { CONTACT_EMAIL } from "@/lib/site";

interface Props {
  context: ReferralContext;
  heading?: string;
  sub?: string;
  compact?: boolean;
}

export default function DesignerConcierge({
  context,
  heading = "Want this handled end-to-end?",
  sub = "Tell us where the project is. We match you with a vetted local lighting designer from our network — by hand, within one business day — and they run the project with our fabrication bench and product line behind them.",
  compact = false,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "fallback">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const summary = describeContext(context);
    const ok = await submitDesignerReferral({
      name,
      email,
      location,
      notes,
      context: context as unknown as Record<string, unknown>,
      context_summary: summary,
    });
    if (ok) {
      setState("done");
    } else {
      const body = [
        "Designer match request",
        `Location: ${location}`,
        `Project: ${summary}`,
        `Notes: ${notes}`,
        `From: ${name} <${email}>`,
      ].join("\n");
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        "Designer match request"
      )}&body=${encodeURIComponent(body)}`;
      setState("fallback");
    }
  }

  if (state === "done") {
    return (
      <div className="notice">
        <strong>Request received.</strong> We&apos;re reviewing designers near{" "}
        {location || "you"} now — expect a personal introduction within one
        business day. Your project details travel with the intro, so you
        won&apos;t repeat yourself.
      </div>
    );
  }

  return (
    <div className="card" style={{ padding: compact ? 24 : "clamp(26px, 4vw, 40px)" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
        <span className="chip">DESIGNER NETWORK</span>
        <span className="chip-quiet chip">HAND-MATCHED · NO OBLIGATION</span>
      </div>
      <h3 className={compact ? undefined : "h-md"} style={{ marginBottom: 8, fontSize: compact ? 19 : undefined }}>
        {heading}
      </h3>
      <p style={{ color: "var(--text-dim)", fontSize: compact ? 14.5 : 15.5, marginBottom: 20, maxWidth: "62ch" }}>
        {sub}
      </p>
      <form onSubmit={submit} className="form-grid">
        <div className="field">
          <label htmlFor={`dc-name-${context.kind}`}>Name</label>
          <input
            id={`dc-name-${context.kind}`}
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`dc-email-${context.kind}`}>Email</label>
          <input
            id={`dc-email-${context.kind}`}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`dc-loc-${context.kind}`}>Project city or ZIP</label>
          <input
            id={`dc-loc-${context.kind}`}
            required
            placeholder="e.g. Portland, OR or 97204"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor={`dc-notes-${context.kind}`}>Anything else? (optional)</label>
          <input
            id={`dc-notes-${context.kind}`}
            placeholder="timeline, budget band, scope…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <div className="field-full" style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <button className="btn btn-primary" disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Match me with a designer"}
          </button>
          <span className="mono-note">
            YOUR PROJECT DETAILS TRAVEL WITH THE INTRO ·{" "}
            <Link href="/designers" style={{ color: "var(--candela)" }}>
              HOW THE NETWORK WORKS
            </Link>
          </span>
        </div>
        {state === "fallback" && (
          <p className="notice notice-warn field-full">
            Our matching desk is momentarily offline — we opened your email
            client with the request pre-filled instead.
          </p>
        )}
      </form>
    </div>
  );
}
