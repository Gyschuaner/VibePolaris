import assert from "node:assert/strict";
import test from "node:test";
import { readNewsPosition } from "../lib/news-navigation.ts";

test("新闻返回位置保留筛选和列表位置；缺失、损坏或旧格式缓存不影响阅读", () => {
  const position = { rangePreset: "custom", customStart: "2026-09-01", customEnd: "2026-10-23", mobileView: "list", selectedSlug: "example", page: 1250, list: 320 };
  assert.deepEqual(readNewsPosition(JSON.stringify(position)), position);
  for (const invalid of [null, "{", "{}", JSON.stringify({ ...position, rangePreset: "all" }), JSON.stringify({ ...position, page: -1 }), JSON.stringify({ ...position, customEnd: "2026-02-30" })]) assert.equal(readNewsPosition(invalid), null);
});
