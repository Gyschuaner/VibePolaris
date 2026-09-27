"use client";

import { CaretDown, Moon, Palette, Plus, Sun, X } from "@phosphor-icons/react";
import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

import { CUSTOM_TOKEN_NAMES, deriveCustomPaletteTokens } from "@/lib/custom-palette";

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

/* 六边形调色盘：外轮廓为平顶大六边形，角度映射色相、距圆心距离映射饱和度、亮度由对比度规则推导。 */
const HEX_SIZE = 15;
const HEX_WIDTH = 19;
const HEX_HEIGHT = 22;
const HEX_RINGS = 4;

type HexSwatch = { id: string; hue: number; sat: number; left: number; top: number };

const HEX_WHEEL = (() => {
  const sqrt3 = Math.sqrt(3);
  const raw: { q: number; r: number; px: number; py: number; dist: number }[] = [];
  let farthest = 0;
  for (let q = -HEX_RINGS; q <= HEX_RINGS; q += 1) {
    for (let r = Math.max(-HEX_RINGS, -q - HEX_RINGS); r <= Math.min(HEX_RINGS, -q + HEX_RINGS); r += 1) {
      const px = HEX_SIZE * sqrt3 * (q + r / 2);
      const py = HEX_SIZE * 1.5 * r;
      const dist = Math.hypot(px, py);
      farthest = Math.max(farthest, dist);
      raw.push({ q, r, px, py, dist });
    }
  }
  const halfWidth = Math.max(...raw.map((cell) => Math.abs(cell.px)));
  const halfHeight = Math.max(...raw.map((cell) => Math.abs(cell.py)));
  const width = halfWidth * 2 + HEX_WIDTH;
  const height = halfHeight * 2 + HEX_HEIGHT;
  const swatches: HexSwatch[] = raw
    .map(({ q, r, px, py, dist }) => {
      const isCenter = dist === 0;
      const angle = (Math.atan2(-py, px) * 180) / Math.PI;
      const hue = isCenter ? 0 : Math.round((((90 - angle) % 360) + 360) % 360);
      const sat = isCenter ? 0 : Math.round((dist / farthest) * 100);
      return {
        id: `${q},${r}`,
        hue,
        sat,
        left: width / 2 + px - HEX_WIDTH / 2,
        top: height / 2 + py - HEX_HEIGHT / 2,
      };
    })
    .sort((a, b) => a.sat - b.sat || a.hue - b.hue);
  return { swatches, width, height };
})();

function isBackground(value: string | undefined | null): value is BackgroundId {
  return BACKGROUNDS.some((option) => option.id === value);
}

function isNightBackground(value: string | undefined | null): value is NightBackgroundId {
  return NIGHT_BACKGROUNDS.some((option) => option.id === value);
}

function isAccent(value: string | undefined | null): value is AccentId {
  return ACCENTS.some((option) => option.id === value);
}

/** 从 "H,S" 存储串恢复自定义色相与饱和度；无效时返回 null。 */
function parseCustomAccent(value: string | null): { hue: number; sat: number } | null {
  const [hueText, satText] = (value ?? "").split(",");
  const hue = Number(hueText);
  const sat = Number(satText);
  if (hueText === undefined || satText === undefined) return null;
  if (!Number.isFinite(hue) || !Number.isFinite(sat) || hue < 0 || hue > 360 || sat < 0 || sat > 100) return null;
  return { hue, sat };
}

