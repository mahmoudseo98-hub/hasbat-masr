# حاسبات مصر — Egyptian Specialized Calculators

Arabic-first (RTL) site of calculators for Egyptian users, built on official sources with a visible
source, effective date and confidence label for every rate. Next.js 16 (App Router, static generation) +
TypeScript + Tailwind CSS 4. No database, no backend: every page is prerendered and every calculation runs in the browser.

## Calculators (MVP)

| URL | Calculator | Status | Logic |
|---|---|---|---|
| `/حاسبة-التأمينات-الاجتماعية` | Social insurance 2026 / 2027 | verified (2027 flagged as press-reported) | `src/calculators/social-insurance` |
| `/حاسبة-عائد-الشهادات` | Bank certificate returns (11 presets + custom) | verified (per-rate confidence) | `src/calculators/bank-certificates` |
| `/حاسبة-استهلاك-الكهرباء-للاجهزة` | Appliance consumption + marginal bill impact | **prototype** (Aug-2026 tier prices not officially published) | `src/calculators/electricity-appliances` |
| `/حاسبة-ضريبة-الفريلانسر` | Freelancer income tax: progressive vs simplified regime | verified | `src/calculators/freelancer-tax` |
| `/حاسبة-جمارك-اللابتوب` | Laptop customs (luggage / shipping) | **prototype** (0% duty not yet read on official tariff) | `src/calculators/laptop-customs` |

Formulas, rates and their sources: see each calculator's `rules.ts` and the research records in `docs/research/`.

## Architecture

```
src/
  calculators/
    types.ts            shared types (fields, results, sources, page content)
    validate.ts         input validation at the trust boundary (Arabic-Indic digits, separators, min/max)
    registry.ts         client-safe map id → {fields, compute}
    <id>/rules.ts       regulatory rates + sources + effective dates  ← update rates HERE only
    <id>/calc.ts        pure calculation functions + field definitions
    <id>/calc.test.ts   unit tests (node:test)
    <id>/content.ts     SEO title/description, intro, how-to, methodology, example, FAQ, assumptions
  content/index.ts      registry of calculators, categories, slug resolution
  content/pages.ts      trust pages (about, contact, privacy, disclaimer, usage policy, sources & methodology)
  components/           Header, Footer, SearchBar, CalculatorCard, CalculatorLayout, CalculatorWidget,
                        CalculatorInput, ResultCard, CalculationBreakdown, FAQAccordion, SourceReferences,
                        LastUpdated, RelatedCalculators, Breadcrumbs, AdSlot, Analytics (consent), JsonLd
  app/
    page.tsx            homepage
    [slug]/page.tsx     every calculator, category and trust page (Arabic slugs, dynamicParams=false → real 404s)
    sitemap.ts, robots.ts, not-found.tsx
docs/research/          research records with source URLs and confidence labels
scripts/e2e.cjs         Playwright end-to-end checks
```

### Adding a calculator
1. Create `src/calculators/<id>/` with `rules.ts`, `calc.ts` (export `definition`), `calc.test.ts`, `content.ts`.
2. Add one line to `src/calculators/registry.ts` and one to `CALCULATORS` in `src/content/index.ts`.
3. The page, sitemap entry, category listing, search, footer link and breadcrumbs appear automatically.

### Updating a rate
Edit the calculator's `rules.ts` (value, source URL, effective date, `LAST_UPDATED`), adjust the test that pins it,
run `npm test`. Nothing else changes.

## Install & run

```bash
npm install
```
```bash
npm test          # 38 unit tests (calculation logic, boundaries, invalid input)
```
```bash
npm run build && npm start   # production build on http://localhost:3000
```
```bash
npm run e2e       # with the server running: 51 browser checks (mobile + desktop)
```

Requires Node.js ≥ 22.18 (tests use native TypeScript type-stripping; no test framework dependency).

## Deploy

Any Node host or Vercel. Set the env vars from `.env.example` — at minimum `NEXT_PUBLIC_SITE_URL`
(canonical URLs and sitemap use it; the default is localhost). On Vercel: import the repo, add env vars, deploy.
Elsewhere: `npm ci && npm run build && npm start` behind a reverse proxy with HTTPS.

After deploy: verify the domain in Google Search Console (set `NEXT_PUBLIC_GSC_VERIFICATION`, rebuild) and submit
`/sitemap.xml`.

## Monetization hooks (off until configured)
- `NEXT_PUBLIC_GA_ID` → GA4, loaded only after cookie consent.
- `NEXT_PUBLIC_ADSENSE_CLIENT` → labelled ad slots (after calculator widget, mid-homepage) with reserved height (no CLS).
- `partnerLinks` on any calculator's content → rendered with `rel="sponsored"` and a visible disclosure.

See `docs/STATUS.md` for test results, completed work, open items and the next 10 calculators.
