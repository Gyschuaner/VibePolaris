import assert from "node:assert/strict";
import test from "node:test";
import { feedback, frames, initialSimulation as initial, makeSummary, simulation as reduce, validateSummary } from "../lib/harness-simulation.ts";

test("首稿确实遗漏共同编辑；修订同时补内容和来源，验收由数据计算", () => {
  const draft = makeSummary(false);
  assert.deepEqual(validateSummary(draft), { missing: ["06"], covered: 5, passed: false });
  assert.equal(draft[2].text.includes("编辑"), false);
  const repaired = makeSummary(true);
  assert.equal(repaired[2].text.includes("编辑"), true);
  assert.deepEqual(validateSummary(repaired), { missing: [], covered: feedback.length, passed: true });
  assert.equal(draft[2].ids.includes("06"), false, "不得回写首稿");
  for (const invalid of [
    [...repaired.slice(0, 2)],
    repaired.map((group, i) => i === 0 ? { ...group, ids: [...group.ids, "99"] } : group),
    repaired.map((group, i) => i === 0 ? { ...group, ids: [...group.ids, "01"] } : group),
  ]) assert.equal(validateSummary(invalid).passed, false);
});
test("完整播放必经失败、返工、重新验收，终点停止；重播不沿用结果", () => {
  let state = reduce(initial, { type: "play" });
  const visited = [];
  while (state.playing) { visited.push(frames[state.frame].phase); state = reduce(state, { type: "tick" }); }
  assert.deepEqual(visited, ["request", "read", "draft", "check", "repair", "verify"]);
  assert.equal(frames[state.frame].phase, "done");
  assert.deepEqual(reduce(state, {type:"tick"}), state);
  assert.equal(reduce(state, {type:"play"}).frame, 1);
});
test("暂停、切换环境、重置均阻止迟到事件；无工具不会生成结果", () => {
  const running = reduce(initial, {type:"play"});
  for (const action of [{type:"play"}, {type:"reset"}, {type:"mode",mode:"without"}, {type:"next"}]) {
    const stopped = reduce(running,action);
    assert.equal(stopped.playing,false);
    assert.deepEqual(reduce(stopped,{type:"tick"}),stopped);
  }
  let state = reduce(initial,{type:"mode",mode:"without"});
  state = reduce(reduce(state,{type:"play"}),{type:"tick"});
  assert.deepEqual(state,{mode:"without",frame:1,playing:false});
  assert.deepEqual(reduce(state,{type:"next"}),state);
});
test("减少动态效果即时抵达正确结果，单步仍能逐个检查中间态", () => {
  assert.deepEqual(reduce(initial,{type:"play",reduced:true}),{mode:"with",frame:7,playing:false});
  let state = initial;
  for (let i = 1; i <= 7; i++) { state = reduce(state,{type:"next"}); assert.equal(state.frame,i); assert.equal(state.playing,false); }
  assert.equal(reduce(reduce(initial,{type:"play"}),{type:"tick",reduced:true}).playing,false);
});
