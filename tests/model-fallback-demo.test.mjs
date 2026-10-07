import test from "node:test";
import assert from "node:assert/strict";
import { getFallbackRelayState } from "../lib/model-fallback-demo.ts";

test("the relay starts with only the primary clasp active", () => {
  const state = getFallbackRelayState(0, "rate", "valid", 2);
  assert.equal(state.status, "primary");
  assert.equal(state.segments[0].state, "active");
  assert.equal(state.segments[1].state, "locked");
});

test("a 429 can open the policy clasp and relay to a compatible backup", () => {
  const state = getFallbackRelayState(3, "rate", "valid", 2);
  assert.equal(state.status, "relayed");
  assert.equal(state.policyAllowed, true);
  assert.equal(state.segments[2].state, "active");
});

test("a valid backup must pass the amount field check", () => {
  assert.equal(getFallbackRelayState(4, "rate", "valid", 2).status, "verified");
  assert.equal(getFallbackRelayState(4, "rate", "invalid", 2).status, "stopped");
});

test("auth failures and unsupported backups stop before a second call", () => {
  for (const args of [["auth", "valid", 2], ["rate", "unsupported", 2], ["rate", "valid", 1]]) {
    const state = getFallbackRelayState(3, args[0], args[1], args[2]);
    assert.equal(state.policyAllowed, false);
    assert.equal(state.status, "stopped");
    assert.equal(state.backupReceipt, args[1] === "valid" ? '{"amount":120}' : args[1] === "unsupported" ? "无法按要求返回" : '{"amount":120}');
  }
});

test("timeout remains distinct from a 429 and keeps the uncertainty visible", () => {
  const state = getFallbackRelayState(1, "timeout", "valid", 2);
  assert.equal(state.primaryReceipt, "未收到响应");
  assert.match(state.statusDetail, /不等于收到了 429/);
});
