// Display formatting. Western digits (0-9) everywhere so typed inputs and results look the same;
// switch LOCALE to "ar-EG" for Arabic-Indic digits (٠١٢٣).
const LOCALE = "ar-EG-u-nu-latn";

export function formatNumber(n: number, maxFractionDigits = 0) {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: maxFractionDigits }).format(n);
}

/**
 * EGP amount. Estimates: whole pounds for large values to avoid misleading precision, piasters for small ones.
 * `exact` keeps piasters for amounts that are paid exactly (e.g. a certificate's monthly payout).
 */
export function formatEGP(n: number, exact = false) {
  const digits = exact || Math.abs(n) < 100 ? 2 : 0;
  return `${formatNumber(n, digits)} جنيه`;
}

export function formatPercent(rate: number, maxFractionDigits = 2) {
  return `${formatNumber(rate * 100, maxFractionDigits)}%`;
}

export function formatDateAr(iso: string) {
  return new Intl.DateTimeFormat(LOCALE, { year: "numeric", month: "long", day: "numeric" }).format(
    new Date(iso + "T00:00:00Z"),
  );
}

/**
 * Parse a user-typed number: accepts Arabic-Indic (٠-٩) and Persian digits, Arabic/Latin
 * thousands separators and the Arabic decimal mark. Returns NaN for anything else.
 */
export function parseUserNumber(raw: string): number {
  const s = raw
    .trim()
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
    .replace(/[,،٬\s]/g, "")
    .replace(/٫/g, ".");
  if (!/^-?\d*\.?\d+$/.test(s)) return NaN;
  return Number(s);
}
