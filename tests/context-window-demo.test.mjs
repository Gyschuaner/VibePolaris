import test from "node:test";
import assert from "node:assert/strict";

const frames = [
  { used: 2, limit: 16, kept: ["返程约束"] },
  { used: 13, limit: 16, kept: ["返程约束", "民宿地址"] },
  { used: 17, limit: 16, kept: [] },
  { used: 14, limit: 16, kept: ["返程约束", "民宿地址", "摘要折页"] },
];

test("context window teaching states preserve overflow and compaction boundaries", () => {
  assert.equal(frames[0].used <= frames[0].limit, true);
  assert.equal(frames[2].used > frames[2].limit, true);
  assert.equal(frames[3].used < frames[2].used, true);
  assert.deepEqual(frames[3].kept, ["返程约束", "民宿地址", "摘要折页"]);
});
