import type { Metadata } from "next";
import AccountClient from "./AccountClient";

export const metadata: Metadata = {
  title: "Your Account",
  description: "Order history, subscriptions, and profile settings.",
  robots: { index: false },
};

export default function AccountPage() {
  return <AccountClient />;
}
