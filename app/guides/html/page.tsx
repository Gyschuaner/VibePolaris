import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { FoundationCourseQuiz, HtmlStructureLab } from "@/components/FoundationCoursePractice";
import { CssCourseToc } from "@/components/CssCourseToc";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "HTML 深度教程",
  description: "用文档结构、语义元素、链接、表单和无障碍规则组织网页内容。",
};

const chapters = [
  ["skeleton", "01", "页面骨架"],
  ["semantic", "02", "语义结构"],
  ["content", "03", "文本与链接"],
  ["forms", "04", "表单与交互"],
  ["accessibility", "05", "无障碍检查"],
  ["practice", "06", "自测与下一步"],
] as const;

export default function HtmlCoursePage() {
  return (
    <>
      <SiteHeader wide />
      <main className="css-course-page">
        <div className="css-course-shell">
          <div className="crumb css-course-crumb"><Link href="/guides">学习与指南</Link> / HTML 深度教程</div>

          <header className="css-course-hero">
            <div className="css-course-hero-lockup">
              <span className="brand-star-only css-course-hero-star" aria-hidden="true" />
              <div>
                <span className="css-course-kicker">VibePolaris Course 02</span>
                <h1>
                  <span className="css-course-title-desktop">HTML：网页内容的<br />结构与语义</span>
                  <span className="css-course-title-mobile">HTML，<br />网页结构与语义</span>
                </h1>
              </div>
            </div>
          </header>

          <div className="css-course-layout">
            <CssCourseToc chapters={chapters} label="HTML 教程章节" />

            <article className="css-course-content">
              <section className="css-course-outcome" aria-labelledby="html-outcome-heading">
                <span>课程目标</span>
                <h2 id="html-outcome-heading">读懂文档层级，选择合适元素，<br />并完成可操作的表单。</h2>
                <div>
                  <p><strong>01</strong>从标题层级读出页面结构</p>
                  <p><strong>02</strong>为内容选择有含义的标签</p>
                  <p><strong>03</strong>搭出键盘也能操作的表单</p>
                </div>
              </section>

              <section className="css-course-section" id="skeleton">
                <div className="css-course-section-head">
                  <span>01</span>
                  <div><h2>HTML 文档的基本结构</h2><p>文档声明、语言、标题和正文组成一个完整页面。</p></div>
                </div>
                <div className="css-rule-anatomy foundation-code-anatomy" aria-label="HTML 文档骨架">
                  <code>{"<!doctype html>"}<br />{"<html lang=\"zh-CN\">"}<br />&nbsp;&nbsp;{"<head>…</head>"}<br />&nbsp;&nbsp;{"<body>…</body>"}<br />{"</html>"}</code>
                  <div><p><mark>doctype</mark> 使用现代 HTML</p><p><b>head</b> 描述页面</p><p><i>body</i> 放可见内容</p></div>
                </div>
                <h3 className="css-course-lab-title">选择一个元素，查看它在文档中的语义</h3>
                <HtmlStructureLab />
              </section>

              <section className="css-course-section" id="semantic">
                <div className="css-course-section-head">
                  <span>02</span>
                  <div><h2>使用语义元素组织内容</h2><p>header、main、article 和 div 对应不同的文档职责。</p></div>
                </div>
                <div className="css-layout-compare">
                  <div><span>只有外形</span><h3>所有内容都塞进 div</h3><div className="foundation-stack-visual" aria-hidden="true"><i /><i /><i /></div><code>{"<div><div><div>…"}</code></div>
                  <div><span>结构清楚</span><h3>标签说明区域职责</h3><div className="foundation-stack-visual is-semantic" aria-hidden="true"><i /><i /><i /></div><code>{"<header><main><article>…"}</code></div>
                </div>
                <div className="css-course-principles">
                  <p><strong>按内容职责选择元素</strong><span>文章、导航和按钮分别使用对应元素。</span></p>
                  <p><strong>无对应语义时使用 div</strong><span>div 只表示通用容器。</span></p>
                  <p><strong>标题元素表达层级</strong><span>h1 到 h6 不用于控制字号。</span></p>
                </div>
              </section>

              <section className="css-course-section" id="content">
                <div className="css-course-section-head">
                  <span>03</span>
                  <div><h2>标题、段落和链接</h2><p>标题建立层级，段落承载说明，链接文字标明目标。</p></div>
                </div>
                <div className="css-cascade-demo">
                  <div className="css-cascade-rules">
                    <p><small>01 · 页面主题</small><code>{"<h1>周末市集指南</h1>"}</code></p>
                    <p><small>02 · 内容章节</small><code>{"<h2>怎么到达</h2>"}</code></p>
                    <p className="is-winner"><small>03 · 明确去向</small><code>{"<a href=\"/map\">查看市集地图</a>"}</code></p>
                  </div>
                  <div className="css-computed-card"><span>读屏顺序</span><strong>h1 → h2 → link</strong><code>结构连续</code><small>链接文字可以独立理解</small></div>
                </div>
              </section>

              <section className="css-course-section" id="forms">
                <div className="css-course-section-head">
                  <span>04</span>
                  <div><h2>表单控件及其关联信息</h2><p>输入需要标签，按钮需要明确类型，错误信息需要关联到对应控件。</p></div>
                </div>
                <div className="css-responsive-code">
                  <div><span>不够完整</span><code>{"<input placeholder=\"邮箱\">"}<br />{"<div>提交</div>"}</code></div>
                  <ArrowRight size={22} aria-hidden="true" />
                  <div><span>语义完整</span><code>{"<label for=\"email\">邮箱</label>"}<br />{"<input id=\"email\" type=\"email\">"}<br />{"<button type=\"submit\">提交</button>"}</code></div>
                </div>
                <ol className="css-responsive-flow">
                  <li><strong>label 说清问题</strong><span>点击文字也能聚焦对应输入。</span></li>
                  <li><strong>type 约束格式</strong><span>浏览器可以提供合适键盘和校验。</span></li>
                  <li><strong>button 说明动作</strong><span>键盘、鼠标和辅助技术都能触发。</span></li>
                </ol>
              </section>

              <section className="css-course-section" id="accessibility">
                <div className="css-course-section-head">
                  <span>05</span>
                  <div><h2>使用原生 HTML 支持无障碍</h2><p>优先使用原生语义；原生元素无法表达时再补充 ARIA。</p></div>
                </div>
                <ol className="css-debug-list">
                  <li><span>01</span><div><strong>只用键盘走一遍</strong><p>确认所有操作都能聚焦、触发和退出。</p></div></li>
                  <li><span>02</span><div><strong>检查标题顺序</strong><p>页面大纲应当连续，不靠字号猜层级。</p></div></li>
                  <li><span>03</span><div><strong>检查控件名称</strong><p>按钮和输入在离开视觉后仍能被说清。</p></div></li>
                  <li><span>04</span><div><strong>必要时补充 ARIA</strong><p>只描述原生语义无法表达的状态和关系。</p></div></li>
                </ol>
              </section>

              <section className="css-course-section" id="practice">
                <div className="css-course-section-head">
                  <span>06</span>
                  <div><h2>知识检查</h2><p>根据控件的行为选择对应的 HTML 元素。</p></div>
                </div>
                <FoundationCourseQuiz
                  name="html-course-quiz"
                  question="一个文字块点击后会提交表单，应该优先用什么元素？"
                  options={[
                    { id: "button", label: "button，并明确 type=\"submit\"" },
                    { id: "div", label: "div，再监听鼠标点击" },
                    { id: "heading", label: "h3，因为它看起来更醒目" },
                  ]}
                  correctId="button"
                  correctText="button 自带操作语义、键盘支持和表单行为。"
                  wrongText="交互控件需要使用语义和行为匹配的元素，外观可由 CSS 调整。"
                />
                <div className="css-course-next">
                  <Link href="/terms/html"><span>回到词条</span><strong>查看 HTML 简版说明</strong><ArrowRight size={20} /></Link>
                  <Link href="/guides/css"><span>相关课程</span><strong>CSS：视觉与布局</strong><ArrowRight size={20} /></Link>
                </div>
              </section>

              <section className="css-course-sources" aria-labelledby="html-sources-heading">
                <div><span>参考资料</span><h2 id="html-sources-heading">查元素、语义和 HTML 标准</h2></div>
                <div>
                  <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content" target="_blank" rel="noreferrer"><strong>MDN · Structuring content</strong><small>系统学习 HTML</small><ArrowUpRight size={18} /></a>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements" target="_blank" rel="noreferrer"><strong>MDN · HTML elements</strong><small>查元素与语义</small><ArrowUpRight size={18} /></a>
                  <a href="https://html.spec.whatwg.org/" target="_blank" rel="noreferrer"><strong>WHATWG · HTML</strong><small>HTML 标准</small><ArrowUpRight size={18} /></a>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
