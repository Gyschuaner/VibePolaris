import assert from "node:assert/strict";
import test from "node:test";
import { harnessPlayer as reduce, initialHarnessPlayer as initial, copyHarnessText } from "../lib/harness-player.ts";

test("Harness 播放只能由用户启动，播放结束停止且不会越过终点", () => {
  assert.deepEqual(reduce(initial, { type: "tick" }), initial);
  let state = reduce(initial, { type: "play" });
  for (let i = 1; i <= 4; i++) { state = reduce(state, { type: "tick" }); assert.equal(state.step, i); }
  assert.equal(state.playing, false);
  assert.deepEqual(reduce(state, { type: "tick" }), state);
  assert.equal(reduce(state, { type: "next" }).step, 4);
  assert.deepEqual(reduce(state, { type: "play" }), { mode: "with", step: 0, playing: true });
});
test("暂停、重来及模式切换后，迟到的时钟事件不得推进演示", () => {
  const running = reduce(reduce(initial, { type: "play" }), { type: "tick" });
  for (const action of [{type:"play"}, {type:"reset"}, {type:"mode",mode:"without"}, {type:"select",step:3}]) {
    const stopped = reduce(running, action);
    assert.equal(stopped.playing, false);
    assert.deepEqual(reduce(stopped, {type:"tick"}), stopped);
  }
  const without = reduce(running, {type:"mode",mode:"without"});
  assert.equal(without.step, 0);
  assert.deepEqual(reduce(reduce(without,{type:"play"}),{type:"tick"}), {mode:"without",step:1,playing:false});
});
test("减少动态效果时两种模式即时完成，播放中切换偏好也会停止", () => {
  assert.deepEqual(reduce(initial, {type:"play",reduced:true}), {mode:"with",step:4,playing:false});
  const without = reduce(initial,{type:"mode",mode:"without"});
  assert.deepEqual(reduce(without,{type:"play",reduced:true}), {mode:"without",step:1,playing:false});
  assert.equal(reduce(reduce(initial,{type:"play"}),{type:"tick",reduced:true}).playing,false);
});
test("剪贴板不可用、权限拒绝和重试均返回可显示的状态且不丢失正文", async () => {
  assert.equal(await copyHarnessText("正文"), "failed");
  assert.equal(await copyHarnessText("正文", {writeText:async()=>{throw new Error("denied");}}), "failed");
  let received;
  assert.equal(await copyHarnessText("正文\n第二行", {writeText:async text=>{received=text;}}), "copied");
  assert.equal(received,"正文\n第二行");
});
