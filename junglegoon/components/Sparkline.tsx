type Props = {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  label?: string; // accessible name / native tooltip
};

/** Tiny inline trend line — 2px stroke, no axes (it's a table micro-chart). */
export default function Sparkline({
  values,
  width = 96,
  height = 26,
  stroke = "var(--series-1)",
  label,
}: Props) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pad = 2;
  const pts = values
    .map((v, i) => {
      const x = pad + (i / (values.length - 1)) * (width - pad * 2);
      const y = pad + (1 - (v - min) / span) * (height - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} role="img" aria-label={label ?? "trend"} style={{ display: "block" }}>
      {label ? <title>{label}</title> : null}
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
