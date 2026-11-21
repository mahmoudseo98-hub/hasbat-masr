// Law 148/2019 contribution rules per year. Sources: docs/research/tax-insurance.md
import type { Source } from "../types.ts";

export interface InsuranceYear {
  year: number;
  minWage: number;
  maxWage: number;
  employee: { label: string; rate: number }[];
  employer: { label: string; rate: number }[];
  /** Self-employed share (Art. 19(2)); null when not yet confirmed for that year. */
  selfEmployedRate: number | null;
  confidence: "official" | "secondary";
}

export const YEARS: InsuranceYear[] = [
  {
    year: 2026, minWage: 2_700, maxWage: 16_700, confidence: "official", selfEmployedRate: 0.21,
    employee: [
      { label: "تأمين الشيخوخة والعجز والوفاة", rate: 0.09 },
      { label: "مكافأة نهاية الخدمة", rate: 0.01 },
      { label: "تأمين المرض", rate: 0.01 },
    ],
    employer: [
      { label: "تأمين الشيخوخة والعجز والوفاة", rate: 0.12 },
      { label: "مكافأة نهاية الخدمة", rate: 0.01 },
      { label: "إصابات العمل", rate: 0.015 },
      { label: "تأمين المرض", rate: 0.0325 },
      { label: "تأمين البطالة", rate: 0.01 },
    ],
  },
  {
    // Art. 19: +1% every 7 years from 2020, split equally. Limits announced by NOSI's chairman; no circular yet.
    year: 2027, minWage: 3_200, maxWage: 19_300, confidence: "secondary", selfEmployedRate: null,
    employee: [
      { label: "تأمين الشيخوخة والعجز والوفاة", rate: 0.095 },
      { label: "مكافأة نهاية الخدمة", rate: 0.01 },
      { label: "تأمين المرض", rate: 0.01 },
    ],
    employer: [
      { label: "تأمين الشيخوخة والعجز والوفاة", rate: 0.125 },
      { label: "مكافأة نهاية الخدمة", rate: 0.01 },
      { label: "إصابات العمل", rate: 0.015 },
      { label: "تأمين المرض", rate: 0.0325 },
      { label: "تأمين البطالة", rate: 0.01 },
    ],
  },
];

export const LAST_UPDATED = "2026-11-21";

export const SOURCES: Source[] = [
  { title: "قانون التأمينات الاجتماعية والمعاشات رقم 148 لسنة 2019 (المواد 19، 36، 46، 70، 86)", publisher: "الهيئة القومية للتأمين الاجتماعي", url: "https://www.nosi.gov.eg/ar/Lists/NOSILibrary/2-12-2019%20%D9%83%D8%AA%D8%A7%D8%A8%20%D8%A7%D9%84%D9%82%D8%A7%D9%86%D9%88%D9%86%20%D8%A7%D9%84%D8%AC%D8%AF%D9%8A%D8%AF.pdf", kind: "official" },
  { title: "الحد الأدنى والأقصى لأجر الاشتراك 2026: 2,700 و16,700 جنيه", publisher: "الهيئة القومية للتأمين الاجتماعي", url: "https://www.nosi.gov.eg/ar/News/Pages/2025-11-30.aspx", kind: "official", effectiveDate: "2026-01-01" },
  { title: "حدود أجر الاشتراك 2027: 3,200 و19,300 جنيه", publisher: "الوطن", url: "https://www.elwatannews.com/news/details/8397469", kind: "secondary", effectiveDate: "2027-01-01" },
  { title: "التأمين على المصريين العاملين بالخارج", publisher: "الهيئة القومية للتأمين الاجتماعي", url: "https://www.nosi.gov.eg/ar/Services/Pages/Info/WorkingAbroad.aspx", kind: "official" },
];
