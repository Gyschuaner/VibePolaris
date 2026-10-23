import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { LibraryDetail } from "@/components/library/LibraryDetail";
import { libraryItems } from "@/lib/library";
import { siteHome, siteModules } from "@/lib/site-modules";

export function generateStaticParams() { return libraryItems.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = libraryItems.find(item => item.slug === slug);
  return { title: item ? `${item.name} · 组件库` : "组件库", description: item?.description };
}
export default async function LibraryItemPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!siteModules.library) redirect(siteHome());
  const { slug } = await params;
  const item = libraryItems.find(item => item.slug === slug);
  if (!item) notFound();
  return <><SiteHeader wide /><Suspense fallback={<p style={{ padding: 40 }}>正在打开详情…</p>}><LibraryDetail item={item} /></Suspense></>;
}
