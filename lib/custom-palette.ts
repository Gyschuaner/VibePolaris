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
 * 六边形色域的明度剖面：滑条值 sliderLight 直接是【中心】明度，量程 0–100，
 * 滑条左右端点真实映射到黑（0）与白（100）。边缘按半径（由饱和度表达）比例变暗：
 * 明度 = sliderLight ×（1 − 0.6 × sat/100），即边缘为滑条值的 40%，中心始终最亮、边缘按比例最暗。
 * 这样滑条在中心（sat=0）等于纯明度调节，在高饱和边缘同步变暗形成浅色中心过渡。
 *
 * 画布绘制、选色映射、当前色显示与首屏引导共用此函数，
 * 保证看到的颜色与应用/持久化的颜色一致。必须保持完全自包含（会被 toString() 内联），
 * 包括常量也只能写字面量。
 */
export function fieldLightness(sat: number, sliderLight: number): number {
  const S = Number(sat);
  const L = Number(sliderLight);
  const s = Number.isFinite(S) ? Math.min(100, Math.max(0, S)) : 0;
  const light = Number.isFinite(L) ? Math.min(100, Math.max(0, L)) : 55;
  return light * (1 - 0.6 * (s / 100));
}

/**
 * 由用户选择的色相/饱和度/明度推导整套主题色 Token。
 * --accent 与 --accent-text 严格使用所选 H/S/L，不因主题模式或对比度自动改色；
 * 其余 Token 从所选颜色派生。未提供明度时才使用各模式的默认值。
 */
export function deriveCustomPaletteTokens(
  hue: number,
  sat: number,
  mode: ThemeMode,
  lightChoice?: number | null,
): CustomPaletteTokens | null {
  const HUE = Number(hue);
  const SAT = Number(sat);
  if (!Number.isFinite(HUE) || !Number.isFinite(SAT) || HUE < 0 || HUE > 360 || SAT < 0 || SAT > 100) return null;
  if (lightChoice !== undefined && lightChoice !== null) {
    const CHOICE = Number(lightChoice);
    if (!Number.isFinite(CHOICE) || CHOICE < 0 || CHOICE > 100) return null;
  }

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
  function hex(h: number, s: number, l: number) {
    const [r, g, b] = hslRgb(h, s, l);
    const to255 = (value: number) => Math.round(clamp(value, 0, 1) * 255).toString(16).padStart(2, "0");
    return `#${to255(r)}${to255(g)}${to255(b)}`;
  }

  const h = (((HUE % 360) + 360) % 360);
  // Preserve the user's full 0–100% saturation and brightness selection.
  const s = clamp(SAT, 0, 100);
  const isLight = mode !== "dark";

  // Only use a mode default when no color has been selected yet. Explicit slider endpoints stay exact.
  const targetLight = lightChoice === undefined || lightChoice === null
    ? (isLight ? 42 : 56)
    : clamp(Number(lightChoice), 0, 100);
  const light = targetLight;

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
