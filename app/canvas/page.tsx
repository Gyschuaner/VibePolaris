import type { Metadata } from "next";
import { Suspense } from "react";
import { CanvasWorkspace } from "@/components/canvas/CanvasWorkspace";
import { redirect } from "next/navigation";
import { siteHome, siteModules } from "@/lib/site-modules";

export const metadata: Metadata = {
  title: "知识画布", description: "自由整理想法、笔记和链接，用 Markdown 持续记录。",
  robots: { index: false, follow: false },
};

export default function CanvasPage() {
  if (!siteModules.canvas) redirect(siteHome());
  return <Suspense fallback={<p style={{ padding: 32 }}>正在打开画布…</p>}><CanvasWorkspace /></Suspense>;
}
