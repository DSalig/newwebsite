import type { Metadata } from "next";
import { Suspense } from "react";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact — Book a Consultation",
  description:
    "Book a lighting design consultation, request a retrofit site audit, or commission a restoration.",
};

export default function ContactPage() {
  return (
    <Suspense>
      <ContactClient />
    </Suspense>
  );
}
