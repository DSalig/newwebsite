import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/lib/cart";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${site.domain}`),
  title: {
    default: `${site.name} — Peptide Skincare & Collagen, Third-Party Tested`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "peptide skincare",
    "copper peptide serum",
    "GHK-Cu",
    "Matrixyl 3000",
    "collagen peptides",
    "peptide serum",
    "third-party tested skincare",
  ],
  openGraph: {
    title: `${site.name} — Peptide Skincare & Collagen`,
    description: site.description,
    siteName: site.name,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* mark JS availability before paint so scroll-reveal styles
            only hide content when the observer will actually run */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-js','')`,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Instrument+Sans:wght@400;500;600;700&family=Spline+Sans+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href={
            "data:image/svg+xml," +
            encodeURIComponent(
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%2323372c'/><g stroke='%23e8c9b8' stroke-width='2' fill='%23b45a38'><line x1='7' y1='20' x2='16' y2='12'/><line x1='16' y1='12' x2='25' y2='20'/><circle cx='7' cy='20' r='3.2'/><circle cx='16' cy='12' r='3.2'/><circle cx='25' cy='20' r='3.2'/></g></svg>`
            )
          }
        />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
