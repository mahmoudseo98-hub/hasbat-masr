import { test } from "node:test";
import assert from "node:assert/strict";
import { formatDateAr, parseUserNumber } from "./format.ts";

test("dates don't shift with the build machine's time zone", () => {
  assert.ok(formatDateAr("2026-11-21").startsWith("21"));
});
test("parses Arabic-Indic digits and separators", () => {
  assert.equal(parseUserNumber("١٠٠٬٠٠٠"), 100_000);
  assert.equal(parseUserNumber("12٫5"), 12.5);
  assert.ok(Number.isNaN(parseUserNumber("abc")));
});
