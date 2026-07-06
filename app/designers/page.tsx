import type { Metadata } from "next";
import DesignersClient from "./DesignersClient";

export const metadata: Metadata = {
  title: "Designer Network — Hand-Matched Local Lighting Designers",
  description:
    "Get matched with a vetted local lighting designer to run your full project — backed by our fabrication bench, product line, and retrofit program. Designers: join the network.",
};

export default function DesignersPage() {
  return <DesignersClient />;
}
