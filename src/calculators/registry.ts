// Client-safe map of calculator logic. Adding a calculator = add its folder + one line here + one line in content/index.ts.
import type { CalculatorDefinition } from "./types.ts";
import { definition as freelancerTax } from "./freelancer-tax/calc.ts";
import { definition as laptopCustoms } from "./laptop-customs/calc.ts";
import { definition as bankCertificates } from "./bank-certificates/calc.ts";
import { definition as electricityAppliances } from "./electricity-appliances/calc.ts";
import { definition as socialInsurance } from "./social-insurance/calc.ts";

export const DEFINITIONS: Record<string, CalculatorDefinition> = {
  "freelancer-tax": freelancerTax,
  "laptop-customs": laptopCustoms,
  "bank-certificates": bankCertificates,
  "electricity-appliances": electricityAppliances,
  "social-insurance": socialInsurance,
};
