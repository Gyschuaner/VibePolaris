import type { Metadata, Viewport } from "next";

import { RouteMeteorProvider } from "@/components/RouteMeteorProvider";

import "./globals.css";

const themeBootstrap = `
(function () {
  var mode, palette, background;
  try {
    mode = localStorage.getItem('vp-theme');
    palette = localStorage.getItem('vp-palette');
    background = localStorage.getItem('vp-background');
  } catch (error) {}
  var backgrounds = { paper: true, oat: true, limestone: true, pearl: true, mist: true };
  var palettes = { moss: true, indigo: true, clay: true, pine: true, plum: true };
  var legacyPalettes = { sprout: 'pine', pomelo: 'moss' };
  if (!palettes[palette] && legacyPalettes[palette]) palette = legacyPalettes[palette];
  document.documentElement.dataset.theme = mode || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.background = backgrounds[background] ? background : 'paper';
  document.documentElement.dataset.palette = palettes[palette] ? palette : 'moss';
})();`;

export const metadata: Metadata = {
  metadataBase: new URL("https://vibepolaris.com"),
  title: {
    default: "VibePolaris Vibe指北",
    template: "%s — VibePolaris Vibe指北",
  },
  description: "按技术领域浏览 Vibe Coding 术语、选型知识与工具。零运行时 AI，内容由构建生成。",
  openGraph: {
    title: "VibePolaris Vibe指北",
    description: "面向 Vibe Coder 的术语词典与选型指北。",
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
      <body><RouteMeteorProvider>{children}</RouteMeteorProvider></body>
    </html>
  );
}
