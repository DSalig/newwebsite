"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import Newsletter from "@/components/Newsletter";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="grid cols-4">
          <div style={{ gridColumn: "span 1" }}>
            <div className="logo" style={{ color: "#f0ede4", marginBottom: "0.8rem" }}>
              Pep<span>thea</span>
            </div>
            <p style={{ maxWidth: "22rem", color: "#b9c4ba" }}>{site.tagline}</p>
          </div>
          <div>
            <h4>Shop</h4>
            <p><Link href="/shop">All products</Link></p>
            <p><Link href="/shop?cat=Serums">Serums</Link></p>
            <p><Link href="/shop?cat=Ingestibles">Collagen</Link></p>
            <p><Link href="/quiz">Routine Builder</Link></p>
          </div>
          <div>
            <h4>Learn</h4>
            <p><Link href="/science">The Science</Link></p>
            <p><Link href="/quality">Testing &amp; COAs</Link></p>
            <p><Link href="/about">About</Link></p>
            <p><Link href="/contact">Contact</Link></p>
          </div>
          <div>
            <h4>Stay in the loop</h4>
            <Newsletter compact />
            <p className="small" style={{ marginTop: "0.8rem", color: "#97a698" }}>
              One useful email a month. No spam, ever.
            </p>
          </div>
        </div>

        <div className="footer-legal">
          <p style={{ marginBottom: "0.6rem" }}>{site.fdaDisclaimer}</p>
          <p style={{ marginBottom: "0.6rem" }}>{site.complianceNote}</p>
          <p>
            © {new Date().getFullYear()} {site.name} ·{" "}
            <Link href="/legal/terms">Terms</Link> ·{" "}
            <Link href="/legal/privacy">Privacy</Link> ·{" "}
            <Link href="/legal/shipping-returns">Shipping &amp; Returns</Link> ·{" "}
            <a href={`mailto:${site.email.hello}`}>{site.email.hello}</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
