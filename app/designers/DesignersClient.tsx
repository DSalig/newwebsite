"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/Reveal";
import DesignerConcierge from "@/components/DesignerConcierge";
import { fetchActiveDesigners, SPECIALTIES, type Designer } from "@/lib/network";
import { submitDesignerApplication } from "@/lib/supabase";
import { CONTACT_EMAIL } from "@/lib/site";

export default function DesignersClient() {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchActiveDesigners().then((d) => {
      setDesigners(d);
      setLoaded(true);
    });
  }, []);

  return (
    <>
      {/* hero */}
      <section className="hero" style={{ paddingBottom: 40 }}>
        <div
          className="glow-orb breathe"
          style={{ width: 500, height: 500, background: "rgba(255,180,84,0.11)", top: -190, right: "-4%" }}
          aria-hidden="true"
        />
        <div className="container" style={{ position: "relative" }}>
          <Reveal><span className="eyebrow">Designer network</span></Reveal>
          <Reveal delay={80}>
            <h1 className="h-xl" style={{ marginTop: 18, maxWidth: "17ch" }}>
              A designer near you, <span className="italic-accent">matched by hand.</span>
            </h1>
          </Reveal>
          <Reveal delay={140}>
            <p className="lede" style={{ marginTop: 22 }}>
              When a project needs someone on site — measuring, permitting,
              directing electricians — we introduce you to a vetted local
              lighting designer from our network. They run the project; our
              fabrication bench, product line, and retrofit program run behind
              them.
            </p>
          </Reveal>
        </div>
      </section>

      {/* how it works */}
      <section className="section-tight">
        <div className="container grid-2" style={{ gap: 56, alignItems: "start" }}>
          <Reveal>
            <div>
              <span className="eyebrow">How matching works</span>
              <div className="process" style={{ marginTop: 10 }}>
                <div className="process-step">
                  <span className="process-num">1</span>
                  <div>
                    <h3>Tell us the project</h3>
                    <p>
                      Where it is and what you&apos;ve decided so far — an AI
                      studio plan, a configured fixture, or just a photo and a
                      hunch. Whatever you have travels with the introduction.
                    </p>
                  </div>
                </div>
                <div className="process-step">
                  <span className="process-num">2</span>
                  <div>
                    <h3>We match by hand</h3>
                    <p>
                      No algorithmic roulette. A person reviews your project
                      and picks the designer whose portfolio, region, and
                      specialty actually fit — within one business day.
                    </p>
                  </div>
                </div>
                <div className="process-step">
                  <span className="process-num">3</span>
                  <div>
                    <h3>The designer runs it</h3>
                    <p>
                      Site visits, drawings, installation oversight — with our
                      fabrication, products, dimmer testing, and rebate filing
                      behind them. One project, no seams.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <DesignerConcierge
              context={{ kind: "general" }}
              heading="Start a match"
              sub="Tell us where the project is. We'll review the network and make a personal introduction within one business day — no obligation, no fee to you."
            />
          </Reveal>
        </div>
      </section>

      {/* directory */}
      <section className="section" style={{ background: "var(--bg-2)", borderBlock: "1px solid var(--line)" }}>
        <div className="container">
          <div className="section-head">
            <Reveal><span className="eyebrow">The network</span></Reveal>
            <Reveal delay={80}><h2 className="h-lg">Members</h2></Reveal>
          </div>
          {designers.length > 0 ? (
            <div className="grid-3">
              {designers.map((d) => (
                <div className="card card-lit" key={d.slug}>
                  <div
                    aria-hidden="true"
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--display)",
                      fontSize: 22,
                      color: "#221503",
                      background:
                        "radial-gradient(circle at 38% 32%, var(--candela-hot), var(--candela) 55%, var(--ember))",
                      marginBottom: 16,
                    }}
                  >
                    {d.name.charAt(0)}
                  </div>
                  <h3 style={{ fontSize: 19 }}>{d.name}</h3>
                  <p className="mono-note" style={{ margin: "4px 0 10px" }}>
                    {d.studio.toUpperCase()} · {d.metros.join(" / ").toUpperCase()}
                  </p>
                  <p style={{ fontSize: 14.5 }}>{d.bio}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                    {d.specialties.map((s) => (
                      <span className="chip-quiet chip" key={s}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="card" style={{ padding: "clamp(30px, 5vw, 52px)", textAlign: "center" }}>
                <p className="mono-note" style={{ marginBottom: 12 }}>FOUNDING NETWORK NOW FORMING</p>
                <h3 className="h-md" style={{ maxWidth: "26ch", margin: "0 auto 10px" }}>
                  We publish designers here as they&apos;re vetted — never before.
                </h3>
                <p style={{ color: "var(--text-dim)", maxWidth: "56ch", margin: "0 auto" }}>
                  {loaded
                    ? "Every member is reviewed personally: portfolio, references, and a joint project standard. Until your region has a published member, concierge matching above still works — we reach beyond the public list."
                    : "Loading the current member list…"}
                </p>
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* join */}
      <section className="section" id="join">
        <div className="container grid-2" style={{ gap: 56, alignItems: "start" }}>
          <Reveal>
            <div>
              <span className="eyebrow">For designers</span>
              <h2 className="h-lg" style={{ margin: "16px 0" }}>
                Join the founding network.
              </h2>
              <p style={{ color: "var(--text-dim)", marginBottom: 18 }}>
                We send you qualified, pre-scoped local projects — room,
                fixture direction, and budget band already captured by the AI
                studio — and back your work with capabilities most independent
                designers can&apos;t carry alone.
              </p>
              <ul className="kicker-list">
                <li>Hand-matched project introductions in your region, free to the client</li>
                <li>Trade pricing across the collection and the Vela Series</li>
                <li>Custom fabrication and restoration bench behind your designs</li>
                <li>Retrofit program support: financial analysis and rebate filing</li>
                <li>Founding members shape the referral terms with us</li>
              </ul>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <JoinForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

function JoinForm() {
  const [name, setName] = useState("");
  const [studio, setStudio] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [portfolio, setPortfolio] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "fallback">("idle");

  const toggle = (s: string) =>
    setSpecialties((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const ok = await submitDesignerApplication({
      name,
      studio,
      email,
      location,
      specialties,
      portfolio_url: portfolio,
      message,
    });
    if (ok) {
      setState("done");
    } else {
      const body = [
        "Designer network application",
        `Studio: ${studio}`,
        `Location: ${location}`,
        `Specialties: ${specialties.join(", ")}`,
        `Portfolio: ${portfolio}`,
        message,
        `— ${name} <${email}>`,
      ].join("\n");
      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
        "Designer network application"
      )}&body=${encodeURIComponent(body)}`;
      setState("fallback");
    }
  }

  if (state === "done") {
    return (
      <div className="notice">
        <strong>Application received.</strong> We review every application
        personally — portfolio, references, fit — and reply within a few
        business days either way.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card form-grid" style={{ padding: "clamp(26px, 4vw, 40px)" }}>
      <div className="field">
        <label htmlFor="jf-name">Your name</label>
        <input id="jf-name" required value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="jf-studio">Studio / practice</label>
        <input id="jf-studio" required value={studio} onChange={(e) => setStudio(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="jf-email">Email</label>
        <input id="jf-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <label htmlFor="jf-loc">City / region served</label>
        <input id="jf-loc" required value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div className="field field-full">
        <label>Specialties</label>
        <div className="option-pills">
          {SPECIALTIES.map((s) => (
            <button
              type="button"
              key={s}
              className="option-pill"
              data-selected={specialties.includes(s)}
              onClick={() => toggle(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="field field-full">
        <label htmlFor="jf-portfolio">Portfolio URL</label>
        <input id="jf-portfolio" placeholder="https://…" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />
      </div>
      <div className="field field-full">
        <label htmlFor="jf-msg">Anything we should know? (optional)</label>
        <textarea id="jf-msg" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
      <div className="field-full">
        <button className="btn btn-primary btn-lg" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : "Apply to join"}
        </button>
      </div>
      {state === "fallback" && (
        <p className="notice notice-warn field-full">
          Our application desk is momentarily offline — we opened your email
          client with the application pre-filled instead.
        </p>
      )}
    </form>
  );
}
