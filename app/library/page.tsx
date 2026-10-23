import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { LibraryGallery } from "@/components/library/LibraryGallery";
import { siteHome, siteModules } from "@/lib/site-modules";

export const metadata: Metadata = { title: "组件库", description: "挑选可预览、可取用的前端组件、样式与素材。" };
export default function LibraryPage() {
  if (!siteModules.library) redirect(siteHome());
  return <><SiteHeader wide /><Suspense fallback={<p style={{ padding: 40 }}>正在打开组件库…</p>}><LibraryGallery /></Suspense></>;
}
