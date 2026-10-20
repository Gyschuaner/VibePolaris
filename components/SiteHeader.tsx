"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Graph } from "@phosphor-icons/react/dist/ssr";

import { NotesButton, useNotes } from "@/components/notes/NotesProvider";
import { BrandMark } from "@/components/BrandMark";
import { ThemeStudio } from "@/components/ThemeStudio";
import { NavIndicator } from "@/components/NavIndicator";
import { navigationSection } from "@/lib/site-navigation";
import { AccountButton } from "@/components/account/AccountProvider";

export function SiteHeader({ wide = false, termSlug }: { wide?: boolean; termSlug?: string }) {
  const section = navigationSection(usePathname());
  const { isOpen } = useNotes();
  const active = isOpen ? "notes" : section;
  const current = (item: string) => section === item ? "page" as const : undefined;
  return (
    <nav className={`nav${wide ? " wide-nav" : ""}`} aria-label="主导航">
      <div className={`nav-inner${wide ? " wide-nav-inner" : ""}`}>
        <Link className="brand" href="/" aria-label="VibePolaris 首页">
          <BrandMark size="nav" />
          <strong>VibePolaris</strong>
          <span className="brand-slash">/</span><span className="zh">Vibe指北</span>
        </Link>
        <div className="nav-links">
          <NavIndicator active={active} slot="desktop" />
          <Link href={termSlug ? `/?term=${termSlug}` : "/"} aria-current={current("graph")} data-nav-active={active === "graph"}>星图</Link>
          <Link href="/canvas" aria-current={current("canvas")} data-nav-active={active === "canvas"}>知识画布</Link>
          <Link href="/news" aria-current={current("news")} data-nav-active={active === "news"}>新闻</Link>
          <NotesButton />
          <Link href="/about" aria-current={current("about")} data-nav-active={active === "about"}>关于</Link>
        </div>
        <div className="nav-right">
          <NavIndicator active={active} slot="mobile" />
          <Link className="nav-graph-mobile" href={termSlug ? `/?term=${termSlug}` : "/"} aria-label="打开概念星图" aria-current={current("graph")} data-nav-active={active === "graph"}><span className="brand-star-only" aria-hidden="true" /></Link>
          <Link className="nav-canvas-mobile" href="/canvas" aria-label="知识画布" aria-current={current("canvas")} data-nav-active={active === "canvas"}><Graph size={23} /></Link>
          <NotesButton compact />
          <ThemeStudio />
          <AccountButton />
        </div>
      </div>
    </nav>
  );
}
