"use client";

// Landing page for Supabase password-recovery links. The link's
// token puts the user in a recovery session; setting a new password
// completes the flow and returns them to /account signed in.

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function ResetClient() {
  const { configured, user, updatePassword } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const err = await updatePassword(password);
    if (err) {
      setError(err);
      setBusy(false);
    } else {
      router.push("/account");
    }
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="card" style={{ maxWidth: "26rem", margin: "0 auto" }}>
          <h1 className="display">Set a new password</h1>
          {!configured || !user ? (
            <>
              <p className="muted" style={{ margin: "0.8rem 0" }}>
                This page only works from the secure link in a password-reset email — the link
                may have expired. Request a fresh one from the account page.
              </p>
              <Link href="/account" className="btn btn-primary">Go to account</Link>
            </>
          ) : (
            <form onSubmit={submit} style={{ marginTop: "1rem" }} noValidate>
              <div className="field">
                <label htmlFor="rp">New password</label>
                <input id="rp" type="password" required minLength={8} autoComplete="new-password"
                  value={password} aria-invalid={error ? true : undefined}
                  onChange={(e) => setPassword(e.target.value)} />
                <p className="small muted">At least 8 characters.</p>
              </div>
              <button className={`btn btn-primary btn-block ${busy ? "loading" : ""}`} disabled={busy || password.length < 8}>
                {busy && <span className="spinner" aria-hidden="true" />}
                Save password
              </button>
              {error && <p className="field-error" role="alert">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
