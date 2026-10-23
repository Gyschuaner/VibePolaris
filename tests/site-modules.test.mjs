import assert from "node:assert/strict";
import test from "node:test";
import { siteHome, siteModules } from "../lib/site-modules.ts";

test("all five switches remain independent and disabled pages never become a redirect destination", () => {
  assert.deepEqual(Object.keys(siteModules).sort(), ["about", "canvas", "graph", "news", "notes"]);
  assert.ok(Object.values(siteModules).every(value => typeof value === "boolean"));
  const keys = Object.keys(siteModules);
  const destinations = { "/": "graph", "/canvas": "canvas", "/news": "news", "/about": "about" };
  for (let mask = 0; mask < 32; mask++) {
    const flags = Object.fromEntries(keys.map((key, bit) => [key, Boolean(mask & (1 << bit))]));
    const destination = siteHome(flags);
    if (destination === "/me") assert.ok(Object.values(destinations).every(key => !flags[key]));
    else assert.equal(flags[destinations[destination]], true, `disabled destination for configuration ${mask}`);
    assert.equal(siteHome({ ...flags, notes: !flags.notes }), destination);
  }
});
