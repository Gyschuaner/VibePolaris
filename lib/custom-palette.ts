/**
 * 自定义主题色推导。
 *
 * deriveCustomPaletteTokens 会被 layout.tsx 以 toString() 内联进首屏引导脚本，
 * 因此必须保持完全自包含：不引用模块内其他导出，只使用参数与函数内部定义。
 */

export const CUSTOM_TOKEN_NAMES = [
  "--accent",
  "--accent-text",
  "--accent-strong",
  "--accent-ink",
  "--brand-trail",
  "--brand-star",
  "--tint",
] as const;

export type CustomPaletteTokens = Record<(typeof CUSTOM_TOKEN_NAMES)[number], string>;

export type ThemeMode = "light" | "dark";

/**
 * 由用户选择的色相/饱和度推导整套主题色 Token。
 * 明暗两套自动在保持色相的同时收敛亮度：文本色对最差底色满足 WCAG AA 4.5:1。
 */
export function deriveCustomPaletteTokens(hue: number, sat: number, mode: ThemeMode): CustomPaletteTokens | null {
  const HUE = Number(hue);
  const SAT = Number(sat);
  if (!Number.isFinite(HUE) || !Number.isFinite(SAT) || HUE < 0 || HUE > 360 || SAT < 0 || SAT > 100) return null;

  function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
  }
  function hslRgb(h: number, s: number, l: number): [number, number, number] {
    const sn = clamp(s, 0, 100) / 100;
    const ln = clamp(l, 0, 100) / 100;
    const chroma = (1 - Math.abs(2 * ln - 1)) * sn;
    const sector = ((((h % 360) + 360) % 360) / 60);
    const secondary = chroma * (1 - Math.abs((sector % 2) - 1));
    const match = ln - chroma / 2;
    let rgb: [number, number, number] = [0, 0, 0];
    if (sector < 1) rgb = [chroma, secondary, 0];
    else if (sector < 2) rgb = [secondary, chroma, 0];
    else if (sector < 3) rgb = [0, chroma, secondary];
    else if (sector < 4) rgb = [0, secondary, chroma];
    else if (sector < 5) rgb = [secondary, 0, chroma];
    else rgb = [chroma, 0, secondary];
    return [rgb[0] + match, rgb[1] + match, rgb[2] + match];
  }
  function luminance(h: number, s: number, l: number) {
    const [r, g, b] = hslRgb(h, s, l);
    const channel = (value: number) => (value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return channel(r) * 0.2126 + channel(g) * 0.7152 + channel(b) * 0.0722;
  }
  function contrastWith(h: number, s: number, l: number, bgLum: number, lightText: boolean) {
    const lum = luminance(h, s, l);
    const [hi, lo] = lightText ? [lum, bgLum] : [bgLum, lum];
    return (hi + 0.05) / (lo + 0.05);
  }
  function hexLuminance(hexValue: string) {
    const value = parseInt(hexValue.slice(1), 16);
    const channel = (shift: number) => {
      const v = ((value >> shift) & 255) / 255;
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    };
    return channel(16) * 0.2126 + channel(8) * 0.7152 + channel(0) * 0.0722;
  }
  function hex(h: number, s: number, l: number) {
    const [r, g, b] = hslRgb(h, s, l);
    const to255 = (value: number) => Math.round(clamp(value, 0, 1) * 255).toString(16).padStart(2, "0");
    return `#${to255(r)}${to255(g)}${to255(b)}`;
  }

  const h = (((HUE % 360) + 360) % 360);
  const s = clamp(SAT, 12, 92);
  const isLight = mode !== "dark";
  // 最差底色：亮色取最暗的石灰 #E7E4DC，夜晚取最亮的沉檀 #1F1A13。
  const worstBgLum = isLight ? hexLuminance("#E7E4DC") : hexLuminance("#1F1A13");

  // 4.6 留余量：Token 会四舍五入成 8-bit hex，实测对比度可能略低于精确值。
  let light = isLight ? 42 : 56;
  if (isLight) {
    while (light > 8 && contrastWith(h, s, light, worstBgLum, false) < 4.6) light -= 1;
  } else {
    while (light < 90 && contrastWith(h, s, light, worstBgLum, true) < 4.6) light += 1;
  }

  if (isLight) {
    return {
      "--accent": hex(h, s, light),
      "--accent-text": hex(h, s, light),
      "--accent-strong": hex(h, s, clamp(light - 8, 6, 90)),
      "--accent-ink": "#ffffff",
      "--brand-trail": hex(h, s, light),
      "--brand-star": hex(h, clamp(s + 10, 0, 96), clamp(light + 26, 0, 84)),
      "--tint": hex(h, clamp(s, 0, 45), 90),
    };
  }
  return {
    "--accent": hex(h, s, light),
    "--accent-text": hex(h, s, light),
    "--accent-strong": hex(h, s, clamp(light + 12, 10, 94)),
    "--accent-ink": "#191c18",
    "--brand-trail": hex(h, s, clamp(light - 16, 24, 90)),
    "--brand-star": hex(h, clamp(s + 10, 0, 96), clamp(light + 18, 0, 92)),
    "--tint": hex(h, clamp(s, 0, 55), 17),
  };
}
