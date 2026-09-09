import type { Metadata } from "next";
import Link from "next/link";
import ClearCart from "./ClearCart";

export const metadata: Metadata = { title: "Order confirmed" };

export default function SuccessPage() {
  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: "42rem", textAlign: "center" }}>
        <ClearCart />
        <p className="eyebrow">Order confirmed</p>
        <h1 className="display">Thank you. Your peptides are on the way.</h1>
        <p className="lede" style={{ margin: "1.2rem auto 2rem" }}>
          A receipt is in your inbox. Every product in your order ships with its lot number —
          you can pull the certificate of analysis anytime on the Testing &amp; COAs page.
        </p>
        <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/quality" className="btn btn-primary">Look up my batch</Link>
          <Link href="/science" className="btn btn-ghost">Read the science</Link>
        </div>
      </div>
    </section>
  );
}
