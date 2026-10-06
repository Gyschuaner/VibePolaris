import assert from "node:assert/strict";
import test from "node:test";
import { RETRIEVAL_BODY_TOKEN_LIMIT, retrievalChunk, retrievalTextTokens } from "../lib/xiaobei/retrieval.ts";

test("检索正文按 token 预算分页，不切开 surrogate pair", () => {
  const text = "北".repeat(20_000) + "😀" + "尾部";
  let offset = 0;
  let combined = "";
  let pages = 0;

  while (offset !== null && pages < 10) {
    const chunk = retrievalChunk(text, offset);
    assert.ok(retrievalTextTokens(chunk.text) <= RETRIEVAL_BODY_TOKEN_LIMIT);
    assert.ok(chunk.text.length > 0 || chunk.nextOffset === null);
    assert.notEqual(chunk.text.at(-1), "\ud83d");
    combined += chunk.text;
    offset = chunk.nextOffset;
    pages += 1;
  }

  assert.equal(combined, text);
  assert.equal(offset, null);
});

test("英文正文也按同一 token 预算控制", () => {
  const text = "retrieval context ".repeat(20_000);
  const chunk = retrievalChunk(text, 0);
  assert.ok(retrievalTextTokens(chunk.text) <= RETRIEVAL_BODY_TOKEN_LIMIT);
  assert.ok(chunk.nextOffset !== null);
});
