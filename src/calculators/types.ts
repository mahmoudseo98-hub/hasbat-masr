// Shared types for every calculator: input fields, results, regulatory sources and page content.

export type Values = Record<string, string>;
export type Parsed = Record<string, number | string>;

interface FieldBase {
  name: string;
  label: string;
  help?: string;
  /** Hide the field (and skip its validation) unless this returns true. */
  showIf?: (v: Values) => boolean;
}
export interface NumberField extends FieldBase {
  type: "number";
  unit?: string;
  min?: number;
  max?: number;
  placeholder?: string;
  default?: string;
  optional?: boolean;
}
export interface SelectField extends FieldBase {
  type: "select";
  options: { value: string; label: string }[];
  default: string;
}
export type Field = NumberField | SelectField;

export interface Row {
  label: string;
  value: string;
  note?: string;
  emphasis?: boolean;
}
export type CalcOutput =
  | {
      ok: true;
      headline: { label: string; value: string; sub?: string };
      highlights?: { label: string; value: string }[];
      breakdown: Row[];
      notes?: string[];
    }
  | { ok: false; errors: Record<string, string> };

export interface CalculatorDefinition {
  fields: Field[];
  compute: (input: Parsed) => CalcOutput;
}

export interface Source {
  title: string;
  publisher: string;
  url: string;
  /** official = government body, law text or the bank itself; secondary = reputable press/advisory. */
  kind: "official" | "secondary";
  effectiveDate?: string;
}

export type Block =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] };

export type CategoryId = "taxes" | "customs" | "electricity" | "banking" | "insurance" | "travel";

export interface CalculatorContent {
  id: string;
  slug: string;
  category: CategoryId;
  /** H1 */
  title: string;
  /** Card / nav label */
  shortTitle: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  /** Direct answer shown under the H1. */
  intro: string;
  howTo: string[];
  methodology: Block[];
  example: { title: string; blocks: Block[] };
  assumptions: string[];
  faqs: { q: string; a: string }[];
  sources: Source[];
  lastUpdated: string;
  /** "verified" = every rate traced to a source; "prototype" = some inputs need verification. */
  status: "verified" | "prototype";
  related: string[];
  popular?: boolean;
  /** Affiliate/partner links; rendered with rel="sponsored" and a visible label. Empty until deals exist. */
  partnerLinks?: { label: string; url: string }[];
}
