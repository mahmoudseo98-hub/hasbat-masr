// Laptop import taxes. Sources: docs/research/customs-electricity.md
import type { Source } from "../types.ts";

/** HS 8471.30 import duty — 0% per tariff aggregators; not yet read on the official tariff (hence "prototype"). */
export const LAPTOP_DUTY_RATE = 0;
/** VAT Law 67/2016 general rate, charged on customs value + duty. */
export const VAT_RATE = 0.14;
/** New items a traveller may bring tax-free (EGP, per person). */
export const TRAVELLER_ALLOWANCE = 15_000;

export const LAST_UPDATED = "2026-11-21";

export const SOURCES: Source[] = [
  { title: "الإعفاءات الجمركية للمسافرين والأمتعة الشخصية (حد 15,000 جنيه للأشياء الجديدة)", publisher: "مصلحة الجمارك المصرية", url: "https://customs.gov.eg/Legislations/TravelAndTourism?travelAndTourismId=1", kind: "official" },
  { title: "قانون الجمارك 207 لسنة 2020 — المادة 16 (القيمة للأغراض الجمركية وسعر الصرف)", publisher: "مصلحة الجمارك المصرية", url: "https://customs.gov.eg/", kind: "official" },
  { title: "Egypt — Other taxes (VAT on imports: CIF + customs duty + other taxes)", publisher: "PwC Worldwide Tax Summaries", url: "https://taxsummaries.pwc.com/egypt/corporate/other-taxes", kind: "secondary" },
  { title: "جمارك اللابتوب: ضريبة وارد صفر% وقيمة مضافة 14%", publisher: "جمركي", url: "https://www.gomruky.com/customs/laptops", kind: "secondary" },
];
