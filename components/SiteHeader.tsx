import Link from "next/link";

import { NotesButton } from "@/components/notes/NotesProvider";
import { BrandMark } from "@/components/BrandMark";
import { ThemeStudio } from "@/components/ThemeStudio";

export function SiteHeader({ wide = false, termSlug }: { wide?: boolean; termSlug?: string }) {
  return (
    <nav className={`nav${wide ? " wide-nav" : ""}`}>
      <div className={`nav-inner${wide ? " wide-nav-inner" : ""}`}>
        <Link className="brand" href="/" aria-label="VibePolaris 首页">
          <BrandMark size="nav" />
          <strong>VibePolaris</strong>
          <span className="brand-slash">/</span><span className="zh">Vibe指北</span>
        </Link>
        <div className="nav-links">
          <Link href={termSlug ? `/?term=${termSlug}` : "/"}>星图</Link>
          <NotesButton />
          <Link href="/about">关于</Link>
        </div>
        <div className="nav-right">
          <Link className="nav-graph-mobile" href={termSlug ? `/?term=${termSlug}` : "/"} aria-label="打开概念星图"><span className="brand-star-only" aria-hidden="true" /></Link>
          <NotesButton compact />
          <ThemeStudio />
        </div>
      </div>
    </nav>
  );
}
