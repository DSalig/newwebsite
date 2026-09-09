import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Staff Console",
  robots: { index: false, follow: false },
};

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders & Billing" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/customers", label: "Customers (CRM)" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "70vh" }}>
      <div style={{ background: "var(--evergreen)", color: "#e8ecdf" }}>
        <div className="wrap" style={{ display: "flex", gap: "1.5rem", alignItems: "center", padding: "0.9rem 1.25rem", flexWrap: "wrap" }}>
          <Link href="/admin" className="logo" style={{ color: "#f0ede4" }}>
            Pep<span>thea</span> <span className="mono" style={{ fontSize: "0.65rem", color: "#97a698" }}>STAFF</span>
          </Link>
          <nav style={{ display: "flex", gap: "1.1rem", flexWrap: "wrap" }}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} style={{ fontSize: "0.9rem", color: "#c9d3c6" }}>
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/" style={{ marginLeft: "auto", fontSize: "0.85rem", color: "#97a698" }}>
            ← Storefront
          </Link>
        </div>
      </div>
      <div className="wrap section-tight">{children}</div>
    </div>
  );
}
