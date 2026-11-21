// Residential tariff. Band LAYOUT is official (EgyptERA); Aug-2026 PRICES are an estimate (docs/research/customs-electricity.md).
import type { Source } from "../types.ts";

/** EGP per kWh, "Version A" press table that reproduces the Ministry's 31-Jul-2026 sample bills. */
export const TARIFF_AUG_2026 = {
  p1: 0.68, // 0–50 (unchanged, official)
  p2: 0.95, // 51–100
  p3: 1.15, // 0–200 for consumers of 101–650
  p4: 1.72, // 201–350
  p5: 2.18, // 351–650
  p6: 2.4, // all kWh, consumers of 651–1000
  p7: 2.74, // all kWh, consumers above 1000
};
/** Monthly customer-service fee by band reached (EGP), official since Jan 2024. */
export const SERVICE_FEES = { zero: 9, b1: 1, b2: 2, b3: 6, b4: 11, b5: 15, b6: 25, b7: 40 };
export const TARIFF_STATUS = "تقديرية";
export const TARIFF_EFFECTIVE = "2026-08-01";

/** Typical input wattage — rough guides only; the label on the appliance is authoritative. */
export const APPLIANCES = [
  { id: "ac15", label: "تكييف 1.5 حصان (عادي)", watts: 1300 },
  { id: "ac225", label: "تكييف 2.25 حصان (عادي)", watts: 1900 },
  { id: "ac3", label: "تكييف 3 حصان (عادي)", watts: 2600 },
  { id: "fridge", label: "ثلاجة", watts: 150 },
  { id: "heater", label: "سخان مياه كهربائي", watts: 1500 },
  { id: "washer", label: "غسالة أوتوماتيك", watts: 500 },
  { id: "tv", label: "تلفزيون LED حوالي 43 بوصة", watts: 100 },
  { id: "fan", label: "مروحة سقف", watts: 75 },
  { id: "laptop", label: "لاب توب", watts: 65 },
  { id: "led", label: "لمبة LED", watts: 10 },
  { id: "microwave", label: "ميكروويف", watts: 1200 },
  { id: "iron", label: "مكواة", watts: 1200 },
];

export const LAST_UPDATED = "2026-11-21";

export const SOURCES: Source[] = [
  { title: "تعريفة الكهرباء (هيكل الشرائح ومقابل خدمة العملاء) — أبريل 2026", publisher: "جهاز تنظيم مرفق الكهرباء وحماية المستهلك", url: "https://egyptera.org/en/TarrifApril2026.aspx", kind: "official", effectiveDate: "2026-04-01" },
  { title: "تثبيت الشريحة الأولى وزيادة باقي الشرائح بمتوسط 12%", publisher: "وزارة الكهرباء والطاقة المتجددة", url: "http://www.moee.gov.eg/test_new/speach_info.aspx?h_id=2953&pg_index=0", kind: "official", effectiveDate: "2026-08-01" },
  { title: "بيان تعريفة الاستخدامات المنزلية الجديدة", publisher: "الهيئة العامة للاستعلامات", url: "https://sis.gov.eg/ar/المركز-الإعلامي/الأخبار/تثبيت-أسعار-الكهرباء-للشريحة-الأولى-وتعريفة-محاسبية-جديدة-لباقي-شرئح-الاستخدامات-المنزلية-بمتوسط-زيادة-12/", kind: "official", effectiveDate: "2026-08-01" },
  { title: "أسعار شرائح الكهرباء الجديدة بالتفصيل", publisher: "المصري اليوم", url: "https://www.almasryalyoum.com/news/details/4327739", kind: "secondary", effectiveDate: "2026-08-01" },
];
