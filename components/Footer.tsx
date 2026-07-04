import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div
        className="glow-orb breathe"
        style={{
          width: 420,
          height: 220,
          background: "var(--candela-glow)",
          bottom: -140,
          left: "50%",
          transform: "translateX(-50%)",
        }}
        aria-hidden="true"
      />
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ marginBottom: 14 }}>
              <span className="logo-mark" aria-hidden="true" />
              Lumenwright
            </div>
            <p style={{ color: "var(--text-dim)", fontSize: 14.5, maxWidth: "34ch" }}>
              The light atelier. Custom installations, vintage rehabilitation,
              rare chandelier repair, and turnkey LED conversion — design
              through fabrication through five years of service.
            </p>
            <p className="mono-note" style={{ marginTop: 18 }}>
              LICENSED · INSURED · UL-LISTED SHOP
            </p>
          </div>
          <div>
            <h4>Studio</h4>
            <ul>
              <li><Link href="/services">Custom installations</Link></li>
              <li><Link href="/services#restoration">Vintage rehabilitation</Link></li>
              <li><Link href="/services#chandelier">Chandelier repair</Link></li>
              <li><Link href="/retrofit">Turnkey LED retrofit</Link></li>
              <li><Link href="/studio">AI lighting studio</Link></li>
            </ul>
          </div>
          <div>
            <h4>Shop</h4>
            <ul>
              <li><Link href="/products?cat=custom-chandeliers">Chandeliers</Link></li>
              <li><Link href="/products?cat=pendants">Pendants</Link></li>
              <li><Link href="/products?cat=sconces-wall">Sconces</Link></li>
              <li><Link href="/products?cat=vintage-restored">Vintage &amp; restored</Link></li>
              <li><Link href="/products?cat=vela-series">Vela Series LED</Link></li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li><Link href="/about">About the atelier</Link></li>
              <li><Link href="/trade">Trade &amp; partners</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Lumenwright Atelier. All rights reserved.</span>
          <span>Serving residential, hospitality &amp; commercial clients.</span>
        </div>
      </div>
    </footer>
  );
}
