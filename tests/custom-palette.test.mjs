import assert from "node:assert/strict";
import test from "node:test";

import { CUSTOM_TOKEN_NAMES, deriveCustomPaletteTokens, fieldLightness } from "../lib/custom-palette.ts";

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => Number.parseInt(value, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("自定义主题色在完整色相、饱和度和明度范围内满足对比度", () => {
  for (let hue = 0; hue < 360; hue += 15) {
    for (const sat of [0, 25, 50, 75, 100]) {
      for (const sliderLight of [0, 25, 50, 75, 100]) {
        const lightChoice = fieldLightness(sat, sliderLight);
        const light = deriveCustomPaletteTokens(hue, sat, "light", lightChoice);
        assert.ok(light, `light ${hue}/${sat}/${sliderLight} 应能推导`);
        for (const name of CUSTOM_TOKEN_NAMES) assert.match(light[name], /^#[0-9a-f]{6}$/);
        assert.ok(
          contrast(light["--accent-text"], "#E7E4DC") >= 4.5,
          `light ${hue}/${sat}/${sliderLight}：${light["--accent-text"]} 与最暗亮色底对比度不足`,
        );
        const dark = deriveCustomPaletteTokens(hue, sat, "dark", lightChoice);
        assert.ok(dark, `dark ${hue}/${sat}/${sliderLight} 应能推导`);
        for (const name of CUSTOM_TOKEN_NAMES) assert.match(dark[name], /^#[0-9a-f]{6}$/);
        assert.ok(
          contrast(dark["--accent-text"], "#1F1A13") >= 4.5,
          `dark ${hue}/${sat}/${sliderLight}：${dark["--accent-text"]} 与最亮夜间底对比度不足`,
        );
      }
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
