# Pepthea — repository conventions & prompting method

## File structure

```
app/<route>/page.tsx        server component: metadata + static shell
app/<route>/<Name>Client.tsx client component when interactivity is needed
app/api/<name>/route.ts     route handlers (Node runtime where crypto is used)
components/<Name>.tsx       shared UI, PascalCase, one component per file
lib/<name>.ts(x)            domain logic; .tsx only when it renders JSX
docs/                       these standards
supabase/schema.sql         full schema incl. RLS — additive edits only
supabase/seed.sql           generated — never hand-edit (npm run seed)
```

## Naming

- Components: `PascalCase` nouns (`BuyPanel`, `BatchLookup`).
- Client components end in `Client` only when they are the client
  half of a server page.
- Database: `snake_case`, plural tables, cents-integer money columns,
  `created_at timestamptz` everywhere.
- CSS: flat utility-ish classes defined in `globals.css`; no CSS
  modules, no inline hex.
- Slugs/SKUs: slugs kebab-case; SKUs `PT-<CAT>-<NNN>`; lots
  `PT<yy>-<ABBR>-<NNN>`.

## Code style

- TypeScript strict; no `any` unless interfacing with untyped JSON,
  then narrow immediately.
- Server-only modules state it in a header comment and are only
  imported from server components/route handlers.
- Every external call (Supabase, Stripe, fetch) has a failure path
  that keeps the UI functional — follow the `withTimeout`/fallback
  patterns in `lib/supabase.ts`.
- Comments state constraints the code can't show; no narration.

## Git

- Branch off the working branch; `npm run build` must pass before
  commit; imperative commit subject + body explaining the why.

## Prompting method (for AI coding sessions)

The repeatable loop that produced this codebase:

1. **Open with the agent layer.** Point the session at `CLAUDE.md`
   first; it pulls in these docs. Never start a session cold.
2. **State the outcome, not the diff.** "Add X to the account page,
   matching the design language, degrading gracefully without env
   vars" beats line-level instructions.
3. **Bind every task to the rules.** Copy tasks cite CLAUDE.md rule 1
   (claims); UI tasks cite the interaction-states table; data tasks
   cite the schema section of the README.
4. **Demand the failure path.** For any new integration ask: "what
   happens when the env var is missing / the call fails / the user
   has JS disabled?" — parity with existing fallbacks is required.
5. **Verify before accepting.** `npm run build`, then smoke the
   affected routes (the repo pattern: `npm start` + curl each route
   for 200). For DB changes, re-run `npm run seed` and eyeball the
   diff.
6. **Commit the standard, not just the code.** If a session created a
   new pattern worth keeping, it must land in these docs in the same
   commit — that's how consistency survives session resets.
