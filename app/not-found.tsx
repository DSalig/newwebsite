import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section" style={{ textAlign: "center", minHeight: "55vh", display: "grid", placeItems: "center" }}>
      <div className="container">
        <p className="eyebrow" style={{ justifyContent: "center" }}>404 · Lights out</p>
        <h1 className="h-xl" style={{ margin: "18px auto", maxWidth: "16ch" }}>
          This room isn&apos;t <span className="italic-accent">wired yet.</span>
        </h1>
        <p className="lede" style={{ margin: "0 auto 30px" }}>
          The page you&apos;re after doesn&apos;t exist — but the collection does.
        </p>
        <div className="hero-actions" style={{ justifyContent: "center" }}>
          <Link href="/" className="btn btn-primary">Back to the atelier</Link>
          <Link href="/products" className="btn btn-ghost">Browse the collection</Link>
        </div>
      </div>
    </section>
  );
}
