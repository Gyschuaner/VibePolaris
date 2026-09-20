import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { ThemeStudio } from "@/components/ThemeStudio";

export function SiteHeader({ home = false, wide = false, termSlug }: { home?: boolean; wide?: boolean; termSlug?: string }) {
  return (
    <nav className={`nav${home ? " home-nav" : ""}${wide ? " wide-nav" : ""}`}>
      <div className={`nav-inner${home ? " home-nav-inner" : ""}${wide ? " wide-nav-inner" : ""}`}>
        <Link className="brand" href="/" aria-label="VibePolaris 首页">
          <BrandMark size="nav" />
          <strong>VibePolaris</strong>
          {!home && <><span className="brand-slash">/</span><span className="zh">Vibe指北</span></>}
        </Link>
        <div className="nav-links">
          <Link href="/terms">术语</Link>
          <Link href={termSlug ? `/graph?term=${termSlug}` : "/graph"}>星图</Link>
          <Link href="/guides">选型指南</Link>
          <Link href="/tools">工具</Link>
          <Link href="/about">关于</Link>
        </div>
        <div className="nav-right">
          <Link className="nav-graph-mobile" href={termSlug ? `/graph?term=${termSlug}` : "/graph"} aria-label="打开概念星图"><span className="brand-star-only" aria-hidden="true" /></Link>
          {home && (
            <form className="nav-search" action="/terms" method="get" role="search">
              <button className="nav-search-submit" type="submit" aria-label="提交搜索">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </button>
              <input name="q" aria-label="搜索术语或技术领域" placeholder="搜索术语或技术领域" autoComplete="off" />
            </form>
          )}
          <ThemeStudio />
        </div>
      </div>
    </nav>
  );
}
