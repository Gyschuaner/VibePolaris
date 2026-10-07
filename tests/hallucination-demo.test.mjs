import assert from "node:assert/strict";
import { test } from "node:test";
import { checkEvidence } from "../lib/hallucination-demo.ts";

test("a plausible profit is blocked while the evidence field is missing", () => {
  const result = checkEvidence("profit", false);
  assert.equal(result.supported, false);
  assert.equal(result.answer, "资料不足");
  assert.equal(result.missing, "利润字段");
});

test("profit margin requires profit evidence and then follows the stated formula", () => {
  const profit = checkEvidence("profit", true);
  const margin = checkEvidence("margin", true);
  assert.deepEqual(profit, { candidate: "利润 48 万", answer: "利润 48 万", supported: true, missing: "" });
  assert.equal(checkEvidence("margin", false).supported, false);
  assert.equal(margin.supported, true);
  assert.equal(margin.answer, `利润率 ${48 / 120 * 100}%`);
});
