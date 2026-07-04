import type { Metadata } from "next";
import StudioClient from "./StudioClient";

export const metadata: Metadata = {
  title: "AI Lighting Studio — Photo to Personalized Lighting Plan",
  description:
    "Upload a photo of your space and get a personalized three-layer lighting plan — ambient, task, and accent — drawn from the Lumenwright collection and reviewed by a designer.",
};

export default function StudioPage() {
  return <StudioClient />;
}
