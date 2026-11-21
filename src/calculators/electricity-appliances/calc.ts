import { formatEGP, formatNumber } from "../../lib/format.ts";
import type { CalcOutput, CalculatorDefinition, Parsed, Row } from "../types.ts";
import { APPLIANCES, SERVICE_FEES as F, TARIFF_AUG_2026 as T } from "./rules.ts";

export function applianceKwh(watts: number, quantity: number, hoursPerDay: number, daysPerMonth: number) {
  return (watts * quantity * hoursPerDay * daysPerMonth) / 1000;
}

/** Monthly residential bill (energy + customer-service fee) per the EgyptERA band layout. */
export function residentialBill(kwh: number): { energy: number; fee: number; band: string } {
  const c = Math.max(0, kwh);
  if (c === 0) return { energy: 0, fee: F.zero, band: "استهلاك صفري" };
  if (c <= 50) return { energy: c * T.p1, fee: F.b1, band: "الشريحة الأولى (حتى 50)" };
  if (c <= 100) return { energy: 50 * T.p1 + (c - 50) * T.p2, fee: F.b2, band: "الشريحة الثانية (51–100)" };
  if (c <= 200) return { energy: c * T.p3, fee: F.b3, band: "الشريحة الثالثة (101–200)" };
  if (c <= 350) return { energy: 200 * T.p3 + (c - 200) * T.p4, fee: F.b4, band: "الشريحة الرابعة (201–350)" };
  if (c <= 650) return { energy: 200 * T.p3 + 150 * T.p4 + (c - 350) * T.p5, fee: F.b5, band: "الشريحة الخامسة (351–650)" };
  if (c <= 1000) return { energy: c * T.p6, fee: F.b6, band: "الشريحة السادسة (651–1000) — كل الكمية بسعر واحد" };
  return { energy: c * T.p7, fee: F.b7, band: "أكثر من 1000 — كل الكمية بسعر واحد" };
}

const isCustomAppliance = (v: Record<string, string>) => v.appliance === "custom";
const isFlatPrice = (v: Record<string, string>) => v.tariff === "flat";

