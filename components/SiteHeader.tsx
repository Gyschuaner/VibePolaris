"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Graph, List, Newspaper, NotePencil, GearSix, Info } from "@phosphor-icons/react/dist/ssr";

import { NotesButton, useNotes } from "@/components/notes/NotesProvider";
import { BrandMark } from "@/components/BrandMark";
import { ThemeStudio } from "@/components/ThemeStudio";
import { NavIndicator } from "@/components/NavIndicator";
import { navigationSection } from "@/lib/site-navigation";
import { AccountButton } from "@/components/account/AccountProvider";

export function SiteHeader({ wide = false, termSlug }: { wide?: boolean; termSlug?: string }) {
  const pathname = usePathname(), section = navigationSection(pathname);
  const { isOpen, open } = useNotes();
  const active = isOpen ? "notes" : section;
  const current = (item: string) => section === item ? "page" as const : undefined;
  const graphUrl = termSlug ? `/?term=${termSlug}` : "/";
  const reading = /^\/(terms|guides|news)\/[^/]+/.test(pathname);
  const menu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => { if (menu.current) menu.current.open = false; };
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) closeMenu(); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return <>
    <nav className={`nav${wide ? " wide-nav" : ""}`} aria-label="主导航" data-mobile-tabs={!reading}>
      <div className={`nav-inner${wide ? " wide-nav-inner" : ""}`}>
        <Link className="brand" href="/" aria-label="VibePolaris 首页">
          <BrandMark size="nav" />
          <strong>VibePolaris</strong>
          <span className="brand-slash">/</span><span className="zh">Vibe指北</span>
        </Link>
        <div className="nav-links">
          <NavIndicator active={active} slot="desktop" />
          <Link href={graphUrl} aria-current={current("graph")} data-nav-active={active === "graph"}>星图</Link>
          <Link href="/canvas" aria-current={current("canvas")} data-nav-active={active === "canvas"}>知识画布</Link>
          <Link href="/news" aria-current={current("news")} data-nav-active={active === "news"}>新闻</Link>
          <NotesButton />
          <Link className="nav-about" href="/about" aria-current={current("about")} data-nav-active={active === "about"}>关于</Link>
        </div>
        <div className="nav-right">
          <ThemeStudio />
          <details ref={menu} className="nav-more" onKeyDown={event => { if (event.key === "Escape") { closeMenu(); menu.current?.querySelector("summary")?.focus(); } }}>
            <summary aria-label="更多导航"><List size={23} /></summary>
            <div className="nav-menu">
              <div className="nav-menu-primary">
                <Link href={graphUrl} onClick={closeMenu}><span className="brand-star-only" aria-hidden="true" />星图</Link>
                <Link href="/canvas" onClick={closeMenu}><Graph size={20} />知识画布</Link>
                <Link href="/news" onClick={closeMenu}><Newspaper size={20} />新闻</Link>
                <button onClick={() => { closeMenu(); open(); }}><NotePencil size={20} />我的笔记</button>
              </div>
              <Link href="/settings" onClick={closeMenu}><GearSix size={20} />设置</Link>
              <Link href="/about" onClick={closeMenu}><Info size={20} />关于 VibePolaris</Link>
            </div>
          </details>
          <AccountButton />
        </div>
      </div>
    </nav>
    {!reading && <nav className="mobile-tabs" aria-label="移动端主导航">
      <Link href={graphUrl} aria-current={current("graph")} data-nav-active={active === "graph"}><span className="brand-star-only" aria-hidden="true" /><span>星图</span></Link>
      <Link href="/canvas" aria-current={current("canvas")} data-nav-active={active === "canvas"}><Graph size={22} /><span>画布</span></Link>
      <Link href="/news" aria-current={current("news")} data-nav-active={active === "news"}><Newspaper size={22} /><span>新闻</span></Link>
      <button onClick={() => open()} aria-haspopup="dialog" aria-expanded={isOpen} aria-controls="notes-library" data-nav-active={isOpen}><NotePencil size={22} /><span>笔记</span></button>
    </nav>}
  </>;
}
