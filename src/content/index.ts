// Server-side content registry: calculator pages, category pages and trust pages, all served by app/[slug].
import type { Block, CalculatorContent, CategoryId } from "../calculators/types.ts";
import { content as socialInsurance } from "../calculators/social-insurance/content.ts";
import { content as bankCertificates } from "../calculators/bank-certificates/content.ts";
import { content as electricityAppliances } from "../calculators/electricity-appliances/content.ts";
import { content as freelancerTax } from "../calculators/freelancer-tax/content.ts";
import { content as laptopCustoms } from "../calculators/laptop-customs/content.ts";
import { INFO_PAGES } from "./pages.ts";

/** Ordered by launch priority (docs/research/market.md). */
export const CALCULATORS: CalculatorContent[] = [socialInsurance, bankCertificates, electricityAppliances, freelancerTax, laptopCustoms];

export interface Category {
  id: CategoryId;
  slug: string;
  name: string;
  description: string;
  /** Planned calculators shown as "قريبًا" (no links, no thin pages). */
  upcoming: string[];
}

export const CATEGORIES: Category[] = [
  { id: "taxes", slug: "حاسبات-الضرائب", name: "الضرائب والعمل الحر", description: "ضريبة الدخل للفريلانسر وأصحاب المهن الحرة والمرتبات والنشاط التجاري.", upcoming: ["ضريبة المرتبات وصافي الراتب", "الضريبة العقارية"] },
  { id: "customs", slug: "حاسبات-الجمارك", name: "الجمارك والأجهزة المستوردة", description: "رسوم دخول الأجهزة الإلكترونية لمصر في السفر أو بالشحن.", upcoming: ["جمارك الموبايل (منظومة تليفوني)", "جمارك السيارات"] },
  { id: "electricity", slug: "حاسبات-الكهرباء", name: "الكهرباء والمرافق", description: "استهلاك الأجهزة وتكلفتها على فاتورة الكهرباء بالشرائح.", upcoming: ["فاتورة الكهرباء بالشرائح"] },
  { id: "banking", slug: "حاسبات-البنوك", name: "البنوك والادخار", description: "عائد شهادات الادخار والودائع في البنوك المصرية.", upcoming: ["مقارنة الشهادات", "التمويل العقاري"] },
  { id: "insurance", slug: "حاسبات-التأمينات-والعمل", name: "التأمينات والعمل", description: "اشتراكات التأمينات الاجتماعية والمعاشات ومستحقات نهاية الخدمة.", upcoming: ["مكافأة نهاية الخدمة", "المعاش التقديري"] },
  { id: "travel", slug: "حاسبات-السفر", name: "السفر والخدمات", description: "تكاليف السفر والحج والعمرة والشحن.", upcoming: ["تكلفة الحج والعمرة", "تكلفة الشحن"] },
];

/** Categories with at least one live calculator get an indexable page. */
export const LIVE_CATEGORIES = CATEGORIES.filter((c) => CALCULATORS.some((x) => x.category === c.id));

export const calculatorsIn = (id: CategoryId) => CALCULATORS.filter((c) => c.category === id);
export const calculatorById = (id: string) => CALCULATORS.find((c) => c.id === id);
export const categoryById = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)!;

export type Resolved =
  | { kind: "calculator"; item: CalculatorContent }
  | { kind: "category"; item: Category }
  | { kind: "page"; item: { slug: string; title: string; description: string; blocks: Block[] } };

export function resolveSlug(slug: string): Resolved | null {
  const calc = CALCULATORS.find((c) => c.slug === slug);
  if (calc) return { kind: "calculator", item: calc };
  const cat = LIVE_CATEGORIES.find((c) => c.slug === slug);
  if (cat) return { kind: "category", item: cat };
  const page = INFO_PAGES.find((p) => p.slug === slug);
  if (page) return { kind: "page", item: page };
  return null;
}

export const ALL_SLUGS = [...CALCULATORS.map((c) => c.slug), ...LIVE_CATEGORIES.map((c) => c.slug), ...INFO_PAGES.map((p) => p.slug)];
