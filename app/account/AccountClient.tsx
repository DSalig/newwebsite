"use client";

// The signed-in experience: auth (create account, sign in, reset),
// account overview, order + subscription history, and settings.
// Order/subscription reads go through the anon client under RLS
// policies that match rows to the JWT's email (schema.sql
// "authenticated user area" section).

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getSupabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/products";
import { site } from "@/lib/site";
import Reveal from "@/components/Reveal";

interface OrderRow {
  id: string;
  created_at: string;
  amount_total: number;
  status: string;
  order_items: { product_name: string; qty: number; is_subscription: boolean }[];
}

interface SubscriptionRow {
  id: string;
  product_slug: string;
  qty: number;
  status: string;
  interval_days: number;
  next_renewal_at: string | null;
}

type Mode = "signin" | "signup" | "forgot";

function AuthForms() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    let err: string | null = null;
    if (mode === "signin") {
      err = await signIn(form.email, form.password);
    } else if (mode === "signup") {
      err = await signUp(form.email, form.password, form.name);
      if (!err) setInfo("Check your inbox — we sent a verification link. Your account activates when you click it.");
    } else {
      err = await resetPassword(form.email);
      if (!err) setInfo("Reset link sent — check your inbox.");
    }
    if (err) setError(err);
    setBusy(false);
  }

  return (
    <div className="card" style={{ maxWidth: "26rem", margin: "0 auto" }}>
      <h2 className="display">
        {mode === "signin" ? "Sign in" : mode === "signup" ? "Create your account" : "Reset password"}
      </h2>
      <p className="small muted" style={{ margin: "0.5rem 0 1.2rem" }}>
        {mode === "signup"
          ? "Track orders, manage subscriptions, and pull your batch COAs."
          : mode === "forgot"
            ? "We'll email you a secure reset link."
            : "Welcome back."}
      </p>
      <form onSubmit={submit} noValidate>
        {mode === "signup" && (
          <div className="field">
            <label htmlFor="au-name">Name</label>
            <input id="au-name" type="text" required autoComplete="name" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
        )}
        <div className="field">
          <label htmlFor="au-email">Email</label>
          <input id="au-email" type="email" required autoComplete="email" value={form.email}
            aria-invalid={error ? true : undefined}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        {mode !== "forgot" && (
          <div className="field">
            <label htmlFor="au-pass">Password</label>
            <input id="au-pass" type="password" required minLength={8}
              autoComplete={mode === "signup" ? "new-password" : "current-password"}
              value={form.password} aria-invalid={error ? true : undefined}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {mode === "signup" && <p className="small muted">At least 8 characters.</p>}
          </div>
        )}
        <button className={`btn btn-primary btn-block ${busy ? "loading" : ""}`} disabled={busy}>
          {busy && <span className="spinner" aria-hidden="true" />}
          {mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link"}
        </button>
        {error && <p className="field-error" role="alert">{error}</p>}
        {info && <p className="small" role="status" style={{ marginTop: "0.7rem", fontWeight: 600 }}>{info}</p>}
      </form>
      <hr className="hr" />
      <div className="small" style={{ display: "grid", gap: "0.35rem" }}>
        {mode !== "signin" && (
          <button className="linklike" onClick={() => { setMode("signin"); setError(""); setInfo(""); }}>
            Have an account? Sign in
          </button>
        )}
        {mode !== "signup" && (
          <button className="linklike" onClick={() => { setMode("signup"); setError(""); setInfo(""); }}>
            New here? Create an account
          </button>
        )}
        {mode !== "forgot" && (
          <button className="linklike" onClick={() => { setMode("forgot"); setError(""); setInfo(""); }}>
            Forgot your password?
          </button>
        )}
      </div>
    </div>
  );
}

