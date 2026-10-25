import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import test from "node:test";
import { createHash } from "node:crypto";
import postcss from "postcss";
import ts from "typescript";
import { libraryAnimations, animationCode, animationSource, animationPoster, animationCollections, animationGroups } from "../lib/library-animations.ts";
import { libraryItems, libraryHref, libraryPage, libraryGroup, filterLibrary } from "../lib/library.ts";

test("the 300 curated effects are scoped, attributable, exportable and reachable through the catalogue", () => {
  assert.equal(libraryAnimations.length, 300);
  assert.equal(libraryItems.length, 306);
  assert.equal(new Set(libraryItems.map(item => item.slug)).size, 306);
  assert.equal(readdirSync("public/library/animations").filter(file => file.endsWith(".css")).length, 300);
  const grouped = animationCollections.flatMap(collection => collection.groups);
  assert.deepEqual([...grouped].sort(), [...animationGroups].sort(), "each type must appear exactly once in the collection navigation");
  assert.equal(readdirSync("public/library/posters").filter(file => file.endsWith(".jpg")).length, 300);
  for (const item of libraryAnimations) {
    const css = readFileSync(`public/library/animations/${item.slug}.css`, "utf8");
    const name = `vp-motion-${item.slug}`;
    assert(css.includes("Permission is hereby granted"));
    assert(css.includes(item.sourceUrl));
    assert(item.sourceUrl.includes(animationSource(item).revision));
    assert(css.includes("prefers-reduced-motion"));
    assert(!/url\(|@import|<\/style/.test(css));
    assert.equal(item.previewVersion, createHash("sha256").update(css+"poster-v1"+item.label).digest("hex").slice(0, 12));
    const poster = readFileSync(`public${animationPoster(item)}`);
    assert.equal(poster.subarray(0, 3).toString("hex"), "ffd8ff", item.slug);
    assert.equal(poster.subarray(-2).toString("hex"), "ffd9", item.slug);
    const ast = postcss.parse(css), keys = new Set();
    ast.walkAtRules(rule => { if (/keyframes$/.test(rule.name)) { assert(rule.params.startsWith(name)); keys.add(rule.params); } });
    assert(keys.size > 0, item.slug);
    ast.walkRules(rule => {
      if (rule.parent.type === "atrule" && /keyframes$/.test(rule.parent.name)) return;
      for (const selector of rule.selectors) assert(selector.startsWith(`.${name}`), `${item.slug}: ${selector}`);
    });
    ast.walkDecls(decl => {
      if (/animation/.test(decl.prop)) for (const ref of decl.value.match(/vp-motion-[\w-]+/g) || []) assert(keys.has(ref), `${item.slug}: ${ref}`);
    });
    const html = animationCode(item, css, "html", 2);
    assert(html.includes(`${name}`) && html.includes("--motion-scale:0.5"));
    assert(html.includes(`>${item.label}</div>`), item.slug);
    const jsx = animationCode(item, css, "react", 2);
    const compiled = ts.transpileModule(jsx, { fileName: "sample.jsx", reportDiagnostics: true, compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } });
    assert.equal(compiled.diagnostics.filter(d => d.category === ts.DiagnosticCategory.Error).length, 0, item.slug);
  }
  assert.equal(filterLibrary("animation", "", "featured").length, 300);
  assert.equal(libraryAnimations.find(item => item.slug === "loaders-text09").label, "Loading");
  assert.equal(libraryAnimations.find(item => item.slug === "loaders-text05").label, "Load ng");
  assert.equal(libraryAnimations.find(item => item.slug === "loaders-graph08").label, "Deleting");
  assert(filterLibrary("animation", "", "featured", "入场").every(item => item.group === "入场"));
  assert.equal(libraryPage("-1"), 1);
  assert.equal(libraryPage("Infinity"), 1);
  assert.equal(libraryGroup("__proto__"), "");
  const back = new URL(libraryHref("animation", "fade", "name", undefined, 3, "入场"), "https://local");
  assert.equal(back.searchParams.get("page"), "3");
  assert.equal(back.searchParams.get("group"), "入场");
  assert.equal(filterLibrary("all", "no-such-motion-item", "featured").length, 0);
});
