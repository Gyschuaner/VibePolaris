import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { SiteHeader } from "@/components/SiteHeader";
import { LibraryDetail } from "@/components/library/LibraryDetail";
import { libraryItems } from "@/lib/library";
import { siteHome, siteModules } from "@/lib/site-modules";
import { readFile } from "node:fs/promises";
import path from "node:path";

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
  const animationCss = item.category === "animation" ? await readFile(path.join(process.cwd(), "public/library/animations", `${item.slug}.css`), "utf8") : undefined;
  return <><SiteHeader wide /><LibraryDetail key={item.slug} item={item} animationCss={animationCss} /></>;
}
