import Link from "next/link";

import { BrandMark } from "@/components/BrandMark";

export function SiteFooter({ home = false }: { home?: boolean }) {
  return (
    <footer className={`footer${home ? " home-footer" : ""}`}>
      <div className={`${home ? "home-wrap" : "wrap"} footer-inner`}>
        <div>
          <Link className="brand" href="/">
            <BrandMark size="footer" />
            <strong>VibePolaris</strong><span className="brand-slash">/</span><span className="zh">Vibe指北</span>
          </Link>
          <div className="ftag">面向 Vibe Coder 的术语词典与选型指北</div>
        </div>
        <div className="fright">
          <div className="fnav">
            <Link href="/terms">术语</Link><Link href="/guides">选型指南</Link><Link href="/tools">工具</Link><Link href="/about">关于</Link>
          </div>
          © {new Date().getFullYear()} VibePolaris · 构建生成，零运行时 AI
        </div>
      </div>
    </footer>
  );
}
