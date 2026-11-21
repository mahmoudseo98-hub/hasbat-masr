// Income tax rules for natural persons. Sources: docs/research/tax-insurance.md
import type { Source } from "../types.ts";

/** Law 91/2005 Art. 8 as replaced by Law 7/2024. `upTo` is the bracket's upper bound (EGP/year). */
export const BRACKETS = [
  { upTo: 40_000, rate: 0 },
  { upTo: 55_000, rate: 0.1 },
  { upTo: 70_000, rate: 0.15 },
  { upTo: 200_000, rate: 0.2 },
  { upTo: 400_000, rate: 0.225 },
  { upTo: 1_200_000, rate: 0.25 },
  { upTo: Infinity, rate: 0.275 },
];

/** Income above each threshold loses one more lower bracket (the next bracket then starts from 1 EGP). */
export const ELIMINATION_THRESHOLDS = [600_000, 700_000, 800_000, 900_000, 1_200_000];

/** Art. 35: deemed costs for professionals who don't keep regular books. */
export const DEEMED_COST_RATE = 0.1;

/** Law 6/2025 Art. 10 — rate applies to the WHOLE annual turnover. `below` is exclusive except the last band. */
export const SIMPLIFIED_BANDS = [
  { below: 500_000, rate: 0.004 },
  { below: 2_000_000, rate: 0.005 },
  { below: 3_000_000, rate: 0.0075 },
  { below: 10_000_000, rate: 0.01 },
  { below: 20_000_000, rate: 0.015 }, // inclusive of 20M
];
export const SIMPLIFIED_MAX_TURNOVER = 20_000_000;

export const LAST_UPDATED = "2026-11-21";

export const SOURCES: Source[] = [
  { title: "القانون 7 لسنة 2024 بتعديل شرائح الضريبة على الدخل (المادة 8)", publisher: "مصلحة الضرائب المصرية", url: "https://eta.gov.eg/sites/default/files/2024-03/law_no.7-2024.pdf", kind: "official", effectiveDate: "2024-03-01" },
  { title: "القانون 6 لسنة 2025 — حوافز المشروعات التي لا يتجاوز حجم أعمالها 20 مليون جنيه", publisher: "مصلحة الضرائب المصرية", url: "https://www.eta.gov.eg/sites/default/files/2025-02/law_no.6.of_.2025.pdf", kind: "official", effectiveDate: "2025-03-01" },
  { title: "القانون 151 لسنة 2026 بتعديل بعض أحكام قانون الضريبة على الدخل (لم يغيّر الشرائح)", publisher: "مصلحة الضرائب المصرية", url: "https://eta.gov.eg/sites/default/files/2026-08/law.no_.151.of_.2026.pdf", kind: "official", effectiveDate: "2026-07-28" },
  { title: "القانون 150 لسنة 2026 — إلزام أصحاب المهن بإمساك الدفاتر", publisher: "مصلحة الضرائب المصرية", url: "https://www.incometax.gov.eg/sites/default/files/2026-08/law.no_.150.of_.2026.pdf", kind: "official", effectiveDate: "2026-07-29" },
  { title: "أسئلة شائعة عن ضرائب الأنشطة الرقمية والعمل الحر", publisher: "مصلحة الضرائب المصرية", url: "https://eta.gov.eg/ar/node/1376", kind: "official" },
  { title: "Egypt — Taxes on personal income", publisher: "PwC Worldwide Tax Summaries", url: "https://taxsummaries.pwc.com/egypt/individual/taxes-on-personal-income", kind: "secondary" },
];
