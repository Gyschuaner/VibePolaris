import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { FoundationCourseQuiz, JavaScriptStateLab } from "@/components/FoundationCoursePractice";
import { CssCourseToc } from "@/components/CssCourseToc";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "JavaScript 深度教程",
  description: "从值、函数、事件、状态到异步与调试，学会让网页交互保持可预测。",
};

const chapters = [
  ["values", "01", "值与变量"],
  ["functions", "02", "条件与函数"],
  ["events", "03", "事件与状态"],
  ["async", "04", "异步与请求"],
  ["debug", "05", "错误与调试"],
  ["practice", "06", "自测与下一步"],
] as const;

export default function JavaScriptCoursePage() {
  return (
    <>
      <SiteHeader wide />
      <main className="css-course-page">
        <div className="css-course-shell">
          <div className="crumb css-course-crumb"><Link href="/guides">学习与指南</Link> / JavaScript 深度教程</div>

          <header className="css-course-hero">
            <div className="css-course-hero-lockup">
              <span className="brand-star-only css-course-hero-star" aria-hidden="true" />
              <div>
                <span className="css-course-kicker">VibePolaris Course 03</span>
                <h1>
                  <span className="css-course-title-desktop">JavaScript：让交互发生，<br />让状态保持可预测</span>
                  <span className="css-course-title-mobile">JavaScript，<br />让状态可预测</span>
                </h1>
              </div>
            </div>
          </header>

          <div className="css-course-layout">
            <CssCourseToc chapters={chapters} label="JavaScript 教程章节" />

            <article className="css-course-content">
              <section className="css-course-outcome" aria-labelledby="javascript-outcome-heading">
                <span>学完以后</span>
                <h2 id="javascript-outcome-heading">你不必背完所有 API，<br />但应该能沿着一次交互找到数据怎么变。</h2>
                <div>
                  <p><strong>01</strong>分清值、变量和数据类型</p>
                  <p><strong>02</strong>把一段行为收进可复用函数</p>
                  <p><strong>03</strong>追踪事件、状态和界面反馈</p>
                </div>
              </section>

              <section className="css-course-section" id="values">
                <div className="css-course-section-head">
                  <span>01</span>
                  <div><h2>先看数据是什么，再决定怎么处理</h2><p>字符串、数字和布尔值长得接近，能做的事情却不同。</p></div>
                </div>
                <div className="css-rule-anatomy foundation-code-anatomy" aria-label="JavaScript 变量结构">
                  <code><mark>const</mark> city = <i>&quot;杭州&quot;</i>;<br /><mark>let</mark> count = <b>0</b>;<br /><mark>const</mark> saved = <b>false</b>;</code>
                  <div><p><mark>const</mark> 不重新赋值</p><p><b>let</b> 允许状态变化</p><p><i>typeof</i> 检查类型</p></div>
                </div>
                <div className="css-course-principles">
                  <p><strong>名字说明用途</strong><span>userCount 比 x 更容易追踪。</span></p>
                  <p><strong>默认优先 const</strong><span>只有重新赋值时再使用 let。</span></p>
                  <p><strong>不要靠隐式转换猜</strong><span>输入、计算和显示前确认类型。</span></p>
                </div>
              </section>

              <section className="css-course-section" id="functions">
                <div className="css-course-section-head">
                  <span>02</span>
                  <div><h2>函数把“输入—处理—输出”收成一件事</h2><p>先让一段逻辑只负责一个目标，再讨论是否复用。</p></div>
                </div>
                <div className="css-cascade-demo">
                  <div className="css-cascade-rules">
                    <p><small>01 · 输入</small><code>price = 68, discount = 0.8</code></p>
                    <p><small>02 · 处理</small><code>const total = price * discount</code></p>
                    <p className="is-winner"><small>03 · 输出</small><code>return Math.round(total)</code></p>
                  </div>
                  <div className="css-computed-card"><span>调用结果</span><strong>getSalePrice(68, 0.8)</strong><code>54</code><small>相同输入得到可检查的结果</small></div>
                </div>
                <div className="css-course-principles">
                  <p><strong>参数是输入口</strong><span>别让函数偷偷依赖太多外部变量。</span></p>
                  <p><strong>return 是输出口</strong><span>结果明确，调用方才能继续处理。</span></p>
                  <p><strong>条件只表达分支</strong><span>把“什么时候”与“做什么”分开。</span></p>
                </div>
              </section>

              <section className="css-course-section" id="events">
                <div className="css-course-section-head">
                  <span>03</span>
                  <div><h2>一次点击，会穿过事件、状态和界面</h2><p>把这条路径拆开看，交互卡住时才知道该查哪里。</p></div>
                </div>
                <h3 className="css-course-lab-title">切换三个阶段，看同一次收藏操作如何流动</h3>
                <JavaScriptStateLab />
                <ol className="css-responsive-flow">
                  <li><strong>事件</strong><span>用户做了什么，在哪里发生。</span></li>
                  <li><strong>状态</strong><span>这次操作让哪份数据发生变化。</span></li>
                  <li><strong>渲染</strong><span>界面如何把新状态反馈给用户。</span></li>
                </ol>
              </section>

              <section className="css-course-section" id="async">
                <div className="css-course-section-head">
                  <span>04</span>
                  <div><h2>请求在路上时，界面也要有状态</h2><p>异步不是“晚一点执行”，而是结果到达前程序还会继续做别的事。</p></div>
                </div>
                <div className="css-responsive-code">
                  <div><span>发起请求</span><code>status = &quot;loading&quot;;<br />const response = await fetch(&quot;/api/saves&quot;);</code></div>
                  <ArrowRight size={22} aria-hidden="true" />
                  <div><span>处理结果</span><code>if (!response.ok) throw new Error();<br />status = &quot;success&quot;;</code></div>
                </div>
                <ol className="css-responsive-flow">
                  <li><strong>loading</strong><span>阻止重复提交，并告诉用户正在处理。</span></li>
                  <li><strong>success</strong><span>更新数据，同时给出明确反馈。</span></li>
                  <li><strong>error</strong><span>保留上下文，允许用户安全重试。</span></li>
                </ol>
              </section>

              <section className="css-course-section" id="debug">
                <div className="css-course-section-head">
                  <span>05</span>
                  <div><h2>不要猜程序怎么跑，让证据把路径照亮</h2><p>从复现、输入、分支到输出，逐段缩小问题范围。</p></div>
                </div>
                <ol className="css-debug-list">
                  <li><span>01</span><div><strong>稳定复现</strong><p>写下触发步骤、输入和实际结果。</p></div></li>
                  <li><span>02</span><div><strong>看 Console</strong><p>先处理第一个真正的错误，而不是后续连锁反应。</p></div></li>
                  <li><span>03</span><div><strong>设断点</strong><p>观察变量如何穿过条件和函数。</p></div></li>
                  <li><span>04</span><div><strong>验证失败分支</strong><p>断网、空值和重复点击也要有可预期结果。</p></div></li>
                </ol>
              </section>

              <section className="css-course-section" id="practice">
                <div className="css-course-section-head">
                  <span>06</span>
                  <div><h2>最后，用一条可靠的数据路径收束</h2><p>页面没更新时，先判断事件、状态还是渲染断在了哪里。</p></div>
                </div>
                <FoundationCourseQuiz
                  name="javascript-course-quiz"
                  question="点击收藏后数字不变，最稳妥的第一步是什么？"
                  options={[
                    { id: "trace", label: "确认点击事件是否触发，再观察 count 是否更新" },
                    { id: "timeout", label: "加一个 setTimeout，让它晚一点再更新" },
                    { id: "reload", label: "每次点击都刷新整个页面" },
                  ]}
                  correctId="trace"
                  correctText="对。沿着事件 → 状态 → 界面的路径检查，能最快确定断点。"
                  wrongText="等待或刷新可能掩盖问题；先拿到事件和状态变化的证据。"
                />
                <div className="css-course-next">
                  <Link href="/terms/javascript"><span>回到词条</span><strong>复习 JavaScript 的 5 分钟版本</strong><ArrowRight size={20} /></Link>
                  <Link href="/terms/dom"><span>下一颗星</span><strong>继续理解 DOM</strong><ArrowRight size={20} /></Link>
                </div>
              </section>

              <section className="css-course-sources" aria-labelledby="javascript-sources-heading">
                <div><span>权威资料</span><h2 id="javascript-sources-heading">需要查语言和 Web API 时，从这里继续</h2></div>
                <div>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" target="_blank" rel="noreferrer"><strong>MDN · JavaScript Guide</strong><small>系统学习语言基础</small><ArrowUpRight size={18} /></a>
                  <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting" target="_blank" rel="noreferrer"><strong>MDN · Dynamic scripting</strong><small>从页面交互入门</small><ArrowUpRight size={18} /></a>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference" target="_blank" rel="noreferrer"><strong>MDN · JavaScript Reference</strong><small>查语法与内置对象</small><ArrowUpRight size={18} /></a>
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
