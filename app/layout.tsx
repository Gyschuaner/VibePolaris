import type { Metadata, Viewport } from "next";

import { RouteMeteorProvider } from "@/components/RouteMeteorProvider";
import { NotesProvider } from "@/components/notes/NotesProvider";
import { PointerFeedback } from "@/components/PointerFeedback";
import { Xiaobei } from "@/components/xiaobei/Xiaobei";
import { publishedTerms } from "@/lib/content";
import { deriveCustomPaletteTokens, fieldLightness } from "@/lib/custom-palette";

import "./globals.css";
import "./harness-v4.css";
import "./xiaobei.css";

// deriveCustomPaletteTokens / fieldLightness 必须自包含：这里取其运行时源码内联，保证与组件内实现一致。
const themeBootstrap = `
var __vpDeriveCustomPaletteTokens = (${deriveCustomPaletteTokens.toString()});
var __vpFieldLightness = (${fieldLightness.toString()});
(function () {
  var mode, palette, dayBackground, nightBackground, customAccent;
  try {
    mode = localStorage.getItem('vp-theme');
    palette = localStorage.getItem('vp-palette');
    dayBackground = localStorage.getItem('vp-background');
    nightBackground = localStorage.getItem('vp-background-night');
    customAccent = localStorage.getItem('vp-palette-custom');
  } catch (error) {}
  var dayBackgrounds = { paper: true, oat: true, limestone: true, pearl: true, mist: true };
  var nightBackgrounds = { obsidian: true, umber: true, graphite: true, spruce: true, abyss: true };
  var palettes = { moss: true, indigo: true, clay: true, pine: true, plum: true };
  var legacyPalettes = { sprout: 'pine', pomelo: 'moss' };
  if (!palettes[palette] && legacyPalettes[palette]) palette = legacyPalettes[palette];
  var isDark = mode ? mode === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  if (palette === 'custom') {
    var customParts = (customAccent || '').split(',');
    var sliderLight = customParts.length > 2 && customParts[2] !== '' ? Number(customParts[2]) : 55;
    var finalLight = __vpFieldLightness(Number(customParts[1]), sliderLight);
    var customTokens = __vpDeriveCustomPaletteTokens(Number(customParts[0]), Number(customParts[1]), isDark ? 'dark' : 'light', finalLight);
    if (customTokens) {
      Object.keys(customTokens).forEach(function (tokenName) {
        document.documentElement.style.setProperty(tokenName, customTokens[tokenName]);
      });
    } else {
      palette = 'moss';
    }
  }
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  document.documentElement.dataset.background = isDark
    ? (nightBackgrounds[nightBackground] ? nightBackground : 'obsidian')
    : (dayBackgrounds[dayBackground] ? dayBackground : 'paper');
  document.documentElement.dataset.palette = palettes[palette] || palette === 'custom' ? palette : 'moss';
})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://vibepolaris.com"),
  title: {
    default: "VibePolaris Vibe指北",
    template: "%s — VibePolaris Vibe指北",
  },
  description: "按技术领域探索 Vibe Coding 概念星图，通过图文与互动教程理解技术术语。",
  openGraph: {
    title: "VibePolaris Vibe指北",
    description: "面向 Vibe Coder 的术语词典与概念星图。",
    locale: "zh_CN",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F7F3E8",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body><NotesProvider><RouteMeteorProvider>{children}<Xiaobei termNames={Object.fromEntries(publishedTerms.map(term => [`/terms/${term.slug}`, term.zh]))} /></RouteMeteorProvider><PointerFeedback /></NotesProvider></body>
    </html>
  );
}
