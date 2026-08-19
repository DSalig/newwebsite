# Pepthea — design language

The aesthetic is **"clinical wellness"**: warm porcelain ground, deep
evergreen ink, copper accent (a nod to GHK-Cu's blue-green copper
complex and its terracotta packaging cues), expressive serif display
type over a neutral grotesk, subtle film grain. Confident and
lab-adjacent without being cold.

## Tokens (authoritative copy in `app/globals.css`)

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#f7f3ec` | page ground |
| `--bg-soft` | `#efe9de` | alternate section bands, skeletons |
| `--surface` | `#fffdf9` | cards, inputs |
| `--ink` | `#1c2420` | primary text |
| `--ink-soft` | `#47524b` | body/secondary text |
| `--ink-faint` | `#77827a` | captions, placeholders |
| `--line` | `#ddd5c7` | borders, dividers |
| `--copper` | `#b45a38` | accent, CTAs, warnings, links-on-hover |
| `--copper-soft` | `#e8c9b8` | selection, badge fills |
| `--evergreen` | `#23372c` | dark sections, footer, admin chrome |
| `--sage` / `--blue` / `--gold` | see CSS | supporting accents only |

Radii: `--radius` 18px (cards), `--radius-sm` 12px (inputs). Shadows:
`--shadow` (rest), `--shadow-lift` (hover). Never introduce new hex
values in components.

## Typography

- **Display**: Fraunces (variable). Weight ~380, tracking −0.02em,
  line-height 1.04. Italic + copper for the emphasized word — at most
  one `<em>` per heading.
- **Body/UI**: Instrument Sans 400–700, 16px base, line-height 1.6.
- **Data**: Spline Sans Mono for lot numbers, SKUs, INCI, eyebrows,
  table headers. Eyebrow style: 0.72rem, 0.22em tracking, uppercase,
  copper.
- Scale: h1 `clamp(2.6rem, 7vw, 5rem)`; h2 `clamp(1.9rem, 4.4vw, 3rem)`;
  h3 `clamp(1.35rem, 2.6vw, 1.8rem)`; lede `clamp(1.05rem, 1.6vw, 1.25rem)`.

## Spacing rhythm

Section padding `clamp(3.5rem, 8vw, 6.5rem)`; tight variant
`clamp(2rem, 5vw, 3.5rem)`. Grid gap 1.25rem (`.grid`), bento gap
1.1rem. Card padding 1.6rem. Content max-width 1200px (`.wrap`),
reading max-width 44–50rem.

## Layout vocabulary

`.wrap` container · `.section`/`.section-tight` bands · `.grid.cols-{2,3,4}`
(collapse 900px → 2-up, 620px → 1-up) · `.bento` 6-col asymmetric grid
with `.span-{3,4,6}` · `.card` / `.card-dark` surfaces · `.notice`
copper-edged callout · `.table-scroll > table.data` for tabular data.

## Interaction states (every interactive component)

| State | Treatment |
| --- | --- |
| Default | token colors above |
| Hover | `.btn-primary` → evergreen + `--shadow-lift`; cards lift −4px; links → `--ink` |
| Focus | `:focus-visible` 2px copper outline, 3px offset — never removed |
| Active | buttons scale(0.98) |
| Disabled | `[disabled]` 50% opacity + not-allowed cursor; never remove from DOM |
| Loading | `.btn.loading` inline spinner (`.spinner`), label preserved; skeletons use `.skeleton` |
| Empty | `.empty-state` — display-font line + one primary action (see empty cart) |
| Error | `.field-error` copper text under field; input `[aria-invalid="true"]` copper border; form-level errors in `.notice` |

## Motion

- Scroll reveal: opacity + 18px lift, 0.7s ease, stagger via 60–120ms
  delays. Marquee 30s linear. Hover transitions 0.15–0.3s ease.
- Everything gated: reveals require `[data-js]`; all animation
  disabled under `prefers-reduced-motion: reduce`.

## Imagery

Procedural SVG "studio shots" (`components/ProductVisual.tsx`) —
deterministic per SKU: vessel silhouette by category, gradient keyed
to `product.hue`, peptide-bond motif. Replace per-SKU with real
photography (same 1:1 ratio, quiet backgrounds) as it's shot.

## Voice

Plain, specific, quietly confident. Numbers over adjectives
("2% GHK-Cu", not "potent"). Admit limits ("vendor-run trials",
"we say so"). Never: miracle words, urgency timers, fake scarcity.
