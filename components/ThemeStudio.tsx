"use client";

import { CaretDown, Moon, Palette, Plus, Sun, X } from "@phosphor-icons/react";
import type { CSSProperties, KeyboardEvent, PointerEvent as ReactPointerEvent, Ref } from "react";
import { useEffect, useRef, useState } from "react";

import { CUSTOM_TOKEN_NAMES, deriveCustomPaletteTokens, fieldLightness } from "@/lib/custom-palette";

const BACKGROUNDS = [
  { id: "paper", name: "纸白", color: "#F7F3E8", indicator: "#74674B" },
  { id: "oat", name: "燕麦", color: "#EFE5D2", indicator: "#806A45" },
  { id: "limestone", name: "石灰", color: "#E7E4DC", indicator: "#62645E" },
  { id: "pearl", name: "冷珍珠", color: "#EEF0EE", indicator: "#526158" },
  { id: "mist", name: "雾蓝", color: "#E8EDF2", indicator: "#4F6275" },
] as const;

const NIGHT_BACKGROUNDS = [
  { id: "obsidian", name: "曜石", color: "#191C18", indicator: "#9AA093" },
  { id: "umber", name: "沉檀", color: "#1F1A13", indicator: "#A8946F" },
  { id: "graphite", name: "石墨", color: "#1B1C1E", indicator: "#9CA1A6" },
  { id: "spruce", name: "黛青", color: "#161D1A", indicator: "#87A79D" },
  { id: "abyss", name: "夜航", color: "#161A22", indicator: "#8595B5" },
] as const;

const ACCENTS = [
  { id: "moss", name: "苔绿", color: "#52683F", indicator: "#314226" },
  { id: "indigo", name: "墨蓝", color: "#58627C", indicator: "#343C54" },
  { id: "clay", name: "陶土", color: "#9A6248", indicator: "#603926" },
  { id: "pine", name: "松石绿", color: "#355D57", indicator: "#1D403B" },
  { id: "plum", name: "灰紫", color: "#6C5A68", indicator: "#453642" },
] as const;

type BackgroundId = (typeof BACKGROUNDS)[number]["id"];
type NightBackgroundId = (typeof NIGHT_BACKGROUNDS)[number]["id"];
type AccentId = (typeof ACCENTS)[number]["id"];
type AccentChoice = AccentId | "custom";
type ThemeMode = "light" | "dark";
type ThemeOption = { id: string; name: string; color: string; indicator: string };

const DEFAULT_BACKGROUND: BackgroundId = "paper";
const DEFAULT_NIGHT_BACKGROUND: NightBackgroundId = "obsidian";
const DEFAULT_ACCENT: AccentId = "moss";
const DEFAULT_CUSTOM_HUE = 82;
const DEFAULT_CUSTOM_SAT = 65;
const DEFAULT_CUSTOM_LIGHT = 55;
const LIGHT_MIN = 0;
const LIGHT_MAX = 100;

/* 连续六边形色域：平顶六边形轮廓，彩虹色相沿边缘顺时针分布（顶部为红）；
 * 饱和度按六边形范数从边缘的 100% 线性降到圆心的 0；滑条值即中心明度（0–100 全量程，
 * 端点=黑/白），边缘按 fieldLightness 剖面 ×(1−0.6·sat/100) 比例变暗，中心始终最亮。
 * Canvas 像素级绘制、指针映射、当前色显示、对比度保护与持久化恢复共用同一组公式，保证“看到即选到”。 */
const FIELD_W = 192;
const HEX_CIRCUM_R = FIELD_W / 2;
const FIELD_H = Math.round(HEX_CIRCUM_R * Math.sqrt(3));
const SQRT3 = Math.sqrt(3);

