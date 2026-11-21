import { test } from "node:test";
import assert from "node:assert/strict";
import { content as tax } from "../calculators/freelancer-tax/content.ts";
import { content as insurance } from "../calculators/social-insurance/content.ts";
import type { Block } from "../calculators/types.ts";

const tables = (blocks: Block[]) => blocks.filter((b) => b.type === "table").map((b) => (b as Extract<Block, { type: "table" }>).rows);

test("tax tables are generated from rules with the published values", () => {
  const [brackets, bands] = tables(tax.methodology);
  assert.deepEqual(brackets[0], ["حتى 40,000 جنيه", "0%"]);
  assert.deepEqual(brackets[4], ["200,000 – 400,000", "22.5%"]);
  assert.deepEqual(brackets.at(-1), ["أكثر من 1,200,000", "27.5%"]);
  assert.deepEqual(bands[0], ["أقل من 500,000 جنيه", "0.4%"]);
  assert.deepEqual(bands.at(-1), ["10,000,000 – 20,000,000", "1.5%"]);
});
test("insurance tables are generated from rules", () => {
  const [branches, limits] = tables(insurance.methodology);
  assert.deepEqual(branches.at(-1), ["الإجمالي 2026", "18.75%", "11%"]);
  assert.ok(branches.some((r) => r[0] === "إصابات العمل" && r[2] === "—"));
  assert.deepEqual(limits[0].slice(0, 3), ["2026", "2,700", "16,700"]);
});
