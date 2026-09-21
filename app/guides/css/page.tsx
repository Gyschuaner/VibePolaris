import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { CssCourseQuiz, CssSelectorLab } from "@/components/CssCoursePractice";
import { CssCourseToc } from "@/components/CssCourseToc";
import { ReadingNotes } from "@/components/notes/ReadingNotes";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "CSS 深度教程",
  description: "用选择器、层叠规则、Flex、Grid、媒体查询和浏览器工具，定位常见的 CSS 问题。",
};

const chapters = [
  ["rule", "01", "规则与选择器"],
  ["cascade", "02", "层叠与最终值"],
  ["layout", "03", "Flex 与 Grid"],
  ["responsive", "04", "响应式"],
  ["debug", "05", "浏览器调试"],
  ["practice", "06", "自测与下一步"],
] as const;

export default function CssCoursePage() {
  return (
    <>
      <SiteHeader wide />
      <ReadingNotes path="/guides/css" title="CSS 深度教程" layout="course">
      <main className="css-course-page">
        <div className="css-course-shell">
          <div className="crumb css-course-crumb"><Link href="/guides">学习与指南</Link> / CSS 深度教程</div>

          <header className="css-course-hero">
            <div className="css-course-hero-lockup">
              <span className="brand-star-only css-course-hero-star" aria-hidden="true" />
              <div>
                <span className="css-course-kicker">VibePolaris Course 01</span>
                <h1>
                  <span className="css-course-title-desktop">CSS：浏览器如何<br />计算和呈现样式</span>
                  <span className="css-course-title-mobile">CSS，<br />样式如何生效</span>
                </h1>
              </div>
            </div>
          </header>

          <div className="css-course-layout">
            <CssCourseToc chapters={chapters} label="CSS 教程章节" />

            <article className="css-course-content">
              <section className="css-course-outcome" aria-labelledby="course-outcome-heading">
                <span>课程目标</span>
                <h2 id="course-outcome-heading">判断规则是否命中，<br />确认最终值并调整布局。</h2>
                <div>
                  <p><strong>01</strong>确认选择器匹配了哪些元素</p>
                  <p><strong>02</strong>解释最终样式值的来源</p>
                  <p><strong>03</strong>在不同视口宽度下调整布局</p>
                </div>
              </section>

              <section className="css-course-section" id="rule">
                <div className="css-course-section-head">
                  <span>01</span>
                  <div><h2>CSS 规则的组成</h2><p>选择器匹配元素，声明指定属性和值。</p></div>
                </div>
                <div className="css-rule-anatomy" aria-label="CSS 规则结构">
                  <code><mark>.course-card</mark> <span>{"{"}</span><br />&nbsp;&nbsp;<b>padding</b>: <i>24px</i>;<br /><span>{"}"}</span></code>
                  <div><p><mark>选择器</mark> 找到谁</p><p><b>属性</b> 改什么</p><p><i>值</i> 改成什么</p></div>
                </div>
                <h3 className="css-course-lab-title">选择一个规则，查看它匹配的页面区域</h3>
                <CssSelectorLab />
              </section>

              <section className="css-course-section" id="cascade">
                <div className="css-course-section-head">
                  <span>02</span>
                  <div><h2>确认最终样式来自哪条规则</h2><p>浏览器会比较匹配结果、优先级和规则出现顺序。</p></div>
                </div>
                <div className="css-cascade-demo">
                  <div className="css-cascade-rules">
                    <p><small>01 · 基础规则</small><code>.card h3 {`{ color: #171A15; }`}</code></p>
                    <p><small>02 · 主题规则</small><code>.dark .card h3 {`{ color: #EDF1E8; }`}</code></p>
                    <p className="is-winner"><small>03 · 当前命中</small><code>.course-card h3 {`{ color: #35502B; }`}</code></p>
                  </div>
                  <div className="css-computed-card">
                    <span>Computed</span>
                    <strong>color</strong>
                    <code>rgb(53, 80, 43)</code>
                    <small>来自 .course-card h3</small>
                  </div>
                </div>
                <div className="css-course-principles">
                  <p><strong>检查选择器是否匹配</strong><span>不匹配的规则不会参与计算。</span></p>
                  <p><strong>比较选择器优先级</strong><span>优先级更高的声明会覆盖较低者。</span></p>
                  <p><strong>检查规则出现顺序</strong><span>优先级相同时，靠后的规则生效。</span></p>
                </div>
              </section>

              <section className="css-course-section" id="layout">
                <div className="css-course-section-head">
                  <span>03</span>
                  <div><h2>Flex 与 Grid 的适用范围</h2><p>Flex 处理单个方向的排列，Grid 处理行列布局。</p></div>
                </div>
                <div className="css-layout-compare">
                  <div>
                    <span>一维 · Flex</span>
                    <h3>导航、按钮组、横向排列</h3>
                    <div className="css-flex-visual" aria-hidden="true"><i /><i /><i /></div>
                    <code>display: flex;<br />gap: 12px;</code>
                  </div>
                  <div>
                    <span>二维 · Grid</span>
                    <h3>卡片墙、章节区、整体布局</h3>
                    <div className="css-grid-visual" aria-hidden="true"><i /><i /><i /><i /></div>
                    <code>display: grid;<br />grid-template-columns: repeat(2, 1fr);</code>
                  </div>
                </div>
              </section>

              <section className="css-course-section" id="responsive">
                <div className="css-course-section-head">
                  <span>04</span>
                  <div><h2>使用媒体查询调整布局</h2><p>根据可用宽度修改列数和排列方式。</p></div>
                </div>
                <div className="css-responsive-code">
                  <div>
                    <span>宽屏</span>
                    <code>.course-grid {`{`}<br />&nbsp;&nbsp;grid-template-columns: repeat(3, 1fr);<br />{`}`}</code>
                  </div>
                  <ArrowRight size={22} aria-hidden="true" />
                  <div>
                    <span>≤ 640px</span>
                    <code>@media (max-width: 640px) {`{`}<br />&nbsp;&nbsp;.course-grid {`{ grid-template-columns: 1fr; }`}<br />{`}`}</code>
                  </div>
                </div>
                <ol className="css-responsive-flow">
                  <li><strong>确认当前规则</strong><span>查看列数和宽度来自哪个声明。</span></li>
                  <li><strong>确定断点</strong><span>记录开始挤压或溢出的视口宽度。</span></li>
                  <li><strong>修改布局</strong><span>保留内容，用媒体查询调整排列。</span></li>
                </ol>
              </section>

              <section className="css-course-section" id="debug">
                <div className="css-course-section-head">
                  <span>05</span>
                  <div><h2>使用浏览器检查样式</h2><p>把问题定位到具体元素、命中规则和视口宽度。</p></div>
                </div>
                <ol className="css-debug-list">
                  <li><span>1</span><div><strong>选中元素</strong><p>用检查器定位出现问题的节点。</p></div></li>
                  <li><span>2</span><div><strong>看 Styles</strong><p>确认规则是否命中、是否被划掉。</p></div></li>
                  <li><span>3</span><div><strong>看 Computed</strong><p>确认浏览器最终采用的值和来源。</p></div></li>
                  <li><span>4</span><div><strong>复现视口</strong><p>切到目标宽度，再写最小范围的修正。</p></div></li>
                </ol>
              </section>

              <section className="css-course-section" id="practice">
                <div className="css-course-section-head">
                  <span>06</span>
                  <div><h2>知识检查</h2><p>根据命中规则和视口宽度，选择合适的处理方式。</p></div>
                </div>
                <CssCourseQuiz />
                <div className="css-course-next">
                  <Link href="/terms/component"><span>相关词条</span><strong>组件：复用界面结构</strong><ArrowRight size={20} /></Link>
                  <Link href="/terms/props"><span>相关词条</span><strong>Props：传入组件的数据</strong><ArrowRight size={20} /></Link>
                </div>
              </section>

              <section className="css-course-sources" aria-labelledby="course-sources-heading">
                <div><span>参考资料</span><h2 id="course-sources-heading">查属性、语法和布局规则</h2></div>
                <div>
                  <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics" target="_blank" rel="noreferrer"><strong>MDN · CSS 基础</strong><small>结构化入门</small><ArrowUpRight size={18} /></a>
                  <a href="https://web.dev/learn/css" target="_blank" rel="noreferrer"><strong>web.dev · Learn CSS</strong><small>现代布局与实践</small><ArrowUpRight size={18} /></a>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/Reference" target="_blank" rel="noreferrer"><strong>MDN · CSS 参考</strong><small>查属性与语法</small><ArrowUpRight size={18} /></a>
                </div>
              </section>
            </article>
          </div>
        </div>
      </main>
      </ReadingNotes>
      <SiteFooter />
    </>
  );
}
