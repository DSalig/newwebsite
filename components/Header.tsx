"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { announcement, nav, site } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { useAuth } from "@/lib/auth";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { user } = useAuth();

  // The admin console has its own chrome.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <div className="announce">{announcement}</div>
      <header className="header">
        <div className="header-inner">
          <Link href="/" className="logo" aria-label={`${site.name} home`}>
            Pep<span>thea</span>
          </Link>
          <nav aria-label="Main">
            <ul className={`nav-links ${open ? "open" : ""}`} style={{ listStyle: "none" }}>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={pathname === item.href ? "active" : ""}
                    aria-current={pathname === item.href ? "page" : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
            <Link
              href="/account"
              className="cart-btn"
              aria-label={user ? "Your account" : "Sign in"}
              title={user ? "Your account" : "Sign in"}
            >
              {user ? "Account" : "Sign in"}
            </Link>
            <Link href="/cart" className="cart-btn" aria-label={`Cart, ${count} items`}>
              Cart {count > 0 && <span className="cart-count">{count}</span>}
            </Link>
            <button
              className="menu-toggle"
              aria-expanded={open}
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "×" : "☰"}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
