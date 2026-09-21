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
          <div className="ftag">面向 Vibe Coder 的术语词典与概念星图</div>
        </div>
        <div className="fright">
          <div className="fnav">
            <Link href="/">星图</Link><Link href="/about">关于</Link>
          </div>
          © {new Date().getFullYear()} VibePolaris · 静态内容，不在浏览器调用模型
        </div>
      </div>
    </footer>
  );
}
