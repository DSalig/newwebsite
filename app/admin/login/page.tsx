"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Wrong password.");
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: "24rem", margin: "3rem auto" }}>
      <h1 className="display">Staff console</h1>
      <form onSubmit={submit} style={{ marginTop: "1.2rem" }}>
        <div className="field">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        </div>
        <button className="btn btn-primary btn-block" disabled={busy}>
          {busy ? "…" : "Sign in"}
        </button>
        {error && <p className="small" style={{ color: "var(--copper)", marginTop: "0.7rem" }}>{error}</p>}
      </form>
    </div>
  );
}
