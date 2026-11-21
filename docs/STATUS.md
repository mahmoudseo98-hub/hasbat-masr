# Status — 2026-11-21

## Test results (executed)
- Unit: `npm test` → 38/38 pass (5 calculators: formulas, published reference values, bracket/band boundaries, invalid input).
- E2E: `npm run e2e` against `next start` → 51/51 pass on iPhone 13 emulation + desktop: one H1 per page,
  labelled inputs, no horizontal scroll, results for every calculator, validation errors + focus, Arabic-Indic digits
  (١٠٠٬٠٠٠), reset, share-link prefill, live recalculation, FAQ, real 404 for unknown slugs, zero console errors.
- Lighthouse 12.6 (mobile, simulated throttling, local server):
  home — Performance 94 · Accessibility 100 · Best Practices 100 · SEO 100 · CLS 0;
  calculator page — Performance 86–88 · 100 · 100 · 100 · CLS 0.
- `tsc --noEmit` and ESLint clean; `next build` prerenders all 16 content pages.

## SEO implemented
Unique title + description + keywords per page; canonical URLs (percent-encoded Arabic); Open Graph + Twitter;
XML sitemap with lastmod; robots.txt; semantic HTML (one H1, H2 sections, H3 inside); breadcrumbs + BreadcrumbList
JSON-LD; WebSite + Organization JSON-LD on home; internal links (related calculators, categories, footer, guides);
FAQ in crawlable `<details>`. FAQPage schema intentionally NOT used — Google limits FAQ rich results to
government/health sites, so it would not be eligible. Categories without live calculators are not published (no thin pages).

## Open items / needs verification
1. Electricity: replace estimated Aug-2026 tier prices when EgyptERA publishes the table → flip status to verified.
   Watch the Electricity Law amendments (approved by Parliament 2026-11-16) and any band restructuring.
2. Laptop customs: confirm 0% duty on HS 8471.30 on the official tariff; add courier/express fees if a flat regime is published.
3. Social insurance: switch 2027 to official once NOSI publishes its circular; add the self-employed 2027 rate.
4. Freelancer tax: confirm with ETA whether the 10% deemed-cost deduction still applies after Law 150/2026.
5. Bank certificates: re-check after every CBE MPC meeting; NBE figures are press-sourced (NBE site didn't render).
6. Performance: lazy-load each calculator's logic instead of the shared registry to cut hydration time on calculator pages.
7. Not built: OG share images, blog/articles (homepage "guides" link to in-page methodology), contact form backend.

## Missing credentials / external setup
`NEXT_PUBLIC_SITE_URL` (domain), `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_ADSENSE_CLIENT`
(AdSense approval needs the live site), `NEXT_PUBLIC_GSC_VERIFICATION`, hosting account. No keyword-research tool was
available: priorities in `docs/research/market.md` are SERP-based estimates, not search-volume data.

## Next 10 calculators (ranked, from SERP research — estimates)
1. جمارك الموبايل — high demand since the passenger exemption ended 2026-01-21; ~2 real competitors. (TRA, customs.gov.eg)
2. ضريبة المرتبات / صافي الراتب — reuses the tax brackets + insurance engines already built. (ETA)
3. فاتورة الكهرباء بالشرائح — reuses `residentialBill()`; competitors disagree on prices. (EgyptERA)
4. مكافأة نهاية الخدمة — new Labor Law 14/2025, 1–2 tools. (Official Gazette, Ministry of Labour)
5. المعاش التقديري — January demand. (NOSI, Law 148/2019 tables)
6. الضريبة العقارية — official worked formula, December deadline, 1 competitor. (rta.gov.eg)
7. جمارك السيارات — engine size, origin (EU 0%), EV/hybrid rules. (customs tariff ch. 87)
8. زكاة الذهب والمال — Ramadan spike; needs a named daily gold-price source. (Al-Azhar / Dar al-Ifta nisab)
9. التمويل العقاري — scheme-specific pages (CBE initiatives, Social Housing Fund).
10. المواريث — evergreen; Egyptian angle: الوصية الواجبة (Law 71/1946).
