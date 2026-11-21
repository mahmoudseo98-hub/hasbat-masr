import { test } from "node:test";
import assert from "node:assert/strict";
import { certificateReturn, definition } from "./calc.ts";
import { parseValues } from "../validate.ts";

test("fixed monthly: 100,000 at 18.75% pays 1,562.50 per month (matches press arithmetic)", () => {
  const r = certificateReturn(100_000, [0.1875, 0.1875, 0.1875], "monthly");
  assert.equal(r.perYear[0].perPayout, 1562.5);
  assert.equal(r.totalReturn, 56_250);
  assert.equal(r.totalAtMaturity, 156_250);
});

test("declining annual: Ibn Masr 22/17.5/13.25 on 100,000", () => {
  const r = certificateReturn(100_000, [0.22, 0.175, 0.1325], "annual");
  assert.deepEqual(r.perYear.map((y) => Math.round(y.perPayout)), [22_000, 17_500, 13_250]);
  assert.equal(Math.round(r.totalReturn), 52_750);
});

test("quarterly divides the annual rate by 4", () => {
  const r = certificateReturn(10_000, [0.1885], "quarterly");
  assert.equal(r.perYear[0].perPayout, 471.25);
});

test("rejects non-positive principal", () => {
  assert.throws(() => certificateReturn(0, [0.2], "monthly"));
});

test("compute: amount below the certificate minimum is an error", () => {
  const { parsed } = parseValues(definition.fields, { amount: "500", certificate: "bm-qimma-m" });
  const out = definition.compute(parsed);
  assert.equal(out.ok, false);
});

test("compute: custom certificate uses typed rate and years", () => {
  const { parsed, errors } = parseValues(definition.fields, { amount: "٥٠٬٠٠٠", certificate: "custom", rate: "20", years: "2", payout: "annual" });
  assert.deepEqual(errors, {});
  const out = definition.compute(parsed);
  assert.ok(out.ok && out.headline.value.includes("10,000"));
});

test("compute: fractional years rejected", () => {
  const { parsed } = parseValues(definition.fields, { amount: "1000", certificate: "custom", rate: "20", years: "1.5", payout: "annual" });
  assert.equal(definition.compute(parsed).ok, false);
});
