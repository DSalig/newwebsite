// Procedural product art: each catalog item renders as a
// stylized SVG luminaire drawn from its category archetype and
// per-product palette, so the storefront ships with consistent
// imagery before photography exists. Deterministic — no
// randomness — so server and client render identically.

import type { ArtKind } from "@/lib/products";

interface Props {
  kind: ArtKind;
  palette: [string, string];
  seed?: string;
  size?: number;
}

// small deterministic hash → 0..1 values for per-product variation
function h(seed: string, i: number): number {
  let x = i + 1;
  for (let c = 0; c < seed.length; c++) x = (x * 31 + seed.charCodeAt(c)) % 9973;
  return (x % 1000) / 1000;
}

export default function ProductArt({ kind, palette, seed = "", size = 260 }: Props) {
  const [a, b] = palette;
  const id = `g-${seed || kind}`;
  const glow = `${id}-glow`;

  const defs = (
    <defs>
      <radialGradient id={id} cx="50%" cy="42%" r="60%">
        <stop offset="0%" stopColor="#fff6e4" />
        <stop offset="38%" stopColor={a} />
        <stop offset="100%" stopColor={b} />
      </radialGradient>
      <radialGradient id={glow} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor={a} stopOpacity="0.5" />
        <stop offset="100%" stopColor={a} stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  let body: React.ReactNode = null;

  if (kind === "chandelier") {
    const arms = 5 + Math.round(h(seed, 1) * 2) * 2; // 5, 7, or 9
    const drops = Array.from({ length: arms }, (_, i) => {
      const x = 30 + (i * 140) / (arms - 1);
      const len = 34 + h(seed, i + 2) * 46;
      return (
        <g key={i}>
          <line x1={x} y1={40} x2={x} y2={40 + len} stroke="#5a4a2e" strokeWidth="1.4" />
          <circle cx={x} cy={46 + len} r={9 + h(seed, i + 20) * 4} fill={`url(#${id})`} />
          <circle cx={x} cy={46 + len} r={22} fill={`url(#${glow})`} />
        </g>
      );
    });
    body = (
      <>
        <line x1={100} y1={8} x2={100} y2={36} stroke="#5a4a2e" strokeWidth="2.4" />
        <rect x={26} y={36} width={148} height={5} rx={2.5} fill="#6e5a36" />
        {drops}
      </>
    );
  } else if (kind === "pendant") {
    const r = 30 + h(seed, 1) * 16;
    body = (
      <>
        <line x1={100} y1={6} x2={100} y2={196 - r * 2 - 14} stroke="#5a4a2e" strokeWidth="1.8" />
        <rect x={92} y={196 - r * 2 - 18} width={16} height={10} rx={3} fill="#6e5a36" />
        <circle cx={100} cy={196 - r} r={r + 26} fill={`url(#${glow})`} />
        <circle cx={100} cy={196 - r} r={r} fill={`url(#${id})`} />
        <ellipse cx={100 - r * 0.3} cy={196 - r - r * 0.35} rx={r * 0.28} ry={r * 0.16} fill="#fff8ea" opacity="0.55" />
      </>
    );
  } else if (kind === "sconce") {
    body = (
      <>
        <rect x={88} y={30} width={10} height={140} rx={4} fill="#3a2f1c" />
        <circle cx={100} cy={100} r={52} fill={`url(#${glow})`} />
        <circle cx={100} cy={100} r={34} fill={`url(#${id})`} opacity="0.92" />
        <circle cx={100} cy={100} r={34} fill="none" stroke="#6e5a36" strokeWidth="2" />
        <rect x={96} y={62} width={8} height={76} rx={4} fill="#241c0f" opacity="0.85" />
      </>
    );
  } else if (kind === "vintage") {
    const tiers = [56, 88, 120];
    body = (
      <>
        <line x1={100} y1={8} x2={100} y2={44} stroke="#6e5a36" strokeWidth="2.2" />
        {tiers.map((y, t) => {
          const w = 34 + t * 26;
          const beads = 5 + t * 2;
          return (
            <g key={t}>
              <path d={`M ${100 - w} ${y} Q 100 ${y + 26} ${100 + w} ${y}`} fill="none" stroke="#c9a86a" strokeWidth="1.6" />
              {Array.from({ length: beads }, (_, i) => {
                const x = 100 - w + (i * 2 * w) / (beads - 1);
                const yy = y + 13 * (1 - Math.abs(i - (beads - 1) / 2) / ((beads - 1) / 2)) + 4;
                return <circle key={i} cx={x} cy={yy} r={2.6} fill={a} opacity="0.9" />;
              })}
            </g>
          );
        })}
        <circle cx={100} cy={150} r={30} fill={`url(#${glow})`} />
        <circle cx={100} cy={148} r={10} fill={`url(#${id})`} />
      </>
    );
  } else if (kind === "retrofit") {
    body = (
      <>
        <rect x={30} y={58} width={140} height={54} rx={8} fill="#241c0f" stroke="#6e5a36" strokeWidth="1.6" />
        <rect x={42} y={70} width={116} height={30} rx={5} fill={`url(#${id})`} opacity="0.95" />
        <rect x={42} y={70} width={116} height={30} rx={5} fill="none" stroke="#fff3da" strokeWidth="0.8" opacity="0.4" />
        <path d="M 60 130 l -8 22 M 100 130 l 0 24 M 140 130 l 8 22" stroke={a} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <circle cx={100} cy={150} r={44} fill={`url(#${glow})`} />
        <path d="M148 40 l 10 -14 h -7 l 10 -16 -16 18 h 7 z" fill={a} />
      </>
    );
  } else {
    // vela — architectural channel of light
    body = (
      <>
        <rect x={24} y={86} width={152} height={12} rx={6} fill="#241c0f" stroke="#6e5a36" strokeWidth="1.4" />
        <rect x={30} y={90} width={140} height={4} rx={2} fill={`url(#${id})`} />
        <rect x={24} y={104} width={152} height={52} fill={`url(#${glow})`} opacity="0.9" />
        <path d="M 30 98 L 20 160 M 100 98 L 100 164 M 170 98 L 180 160" stroke={a} strokeWidth="1.2" opacity="0.35" />
        <circle cx={52} cy={40} r={3} fill={a} opacity="0.8" />
        <circle cx={100} cy={32} r={3} fill={a} opacity="0.8" />
        <circle cx={148} cy={40} r={3} fill={a} opacity="0.8" />
      </>
    );
  }

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label={`Stylized illustration of a ${kind} luminaire`}
    >
      {defs}
      {body}
    </svg>
  );
}
