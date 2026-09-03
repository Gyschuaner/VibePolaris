import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
const component = read("components/ThemeStudio.tsx");
const css = read("app/globals.css");
const layout = read("app/layout.tsx");

const backgroundColors = ["#F7F3E8", "#EFE5D2", "#E7E4DC", "#EEF0EE", "#E8EDF2"];
const accentColors = ["#52683F", "#58627C", "#9A6248", "#355D57", "#6C5A68"];
const accentTextColors = ["#52683F", "#58627C", "#8C5942", "#355D57", "#6C5A68"];

function luminance(hex) {
  const channels = hex.slice(1).match(/../g).map((value) => Number.parseInt(value, 16) / 255);
  const linear = channels.map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

test("主题画板使用指定的五档背景与五档主题色", () => {
  for (const color of [...backgroundColors, ...accentColors]) {
    assert.match(component, new RegExp(color, "i"));
  }
  assert.match(css, /#191C18/);
  assert.match(css, /#EEEBDD/);
  assert.match(css, /#B6CC32/);
  assert.match(component, /label="背景"/);
  assert.match(component, /label="主题色"/);
  assert.doesNotMatch(component, /type="color"/);
});

test("正文与全部亮色背景满足 WCAG AA，主题色作为非文本 UI 满足 3:1", () => {
  for (const [backgroundIndex, background] of backgroundColors.entries()) {
    assert.ok(contrast("#171A15", background) >= 4.5, `${background} 的正文对比度不足`);
    for (const [accentIndex, accent] of accentColors.entries()) {
      assert.ok(contrast(accent, background) >= 3, `${accent} 与 ${background} 的非文本对比度不足`);
      assert.ok(
        contrast(accentTextColors[accentIndex], backgroundColors[backgroundIndex]) >= 4.5,
        `${accentTextColors[accentIndex]} 与 ${background} 的文本对比度不足`,
      );
    }
  }
  assert.ok(contrast("#EEEBDD", "#191C18") >= 4.5);
  assert.ok(contrast("#B6CC32", "#191C18") >= 3);
});

test("色带使用离散单选语义、罗盘刻度和完整键盘操作", () => {
  assert.match(component, /role="radiogroup"/);
  assert.match(component, /role="radio"/);
  assert.match(component, /aria-checked/);
  assert.match(component, /ArrowLeft/);
  assert.match(component, /ArrowRight/);
  assert.match(component, /Home/);
  assert.match(component, /End/);
  assert.match(component, /Escape/);
  assert.match(component, /theme-scale-caret/);
  assert.match(component, /theme-scale-needle/);
  assert.match(component, /theme-scale-tick/);
});

test("夜晚往返保留亮色选择并持久化，旧配色安全迁移", () => {
  assert.match(component, /persist\(nextMode, background, accent\)/);
  assert.match(component, /localStorage\.setItem\("vp-background"/);
  assert.match(component, /localStorage\.setItem\("vp-palette"/);
  assert.match(component, /localStorage\.setItem\("vp-theme"/);
  assert.match(layout, /legacyPalettes = \{ sprout: 'pine', pomelo: 'moss' \}/);
  assert.match(layout, /backgrounds\[background\] \? background : 'paper'/);
  assert.match(layout, /matchMedia\('\(prefers-color-scheme: dark\)'\)/);
});

test("昼夜图标无可见按钮框并以 240ms 变换，低动效即时降级", () => {
  assert.match(component, /theme-mode-moon/);
  assert.match(component, /theme-mode-sun/);
  assert.match(css, /\.theme-mode-button[\s\S]*border: 0;[\s\S]*background: transparent/);
  assert.match(css, /\.theme-mode-icons svg[\s\S]*240ms/);
  assert.match(css, /rotate\(35deg\) scale\(\.86\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*\.theme-mode-icons svg,[\s\S]*transition: none/);
});