function SignedIn() {
  const { user, signOut, updatePassword } = useAuth();
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [subs, setSubs] = useState<SubscriptionRow[] | null>(null);
  const [newPass, setNewPass] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passBusy, setPassBusy] = useState(false);

  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const [o, s] = await Promise.all([
      sb.from("orders")
        .select("id, created_at, amount_total, status, order_items(product_name, qty, is_subscription)")
        .order("created_at", { ascending: false }),
      sb.from("subscriptions")
        .select("id, product_slug, qty, status, interval_days, next_renewal_at"),
    ]);
    setOrders((o.data as OrderRow[]) ?? []);
    setSubs((s.data as SubscriptionRow[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPassBusy(true);
    const err = await updatePassword(newPass);
    setPassMsg(err ?? "Password updated. ✓");
    if (!err) setNewPass("");
    setPassBusy(false);
  }

  const name = (user?.user_metadata?.name as string) || "";
  const verified = Boolean(user?.email_confirmed_at);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p className="eyebrow">Your account</p>
          <h1 className="display" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
            {name ? `Hi, ${name.split(" ")[0]}.` : "Hi."}
          </h1>
          <p className="muted">{user?.email} {verified ? <span className="badge green">verified</span> : <span className="badge">verification pending</span>}</p>
        </div>
        <button className="btn btn-ghost" onClick={signOut}>Sign out</button>
      </div>

      {!verified && (
        <div className="notice" style={{ margin: "1.2rem 0" }}>
          Your email isn&apos;t verified yet — some features stay locked until you click the link
          we sent. Lost it? Sign out and use &quot;Forgot your password?&quot; to get a fresh link.
        </div>
      )}

      <div className="grid cols-2" style={{ marginTop: "2rem", alignItems: "start" }}>
        <section className="card" aria-labelledby="orders-h">
          <h2 id="orders-h" className="display">Orders</h2>
          {orders === null ? (
            <div aria-hidden="true" style={{ display: "grid", gap: "0.6rem", marginTop: "1rem" }}>
              <div className="skeleton" /><div className="skeleton" /><div className="skeleton" />
            </div>
          ) : orders.length === 0 ? (
            <div className="empty-state">
              <p className="display" style={{ fontSize: "1.2rem" }}>No orders yet.</p>
              <Link href="/shop" className="btn btn-primary" style={{ marginTop: "0.8rem" }}>Start with the shop</Link>
            </div>
          ) : (
            <div className="table-scroll" style={{ marginTop: "0.8rem" }}>
              <table className="data">
                <thead><tr><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id}>
                      <td>{new Date(o.created_at).toLocaleDateString("en-US")}</td>
                      <td style={{ whiteSpace: "normal" }}>
                        {o.order_items.map((i) => `${i.qty} × ${i.product_name}${i.is_subscription ? " ↻" : ""}`).join(", ")}
                      </td>
                      <td>{formatPrice(o.amount_total)}</td>
                      <td><span className={`badge ${["paid", "shipped", "delivered"].includes(o.status) ? "green" : ""}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div style={{ display: "grid", gap: "1.25rem" }}>
          <section className="card" aria-labelledby="subs-h">
            <h2 id="subs-h" className="display">Subscriptions</h2>
            {subs === null ? (
              <div aria-hidden="true" style={{ display: "grid", gap: "0.6rem", marginTop: "1rem" }}>
                <div className="skeleton" />
              </div>
            ) : subs.length === 0 ? (
              <p className="muted" style={{ marginTop: "0.8rem" }}>
                No active subscriptions. Any product can be subscribed at −15% from its page.
              </p>
            ) : (
              <ul style={{ listStyle: "none", marginTop: "0.8rem", display: "grid", gap: "0.6rem" }}>
                {subs.map((s) => (
                  <li key={s.id} style={{ display: "flex", justifyContent: "space-between", gap: "0.6rem", flexWrap: "wrap" }}>
                    <span>
                      {s.qty} × <Link href={`/products/${s.product_slug}`} style={{ textDecoration: "underline" }}>{s.product_slug.replaceAll("-", " ")}</Link>{" "}
                      <span className="muted small">every {s.interval_days} days</span>
                    </span>
                    <span className={`badge ${s.status === "active" ? "green" : ""}`}>{s.status}</span>
                  </li>
                ))}
              </ul>
            )}
            <p className="small muted" style={{ marginTop: "0.8rem" }}>
              Pause, skip, or cancel from the manage link in any order email (Stripe customer
              portal) — or write to <a href={`mailto:${site.email.support}`} style={{ textDecoration: "underline" }}>{site.email.support}</a>.
            </p>
          </section>

          <section className="card" aria-labelledby="settings-h">
            <h2 id="settings-h" className="display">Settings</h2>
            <form onSubmit={changePassword} style={{ marginTop: "0.8rem" }} noValidate>
              <div className="field">
                <label htmlFor="np">New password</label>
                <input id="np" type="password" minLength={8} required autoComplete="new-password"
                  value={newPass} onChange={(e) => setNewPass(e.target.value)} />
              </div>
              <button className={`btn btn-ghost ${passBusy ? "loading" : ""}`} disabled={passBusy || newPass.length < 8}>
                {passBusy && <span className="spinner" aria-hidden="true" />}
                Update password
              </button>
              {passMsg && <p className={passMsg.endsWith("✓") ? "small" : "field-error"} role="status" style={{ marginTop: "0.5rem" }}>{passMsg}</p>}
            </form>
            <p className="small muted" style={{ marginTop: "0.8rem" }}>
              Data or deletion requests: email{" "}
              <a href={`mailto:${site.email.support}`} style={{ textDecoration: "underline" }}>{site.email.support}</a>{" "}
              — honored within 30 days per our <Link href="/legal/privacy" style={{ textDecoration: "underline" }}>privacy policy</Link>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}

export default function AccountClient() {
  const { configured, loading, user } = useAuth();

  return (
    <section className="section">
      <div className="wrap">
        {!configured ? (
          <Reveal className="card" style={{ maxWidth: "34rem", margin: "0 auto" }}>
            <h1 className="display">Accounts aren&apos;t switched on yet.</h1>
            <p className="muted" style={{ margin: "0.8rem 0" }}>
              Customer accounts activate once Supabase is connected (see the README). Orders
              placed meanwhile are emailed with tracking and batch numbers, and every COA is
              publicly available on the <Link href="/quality" style={{ textDecoration: "underline" }}>Testing &amp; COAs</Link> page.
            </p>
            <Link href="/shop" className="btn btn-primary">Back to the shop</Link>
          </Reveal>
        ) : loading ? (
          <div aria-hidden="true" style={{ display: "grid", gap: "0.8rem", maxWidth: "34rem", margin: "0 auto" }}>
            <div className="skeleton" style={{ height: "2.2rem" }} />
            <div className="skeleton" /><div className="skeleton" />
          </div>
        ) : user ? (
          <SignedIn />
        ) : (
          <AuthForms />
        )}
      </div>
    </section>
  );
}
