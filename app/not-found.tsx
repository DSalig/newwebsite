import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="wrap" style={{ textAlign: "center" }}>
        <p className="eyebrow">404</p>
        <h1 className="display">This page didn&apos;t bond.</h1>
        <p className="muted" style={{ margin: "1rem 0 2rem" }}>
          The link may be old, or the product may have moved.
        </p>
        <div style={{ display: "flex", gap: "0.8rem", justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary">Home</Link>
          <Link href="/shop" className="btn btn-ghost">Shop</Link>
        </div>
      </div>
    </section>
  );
}
