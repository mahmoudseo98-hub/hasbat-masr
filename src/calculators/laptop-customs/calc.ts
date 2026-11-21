import { formatEGP, formatNumber, formatPercent } from "../../lib/format.ts";
import type { CalcOutput, CalculatorDefinition, Parsed, Row } from "../types.ts";
import { LAPTOP_DUTY_RATE, TRAVELLER_ALLOWANCE, VAT_RATE } from "./rules.ts";

/** Taxes on a dutiable value: duty on value, VAT on value + duty. */
export function importTaxes(value: number) {
  const duty = value * LAPTOP_DUTY_RATE;
  const vat = (value + duty) * VAT_RATE;
  return { duty, vat, total: duty + vat };
}

/** Part of the laptop's value above the traveller allowance left after other new items. */
export function dutiableInLuggage(laptopEgp: number, otherNewItemsEgp: number) {
  return Math.max(0, Math.min(laptopEgp, laptopEgp + otherNewItemsEgp - TRAVELLER_ALLOWANCE));
}

const shipped = (v: Record<string, string>) => v.method === "shipping";
const newInLuggage = (v: Record<string, string>) => v.method === "luggage-new";
const needsPrice = (v: Record<string, string>) => v.method !== "luggage-used";

export const definition: CalculatorDefinition = {
  fields: [
    { name: "method", label: "اللابتوب جاي إزاي؟", type: "select", options: [{ value: "luggage-new", label: "جديد في شنطة السفر (هدية أو للاستخدام)" }, { value: "luggage-used", label: "لابتوبي الشخصي المستعمل معايا في السفر" }, { value: "shipping", label: "شحن من الخارج (شراء أونلاين / شركة شحن)" }], default: "luggage-new" },
    { name: "price", label: "سعر اللابتوب", type: "number", unit: "دولار", min: 1, max: 100_000, default: "1000", showIf: needsPrice, help: "السعر في الفاتورة بالدولار." },
    { name: "freight", label: "تكلفة الشحن والتأمين لحد مصر", type: "number", unit: "دولار", min: 0, max: 100_000, default: "0", optional: true, showIf: shipped, help: "الجمارك بتحسب على قيمة الجهاز + الشحن + التأمين (CIF)." },
    { name: "fx", label: "سعر الدولار بالجنيه", type: "number", unit: "جنيه", min: 1, max: 1000, placeholder: "مثال: 48.5", showIf: needsPrice, help: "الجمارك بتستخدم سعر البنك المركزي يوم تسجيل الشهادة الجمركية — اكتب سعر النهارده من موقع البنك المركزي." },
    { name: "other", label: "قيمة أي حاجات جديدة تانية معاك", type: "number", unit: "جنيه", min: 0, max: 10_000_000, default: "0", optional: true, showIf: newInLuggage, help: "حد الإعفاء 15,000 جنيه بيتوزع على كل الحاجات الجديدة اللي معاك (لكل فرد)." },
  ],
  compute(input: Parsed): CalcOutput {
    if (input.method === "luggage-used") {
      return {
        ok: true,
        headline: { label: "الرسوم المتوقعة", value: formatEGP(0), sub: "الحاسب الشخصي المحمول من الأمتعة الشخصية المعفاة" },
        breakdown: [
          { label: "التصنيف", value: "أمتعة شخصية" },
          { label: "ضريبة الوارد + القيمة المضافة", value: "لا تُحصّل" },
        ],
        notes: [
          "الإعفاء بشرط إنه لاستعمالك الشخصي ومش بكميات تجارية؛ وموظف الجمارك بيقدّر ده حسب ظروف المسافر وعدد مرات سفره.",
          "اللابتوب والتابلت مش داخلين في منظومة رسوم الموبايلات (38.5%) حسب التصريحات المنشورة.",
        ],
      };
    }
    const fx = input.fx as number;
    const priceEgp = (input.price as number) * fx;
    const notes: string[] = [
      "نسبة ضريبة الوارد 0% على اللابتوب (بند 8471.30) منقولة عن مواقع التعريفة الجمركية ولم نطابقها بعد مع التعريفة الرسمية — النتيجة نموذج أولي.",
    ];
    if (input.method === "luggage-new") {
      const dutiable = dutiableInLuggage(priceEgp, input.other as number);
      const t = importTaxes(dutiable);
      const breakdown: Row[] = [
        { label: "قيمة اللابتوب بالجنيه", value: formatEGP(priceEgp), note: `${formatNumber(input.price as number)} دولار × ${formatNumber(fx, 2)}` },
        { label: "حاجات جديدة تانية معاك", value: formatEGP(input.other as number) },
        { label: "حد الإعفاء للفرد", value: `- ${formatEGP(TRAVELLER_ALLOWANCE)}` },
        { label: "الجزء الخاضع للرسوم من قيمة اللابتوب", value: formatEGP(dutiable), emphasis: true },
        { label: `ضريبة الوارد ${formatPercent(LAPTOP_DUTY_RATE)}`, value: formatEGP(t.duty) },
        { label: `ضريبة القيمة المضافة ${formatPercent(VAT_RATE)}`, value: formatEGP(t.vat) },
        { label: "إجمالي الرسوم المتوقعة", value: formatEGP(t.total), emphasis: true },
      ];
      if (dutiable === 0) notes.push("قيمة الحاجات الجديدة اللي معاك في حدود الإعفاء، فمفيش رسوم متوقعة.");
      notes.push("الإعفاء مرتين في السنة للمقيمين و4 مرات للسياح، ولكل فرد في الأسرة إعفاء منفصل لكن مينفعش تجمّعوا إعفاءاتكم على جهاز واحد.");
      return {
        ok: true,
        headline: { label: "الرسوم المتوقعة في المطار", value: formatEGP(t.total) },
        highlights: [{ label: "التكلفة الكلية للجهاز", value: formatEGP(priceEgp + t.total) }],
        breakdown,
        notes,
      };
    }
    const cif = ((input.price as number) + (input.freight as number)) * fx;
    const t = importTaxes(cif);
    notes.push("مش محسوب: رسوم شركة الشحن والتخليص وأي رسوم خدمات جمركية، لأنها بتختلف حسب الشركة والشحنة. مفيش نظام سعر موحد رسمي منشور للطرود السريعة لحد دلوقتي.");
    return {
      ok: true,
      headline: { label: "الضرائب الجمركية المتوقعة", value: formatEGP(t.total), sub: `التكلفة الكلية تقريبًا ${formatEGP(cif + t.total)} قبل رسوم الشحن والتخليص` },
      highlights: [
        { label: "القيمة الجمركية (CIF)", value: formatEGP(cif) },
        { label: "التكلفة الكلية", value: formatEGP(cif + t.total) },
      ],
      breakdown: [
        { label: "سعر الجهاز + الشحن والتأمين", value: `${formatNumber((input.price as number) + (input.freight as number))} دولار` },
        { label: "القيمة الجمركية بالجنيه (CIF)", value: formatEGP(cif), note: `× ${formatNumber(fx, 2)} جنيه للدولار`, emphasis: true },
        { label: `ضريبة الوارد ${formatPercent(LAPTOP_DUTY_RATE)}`, value: formatEGP(t.duty) },
        { label: `ضريبة القيمة المضافة ${formatPercent(VAT_RATE)} على (القيمة + الوارد)`, value: formatEGP(t.vat) },
        { label: "إجمالي الضرائب", value: formatEGP(t.total), emphasis: true },
      ],
      notes,
    };
  },
};
