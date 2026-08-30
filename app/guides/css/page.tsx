import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight, Clock, Crosshair, ListChecks } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { CssCourseQuiz, CssSelectorLab } from "@/components/CssCoursePractice";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "CSS 深度教程",
  description: "从选择器、层叠、布局、响应式到浏览器调试，建立一套真正可迁移的 CSS 判断方法。",
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
      <main className="css-course-page">
        <div className="css-course-shell">
          <div className="crumb css-course-crumb"><Link href="/guides">学习与指南</Link> / CSS 深度教程</div>

          <header className="css-course-hero">
            <div className="css-course-hero-lockup">
              <span className="brand-star-only css-course-hero-star" aria-hidden="true" />
              <div>
                <span className="css-course-kicker">VibePolaris Course 01</span>
                <h1>
                  <span className="css-course-title-desktop">CSS：从“改样式”到<br />“看懂浏览器怎么决定”</span>
                  <span className="css-course-title-mobile">CSS，先看懂<br />浏览器怎么决定</span>
                </h1>
              </div>
            </div>
            <p>不背属性表。用规则、最终值和三个真实问题，建立一套能带到任何项目里的判断方法。</p>
            <div className="css-course-meta" aria-label="课程信息">
              <span><ListChecks size={18} />6 章</span>
              <span><Clock size={18} />约 35 分钟</span>
              <span><Crosshair size={18} />3 个动手节点</span>
            </div>
          </header>

          <div className="css-course-layout">
            <aside className="css-course-toc" aria-label="CSS 教程章节">
              <span>课程目录</span>
              <nav>
                {chapters.map(([id, number, title]) => (
                  <a key={id} href={`#${id}`}><small>{number}</small><strong>{title}</strong></a>
                ))}
              </nav>
            </aside>

            <article className="css-course-content">
              <section className="css-course-outcome" aria-labelledby="course-outcome-heading">
                <span>学完以后</span>
                <h2 id="course-outcome-heading">你不必记住所有 CSS，<br />但应该知道去哪里找答案。</h2>
                <div>
                  <p><strong>01</strong>判断一条规则到底选中了谁</p>
                  <p><strong>02</strong>解释最终样式为什么是这个值</p>
                  <p><strong>03</strong>在桌面和手机之间做稳定重排</p>
                </div>
              </section>

              <section className="css-course-section" id="rule">
                <div className="css-course-section-head">
                  <span>01</span>
                  <div><h2>先看懂一条 CSS 规则</h2><p>选择器找到元素，声明告诉浏览器如何呈现。</p></div>
                </div>
                <div className="css-rule-anatomy" aria-label="CSS 规则结构">
                  <code><mark>.course-card</mark> <span>{"{"}</span><br />&nbsp;&nbsp;<b>padding</b>: <i>24px</i>;<br /><span>{"}"}</span></code>
                  <div><p><mark>选择器</mark> 找到谁</p><p><b>属性</b> 改什么</p><p><i>值</i> 改成什么</p></div>
                </div>
                <h3 className="css-course-lab-title">点一个选择器，看它对应页面的哪一块</h3>
                <CssSelectorLab />
              </section>

              <section className="css-course-section" id="cascade">
                <div className="css-course-section-head">
                  <span>02</span>
                  <div><h2>页面不听话，通常不是 CSS 失效了</h2><p>浏览器只是从多条候选规则里，算出了另一条最终值。</p></div>
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
                  <p><strong>先看有没有命中</strong><span>选择器不匹配，后面都不用算。</span></p>
                  <p><strong>再看谁更具体</strong><span>更具体的选择器通常拥有更高优先级。</span></p>
                  <p><strong>最后看出现顺序</strong><span>优先级相同时，靠后的规则获胜。</span></p>
                </div>
              </section>

              <section className="css-course-section" id="layout">
                <div className="css-course-section-head">
                  <span>03</span>
                  <div><h2>Flex 负责一条线，Grid 负责一张网</h2><p>先判断关系，再选工具，比背属性快得多。</p></div>
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
                  <div><h2>响应式不是缩小，是重新安排关系</h2><p>内容不变，空间改变；在必要的断点重排它们。</p></div>
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
                  <li><strong>看现状</strong><span>当前值来自哪条规则？</span></li>
                  <li><strong>找临界点</strong><span>什么时候开始挤压或溢出？</span></li>
                  <li><strong>只做重排</strong><span>保留内容，用媒体查询改变布局。</span></li>
                </ol>
              </section>

              <section className="css-course-section" id="debug">
                <div className="css-course-section-head">
                  <span>05</span>
                  <div><h2>在浏览器里沿着结果往回找</h2><p>不要盲改代码。先把问题定位到元素、规则和视口。</p></div>
                </div>
                <ol className="css-debug-list">
                  <li><span>1</span><div><strong>选中元素</strong><p>用检查器点中真正出问题的节点。</p></div></li>
                  <li><span>2</span><div><strong>看 Styles</strong><p>确认规则是否命中、是否被划掉。</p></div></li>
                  <li><span>3</span><div><strong>看 Computed</strong><p>确认浏览器最终采用的值和来源。</p></div></li>
                  <li><span>4</span><div><strong>复现视口</strong><p>切到目标宽度，再写最小范围的修正。</p></div></li>
                </ol>
              </section>

              <section className="css-course-section" id="practice">
                <div className="css-course-section-head">
                  <span>06</span>
                  <div><h2>最后，用一个判断题收束</h2><p>正确答案不是某条语法，而是一条可靠的排查路径。</p></div>
                </div>
                <CssCourseQuiz />
                <div className="css-course-next">
                  <Link href="/terms/css"><span>回到词条</span><strong>复习 CSS 的 5 分钟版本</strong><ArrowRight size={20} /></Link>
                  <Link href="/terms/responsive"><span>下一颗星</span><strong>继续理解响应式布局</strong><ArrowRight size={20} /></Link>
                </div>
              </section>

              <section className="css-course-sources" aria-labelledby="course-sources-heading">
                <div><span>权威资料</span><h2 id="course-sources-heading">需要查语法时，从这里继续</h2></div>
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
      <SiteFooter />
    </>
  );
}
