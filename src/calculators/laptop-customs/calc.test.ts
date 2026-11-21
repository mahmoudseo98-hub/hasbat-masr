import { test } from "node:test";
import assert from "node:assert/strict";
import { dutiableInLuggage, importTaxes, definition } from "./calc.ts";
import { parseValues } from "../validate.ts";

test("VAT 14% on value + 0% duty", () => {
  const t = importTaxes(50_000);
  assert.equal(t.duty, 0);
  assert.ok(Math.abs(t.vat - 7_000) < 1e-6);
});
test("luggage allowance: 15,000 deducted, shared with other new items", () => {
  assert.equal(dutiableInLuggage(10_000, 0), 0);
  assert.equal(dutiableInLuggage(48_500, 0), 33_500);
  assert.equal(dutiableInLuggage(48_500, 20_000), 48_500); // allowance used up by other items
  assert.equal(dutiableInLuggage(20_000, 3_000), 8_000);
});
test("compute shipping: (1000 + 50) × 50 → CIF 52,500, VAT 7,350", () => {
  const { parsed, errors } = parseValues(definition.fields, { method: "shipping", price: "1000", freight: "50", fx: "50" });
  assert.deepEqual(errors, {});
  const out = definition.compute(parsed);
  assert.ok(out.ok && out.headline.value.startsWith("7,350"));
});
test("compute used personal laptop: zero fees, no price needed", () => {
  const { parsed, errors } = parseValues(definition.fields, { method: "luggage-used" });
  assert.deepEqual(errors, {});
  const out = definition.compute(parsed);
  assert.ok(out.ok && out.headline.value.startsWith("0"));
});
test("missing exchange rate is a validation error", () => {
  const { errors } = parseValues(definition.fields, { method: "shipping", price: "1000", freight: "0", fx: "" });
  assert.ok(errors.fx);
});
