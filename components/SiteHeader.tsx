"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Graph, List, Newspaper, UserCircle, GearSix, Info } from "@phosphor-icons/react/dist/ssr";

import { BrandMark } from "@/components/BrandMark";
import { ThemeStudio } from "@/components/ThemeStudio";
import { NavIndicator } from "@/components/NavIndicator";
import { navigationSection } from "@/lib/site-navigation";
import { AccountButton } from "@/components/account/AccountProvider";
import { siteHome, siteModules } from "@/lib/site-modules";

export function SiteHeader({ wide = false, termSlug }: { wide?: boolean; termSlug?: string }) {
  const pathname = usePathname(), section = navigationSection(pathname);
  const active = section;
  const current = (item: string) => section === item ? "page" as const : undefined;
  const graphUrl = termSlug ? `/?term=${termSlug}` : "/";
  const reading = /^\/(terms|guides|news)\/[^/]+/.test(pathname);
  const mobileTabs = !reading && (siteModules.graph || siteModules.canvas || siteModules.news || siteModules.about);
  const menu = useRef<HTMLDetailsElement>(null);
  const closeMenu = () => { if (menu.current) menu.current.open = false; };
  useEffect(() => {
    const close = (event: PointerEvent) => { if (!menu.current?.contains(event.target as Node)) closeMenu(); };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return <>
    <nav className={`nav${wide ? " wide-nav" : ""}`} aria-label="主导航" data-mobile-tabs={mobileTabs}>
      <div className={`nav-inner${wide ? " wide-nav-inner" : ""}`}>
        <Link className="brand" href={siteHome()} aria-label="VibePolaris 首页">
          <BrandMark size="nav" />
          <strong>VibePolaris</strong>
          <span className="brand-slash">/</span><span className="zh">Vibe指北</span>
        </Link>
        <div className="nav-links">
          <NavIndicator active={active} slot="desktop" />
          {siteModules.graph && <Link href={graphUrl} aria-current={current("graph")} data-nav-active={active === "graph"}>星图</Link>}
          {siteModules.canvas && <Link href="/canvas" aria-current={current("canvas")} data-nav-active={active === "canvas"}>知识画布</Link>}
          {siteModules.news && <Link href="/news" aria-current={current("news")} data-nav-active={active === "news"}>新闻</Link>}
          {siteModules.about && <Link className="nav-about" href="/about" aria-current={current("about")} data-nav-active={active === "about"}>关于</Link>}
        </div>
        <div className="nav-right">
          <ThemeStudio />
          <details ref={menu} className="nav-more" onKeyDown={event => { if (event.key === "Escape") { closeMenu(); menu.current?.querySelector("summary")?.focus(); } }}>
            <summary aria-label="更多导航"><List size={23} /></summary>
            <div className="nav-menu">
              <div className="nav-menu-primary">
                {siteModules.graph && <Link href={graphUrl} onClick={closeMenu}><span className="brand-star-only" aria-hidden="true" />星图</Link>}
                {siteModules.canvas && <Link href="/canvas" onClick={closeMenu}><Graph size={20} />知识画布</Link>}
                {siteModules.news && <Link href="/news" onClick={closeMenu}><Newspaper size={20} />新闻</Link>}
              </div>
              <Link href="/me" onClick={closeMenu}><UserCircle size={20} />我的主页</Link>
              <Link href="/settings" onClick={closeMenu}><GearSix size={20} />设置</Link>
              {siteModules.about && <Link href="/about" onClick={closeMenu}><Info size={20} />关于 VibePolaris</Link>}
            </div>
          </details>
          <AccountButton />
        </div>
      </div>
    </nav>
    {mobileTabs && <nav className="mobile-tabs" aria-label="移动端主导航">
      {siteModules.graph && <Link href={graphUrl} aria-current={current("graph")} data-nav-active={active === "graph"}><span className="brand-star-only" aria-hidden="true" /><span>星图</span></Link>}
      {siteModules.canvas && <Link href="/canvas" aria-current={current("canvas")} data-nav-active={active === "canvas"}><Graph size={22} /><span>画布</span></Link>}
      {siteModules.news && <Link href="/news" aria-current={current("news")} data-nav-active={active === "news"}><Newspaper size={22} /><span>新闻</span></Link>}
      {siteModules.about && <Link href="/about" aria-current={current("about")} data-nav-active={active === "about"}><Info size={22} /><span>关于</span></Link>}
      <Link href="/me" aria-current={current("me")} data-nav-active={active === "me"}><UserCircle size={22} /><span>我的</span></Link>
    </nav>}
  </>;
}
