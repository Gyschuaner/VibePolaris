import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";
import { HomeDomains } from "@/components/HomeDomains";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export default function HomePage() {
  return (
    <>
      <SiteHeader home />
      <header className="brand-stage home-wrap">
        <div className="brand-stage-lockup">
          <BrandMark size="hero" intro />
          <h1>VibePolaris</h1>
        </div>
      </header>
      <main className="home-wrap home-main">
        <div className="domain-toolbar"><Link href="/terms">查看全部领域 <span aria-hidden="true">→</span></Link></div>
        <HomeDomains />
        <section className="recent-strip" aria-labelledby="recentTitle">
          <h2 id="recentTitle">最近更新</h2>
          <div>
            <Link href="/terms/token">Token 是什么</Link><span>·</span>
            <Link href="/terms/context">上下文 Context 详解</Link><span>·</span>
            <Link href="/terms/api">API 接口基础</Link>
          </div>
        </section>
      </main>
      <SiteFooter home />
    </>
  );
}
