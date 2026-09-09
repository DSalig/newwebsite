"use client";

import { useState } from "react";
import { subscribeNewsletter } from "@/lib/supabase";
import { site } from "@/lib/site";

export default function Newsletter({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "fallback">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("busy");
    const ok = await subscribeNewsletter(email, compact ? "footer" : "home");
    if (ok) {
      setState("done");
    } else {
      // no Supabase yet — hand off to email so no signup is lost
      window.location.href = `mailto:${site.email.hello}?subject=${encodeURIComponent(
        "Newsletter signup"
      )}&body=${encodeURIComponent(`Please add ${email} to the Pepthea list.`)}`;
      setState("fallback");
    }
  }

  if (state === "done") {
    return <p style={{ fontWeight: 600 }}>You&apos;re in — welcome. ✓</p>;
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <input
        type="email"
        required
        value={email}
        placeholder="you@example.com"
        aria-label="Email address"
        onChange={(e) => setEmail(e.target.value)}
        style={{ flex: "1 1 12rem" }}
      />
      <button className={compact ? "btn btn-light" : "btn btn-copper"} disabled={state === "busy"}>
        {state === "busy" ? "…" : "Subscribe"}
      </button>
    </form>
  );
}
