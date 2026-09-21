import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "关于",
  description: "VibePolaris 是什么、为什么零内置 AI、接下来做什么。",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main className="detail wrap">
        <h1 className="page-title">关于 VibePolaris</h1>
        <div className="d-meta about-meta"><span className="chip">关于</span></div>
        <section className="d-sect about-first"><h2>这是什么</h2><div className="def">
          <p>VibePolaris（Vibe 指北）是一份给 Vibe Coder 的随身词典与指北针：把你心里的大白话，翻译成 AI 听得懂的准确术语，通过概念星图与互动教程理解它们之间的联系。</p>
          <p className="about-paragraph">名字里的 Polaris 是北极星——夜航的人不需要引擎，只需要一颗不会迷路的星。</p>
        </div></section>
        <section className="d-sect"><h2>为什么这里没有任何 AI 功能</h2><div className="def"><p>本站<strong>零内置 AI</strong>：没有聊天机器人，没有算法推荐，不追踪你。术语通过图文与互动演示讲解。教你驾驭 AI 的站点，自己先保持干净——这是立场，不是能力限制。</p></div></section>
        <section className="d-sect"><h2>接下来</h2><div className="def"><ul className="about-list"><li>术语图鉴从 20 条持续扩充到 100+</li><li>补充概念之间的联系与互动教程</li><li>规划练习挑战、案例拆解与完整学习路线</li></ul></div></section>
        <section className="d-sect"><div className="related"><Link href="/">探索概念星图</Link></div></section>
      </main>
      <SiteFooter />
    </>
  );
}
