import assert from "node:assert/strict";
import test from "node:test";
import { copyHarnessText } from "../lib/harness-player.ts";

test("剪贴板不可用、权限拒绝和重试均返回可显示的状态且不丢失正文", async () => {
  assert.equal(await copyHarnessText("正文"), "failed");
  assert.equal(await copyHarnessText("正文", {writeText:async()=>{throw new Error("denied");}}), "failed");
  let received;
  assert.equal(await copyHarnessText("正文\n第二行", {writeText:async text=>{received=text;}}), "copied");
  assert.equal(received,"正文\n第二行");
});
