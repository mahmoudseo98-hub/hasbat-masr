import { test } from "node:test";
import assert from "node:assert/strict";
import { applianceKwh, residentialBill, definition } from "./calc.ts";
import { parseValues } from "../validate.ts";

const close = (a: number, b: number, eps = 0.01) => assert.ok(Math.abs(a - b) < eps, `${a} ≠ ${b}`);

test("kWh = W × qty × h × days / 1000", () => {
  assert.equal(applianceKwh(1300, 1, 8, 30), 312);
  assert.equal(applianceKwh(10, 5, 6, 30), 9);
});

// The Ministry's 31-Jul-2026 statement implies these citizen bills; the tariff table must reproduce them.
test("energy cost reproduces ministry sample points (≈81.9 / 230.3 / 402.6 EGP)", () => {
  close(residentialBill(100).energy, 81.5, 0.5);
  close(residentialBill(200).energy, 230, 0.5);
  close(residentialBill(300).energy, 402, 0.7);
});
test("band boundaries", () => {
  close(residentialBill(50).energy, 34);
  assert.equal(residentialBill(50).fee, 1);
  assert.equal(residentialBill(101).energy, 101 * 1.15);
  assert.equal(residentialBill(651).energy, 651 * 2.4);
  assert.equal(residentialBill(1001).energy, 1001 * 2.74);
  assert.equal(residentialBill(0).fee, 9);
});

test("compute: appliance pushing household into a higher band costs more than its own kWh", () => {
  const { parsed, errors } = parseValues(definition.fields, { appliance: "ac15", quantity: "1", hours: "8", days: "30", base: "400", tariff: "aug2026" });
  assert.deepEqual(errors, {});
  const out = definition.compute(parsed);
  assert.ok(out.ok);
  // 400 → 712 kWh crosses 650: whole consumption at 2.40
  const expected = 712 * 2.4 + 25 - (200 * 1.15 + 150 * 1.72 + 50 * 2.18 + 15);
  assert.ok(out.headline.value.startsWith(new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(expected)));
});
test("compute: flat price mode", () => {
  const { parsed } = parseValues(definition.fields, { appliance: "led", quantity: "10", hours: "5", days: "30", tariff: "flat", price: "274" });
  const out = definition.compute(parsed);
  assert.ok(out.ok && out.headline.value.startsWith("41.1")); // 15 kWh × 2.74
});
test("validation: hours above 24 rejected", () => {
  const { errors } = parseValues(definition.fields, { appliance: "led", quantity: "1", hours: "25", days: "30", tariff: "aug2026" });
  assert.ok(errors.hours);
});
test("content example: AC adds ≈1,122 EGP to a 400 kWh home", () => {
  const before = residentialBill(400), after = residentialBill(712);
  close(after.energy + after.fee - before.energy - before.fee, 1121.8);
});
test("no household consumption given: cost equals the appliance's own bill (no zero-consumption fee subtracted)", () => {
  const { parsed } = parseValues(definition.fields, { appliance: "ac15", quantity: "1", hours: "8", days: "30", base: "", tariff: "aug2026" });
  const out = definition.compute(parsed);
  const alone = residentialBill(312);
  assert.ok(out.ok && out.headline.value.startsWith(new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(alone.energy + alone.fee))); // 434
});