export const definition: CalculatorDefinition = {
  fields: [
    { name: "appliance", label: "الجهاز", type: "select", options: [...APPLIANCES.map((a) => ({ value: a.id, label: `${a.label} (~${formatNumber(a.watts)} وات)` })), { value: "custom", label: "جهاز تاني — هكتب القدرة بنفسي" }], default: "ac15", help: "القدرات المكتوبة تقريبية؛ الأدق تكتب القدرة المكتوبة على ملصق جهازك." },
    { name: "watts", label: "قدرة الجهاز", type: "number", unit: "وات", min: 1, max: 50_000, default: "1000", showIf: isCustomAppliance, help: "مكتوبة على الملصق بالوات (W). لو مكتوبة بالكيلووات اضرب في 1000." },
    { name: "quantity", label: "عدد الأجهزة", type: "number", min: 1, max: 100, default: "1" },
    { name: "hours", label: "ساعات التشغيل في اليوم", type: "number", unit: "ساعة", min: 0.1, max: 24, default: "8", help: "التكييف والثلاجة بيفصلوا ويشتغلوا؛ اكتب الساعات اللي الموتور شغال فيها فعلًا تقريبًا (الثلاجة غالبًا 8–10 ساعات)." },
    { name: "days", label: "أيام التشغيل في الشهر", type: "number", unit: "يوم", min: 1, max: 31, default: "30" },
    { name: "base", label: "استهلاك بيتك الشهري من غير الجهاز ده", type: "number", unit: "كيلووات", min: 0, max: 100_000, default: "", optional: true, help: "من فاتورتك أو كارت العداد. بيخلينا نحسب الجهاز هيزوّد فاتورتك كام فعلًا، لأن السعر بيتغير حسب الشريحة." },
    { name: "tariff", label: "طريقة التسعير", type: "select", options: [{ value: "aug2026", label: "شرائح المنزلي — أغسطس 2026 (تقديرية)" }, { value: "flat", label: "سعر ثابت للكيلووات (عداد كودي أو سعر من فاتورتك)" }], default: "aug2026" },
    { name: "price", label: "سعر الكيلووات", type: "number", unit: "قرش", min: 1, max: 1000, default: "274", showIf: isFlatPrice, help: "العداد الكودي 274 قرش حسب تعريفة أبريل 2026." },
  ],
  compute(input: Parsed): CalcOutput {
    const appliance = APPLIANCES.find((a) => a.id === input.appliance);
    const watts = appliance ? appliance.watts : (input.watts as number);
    const kwh = applianceKwh(watts, input.quantity as number, input.hours as number, input.days as number);
    const base = input.base as number;
    const notes: string[] = [];
    const breakdown: Row[] = [
      { label: "قدرة الجهاز", value: `${formatNumber(watts)} وات${appliance ? " (تقريبية)" : ""}` },
      { label: "الاستهلاك اليومي", value: `${formatNumber(kwh / (input.days as number), 2)} كيلووات ساعة`, note: `${formatNumber(watts)} × ${formatNumber(input.quantity as number)} × ${formatNumber(input.hours as number, 1)} ساعة ÷ 1000` },
      { label: "الاستهلاك الشهري", value: `${formatNumber(kwh, 1)} كيلووات ساعة`, emphasis: true },
    ];
    let added: number;
    if (input.tariff === "flat") {
      const price = (input.price as number) / 100;
      added = kwh * price;
      breakdown.push({ label: `التكلفة بسعر ثابت ${formatNumber(input.price as number)} قرش`, value: formatEGP(added), emphasis: true });
    } else {
      // No base given → appliance alone; don't subtract the 9 EGP zero-consumption fee.
      const before = base > 0 ? residentialBill(base) : { energy: 0, fee: 0, band: "" };
      const after = residentialBill(base + kwh);
      added = after.energy + after.fee - (before.energy + before.fee);
      if (base > 0) breakdown.push({ label: `فاتورتك من غير الجهاز (${formatNumber(base)} ك.و.س) — ${before.band}`, value: formatEGP(before.energy + before.fee) });
      breakdown.push(
        { label: `الفاتورة ${base > 0 ? "مع" : "للجهاز لوحده"} (${formatNumber(base + kwh, 1)} ك.و.س) — ${after.band}`, value: formatEGP(after.energy + after.fee), note: `استهلاك ${formatEGP(after.energy)} + مقابل خدمة عملاء ${formatEGP(after.fee)}` },
        { label: "الجهاز بيزوّد فاتورتك", value: formatEGP(added), emphasis: true },
      );
      if (base === 0) notes.push("مكتبتش استهلاك بيتك، فحسبنا الجهاز كأنه لوحده في الشرائح الرخيصة. اكتب استهلاكك الشهري علشان تعرف الزيادة الحقيقية.");
      if (before.band !== after.band) notes.push("الجهاز ده بينقلك لشريحة أعلى، وده بيرفع سعر الكيلووات على استهلاكك كله أو جزء منه — علشان كده الزيادة أكبر من سعر الكيلووات العادي.");
      notes.push("أسعار شرائح أغسطس 2026 تقديرية: الوزارة أعلنت متوسط زيادة 12% من غير جدول أسعار رسمي، واستخدمنا الجدول الصحفي اللي بيطابق أمثلة الوزارة الرسمية.");
    }
    return {
      ok: true,
      headline: { label: "التكلفة الشهرية المتوقعة للجهاز", value: formatEGP(added), sub: `${formatNumber(kwh, 1)} كيلووات ساعة في الشهر` },
      highlights: [
        { label: "في السنة (لو نفس الاستخدام)", value: formatEGP(added * 12) },
        { label: "تكلفة ساعة التشغيل", value: formatEGP(added / ((input.hours as number) * (input.days as number))) },
      ],
      breakdown,
      notes,
    };
  },
};
