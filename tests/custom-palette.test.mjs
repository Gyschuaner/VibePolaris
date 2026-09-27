import assert from "node:assert/strict";
import test from "node:test";

import { CUSTOM_TOKEN_NAMES, deriveCustomPaletteTokens } from "../lib/custom-palette.ts";

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => Number.parseInt(value, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("自定义主题色在全部色相与饱和度下自动收敛到可读亮度", () => {
  for (let hue = 0; hue < 360; hue += 15) {
    for (const sat of [10, 45, 80, 100]) {
      const light = deriveCustomPaletteTokens(hue, sat, "light");
      assert.ok(light, `light ${hue}/${sat} 应能推导`);
      for (const name of CUSTOM_TOKEN_NAMES) assert.match(light[name], /^#[0-9a-f]{6}$/);
      assert.ok(
        contrast(light["--accent-text"], "#E7E4DC") >= 4.5,
        `light ${hue}/${sat}：${light["--accent-text"]} 与最暗亮色底对比度不足`,
      );
      const dark = deriveCustomPaletteTokens(hue, sat, "dark");
      assert.ok(dark, `dark ${hue}/${sat} 应能推导`);
      for (const name of CUSTOM_TOKEN_NAMES) assert.match(dark[name], /^#[0-9a-f]{6}$/);
      assert.ok(
        contrast(dark["--accent"], "#1F1A13") >= 4.5,
        `dark ${hue}/${sat}：${dark["--accent"]} 与最亮夜间底对比度不足`,
      );
    }
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
  assert.match(layout, /__vpDeriveCustomPaletteTokens/);
});
