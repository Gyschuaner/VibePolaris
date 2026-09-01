import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ToolsBrowser } from "@/components/ToolsBrowser";
import { tools } from "@/lib/content";

export const metadata: Metadata = {
  title: "工具导航",
  description: "AI 编程工具、模型与配套服务精选导航，按标签筛选。",
};

export default function ToolsPage() {
  return (
    <>
      <SiteHeader />
      <main className="wrap page-main">
        <h1 className="page-title">工具导航</h1>
        <p className="page-intro">精选 AI 编程工具与配套服务，本站零内置 AI，内容来自构建期数据。</p>
        <ToolsBrowser tools={tools} />
        <Link className="guidelink" href="/guides">不知道怎么选？看精选指北 · 《AI 模型 / 编程工具怎么选》→</Link>
      </main>
      <SiteFooter />
    </>
  );
}
