"use client";

import { CaretDown, Moon, Palette, Sun } from "@phosphor-icons/react";
import type { CSSProperties, KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

const BACKGROUNDS = [
  { id: "paper", name: "纸白", color: "#F7F3E8", indicator: "#74674B" },
  { id: "oat", name: "燕麦", color: "#EFE5D2", indicator: "#806A45" },
  { id: "limestone", name: "石灰", color: "#E7E4DC", indicator: "#62645E" },
  { id: "pearl", name: "冷珍珠", color: "#EEF0EE", indicator: "#526158" },
  { id: "mist", name: "雾蓝", color: "#E8EDF2", indicator: "#4F6275" },
] as const;

const ACCENTS = [
  { id: "moss", name: "苔绿", color: "#52683F", indicator: "#314226" },
  { id: "indigo", name: "墨蓝", color: "#58627C", indicator: "#343C54" },
  { id: "clay", name: "陶土", color: "#9A6248", indicator: "#603926" },
  { id: "pine", name: "松石绿", color: "#355D57", indicator: "#1D403B" },
  { id: "plum", name: "灰紫", color: "#6C5A68", indicator: "#453642" },
] as const;

type BackgroundId = (typeof BACKGROUNDS)[number]["id"];
type AccentId = (typeof ACCENTS)[number]["id"];
type ThemeMode = "light" | "dark";
type ThemeOption = { id: string; name: string; color: string; indicator: string };

const DEFAULT_BACKGROUND: BackgroundId = "paper";
const DEFAULT_ACCENT: AccentId = "moss";

function isBackground(value: string | undefined): value is BackgroundId {
  return BACKGROUNDS.some((option) => option.id === value);
}

function isAccent(value: string | undefined): value is AccentId {
  return ACCENTS.some((option) => option.id === value);
}

function applyTheme(mode: ThemeMode, background: BackgroundId, accent: AccentId) {
  const root = document.documentElement;
  root.dataset.theme = mode;
  root.dataset.background = background;
  root.dataset.palette = accent;
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.content = mode === "dark"
      ? "#191C18"
      : BACKGROUNDS.find((option) => option.id === background)?.color ?? "#F7F3E8";
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
        <div className="theme-scale-track" role="radiogroup" aria-label={label} ref={groupRef}>
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
  const [background, setBackground] = useState<BackgroundId>(DEFAULT_BACKGROUND);
  const [accent, setAccent] = useState<AccentId>(DEFAULT_ACCENT);
  const studioRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusPanelOnOpenRef = useRef(false);

  useEffect(() => {
    const syncFrame = window.requestAnimationFrame(() => {
      const root = document.documentElement;
      const nextMode: ThemeMode = root.dataset.theme === "dark" ? "dark" : "light";
      const nextBackground = isBackground(root.dataset.background) ? root.dataset.background : DEFAULT_BACKGROUND;
      const nextAccent = isAccent(root.dataset.palette) ? root.dataset.palette : DEFAULT_ACCENT;
      setMode(nextMode);
      setBackground(nextBackground);
      setAccent(nextAccent);
      applyTheme(nextMode, nextBackground, nextAccent);
    });
    return () => window.cancelAnimationFrame(syncFrame);
  }, []);

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
  }, [open]);

  function persist(nextMode: ThemeMode, nextBackground: BackgroundId, nextAccent: AccentId) {
    applyTheme(nextMode, nextBackground, nextAccent);
    try {
      localStorage.setItem("vp-theme", nextMode);
      localStorage.setItem("vp-background", nextBackground);
      localStorage.setItem("vp-palette", nextAccent);
    } catch {
      // Theme selection still works for this page when storage is unavailable.
    }
  }

  function chooseBackground(next: string) {
    if (!isBackground(next)) return;
    setBackground(next);
    setMode("light");
    persist("light", next, accent);
  }

  function chooseAccent(next: string) {
    if (!isAccent(next)) return;
    setAccent(next);
    setMode("light");
    persist("light", background, next);
  }

  function toggleNightMode() {
    const nextMode = mode === "dark" ? "light" : "dark";
    setMode(nextMode);
    persist(nextMode, background, accent);
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

      {open && (
        <div
          className="theme-studio-panel"
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

          <ThemeScale label="背景" options={BACKGROUNDS} value={background} onChange={chooseBackground} />
          <ThemeScale label="主题色" options={ACCENTS} value={accent} onChange={chooseAccent} />
        </div>
      )}
    </div>
  );
}
