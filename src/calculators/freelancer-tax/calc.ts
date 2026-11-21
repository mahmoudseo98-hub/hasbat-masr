import { formatEGP, formatNumber, formatPercent } from "../../lib/format.ts";
import type { CalcOutput, CalculatorDefinition, Parsed, Row } from "../types.ts";
import { BRACKETS, DEEMED_COST_RATE, ELIMINATION_THRESHOLDS, SIMPLIFIED_BANDS, SIMPLIFIED_MAX_TURNOVER } from "./rules.ts";

export interface BracketSlice { from: number; to: number; rate: number; tax: number }

/** Progressive tax on annual net income with the Law 7/2024 bracket-elimination rule. */
export function progressiveTax(netIncome: number): { taxable: number; tax: number; slices: BracketSlice[] } {
  const taxable = Math.max(0, Math.floor(netIncome / 10) * 10); // rounded down to nearest 10 EGP
  const skip = ELIMINATION_THRESHOLDS.filter((t) => taxable > t).length;
  const slices: BracketSlice[] = [];
  let lower = 0;
  for (const b of BRACKETS.slice(skip)) {
    if (taxable <= lower) break;
    const to = Math.min(taxable, b.upTo);
    slices.push({ from: lower, to, rate: b.rate, tax: (to - lower) * b.rate });
    lower = b.upTo;
  }
  return { taxable, tax: slices.reduce((s, x) => s + x.tax, 0), slices };
}

/** Law 6/2025: one rate on the whole turnover. Returns null above the 20M ceiling. */
export function simplifiedTax(turnover: number): { rate: number; tax: number } | null {
  if (turnover > SIMPLIFIED_MAX_TURNOVER) return null;
  const band = SIMPLIFIED_BANDS.find((b) => turnover < b.below) ?? SIMPLIFIED_BANDS[SIMPLIFIED_BANDS.length - 1];
  return { rate: band.rate, tax: turnover * band.rate };
}

const usesActualCosts = (v: Record<string, string>) => v.costMethod === "actual";

