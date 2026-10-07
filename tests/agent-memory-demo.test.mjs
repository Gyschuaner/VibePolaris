import test from "node:test";
import assert from "node:assert/strict";
import { getMemoryDrawerState } from "../lib/agent-memory-demo.ts";

test("a preference starts outside the drawer until the user agrees", () => {
  const state = getMemoryDrawerState(0);
  assert.equal(state.status, "ask");
  assert.equal(state.cardState, "outside");
  assert.match(state.statusDetail, /不能悄悄/);
});

test("saving adds one scoped card without exporting the other card", () => {
  const state = getMemoryDrawerState(1);
  assert.equal(state.status, "saved");
  assert.equal(state.drawerCount, 2);
  assert.match(state.cardDetail, /scope=code/);
});

test("retrieval and insertion are separate moments", () => {
  assert.equal(getMemoryDrawerState(2).cardState, "retrieved");
  assert.match(getMemoryDrawerState(2).promptLabel, /等待放入/);
  assert.equal(getMemoryDrawerState(3).cardState, "inserted");
  assert.match(getMemoryDrawerState(3).promptLabel, /context/);
});

test("correction changes future value while retaining the old output", () => {
  const state = getMemoryDrawerState(4, "Python");
  assert.equal(state.value, "Python");
  assert.match(state.outputLabel, /TypeScript/);
  assert.match(state.statusDetail, /过去/);
});

test("deleting removes future retrieval but does not erase the old answer", () => {
  const state = getMemoryDrawerState(5, "Python", true);
  assert.equal(state.status, "deleted");
  assert.equal(state.drawerCount, 1);
  assert.match(state.outputLabel, /重新说明/);
  assert.match(state.statusDetail, /仍保持原样/);
});