/** 像素偏移 → (色相, 饱和度)：色相为自顶部顺时针的角度，饱和度为六边形范数（0–100）。 */
function hexFieldPoint(px: number, py: number): { hue: number; sat: number } {
  const q = px / HEX_CIRCUM_R - py / (HEX_CIRCUM_R * SQRT3);
  const r = (2 * py) / (HEX_CIRCUM_R * SQRT3);
  const norm = Math.min(1, (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2);
  const hue = Math.round((((Math.atan2(px, -py) * 180) / Math.PI) % 360 + 360) % 360);
  return { hue, sat: Math.round(norm * 100) };
}

/** (色相, 饱和度) → 像素位置：hexFieldPoint 的逆变换，边缘半径按到边法线的夹角余弦修正。 */
function hexFieldPosition(hue: number, sat: number): { x: number; y: number } {
  const phi = (hue * Math.PI) / 180;
  const edgeNormalAngle = ((90 - hue) % 60 + 60) % 60 - 30;
  const edgeRadius = ((HEX_CIRCUM_R * SQRT3) / 2) / Math.cos((edgeNormalAngle * Math.PI) / 180);
  const radius = (sat / 100) * edgeRadius;
  return { x: FIELD_W / 2 + radius * Math.sin(phi), y: FIELD_H / 2 - radius * Math.cos(phi) };
}

function hslToRgb255(h: number, s: number, l: number): [number, number, number] {
  const sn = Math.min(100, Math.max(0, s)) / 100;
  const ln = Math.min(100, Math.max(0, l)) / 100;
  const chroma = (1 - Math.abs(2 * ln - 1)) * sn;
  const sector = (((h % 360) + 360) % 360) / 60;
  const secondary = chroma * (1 - Math.abs((sector % 2) - 1));
  const match = ln - chroma / 2;
  let rgb: [number, number, number] = [0, 0, 0];
  if (sector < 1) rgb = [chroma, secondary, 0];
  else if (sector < 2) rgb = [secondary, chroma, 0];
  else if (sector < 3) rgb = [0, chroma, secondary];
  else if (sector < 4) rgb = [0, secondary, chroma];
  else if (sector < 5) rgb = [secondary, 0, chroma];
  else rgb = [chroma, 0, secondary];
  return [
    Math.round(Math.min(1, Math.max(0, rgb[0] + match)) * 255),
    Math.round(Math.min(1, Math.max(0, rgb[1] + match)) * 255),
    Math.round(Math.min(1, Math.max(0, rgb[2] + match)) * 255),
  ];
}

/** 按当前明度把连续色域画进 canvas：逐像素 HSL，六边形边缘做 alpha 抗锯齿。 */
function paintHexField(canvas: HTMLCanvasElement, lightness: number) {
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  const width = Math.round(FIELD_W * dpr);
  const height = Math.round(FIELD_H * dpr);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const image = ctx.createImageData(width, height);
  const data = image.data;
  for (let y = 0; y < height; y += 1) {
    const py = (y + 0.5) / dpr - FIELD_H / 2;
    for (let x = 0; x < width; x += 1) {
      const idx = (y * width + x) * 4;
      const px = (x + 0.5) / dpr - FIELD_W / 2;
      const q = px / HEX_CIRCUM_R - py / (HEX_CIRCUM_R * SQRT3);
      const r = (2 * py) / (HEX_CIRCUM_R * SQRT3);
      const norm = (Math.abs(q) + Math.abs(r) + Math.abs(q + r)) / 2;
      if (norm > 1.012) {
        data[idx + 3] = 0;
        continue;
      }
      const hue = (Math.atan2(px, -py) * 180) / Math.PI;
      const radiusSat = Math.min(1, norm) * 100;
      const [cr, cg, cb] = hslToRgb255(hue, radiusSat, fieldLightness(radiusSat, lightness));
      data[idx] = cr;
      data[idx + 1] = cg;
      data[idx + 2] = cb;
      data[idx + 3] = Math.round(255 * Math.min(1, Math.max(0, (1.012 - norm) / 0.024)));
    }
  }
  ctx.putImageData(image, 0, 0);
}

function isBackground(value: string | undefined | null): value is BackgroundId {
  return BACKGROUNDS.some((option) => option.id === value);
}

function isNightBackground(value: string | undefined | null): value is NightBackgroundId {
  return NIGHT_BACKGROUNDS.some((option) => option.id === value);
}

function isAccent(value: string | undefined | null): value is AccentId {
  return ACCENTS.some((option) => option.id === value);
}

/** 从 "H,S[,L]" 存储串恢复自定义色相、饱和度与明度；无效时返回 null。旧两段串明度回默认值。 */
function parseCustomAccent(value: string | null): { hue: number; sat: number; light: number } | null {
  const [hueText, satText, lightText] = (value ?? "").split(",");
  const hue = Number(hueText);
  const sat = Number(satText);
  if (hueText === undefined || satText === undefined) return null;
  if (!Number.isFinite(hue) || !Number.isFinite(sat) || hue < 0 || hue > 360 || sat < 0 || sat > 100) return null;
  if (lightText === undefined || lightText === "") return { hue, sat, light: DEFAULT_CUSTOM_LIGHT };
  const light = Number(lightText);
  if (!Number.isFinite(light) || light < 0 || light > 100) return null;
  return { hue, sat, light };
}

function applyTheme(
  mode: ThemeMode,
  lightBackground: BackgroundId,
  nightBackground: NightBackgroundId,
  accent: AccentChoice,
  customHue: number,
  customSat: number,
  customLight: number,
) {
  const root = document.documentElement;
  const background = mode === "dark" ? nightBackground : lightBackground;
  const options = mode === "dark" ? NIGHT_BACKGROUNDS : BACKGROUNDS;
  // customLight 是滑条明度（色域边缘基准）；派生输入必须用色域剖面混合后的最终明度。
  const derived = accent === "custom"
    ? deriveCustomPaletteTokens(customHue, customSat, mode, fieldLightness(customSat, customLight))
    : null;
  root.dataset.theme = mode;
  root.dataset.background = background;
  root.dataset.palette = accent === "custom" && !derived ? DEFAULT_ACCENT : accent;
  if (derived) {
    for (const name of CUSTOM_TOKEN_NAMES) root.style.setProperty(name, derived[name]);
  } else {
    for (const name of CUSTOM_TOKEN_NAMES) root.style.removeProperty(name);
  }
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.content = options.find((option) => option.id === background)?.color
      ?? (mode === "dark" ? "#191C18" : "#F7F3E8");
  }
}

