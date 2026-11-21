import { test } from "node:test";
import assert from "node:assert/strict";
import { employeeContributions, insurableWage, definition } from "./calc.ts";
import { YEARS } from "./rules.ts";
import { parseValues } from "../validate.ts";

const y2026 = YEARS.find((y) => y.year === 2026)!;
const y2027 = YEARS.find((y) => y.year === 2027)!;
const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-6, `${a} ≠ ${b}`);

test("2026 rates total 11% / 18.75%", () => {
  const c = employeeContributions(10_000, y2026);
  close(c.employee, 1_100);
  close(c.employer, 1_875);
});
test("2027 rates total 11.5% / 19.25%", () => {
  const c = employeeContributions(10_000, y2027);
  close(c.employee, 1_150);
  close(c.employer, 1_925);
});
test("wage is clamped to min and max", () => {
  assert.equal(insurableWage(1_000, y2026), 2_700);
  assert.equal(insurableWage(50_000, y2026), 16_700);
  assert.equal(insurableWage(16_700, y2026), 16_700);
});
test("max-wage employee 2026 pays 1,837", () => {
  close(employeeContributions(30_000, y2026).employee, 1_837);
});
test("self-employed 2026: 21% of chosen income", () => {
  const { parsed } = parseValues(definition.fields, { type: "self", year: "2026", wage: "5000" });
  const out = definition.compute(parsed);
  assert.ok(out.ok && out.headline.value.startsWith("1,050"));
});
test("self-employed 2027 is refused (rate unconfirmed)", () => {
  const { parsed } = parseValues(definition.fields, { type: "self", year: "2027", wage: "5000" });
  assert.equal(definition.compute(parsed).ok, false);
});
test("invalid wage input is rejected at validation", () => {
  const { errors } = parseValues(definition.fields, { type: "employee", year: "2026", wage: "abc" });
  assert.ok(errors.wage);
});
