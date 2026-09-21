import type { Metadata } from "next";
import Link from "next/link";

import { CopyButton } from "@/components/CopyButton";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "AI 模型 / 编程工具怎么选",
  description: "场景、约束、候选对比、推荐结论与可以直接使用的需求说法。",
};

const prompt = `【我要做】一个 ______（一句话产品）
【技术约束】我用 ______（如 Lovable / Cursor），不会写代码，要求不装本地环境
【功能范围】第一版只要 ______、______、______ 三个功能，其余都不要
【交付标准】做完告诉我：怎么发布上线、怎么改文案、出问题把报错原样贴给谁`;

export default function GuidesPage() {
  return (
    <>
      <SiteHeader />
      <main className="guide wrap">
        <div className="crumb"><Link href="/guides">选型指南</Link> / AI 模型 / 编程工具怎么选</div>
        <h1>《AI 模型 / 编程工具怎么选》</h1>
        <div className="g-meta"><span>更新于 2026-08-28</span><span>·</span><span>超过 90 天请重新核对</span><span>·</span><span>人工整理，非 AI 生成</span></div>
        <section className="g-sect">
          <h2>先说结论</h2>
          <div className="verdict">
            <p><strong>不会写代码、想把想法做成能用的东西：</strong>生成式建站工具起步，遇到坎再把具体报错交给对话模型。</p>
            <p><strong>有一点基础、想认真做产品：</strong>AI 编辑器配合强推理模型做主力，预算敏感时切换低成本模型。</p>
            <p><strong>是开发者、要控盘大项目：</strong>终端或桌面编程 Agent 接进现有仓库，模型按任务混用。</p>
          </div>
        </section>
        <section className="g-sect">
          <h2>先问自己三个问题</h2>
          <ul>
            <li><strong>写不写代码？</strong>完全不写选生成式建站；看得懂报错选 AI 编辑器；直接写选编程 Agent。</li>
            <li><strong>预算多少？</strong>先用免费额度试水，真正长期使用再比较订阅和按量成本。</li>
            <li><strong>做多复杂？</strong>单页小工具选择很多；有登录、数据库、支付时，优先选择代码可见且能本地运行的方案。</li>
          </ul>
        </section>
        <section className="g-sect">
          <h2>对话模型：怎么选脑子</h2>
          <table className="cmp"><thead><tr><th>候选</th><th>定位</th><th>擅长</th><th>注意</th></tr></thead><tbody>
            <tr><td>Claude</td><td>长任务与代码主力</td><td>大改动、复杂指令与长文档</td><td>价格与限额会变化</td></tr>
            <tr><td>GPT 系</td><td>生态完整的通用助手</td><td>多模态、工具与通用任务</td><td>产品层级较多</td></tr>
            <tr><td>DeepSeek</td><td>性价比路线</td><td>推理、中文与批量调用</td><td>服务体验会波动</td></tr>
            <tr><td>Gemini</td><td>长上下文路线</td><td>读取超长文档与多模态资料</td><td>输出风格需约束</td></tr>
          </tbody></table>
        </section>
        <section className="g-sect">
          <h2>编程工具：怎么选工位</h2>
          <table className="cmp"><thead><tr><th>候选</th><th>定位</th><th>适合谁</th><th>注意</th></tr></thead><tbody>
            <tr><td>Cursor</td><td>AI 原生代码编辑器</td><td>半专业与专业开发者</td><td>仍需理解项目代码</td></tr>
            <tr><td>Codex / Claude Code</td><td>编程 Agent</td><td>接现有仓库持续开发</td><td>需要版本控制习惯</td></tr>
            <tr><td>Lovable / Bolt</td><td>自然语言生成应用</td><td>不写代码的创作者</td><td>复杂逻辑与迁移需提前验证</td></tr>
            <tr><td>v0</td><td>生成界面与组件</td><td>重视前端呈现的人</td><td>后端能力需另行组合</td></tr>
          </tbody></table>
        </section>
        <section className="g-sect">
          <h2>向 AI 这样说</h2>
          <p>选型定了之后，把边界一次说清楚：</p>
          <div className="codecard"><CopyButton text={prompt} /><span>{prompt}</span></div>
        </section>
        <section className="g-sect">
          <h2>相关术语</h2>
          <div className="related"><Link href="/terms/llm">大模型 LLM</Link><Link href="/terms/prompt">提示词 Prompt</Link><Link href="/terms/agent">智能体 Agent</Link><Link href="/terms/api">API 接口</Link></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
