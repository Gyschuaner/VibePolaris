import assert from "node:assert/strict";
import { test } from "node:test";
import { teachingSample, teachingTexts, teachingTokenCount } from "../lib/tokenization-demo.ts";

test("same text can have different teaching boundaries under different encoders", () => {
  const bpe = teachingSample("CSS 很好用", "bpe");
  const word = teachingSample("CSS 很好用", "word");
  assert.equal(bpe.length, 5);
  assert.equal(word.length, 3);
  assert.notDeepEqual(bpe.map((token) => token.text), word.map((token) => token.text));
  assert.equal(bpe.map((token) => token.text).join(""), "CSS 很好用");
  assert.equal(word.map((token) => token.text).join(""), "CSS 很好用");
});

test("editing whitespace changes the local token sequence", () => {
  assert.equal(teachingTokenCount("CSS很好用", "bpe"), 4);
  assert.equal(teachingTokenCount("CSS 很好用", "bpe"), 5);
  assert.equal(teachingTexts.length, 3);
});
