"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/services", label: "Services" },
  { href: "/retrofit", label: "LED Retrofit" },
  { href: "/products", label: "Shop" },
  { href: "/studio", label: "AI Studio" },
  { href: "/trade", label: "Trade" },
  { href: "/about", label: "Company" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="logo" aria-label="Lumenwright home">
          <span className="logo-mark breathe" aria-hidden="true" />
          Lumenwright
        </Link>

        <nav aria-label="Primary">
          <ul className="nav-links" data-open={open}>
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  data-active={pathname?.startsWith(l.href)}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" onClick={() => setOpen(false)}>
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <div className="nav-cta">
          <Link href="/contact" className="btn btn-primary">
            Book a consultation
          </Link>
          <button
            className="nav-toggle"
            aria-expanded={open}
            aria-label="Toggle navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? "✕" : "☰"}
          </button>
        </div>
      </div>
    </header>
  );
}
