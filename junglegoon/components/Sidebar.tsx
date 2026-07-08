"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const icon = (d: string) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const RESEARCH = [
  { href: "/", label: "Dashboard", icon: icon("M3 3v18h18M7 14l4-4 3 3 5-6") },
  { href: "/products", label: "Product Database", icon: icon("M21 8V21H3V8M1 3h22v5H1zM10 12h4") },
  { href: "/niches", label: "Niche Finder", icon: icon("M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35") },
  { href: "/keywords", label: "Keyword Scout", icon: icon("M4 7V4h16v3M9 20h6M12 4v16") },
  { href: "/estimator", label: "Sales Estimator", icon: icon("M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6") },
];

const SIGNALS = [
  { href: "/trends", label: "Trend Radar", icon: icon("M22 12h-4l-3 9L9 3l-3 9H2") },
  { href: "/ideas", label: "Idea Vault", icon: icon("M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2z") },
  { href: "/tracker", label: "Product Tracker", icon: icon("M12 20V10M18 20V4M6 20v-4") },
];

function NavLink({ href, label, icon: ic }: { href: string; label: string; icon: React.ReactNode }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link href={href} className={`nav-link${active ? " active" : ""}`}>
      {ic}
      {label}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">
        Jungle<span>Goon</span>
        <small>personal FBA research</small>
      </div>
      <div className="nav-section">Research</div>
      {RESEARCH.map((l) => (
        <NavLink key={l.href} {...l} />
      ))}
      <div className="nav-section">Signals</div>
      {SIGNALS.map((l) => (
        <NavLink key={l.href} {...l} />
      ))}
    </aside>
  );
}
