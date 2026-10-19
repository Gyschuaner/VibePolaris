import assert from "node:assert/strict";
import test from "node:test";
import { navigationSection } from "../lib/site-navigation.ts";

test("navigation follows route sections without matching unrelated path prefixes", () => {
  for (const path of ["/", "/terms/harness", "/guides/css"]) assert.equal(navigationSection(path), "graph");
  for (const section of ["canvas", "news", "about"]) {
    assert.equal(navigationSection(`/${section}`), section);
    assert.equal(navigationSection(`/${section}/article`), section);
    assert.equal(navigationSection(`/${section}-other`), null);
  }
  assert.equal(navigationSection("/missing"), null);
});
