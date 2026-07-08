# Lumenwright Business Plan

`Lumenwright-Business-Plan.xlsx` — the master business plan, 10 tabs:

| Tab | Contents |
| --- | --- |
| 0 · Start Here | How the tabs connect, the ten numbers that matter, operating principles |
| 1 · Business Plan | Market, customers (ICPs), competition, operations, hiring, risk register, KPIs |
| 2 · GTM + Workback | Go-to-market strategy + dated week-by-week workback to the Oct 1, 2026 launch |
| 3 · Phased Approach | Five phases with explicit entry/exit gates |
| 4 · Revenue Engine | Six revenue streams, unit economics, pricing, LTV/CAC, cash cycle |
| 5 · Forecast | 24-month model + Year 3, live formulas — edit the yellow cells |
| 6 · Designer Network | Recruiting funnel, vetting rubric, founding-member terms, scorecard |
| 7 · Digital Marketing | SEO, content engine, per-platform social strategy, paid media, email |
| 8 · Vendors + Sourcing | Named suppliers per category, ODM process, trade shows, vetting checklist |
| 9 · Funding + Startup | $118.5k itemized startup budget + staged SBA funding stack |

## Regenerating the workbook

The workbook is generated from `generator/` (content lives in
`content_a.py` / `content_b.py`; layout + forecast formulas in
`build_plan.py`):

```bash
cd business/generator
pip install openpyxl
python3 build_plan.py   # writes Lumenwright-Business-Plan.xlsx alongside the scripts
```

Edit the content files and rerun, or just edit the .xlsx directly —
the yellow cells in the Forecast tab are the intended inputs.
