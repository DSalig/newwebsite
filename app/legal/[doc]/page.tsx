import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { site } from "@/lib/site";

// Plain-language starter legal pages. Have counsel review before
// scale — these are honest defaults, not legal advice.

const docs: Record<string, { title: string; sections: [string, string][] }> = {
  terms: {
    title: "Terms of Service",
    sections: [
      ["Who we are", `${site.name} sells cosmetic (topical) and dietary supplement (ingestible) peptide products for personal use. We do not sell injectable, compounded, or research-use-only substances, and our products are not intended to diagnose, treat, cure, or prevent any disease.`],
      ["Intended use", "Products must be used as directed on the label. Topicals are for external use only. Ingestibles are for adults; consult a physician before use if you are pregnant, nursing, taking medication, or have a medical condition. Keep all products away from children."],
      ["Orders & payment", "Payment is processed by Stripe; we never store card numbers. We may cancel and refund any order at our discretion (e.g., suspected resale abuse or address issues). Prices can change, but never for an order already placed."],
      ["Subscriptions", "Subscribe & Save orders recur on the stated interval at the discounted price. You can pause, skip, or cancel anytime before a renewal ships via the link in any order email — no phone calls required."],
      ["Liability", `To the fullest extent permitted by law, ${site.name}'s liability for any claim is limited to the amount you paid for the product concerned. Patch-test topicals before first full use and discontinue use if irritation occurs.`],
      ["Contact", `Questions about these terms: ${site.email.hello}.`],
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      ["What we collect", "Order details (name, email, shipping address, purchase history), routine-quiz answers when you choose to save them, and support correspondence. Payment card data is handled entirely by Stripe and never touches our servers."],
      ["What we don't do", "We don't sell or rent your data. We don't run third-party ad trackers on this site. Quiz answers are used only to build your routine and, with your consent, to email it to you."],
      ["Where it lives", "Data is stored with our infrastructure providers (Supabase/PostgreSQL, Stripe) under their security programs. Access is limited to staff who need it for support and fulfillment."],
      ["Your rights", `Email ${site.email.support} to access, correct, or delete your data. We honor deletion requests within 30 days, except records we must keep for tax or fraud-prevention purposes.`],
      ["Cookies", "We use only functional storage: your cart and preferences in your own browser's localStorage, and a session cookie for the staff console. No cross-site tracking cookies."],
    ],
  },
  "shipping-returns": {
    title: "Shipping & Returns",
    sections: [
      ["Shipping", `Orders over $50 ship free in the U.S.; otherwise a flat $5.95. Orders placed by 1pm ET ship the same business day from our U.S. warehouse. Tracking is emailed on dispatch.`],
      ["Returns", "60-day satisfaction guarantee: if a product isn't working for you, email us for a prepaid return label — opened products included. Refunds go to the original payment method within 5 business days of arrival back to us."],
      ["Damaged or wrong items", `Photo + order number to ${site.email.support} and we'll reship immediately; no need to return the damaged unit.`],
      ["Ingestibles", "For safety, ingestible products that arrive with a broken seal are always replaced, never resold. Unopened ingestibles are returnable like everything else."],
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(docs).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const entry = docs[doc];
  return entry ? { title: entry.title } : {};
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const entry = docs[doc];
  if (!entry) notFound();

  return (
    <section className="section">
      <div className="wrap" style={{ maxWidth: "44rem" }}>
        <p className="eyebrow">Legal</p>
        <h1 className="display">{entry.title}</h1>
        <p className="mono muted" style={{ margin: "0.8rem 0 2rem" }}>Last updated July 2026</p>
        {entry.sections.map(([h, body]) => (
          <div key={h} style={{ marginBottom: "1.6rem" }}>
            <h3 className="display">{h}</h3>
            <p style={{ marginTop: "0.5rem", color: "var(--ink-soft)" }}>{body}</p>
          </div>
        ))}
        <div className="notice">{site.fdaDisclaimer}</div>
      </div>
    </section>
  );
}
