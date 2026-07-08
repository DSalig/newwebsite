"use client";

import { useTracked } from "@/lib/store";

export default function TrackButton({ asin }: { asin: string }) {
  const [tracked, toggle] = useTracked();
  const on = tracked.includes(asin);
  return (
    <button
      className={`btn small${on ? "" : " ghost"}`}
      onClick={() => toggle(asin)}
      title={on ? "Remove from tracker" : "Add to tracker"}
    >
      {on ? "✓ Tracking" : "+ Track"}
    </button>
  );
}
