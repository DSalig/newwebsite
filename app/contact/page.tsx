import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact",
  description: "Questions about products, orders, batches, or wholesale — we answer within one business day.",
};

export default function ContactPage() {
  return <ContactClient />;
}
