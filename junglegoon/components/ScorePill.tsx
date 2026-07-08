import { opportunityLabel } from "@/lib/scoring";

/** Opportunity score 1-10 — number always shown, color never carries it alone. */
export default function ScorePill({ score }: { score: number }) {
  const label = opportunityLabel(score);
  const cls = label.toLowerCase() as "high" | "medium" | "low";
  return (
    <span className={`pill ${cls}`}>
      {score}/10 · {label}
    </span>
  );
}
