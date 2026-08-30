import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { FoundationCourseQuiz, HtmlStructureLab } from "@/components/FoundationCoursePractice";
import { CssCourseToc } from "@/components/CssCourseToc";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "HTML 深度教程",
  description: "从文档骨架、语义标签、链接、表单到无障碍，学会让网页结构自己说话。",
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
                  <span className="css-course-title-desktop">HTML：让内容拥有结构，<br />让浏览器读懂页面</span>
                  <span className="css-course-title-mobile">HTML，让结构<br />自己说话</span>
                </h1>
              </div>
            </div>
          </header>

          <div className="css-course-layout">
            <CssCourseToc chapters={chapters} label="HTML 教程章节" />

            <article className="css-course-content">
              <section className="css-course-outcome" aria-labelledby="html-outcome-heading">
                <span>学完以后</span>
                <h2 id="html-outcome-heading">你不必背完所有标签，<br />但应该能读懂一页内容的骨架。</h2>
                <div>
                  <p><strong>01</strong>从标题层级读出页面结构</p>
                  <p><strong>02</strong>为内容选择有含义的标签</p>
                  <p><strong>03</strong>搭出键盘也能操作的表单</p>
                </div>
              </section>

              <section className="css-course-section" id="skeleton">
                <div className="css-course-section-head">
                  <span>01</span>
                  <div><h2>先让浏览器知道这是一张什么页面</h2><p>文档声明、语言、标题和正文，是任何网页最小而完整的骨架。</p></div>
                </div>
                <div className="css-rule-anatomy foundation-code-anatomy" aria-label="HTML 文档骨架">
                  <code>{"<!doctype html>"}<br />{"<html lang=\"zh-CN\">"}<br />&nbsp;&nbsp;{"<head>…</head>"}<br />&nbsp;&nbsp;{"<body>…</body>"}<br />{"</html>"}</code>
                  <div><p><mark>doctype</mark> 使用现代 HTML</p><p><b>head</b> 描述页面</p><p><i>body</i> 放可见内容</p></div>
                </div>
                <h3 className="css-course-lab-title">点一个标签，看代码如何变成可理解的文档结构</h3>
                <HtmlStructureLab />
              </section>

              <section className="css-course-section" id="semantic">
                <div className="css-course-section-head">
                  <span>02</span>
                  <div><h2>标签不只负责包起来，还负责说明含义</h2><p>视觉上都能做成一块，但 header、main、article 和 div 传达的信息不同。</p></div>
                </div>
                <div className="css-layout-compare">
                  <div><span>只有外形</span><h3>所有内容都塞进 div</h3><div className="foundation-stack-visual" aria-hidden="true"><i /><i /><i /></div><code>{"<div><div><div>…"}</code></div>
                  <div><span>结构清楚</span><h3>标签说明区域职责</h3><div className="foundation-stack-visual is-semantic" aria-hidden="true"><i /><i /><i /></div><code>{"<header><main><article>…"}</code></div>
                </div>
                <div className="css-course-principles">
                  <p><strong>先问内容是什么</strong><span>文章、导航、按钮，先按职责命名。</span></p>
                  <p><strong>没有合适语义再用 div</strong><span>div 是容器，不是默认答案。</span></p>
                  <p><strong>别用标题只为放大字</strong><span>h1 到 h6 表达层级，不表达字号。</span></p>
                </div>
              </section>

              <section className="css-course-section" id="content">
                <div className="css-course-section-head">
                  <span>03</span>
                  <div><h2>文本有层级，链接有去向</h2><p>标题帮助扫读，段落承载说明，链接让用户知道会去哪里。</p></div>
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
                  <div><h2>表单不是几个输入框，而是一段完整对话</h2><p>每个输入都要有标签，提交方式要明确，错误信息要能被理解。</p></div>
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
                  <div><h2>先用原生 HTML，把基础无障碍做对</h2><p>能用正确标签解决的问题，不要急着用 aria 或脚本补丁。</p></div>
                </div>
                <ol className="css-debug-list">
                  <li><span>01</span><div><strong>只用键盘走一遍</strong><p>确认所有操作都能聚焦、触发和退出。</p></div></li>
                  <li><span>02</span><div><strong>检查标题顺序</strong><p>页面大纲应当连续，不靠字号猜层级。</p></div></li>
                  <li><span>03</span><div><strong>检查控件名称</strong><p>按钮和输入在离开视觉后仍能被说清。</p></div></li>
                  <li><span>04</span><div><strong>最后再补 aria</strong><p>只补原生语义无法表达的状态和关系。</p></div></li>
                </ol>
              </section>

              <section className="css-course-section" id="practice">
                <div className="css-course-section-head">
                  <span>06</span>
                  <div><h2>最后，用一个真实选择收束</h2><p>正确答案不是“更好看”，而是让结构和操作方式保持一致。</p></div>
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
                  correctText="对。button 自带操作语义、键盘支持和表单行为。"
                  wrongText="外观可以用 CSS 调整；交互控件应先选择语义与行为都正确的元素。"
                />
                <div className="css-course-next">
                  <Link href="/terms/html"><span>回到词条</span><strong>复习 HTML 的 5 分钟版本</strong><ArrowRight size={20} /></Link>
                  <Link href="/guides/css"><span>下一门课</span><strong>用 CSS 安排视觉与布局</strong><ArrowRight size={20} /></Link>
                </div>
              </section>

              <section className="css-course-sources" aria-labelledby="html-sources-heading">
                <div><span>权威资料</span><h2 id="html-sources-heading">需要查标签时，从这里继续</h2></div>
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