export const definition: CalculatorDefinition = {
  fields: [
    { name: "revenue", label: "إجمالي إيراداتك في السنة", type: "number", unit: "جنيه", min: 0, max: 1_000_000_000, default: "600000", help: "كل اللي استلمته من العملاء خلال السنة الضريبية (يناير–ديسمبر) بعد تحويله للجنيه." },
    { name: "costMethod", label: "طريقة خصم التكاليف (النظام العادي)", type: "select", options: [{ value: "deemed", label: "مش بمسك دفاتر — خصم 10% من الإيراد" }, { value: "actual", label: "بمسك دفاتر — تكاليف فعلية بمستندات" }], default: "deemed", help: "القانون بيسمح بخصم 10% من الإيراد لو مفيش دفاتر منتظمة (المادة 35)." },
    { name: "costs", label: "التكاليف الفعلية الموثقة", type: "number", unit: "جنيه", min: 0, max: 1_000_000_000, default: "0", optional: true, showIf: usesActualCosts, help: "إيجار، اشتراكات برامج، إنترنت، أجهزة… بشرط وجود فواتير." },
    { name: "concentration", label: "هل شغلك استشارات مهنية و90% أو أكتر من دخلك من عميل أو اتنين؟", type: "select", options: [{ value: "no", label: "لا" }, { value: "yes", label: "أيوه" }], default: "no", help: "الحالة دي مستبعدة من النظام المبسط (المادة 4 من القانون 6 لسنة 2025)." },
  ],
  compute(input: Parsed): CalcOutput {
    const revenue = input.revenue as number;
    const costs = input.costMethod === "actual" ? (input.costs as number) : revenue * DEEMED_COST_RATE;
    if (costs > revenue) return { ok: false, errors: { costs: "التكاليف أكبر من الإيراد — مفيش ضريبة على خسارة، راجع الأرقام" } };
    const net = revenue - costs;
    const prog = progressiveTax(net);
    const simple = input.concentration === "yes" ? null : simplifiedTax(revenue);

    const breakdown: Row[] = [
      { label: "إجمالي الإيرادات", value: formatEGP(revenue) },
      { label: input.costMethod === "actual" ? "التكاليف الفعلية" : "تكاليف حكمية 10%", value: `- ${formatEGP(costs)}` },
      { label: "صافي الربح الخاضع للضريبة (مقرّب لأقرب 10 جنيه أقل)", value: formatEGP(prog.taxable), emphasis: true },
      ...prog.slices.map((s) => ({
        label: `من ${formatNumber(s.from)} إلى ${formatNumber(s.to)} × ${formatPercent(s.rate, 1)}`,
        value: formatEGP(s.tax),
      })),
      { label: "الضريبة في النظام العادي (الشرائح)", value: formatEGP(prog.tax), emphasis: true },
    ];
    const notes: string[] = [];
    if (prog.taxable > ELIMINATION_THRESHOLDS[0]) notes.push("دخلك أكبر من 600 ألف جنيه، فبتتحرم من الشرائح الأقل حسب القانون 7 لسنة 2024 — علشان كده الشريحة الأولى بتبدأ من جنيه واحد بنسبة أعلى.");
    if (simple) {
      breakdown.push(
        { label: `النظام المبسط: ${formatNumber(revenue)} × ${formatPercent(simple.rate, 2)} من حجم الأعمال`, value: formatEGP(simple.tax), emphasis: true },
      );
    } else if (input.concentration === "yes") {
      notes.push("الاستشارات المهنية اللي 90% من دخلها من عميل أو اتنين مستبعدة من النظام المبسط، فالمتاح لك النظام العادي بس.");
    } else {
      notes.push("حجم أعمالك فوق 20 مليون جنيه، فمش من حقك النظام المبسط.");
    }
    const best = simple && simple.tax < prog.tax ? "simple" : "progressive";
    const bestTax = best === "simple" ? simple!.tax : prog.tax;
    if (simple) {
      notes.push(
        best === "simple"
          ? `النظام المبسط أوفر لك بحوالي ${formatEGP(prog.tax - simple.tax)} — لكنه بيحتاج تقديم طلب (نموذج 1/10)، والانضمام للفاتورة/الإيصال الإلكتروني، والالتزام بيه 5 سنين.`
          : "النظام العادي أوفر لك بالأرقام دي. النظام المبسط بيحسب الضريبة على الإيراد كله من غير خصم تكاليف.",
      );
    }
    notes.push("الإعفاء الشخصي 20,000 جنيه خاص بالمرتبات، فمش متخصوم هنا. ولو عميل مصري خصم منك 5% تحت حساب الضريبة، بتتخصم من المستحق عليك.");
    notes.push("الحساب ده لضريبة الدخل بس؛ ضريبة القيمة المضافة/الجدول على الخدمات المهنية حساب منفصل (والخدمات المصدّرة للخارج بنسبة 0%).");
    return {
      ok: true,
      headline: {
        label: best === "simple" ? "أقل ضريبة سنوية متوقعة (النظام المبسط)" : "الضريبة السنوية المتوقعة (النظام العادي)",
        value: formatEGP(bestTax),
        sub: revenue > 0 ? `حوالي ${formatPercent(bestTax / revenue, 1)} من إيرادك — صافي دخلك بعد الضريبة ${formatEGP(revenue - bestTax)} قبل خصم مصاريفك` : undefined,
      },
      highlights: [
        { label: "النظام العادي", value: formatEGP(prog.tax) },
        { label: "النظام المبسط", value: simple ? formatEGP(simple.tax) : "غير متاح" },
        { label: "الشهري تقريبًا", value: formatEGP(bestTax / 12) },
      ],
      breakdown,
      notes,
    };
  },
};
