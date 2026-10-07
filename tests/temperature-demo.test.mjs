import assert from "node:assert/strict";
import { test } from "node:test";
import { temperatureDistribution, pickTemperatureCandidate } from "../lib/temperature-demo.ts";

test("temperature changes the candidate areas for the same draw", () => {
  const cold = temperatureDistribution(0.5);
  const base = temperatureDistribution(1);
  const hot = temperatureDistribution(2);
  for (const probabilities of [cold, base, hot]) assert.ok(Math.abs(probabilities.reduce((sum, value) => sum + value, 0) - 1) < 1e-12);
  assert.ok(cold[0] > base[0] && base[0] > hot[0]);
  assert.ok(cold[2] < base[2] && base[2] < hot[2]);
  assert.equal(pickTemperatureCandidate(cold, 0.62), 0);
  assert.equal(pickTemperatureCandidate(hot, 0.62), 1);
  assert.equal(pickTemperatureCandidate(cold, 0.999), 2);
});
