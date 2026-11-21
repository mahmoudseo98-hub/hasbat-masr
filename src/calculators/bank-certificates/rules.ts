// Certificate presets. Every rate traced to a source (docs/research/banks.md). Update here only.
import type { Source } from "../types.ts";

export type Payout = "monthly" | "quarterly" | "annual";
export const PERIODS_PER_YEAR: Record<Payout, number> = { monthly: 12, quarterly: 4, annual: 1 };
export const PAYOUT_LABEL: Record<Payout, string> = { monthly: "شهري", quarterly: "ربع سنوي", annual: "سنوي" };

export interface CertificatePreset {
  id: string;
  bank: string;
  name: string;
  payout: Payout;
  /** Annual rate per year of the term; length = tenor in years. */
  yearlyRates: number[];
  minAmount: number;
  multiple: number;
  type: "fixed" | "declining";
  effective: string;
  confidence: "official" | "secondary";
  sourceUrl: string;
}

const BM_SHEET = "https://www.banquemisr.com/-/media/Interest-rates/Interest-Rates-AR.ashx";
const BM_QIMMA =
  "https://www.banquemisr.com/ar-EG/ABOUT-US/News/Banque-Misr-raises-the-interest-rate-on-the-Al-Qimma-certificate";
const NBE_PAGE = "https://www.nbe.com.eg/NBE/E/#/AR/ProductCategory?inParams=%7B%22CategoryID%22%3A%22PlatinumLocalCurrency%22%7D";
const NBE_PRESS = "https://www.almasryalyoum.com/news/details/4404425";
const BDC_PRESS = "https://www.alamalmal.net/article/942412";

const three = (r: number) => [r, r, r];

export const CERTIFICATES: CertificatePreset[] = [
  { id: "bm-qimma-m", bank: "بنك مصر", name: "شهادة القمة", payout: "monthly", yearlyRates: three(0.1875), minAmount: 1000, multiple: 1000, type: "fixed", effective: "2026-11-08", confidence: "official", sourceUrl: BM_QIMMA },
  { id: "bm-qimma-q", bank: "بنك مصر", name: "شهادة القمة", payout: "quarterly", yearlyRates: three(0.1885), minAmount: 1000, multiple: 1000, type: "fixed", effective: "2026-11-08", confidence: "official", sourceUrl: BM_QIMMA },
  { id: "bm-ibnmasr-m", bank: "بنك مصر", name: "ابن مصر الثلاثية المتناقصة", payout: "monthly", yearlyRates: [0.205, 0.1625, 0.1225], minAmount: 1000, multiple: 1000, type: "declining", effective: "2026-11-19", confidence: "official", sourceUrl: BM_SHEET },
  { id: "bm-ibnmasr-a", bank: "بنك مصر", name: "ابن مصر الثلاثية المتناقصة", payout: "annual", yearlyRates: [0.22, 0.175, 0.1325], minAmount: 1000, multiple: 1000, type: "declining", effective: "2026-11-19", confidence: "official", sourceUrl: BM_SHEET },
  { id: "nbe-platinum-fixed-m", bank: "البنك الأهلي المصري", name: "البلاتينية ذات العائد الثابت", payout: "monthly", yearlyRates: three(0.1875), minAmount: 1000, multiple: 1000, type: "fixed", effective: "2026-11-08", confidence: "secondary", sourceUrl: NBE_PRESS },
  { id: "nbe-platinum-fixed-q", bank: "البنك الأهلي المصري", name: "البلاتينية ذات العائد الثابت", payout: "quarterly", yearlyRates: three(0.1885), minAmount: 1000, multiple: 1000, type: "fixed", effective: "2026-11-08", confidence: "secondary", sourceUrl: NBE_PRESS },
  { id: "nbe-platinum-step-m", bank: "البنك الأهلي المصري", name: "البلاتينية المتدرجة", payout: "monthly", yearlyRates: [0.21, 0.1625, 0.12], minAmount: 1000, multiple: 1000, type: "declining", effective: "2026-11-21", confidence: "official", sourceUrl: NBE_PAGE },
  { id: "nbe-5y-m", bank: "البنك الأهلي المصري", name: "الشهادة الخماسية ذات العائد الشهري", payout: "monthly", yearlyRates: [0.1425, 0.1425, 0.1425, 0.1425, 0.1425], minAmount: 1000, multiple: 1000, type: "fixed", effective: "2026-11-21", confidence: "official", sourceUrl: NBE_PAGE },
  { id: "bdc-primo-m", bank: "بنك القاهرة", name: "بريمو الثلاثية الثابتة", payout: "monthly", yearlyRates: three(0.1725), minAmount: 1000, multiple: 1000, type: "fixed", effective: "2026-11-03", confidence: "secondary", sourceUrl: BDC_PRESS },
  { id: "bdc-primo-q", bank: "بنك القاهرة", name: "بريمو الثلاثية الثابتة", payout: "quarterly", yearlyRates: three(0.175), minAmount: 1000, multiple: 1000, type: "fixed", effective: "2026-11-03", confidence: "secondary", sourceUrl: BDC_PRESS },
  { id: "bdc-primo-a", bank: "بنك القاهرة", name: "بريمو الثلاثية الثابتة", payout: "annual", yearlyRates: three(0.185), minAmount: 1000, multiple: 1000, type: "fixed", effective: "2026-11-03", confidence: "secondary", sourceUrl: BDC_PRESS },
];

export const RATES_CHECKED = "2026-11-21";

export const SOURCES: Source[] = [
  { title: "بيان لجنة السياسة النقدية 29 أكتوبر 2026 (عائد الإيداع لليلة واحدة 20%)", publisher: "البنك المركزي المصري", url: "https://www.cbe.org.eg/en/news-publications/news/2026/10/29/13/08/mpc-press-release-29-october-2026", kind: "official", effectiveDate: "2026-10-29" },
  { title: "أسعار العائد على الشهادات والودائع", publisher: "بنك مصر", url: BM_SHEET, kind: "official", effectiveDate: "2026-11-19" },
  { title: "رفع سعر العائد على شهادة القمة", publisher: "بنك مصر", url: BM_QIMMA, kind: "official", effectiveDate: "2026-11-08" },
  { title: "شهادات الادخار بالجنيه المصري", publisher: "البنك الأهلي المصري", url: NBE_PAGE, kind: "official" },
  { title: "الأهلي يرفع عائد الشهادة البلاتينية الثابتة", publisher: "المصري اليوم", url: NBE_PRESS, kind: "secondary", effectiveDate: "2026-11-08" },
  { title: "أسعار شهادات بنك القاهرة بعد قرار المركزي", publisher: "عالم المال", url: BDC_PRESS, kind: "secondary", effectiveDate: "2026-11-03" },
  { title: "قانون الضريبة على الدخل 91 لسنة 2005 — المادة 31 بند 5 (إعفاء عوائد الشهادات للأفراد)", publisher: "مصلحة الضرائب المصرية", url: "https://portal.eta.gov.eg/sites/default/files/2024-03/law_no.91-2005.pdf", kind: "official" },
];