function applyTheme(
  mode: ThemeMode,
  lightBackground: BackgroundId,
  nightBackground: NightBackgroundId,
  accent: AccentChoice,
  customHue: number,
  customSat: number,
) {
  const root = document.documentElement;
  const background = mode === "dark" ? nightBackground : lightBackground;
  const options = mode === "dark" ? NIGHT_BACKGROUNDS : BACKGROUNDS;
  const derived = accent === "custom" ? deriveCustomPaletteTokens(customHue, customSat, mode) : null;
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
}: {
  label: string;
  options: readonly ThemeOption[];
  value: string;
  onChange: (next: string) => void;
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
  const [wheelOpen, setWheelOpen] = useState(false);
  const studioRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusPanelOnOpenRef = useRef(false);

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
      setMode(nextMode);
      setLightBackground(nextLight);
      setNightBackground(nextNight);
      setAccent(nextAccent);
      setCustomHue(nextHue);
      setCustomSat(nextSat);
      applyTheme(nextMode, nextLight, nextNight, nextAccent, nextHue, nextSat);
    });
    return () => window.cancelAnimationFrame(syncFrame);
  }, []);

  useEffect(() => {
    if (!open) setWheelOpen(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const focusSelected = focusPanelOnOpenRef.current
      ? window.requestAnimationFrame(() => {
          panelRef.current?.querySelector<HTMLButtonElement>('[role="radio"][aria-checked="true"]')?.focus();
          focusPanelOnOpenRef.current = false;
        })
      : 0;

    function handlePointerDown(event: PointerEvent) {
      if (!studioRef.current?.contains(event.target as Node)) setOpen(false);
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (wheelOpen) {
        setWheelOpen(false);
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

  function persist(nextMode: ThemeMode, nextLight: BackgroundId, nextNight: NightBackgroundId, nextAccent: AccentChoice, nextHue: number, nextSat: number) {
    applyTheme(nextMode, nextLight, nextNight, nextAccent, nextHue, nextSat);
    try {
      localStorage.setItem("vp-theme", nextMode);
      localStorage.setItem("vp-background", nextLight);
      localStorage.setItem("vp-background-night", nextNight);
      localStorage.setItem("vp-palette", nextAccent);
      if (nextAccent === "custom") localStorage.setItem("vp-palette-custom", `${nextHue},${nextSat}`);
    } catch {
      // Theme selection still works for this page when storage is unavailable.
    }
  }

  function chooseBackground(next: string) {
    if (mode === "dark") {
      if (!isNightBackground(next)) return;
      setNightBackground(next);
      persist("dark", lightBackground, next, accent, customHue, customSat);
      return;
    }
    if (!isBackground(next)) return;
    setLightBackground(next);
    persist("light", next, nightBackground, accent, customHue, customSat);
  }

  function chooseAccent(next: string) {
    if (next === "custom") {
      if (accent === "custom") {
        setWheelOpen((current) => !current);
        return;
      }
      setAccent("custom");
      setWheelOpen(true);
      persist(mode, lightBackground, nightBackground, "custom", customHue, customSat);
      return;
    }
    if (!isAccent(next)) return;
    setAccent(next);
    setWheelOpen(false);
    persist(mode, lightBackground, nightBackground, next, customHue, customSat);
  }

  function chooseCustomAccent(nextHue: number, nextSat: number) {
    setCustomHue(nextHue);
    setCustomSat(nextSat);
    persist(mode, lightBackground, nightBackground, "custom", nextHue, nextSat);
  }

  function toggleNightMode() {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    persist(nextMode, lightBackground, nightBackground, accent, customHue, customSat);
  }

  function toggleStudio(fromKeyboard = false) {
    if (!open && fromKeyboard) focusPanelOnOpenRef.current = true;
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
            options={[...ACCENTS, {
              id: "custom",
              name: "自定义",
              color: accent === "custom"
                ? `hsl(${customHue} ${customSat}% 45%)`
                : "conic-gradient(from 0deg, hsl(0 70% 55%), hsl(60 70% 55%), hsl(120 70% 55%), hsl(180 70% 55%), hsl(240 70% 55%), hsl(300 70% 55%), hsl(360 70% 55%))",
              indicator: accent === "custom"
                ? `hsl(${customHue} ${customSat}% 35%)`
                : "var(--muted)",
            }]}
            value={accent}
            onChange={chooseAccent}
          />
          {accent === "custom" && wheelOpen && (
            <div className="theme-hex-wheel" role="group" aria-label="六边形调色盘">
              <button
                className="theme-hex-close"
                type="button"
                onClick={() => setWheelOpen(false)}
                aria-label="关闭调色盘"
              >
                <X size={15} weight="bold" aria-hidden="true" />
              </button>
              <div className="theme-hex-plate">
              <div className="theme-hex-grid" style={{ width: HEX_WHEEL.width, height: HEX_WHEEL.height }}>
                {HEX_WHEEL.swatches.map((swatch) => {
                  const selected = swatch.hue === customHue && swatch.sat === customSat;
                  return (
                    <button
                      key={swatch.id}
                      type="button"
                      className={`theme-hex-swatch${selected ? " is-selected" : ""}`}
                      style={{ left: swatch.left, top: swatch.top, background: `hsl(${swatch.hue} ${swatch.sat}% 55%)` }}
                      aria-label={swatch.sat === 0
                        ? "调色盘：中性灰"
                        : `调色盘：色相 ${swatch.hue} 度，饱和度 ${swatch.sat}%`}
                      aria-pressed={selected}
                      onClick={() => chooseCustomAccent(swatch.hue, swatch.sat)}
                    />
                  );
                })}
              </div>
              </div>
            </div>
          )}
        </div>
    </div>
  );
}
