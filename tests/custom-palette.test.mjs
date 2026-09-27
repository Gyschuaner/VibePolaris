import assert from "node:assert/strict";
import test from "node:test";

import { CUSTOM_TOKEN_NAMES, deriveCustomPaletteTokens, fieldLightness } from "../lib/custom-palette.ts";

test("自定义主题主色在昼夜模式和明度端点都严格保留所选值", () => {
  const selections = [
    [300, 80, 0, "#000000"],
    [300, 80, 50, "#e619e6"],
    [210, 65, 40, "#2466a8"],
    [300, 80, 100, "#ffffff"],
  ];
  for (const mode of ["light", "dark"]) {
    for (const [hue, sat, light, expected] of selections) {
      const tokens = deriveCustomPaletteTokens(hue, sat, mode, light);
      assert.ok(tokens, `${mode} ${hue}/${sat}/${light} 应能推导`);
      assert.equal(tokens["--accent"], expected);
      assert.equal(tokens["--accent-text"], expected);
      for (const name of CUSTOM_TOKEN_NAMES) assert.match(tokens[name], /^#[0-9a-f]{6}$/);
    }
  }
});

test("色域明度剖面保留中性中心并让滑条端点覆盖全量程", () => {
  assert.equal(fieldLightness(0, 0), 0);
  assert.equal(fieldLightness(0, 100), 100);
  assert.equal(fieldLightness(100, 100), 40);
  assert.equal(fieldLightness(100, 0), 0);
  assert.equal(fieldLightness(Number.NaN, Number.NaN), 55);

  for (const mode of ["light", "dark"]) {
    const neutral = deriveCustomPaletteTokens(180, 0, mode, 50);
    assert.ok(neutral);
    const [red, green, blue] = neutral["--accent"].slice(1).match(/../g);
    assert.equal(red, green);
    assert.equal(green, blue);
  }
});

test("越界或非数字的自定义色输入安全返回 null", () => {
  assert.equal(deriveCustomPaletteTokens(-1, 50, "light"), null);
  assert.equal(deriveCustomPaletteTokens(361, 50, "light"), null);
  assert.equal(deriveCustomPaletteTokens(120, 101, "light"), null);
  assert.equal(deriveCustomPaletteTokens(Number.NaN, 50, "light"), null);
  assert.equal(deriveCustomPaletteTokens(120, Number.NaN, "dark"), null);
});

test("引导脚本内联的推导函数与 lib 实现同源", async () => {
  const { readFileSync } = await import("node:fs");
  const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.match(layout, /deriveCustomPaletteTokens\.toString\(\)/);
  assert.match(layout, /fieldLightness\.toString\(\)/);
  assert.match(layout, /__vpDeriveCustomPaletteTokens/);
  assert.match(layout, /__vpFieldLightness/);
  assert.match(layout, /customParts\[2\]/);
});