function ThemeScale({
  label,
  options,
  value,
  onChange,
  customOptionRef,
}: {
  label: string;
  options: readonly ThemeOption[];
  value: string;
  onChange: (next: string) => void;
  customOptionRef?: Ref<HTMLButtonElement>;
}) {
  const selectedIndex = Math.max(0, options.findIndex((option) => option.id === value));
  const selected = options[selectedIndex];
  const groupRef = useRef<HTMLDivElement>(null);

  function selectByKeyboard(event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) {
    let nextIndex: number | null = null;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") nextIndex = Math.max(0, currentIndex - 1);
    if (event.key === "ArrowRight" || event.key === "ArrowUp") nextIndex = Math.min(options.length - 1, currentIndex + 1);
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = options.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    onChange(options[nextIndex].id);
    groupRef.current?.querySelectorAll<HTMLButtonElement>("[role=radio]")[nextIndex]?.focus();
  }

  const indicatorStyle = {
    "--theme-scale-position": `${((selectedIndex + 0.5) / options.length) * 100}%`,
    "--theme-scale-indicator": selected.indicator,
  } as CSSProperties;

  return (
    <div className="theme-scale">
      <div className="theme-scale-heading">
        <span>{label}</span>
        <output aria-live="polite">{selected.name}</output>
      </div>
      <div className="theme-scale-control" style={indicatorStyle}>
        <div
          className="theme-scale-track"
          role="radiogroup"
          aria-label={label}
          ref={groupRef}
          style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
        >
          {options.map((option, index) => (
            <button
              key={option.id}
              className="theme-scale-option"
              type="button"
              ref={option.id === "custom" ? customOptionRef : undefined}
              role="radio"
              aria-checked={index === selectedIndex}
              aria-label={`${label}：${option.name}，第 ${index + 1} 项，共 ${options.length} 项`}
              tabIndex={index === selectedIndex ? 0 : -1}
              onClick={() => onChange(option.id)}
              onKeyDown={(event) => selectByKeyboard(event, index)}
            >
              <span className="theme-scale-color" style={{ "--theme-segment": option.color } as CSSProperties} />
              {option.id === "custom" && (
                <Plus className="theme-scale-custom-icon" size={15} weight="bold" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
        <span className="theme-scale-indicator" aria-hidden="true">
          <CaretDown className="theme-scale-caret" size={13} weight="fill" />
          <span className="theme-scale-needle" />
          <span className="theme-scale-tick" />
        </span>
      </div>
    </div>
  );
}

export function ThemeStudio() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ThemeMode>("light");
  const [lightBackground, setLightBackground] = useState<BackgroundId>(DEFAULT_BACKGROUND);
  const [nightBackground, setNightBackground] = useState<NightBackgroundId>(DEFAULT_NIGHT_BACKGROUND);
  const [accent, setAccent] = useState<AccentChoice>(DEFAULT_ACCENT);
  const [customHue, setCustomHue] = useState(DEFAULT_CUSTOM_HUE);
  const [customSat, setCustomSat] = useState(DEFAULT_CUSTOM_SAT);
  const [customLight, setCustomLight] = useState(DEFAULT_CUSTOM_LIGHT);
  const [wheelOpen, setWheelOpen] = useState(false);
  const studioRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const customOptionRef = useRef<HTMLButtonElement | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const fieldCanvasRef = useRef<HTMLCanvasElement>(null);
  const focusPanelOnOpenRef = useRef(false);
  const draggingFieldRef = useRef(false);
  const draggingLightRef = useRef(false);

  useEffect(() => {
    const syncFrame = window.requestAnimationFrame(() => {
      const root = document.documentElement;
      const nextMode: ThemeMode = root.dataset.theme === "dark" ? "dark" : "light";
      let storedLight: string | null = null;
      let storedNight: string | null = null;
      let storedCustom: string | null = null;
      try {
        storedLight = localStorage.getItem("vp-background");
        storedNight = localStorage.getItem("vp-background-night");
        storedCustom = localStorage.getItem("vp-palette-custom");
      } catch {
        // Falls back to defaults when storage is unavailable.
      }
      // dataset.background 始终反映当前模式的底色；另一模式的档位从存储恢复。
      const activeBackground = nextMode === "dark"
        ? (isNightBackground(root.dataset.background) ? root.dataset.background : DEFAULT_NIGHT_BACKGROUND)
        : (isBackground(root.dataset.background) ? root.dataset.background : DEFAULT_BACKGROUND);
      const nextLight = nextMode === "dark"
        ? (isBackground(storedLight) ? storedLight : DEFAULT_BACKGROUND)
        : (activeBackground as BackgroundId);
      const nextNight = nextMode === "dark"
        ? (activeBackground as NightBackgroundId)
        : (isNightBackground(storedNight) ? storedNight : DEFAULT_NIGHT_BACKGROUND);
      const storedCustomAccent = root.dataset.palette === "custom" ? parseCustomAccent(storedCustom) : null;
      const nextAccent: AccentChoice = storedCustomAccent ? "custom"
        : (isAccent(root.dataset.palette) ? root.dataset.palette : DEFAULT_ACCENT);
      const nextHue = storedCustomAccent ? storedCustomAccent.hue : DEFAULT_CUSTOM_HUE;
      const nextSat = storedCustomAccent ? storedCustomAccent.sat : DEFAULT_CUSTOM_SAT;
      const nextCustomLight = storedCustomAccent ? storedCustomAccent.light : DEFAULT_CUSTOM_LIGHT;
      setMode(nextMode);
      setLightBackground(nextLight);
      setNightBackground(nextNight);
      setAccent(nextAccent);
      setCustomHue(nextHue);
      setCustomSat(nextSat);
      setCustomLight(nextCustomLight);
      applyTheme(nextMode, nextLight, nextNight, nextAccent, nextHue, nextSat, nextCustomLight);
    });
    return () => window.cancelAnimationFrame(syncFrame);
  }, []);

  useEffect(() => {
    if (accent === "custom" && wheelOpen && fieldCanvasRef.current) {
      paintHexField(fieldCanvasRef.current, customLight);
    }
  }, [accent, wheelOpen, customLight]);

  useEffect(() => {
    if (!wheelOpen) return;
    const focusFrame = window.requestAnimationFrame(() => fieldRef.current?.focus());
    return () => window.cancelAnimationFrame(focusFrame);
  }, [wheelOpen]);

  useEffect(() => {
    if (!open) return;
    const focusSelected = focusPanelOnOpenRef.current
      ? window.requestAnimationFrame(() => {
          panelRef.current?.querySelector<HTMLButtonElement>('[role="radio"][aria-checked="true"]')?.focus();
          focusPanelOnOpenRef.current = false;
        })
      : 0;

    function handlePointerDown(event: PointerEvent) {
      if (!studioRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setWheelOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (wheelOpen) {
        setWheelOpen(false);
        window.requestAnimationFrame(() => customOptionRef.current?.focus());
        return;
      }
      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusSelected);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, wheelOpen]);

  function persist(
    nextMode: ThemeMode,
    nextLight: BackgroundId,
    nextNight: NightBackgroundId,
    nextAccent: AccentChoice,
    nextHue: number,
    nextSat: number,
    nextCustomLight: number,
  ) {
    applyTheme(nextMode, nextLight, nextNight, nextAccent, nextHue, nextSat, nextCustomLight);
    try {
      localStorage.setItem("vp-theme", nextMode);
      localStorage.setItem("vp-background", nextLight);
      localStorage.setItem("vp-background-night", nextNight);
      localStorage.setItem("vp-palette", nextAccent);
      if (nextAccent === "custom") localStorage.setItem("vp-palette-custom", `${nextHue},${nextSat},${nextCustomLight}`);
    } catch {
      // Theme selection still works for this page when storage is unavailable.
    }
  }

  function chooseBackground(next: string) {
    if (mode === "dark") {
      if (!isNightBackground(next)) return;
      setNightBackground(next);
      persist("dark", lightBackground, next, accent, customHue, customSat, customLight);
      return;
    }
    if (!isBackground(next)) return;
    setLightBackground(next);
    persist("light", next, nightBackground, accent, customHue, customSat, customLight);
  }

  function chooseAccent(next: string) {
    if (next === "custom") {
      if (accent === "custom") {
        setWheelOpen((current) => !current);
        return;
      }
      setAccent("custom");
      setWheelOpen(true);
      persist(mode, lightBackground, nightBackground, "custom", customHue, customSat, customLight);
      return;
    }
    if (!isAccent(next)) return;
    setAccent(next);
    setWheelOpen(false);
    persist(mode, lightBackground, nightBackground, next, customHue, customSat, customLight);
  }

  function chooseCustomAccent(nextHue: number, nextSat: number, nextLight: number) {
    setCustomHue(nextHue);
    setCustomSat(nextSat);
    setCustomLight(nextLight);
    persist(mode, lightBackground, nightBackground, "custom", nextHue, nextSat, nextLight);
  }

  function pickFromField(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const point = hexFieldPoint(
      ((event.clientX - rect.left) / rect.width) * FIELD_W - FIELD_W / 2,
      ((event.clientY - rect.top) / rect.height) * FIELD_H - FIELD_H / 2,
    );
    chooseCustomAccent(point.hue, point.sat, customLight);
  }

  function pickFromLightSlider(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
    chooseCustomAccent(customHue, customSat, Math.round(LIGHT_MIN + ratio * (LIGHT_MAX - LIGHT_MIN)));
  }

  function fieldKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const fast = event.shiftKey ? 4 : 1;
    let nextHue = customHue;
    let nextSat = customSat;
    if (event.key === "ArrowLeft") nextHue = (customHue - 4 * fast + 360) % 360;
    else if (event.key === "ArrowRight") nextHue = (customHue + 4 * fast) % 360;
    else if (event.key === "ArrowUp") nextSat = Math.min(100, customSat + 4 * fast);
    else if (event.key === "ArrowDown") nextSat = Math.max(0, customSat - 4 * fast);
    else return;
    event.preventDefault();
    chooseCustomAccent(nextHue, nextSat, customLight);
  }

  function lightKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const fast = event.shiftKey ? 10 : 2;
    let nextLight = customLight;
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") nextLight = Math.max(LIGHT_MIN, customLight - fast);
    else if (event.key === "ArrowRight" || event.key === "ArrowUp") nextLight = Math.min(LIGHT_MAX, customLight + fast);
    else if (event.key === "Home") nextLight = LIGHT_MIN;
    else if (event.key === "End") nextLight = LIGHT_MAX;
    else return;
    event.preventDefault();
    chooseCustomAccent(customHue, customSat, nextLight);
  }

  function toggleNightMode() {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    persist(nextMode, lightBackground, nightBackground, accent, customHue, customSat, customLight);
  }

  function toggleStudio(fromKeyboard = false) {
    if (!open && fromKeyboard) focusPanelOnOpenRef.current = true;
    if (open) setWheelOpen(false);
    setOpen((current) => !current);
  }

  return (
    <div className="theme-studio" ref={studioRef}>
      <button
        className="theme-studio-trigger"
        type="button"
        ref={triggerRef}
        aria-label={open ? "关闭主题画板" : "打开主题画板"}
        aria-expanded={open}
        aria-controls="theme-studio-panel"
        onClick={() => toggleStudio()}
        onKeyDown={(event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          toggleStudio(true);
        }}
      >
        <Palette size={21} weight="regular" aria-hidden="true" />
      </button>

        <div
          className="theme-studio-panel"
          data-open={open}
          inert={!open}
          aria-hidden={!open}
          id="theme-studio-panel"
          role="dialog"
          aria-label="主题画板"
          ref={panelRef}
        >
          <button
            className={`theme-mode-button${mode === "dark" ? " is-night" : ""}`}
            type="button"
            onClick={toggleNightMode}
            aria-label={mode === "dark" ? "切换到亮色模式" : "切换到夜晚模式"}
            aria-pressed={mode === "dark"}
          >
            <span className="theme-mode-icons" aria-hidden="true">
              <Moon className="theme-mode-moon" size={21} weight="regular" />
              <Sun className="theme-mode-sun" size={21} weight="regular" />
            </span>
          </button>

          <ThemeScale
            label="背景"
            options={mode === "dark" ? NIGHT_BACKGROUNDS : BACKGROUNDS}
            value={mode === "dark" ? nightBackground : lightBackground}
            onChange={chooseBackground}
          />
          <ThemeScale
            label="主题色"
            customOptionRef={customOptionRef}
            options={[...ACCENTS, {
              id: "custom",
              name: "自定义",
              color: accent === "custom"
                ? `hsl(${customHue} ${customSat}% ${fieldLightness(customSat, customLight)}%)`
                : "conic-gradient(from 0deg, hsl(0 70% 55%), hsl(60 70% 55%), hsl(120 70% 55%), hsl(180 70% 55%), hsl(240 70% 55%), hsl(300 70% 55%), hsl(360 70% 55%))",
              indicator: accent === "custom"
                ? `hsl(${customHue} ${customSat}% ${Math.max(20, fieldLightness(customSat, customLight) - 30)}%)`
                : "var(--muted)",
            }]}
            value={accent}
            onChange={chooseAccent}
          />
          {accent === "custom" && wheelOpen && (() => {
            const cursor = hexFieldPosition(customHue, customSat);
            const finalLight = fieldLightness(customSat, customLight);
            const rawColor = `hsl(${customHue} ${customSat}% ${finalLight}%)`;
            const [rawR, rawG, rawB] = hslToRgb255(customHue, customSat, finalLight);
            const rawHex = `#${[rawR, rawG, rawB].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
            const appliedTokens = deriveCustomPaletteTokens(customHue, customSat, mode, finalLight);
            const appliedColor = appliedTokens?.["--accent"] ?? rawColor;
            const protectedDiffers = Boolean(appliedTokens && appliedTokens["--accent"] !== rawHex);
            const sliderPosition = ((customLight - LIGHT_MIN) / (LIGHT_MAX - LIGHT_MIN)) * 100;
            return (
              <div className="theme-hex-wheel" role="group" aria-label="六边形调色盘">
                <button
                  className="theme-hex-close"
                  type="button"
                  onClick={() => {
                    setWheelOpen(false);
                    window.requestAnimationFrame(() => customOptionRef.current?.focus());
                  }}
                  aria-label="关闭调色盘"
                >
                  <X size={15} weight="bold" aria-hidden="true" />
                </button>
                <div
                  className="theme-hex-field"
                  style={{ width: FIELD_W, height: FIELD_H }}
                  ref={fieldRef}
                  role="application"
                  aria-label="连续色域：色相沿六边形边缘分布，向中心饱和度递减。方向键左右调色相、上下调饱和度，Shift 加速"
                  tabIndex={0}
                  onPointerDown={(event) => {
                    draggingFieldRef.current = true;
                    event.currentTarget.setPointerCapture(event.pointerId);
                    pickFromField(event);
                  }}
                  onPointerMove={(event) => {
                    if (draggingFieldRef.current) pickFromField(event);
                  }}
                  onPointerUp={() => { draggingFieldRef.current = false; }}
                  onPointerCancel={() => { draggingFieldRef.current = false; }}
                  onKeyDown={fieldKeyDown}
                >
                  <canvas
                    ref={fieldCanvasRef}
                    className="theme-hex-canvas"
                    style={{ width: FIELD_W, height: FIELD_H }}
                    aria-hidden="true"
                  />
                  <span
                    className="theme-hex-cursor"
                    style={{ left: cursor.x, top: cursor.y, borderColor: rawColor }}
                    aria-hidden="true"
                  />
                </div>
                <div
                  className="theme-hex-light-slider"
                  role="slider"
                  aria-label="明度"
                  aria-valuemin={LIGHT_MIN}
                  aria-valuemax={LIGHT_MAX}
                  aria-valuenow={customLight}
                  aria-valuetext={`明度 ${customLight}%`}
                  tabIndex={0}
                  onPointerDown={(event) => {
                    draggingLightRef.current = true;
                    event.currentTarget.setPointerCapture(event.pointerId);
                    pickFromLightSlider(event);
                  }}
                  onPointerMove={(event) => {
                    if (draggingLightRef.current) pickFromLightSlider(event);
                  }}
                  onPointerUp={() => { draggingLightRef.current = false; }}
                  onPointerCancel={() => { draggingLightRef.current = false; }}
                  onKeyDown={lightKeyDown}
                >
                  <span className="theme-hex-light-thumb" style={{ left: `${sliderPosition}%`, background: rawColor }} aria-hidden="true" />
                </div>
                <div className="theme-hex-current" aria-live="polite">
                  <span className="theme-hex-current-swatches" aria-hidden="true">
                    <i style={{ background: rawColor }} title={`原始选色 ${rawHex}`} />
                    <i style={{ background: appliedColor }} title={`主题色（对比度保护后）${appliedColor}`} />
                  </span>
                  <span className="theme-hex-current-text">
                    {`选色 ${rawHex}`}
                    <em aria-hidden="true"> → </em>
                    <strong>{`主题色 ${appliedColor}`}</strong>
                    {protectedDiffers ? <span className="theme-hex-current-note">（已保护）</span> : null}
                  </span>
                </div>
              </div>
            );
          })()}
        </div>
    </div>
  );
}
