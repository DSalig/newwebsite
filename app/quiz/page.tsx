import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "AI Routine Builder",
  description:
    "Answer five questions and get a peptide routine that layers correctly — morning, evening, and what not to combine.",
};

export default function QuizPage() {
  return <QuizClient />;
}
