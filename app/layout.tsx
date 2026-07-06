import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Lumenwright — The Light Atelier | Custom Lighting, Restoration & LED Retrofit",
    template: "%s | Lumenwright",
  },
  description:
    "Custom-designed lighting installations, vintage lighting rehabilitation, rare chandelier repair, and turnkey LED retrofit programs. AI-powered lighting recommendations from a photo of your space.",
  keywords: [
    "custom lighting",
    "chandelier repair",
    "vintage lighting restoration",
    "LED retrofit",
    "architectural lighting",
    "lighting design",
  ],
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
              `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><defs><radialGradient id='g' cx='40%' cy='35%' r='70%'><stop offset='0%' stop-color='#ffd9a0'/><stop offset='50%' stop-color='#ffb454'/><stop offset='100%' stop-color='#e2622b'/></radialGradient></defs><circle cx='16' cy='16' r='13' fill='url(#g)'/></svg>`
            )
          }
        />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
