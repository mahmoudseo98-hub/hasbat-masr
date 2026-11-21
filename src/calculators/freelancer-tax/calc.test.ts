import { test } from "node:test";
import assert from "node:assert/strict";
import { progressiveTax, simplifiedTax, definition } from "./calc.ts";
import { parseValues } from "../validate.ts";

// Reference values published by Global Kinect / consistent with Deloitte's reading of Law 7/2024.
test("600,000 net income → 124,750 (full table)", () => {
  assert.equal(progressiveTax(600_000).tax, 124_750);
});
test("600,010 net income → 128,752.50 (0% bracket eliminated)", () => {
  assert.equal(progressiveTax(600_010).tax, 128_752.5);
});
test("boundaries: 40,000 → 0; 55,000 → 1,500", () => {
  assert.equal(progressiveTax(40_000).tax, 0);
  assert.equal(progressiveTax(55_000).tax, 1_500);
});
test("net income is rounded down to nearest 10", () => {
  assert.equal(progressiveTax(55_009).taxable, 55_000);
});
test(">1.2M: 25% on first 1.2M then 27.5%", () => {
  assert.equal(progressiveTax(2_000_000).tax, 1_200_000 * 0.25 + 800_000 * 0.275);
});
test(">900k ≤1.2M: 22.5% on first 400k, 25% above", () => {
  assert.equal(progressiveTax(1_000_000).tax, 400_000 * 0.225 + 600_000 * 0.25);
});
test("zero and negative income → no tax", () => {
  assert.equal(progressiveTax(0).tax, 0);
  assert.equal(progressiveTax(-5).tax, 0);
});

test("simplified bands: whole turnover at band rate", () => {
  assert.equal(simplifiedTax(499_999)!.rate, 0.004);
  assert.equal(simplifiedTax(500_000)!.rate, 0.005);
  assert.equal(simplifiedTax(3_000_000)!.rate, 0.01);
  assert.equal(simplifiedTax(20_000_000)!.rate, 0.015);
  assert.equal(simplifiedTax(20_000_001), null);
});

test("compute: costs above revenue is a validation error", () => {
  const { parsed } = parseValues(definition.fields, { revenue: "1000", costMethod: "actual", costs: "2000", concentration: "no" });
  assert.equal(definition.compute(parsed).ok, false);
});
test("compute: 600k revenue, deemed costs → simplified (0.5% = 3,000) beats progressive", () => {
  const { parsed } = parseValues(definition.fields, { revenue: "600000", costMethod: "deemed", concentration: "no" });
  const out = definition.compute(parsed);
  assert.ok(out.ok && out.headline.value.startsWith("3,000"));
});
test("compute: concentrated consulting → simplified not available", () => {
  const { parsed } = parseValues(definition.fields, { revenue: "600000", costMethod: "deemed", concentration: "yes" });
  const out = definition.compute(parsed);
  assert.ok(out.ok && out.highlights!.some((h) => h.value === "غير متاح"));
});
test("content example: 540,000 net → 109,750", () => {
  assert.equal(progressiveTax(540_000).tax, 109_750);
});
