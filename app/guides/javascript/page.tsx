import type { Metadata } from "next";
import { ArrowRight, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

import { FoundationCourseQuiz, JavaScriptStateLab } from "@/components/FoundationCoursePractice";
import { CssCourseToc } from "@/components/CssCourseToc";
import { ReadingNotes } from "@/components/notes/ReadingNotes";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "JavaScript 深度教程",
  description: "用变量、函数、事件、异步请求和浏览器调试工具，梳理网页交互的实际执行过程。",
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
      <ReadingNotes path="/guides/javascript" title="JavaScript 深度教程" layout="course">
      <main className="css-course-page">
        <div className="css-course-shell">
          <div className="crumb css-course-crumb"><Link href="/terms/javascript">JavaScript</Link> / JavaScript 深度教程</div>

          <header className="css-course-hero">
            <div className="css-course-hero-lockup">
              <span className="brand-star-only css-course-hero-star" aria-hidden="true" />
              <div>
                <span className="css-course-kicker">VibePolaris Course 03</span>
                <h1>
                  <span className="css-course-title-desktop">JavaScript：网页交互的<br />执行过程</span>
                  <span className="css-course-title-mobile">JavaScript，<br />网页交互的执行过程</span>
                </h1>
              </div>
            </div>
          </header>

          <div className="css-course-layout">
            <CssCourseToc chapters={chapters} label="JavaScript 教程章节" />

            <article className="css-course-content">
              <section className="css-course-outcome" aria-labelledby="javascript-outcome-heading">
                <span>课程目标</span>
                <h2 id="javascript-outcome-heading">追踪事件、数据变化<br />和页面更新。</h2>
                <div>
                  <p><strong>01</strong>识别常见值和变量的变化</p>
                  <p><strong>02</strong>用函数组织一段独立逻辑</p>
                  <p><strong>03</strong>排查点击后页面没有更新的问题</p>
                </div>
              </section>

              <section className="css-course-section" id="values">
                <div className="css-course-section-head">
                  <span>01</span>
                  <div><h2>值、变量和数据类型</h2><p>变量保存数据，数据类型决定它可以参与哪些运算。</p></div>
                </div>
                <div className="css-rule-anatomy foundation-code-anatomy" aria-label="JavaScript 变量结构">
                  <code><mark>const</mark> city = <i>&quot;杭州&quot;</i>;<br /><mark>let</mark> count = <b>0</b>;<br /><mark>const</mark> saved = <b>false</b>;</code>
                  <div><p><mark>const</mark> 不重新赋值</p><p><b>let</b> 允许状态变化</p><p><i>typeof</i> 检查类型</p></div>
                </div>
                <div className="css-course-principles">
                  <p><strong>名称写清用途</strong><span>userCount 比 x 更容易检查。</span></p>
                  <p><strong>默认使用 const</strong><span>确实需要重新赋值时再用 let。</span></p>
                  <p><strong>在边界检查类型</strong><span>表单输入和接口数据不一定符合预期。</span></p>
                </div>
              </section>

              <section className="css-course-section" id="functions">
                <div className="css-course-section-head">
                  <span>02</span>
                  <div><h2>条件判断与函数</h2><p>函数接收参数，处理后返回结果；条件负责选择执行分支。</p></div>
                </div>
                <div className="css-cascade-demo">
                  <div className="css-cascade-rules">
                    <p><small>01 · 输入</small><code>price = 68, discount = 0.8</code></p>
                    <p><small>02 · 处理</small><code>const total = price * discount</code></p>
                    <p className="is-winner"><small>03 · 输出</small><code>return Math.round(total)</code></p>
                  </div>
                  <div className="css-computed-card"><span>调用结果</span><strong>getSalePrice(68, 0.8)</strong><code>54</code><small>返回值可以继续交给其他代码使用</small></div>
                </div>
                <div className="css-course-principles">
                  <p><strong>参数提供输入</strong><span>把函数需要的数据明确传进去。</span></p>
                  <p><strong>return 返回结果</strong><span>调用方可以保存、显示或继续计算。</span></p>
                  <p><strong>条件选择分支</strong><span>不同输入可以执行不同处理。</span></p>
                </div>
              </section>

              <section className="css-course-section" id="events">
                <div className="css-course-section-head">
                  <span>03</span>
                  <div><h2>点击事件、数据变化与页面更新</h2><p>事件处理程序修改数据，并把结果写回页面。</p></div>
                </div>
                <h3 className="css-course-lab-title">查看一次收藏操作的三个阶段</h3>
                <JavaScriptStateLab />
                <ol className="css-responsive-flow">
                  <li><strong>接收事件</strong><span>确认点击发生在哪个元素上。</span></li>
                  <li><strong>修改数据</strong><span>把 count 从 0 更新为 1。</span></li>
                  <li><strong>更新页面</strong><span>把新数值写回计数区域。</span></li>
                </ol>
              </section>

              <section className="css-course-section" id="async">
                <div className="css-course-section-head">
                  <span>04</span>
                  <div><h2>处理异步请求</h2><p>请求未完成、成功和失败时，页面需要分别显示对应状态。</p></div>
                </div>
                <div className="css-responsive-code">
                  <div><span>发起请求</span><code>status = &quot;loading&quot;;<br />const response = await fetch(&quot;/api/saves&quot;);</code></div>
                  <ArrowRight size={22} aria-hidden="true" />
                  <div><span>处理结果</span><code>if (!response.ok) throw new Error();<br />status = &quot;success&quot;;</code></div>
                </div>
                <ol className="css-responsive-flow">
                  <li><strong>loading</strong><span>禁止重复提交，并显示正在处理。</span></li>
                  <li><strong>success</strong><span>使用响应数据更新页面。</span></li>
                  <li><strong>error</strong><span>保留用户输入，并提供重试入口。</span></li>
                </ol>
              </section>

              <section className="css-course-section" id="debug">
                <div className="css-course-section-head">
                  <span>05</span>
                  <div><h2>用浏览器调试 JavaScript</h2><p>按复现步骤检查控制台、变量和请求，找出第一处异常。</p></div>
                </div>
                <ol className="css-debug-list">
                  <li><span>01</span><div><strong>记录复现步骤</strong><p>保留触发动作、输入和实际结果。</p></div></li>
                  <li><span>02</span><div><strong>查看第一个错误</strong><p>后面的报错可能只是连锁结果。</p></div></li>
                  <li><span>03</span><div><strong>用断点检查变量</strong><p>确认参数、条件和返回值是否正确。</p></div></li>
                  <li><span>04</span><div><strong>测试异常情况</strong><p>检查断网、空值和重复点击的处理。</p></div></li>
                </ol>
              </section>

              <section className="css-course-section" id="practice">
                <div className="css-course-section-head">
                  <span>06</span>
                  <div><h2>知识检查</h2><p>根据事件和数据变化，判断页面没有更新的原因。</p></div>
                </div>
                <FoundationCourseQuiz
                  name="javascript-course-quiz"
                  question="点击收藏后数字没有变化，应该先检查什么？"
                  options={[
                    { id: "trace", label: "确认点击事件是否触发，再观察 count 是否更新" },
                    { id: "timeout", label: "加一个 setTimeout，让它晚一点再更新" },
                    { id: "reload", label: "每次点击都刷新整个页面" },
                  ]}
                  correctId="trace"
                  correctText="检查事件是否触发和 count 是否更新，可以确定异常发生在事件处理还是页面更新。"
                  wrongText="setTimeout 和刷新不能定位原因。需要检查事件是否触发，以及 count 是否发生变化。"
                />
                <div className="css-course-next">
                  <Link href="/terms/event"><span>相关词条</span><strong>事件：交互怎样触发代码</strong><ArrowRight size={20} /></Link>
                  <Link href="/terms/state"><span>相关词条</span><strong>状态：界面依据什么更新</strong><ArrowRight size={20} /></Link>
                </div>
              </section>

              <section className="css-course-sources" aria-labelledby="javascript-sources-heading">
                <div><span>参考资料</span><h2 id="javascript-sources-heading">查语法和 Web API</h2></div>
                <div>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" target="_blank" rel="noreferrer"><strong>MDN · JavaScript Guide</strong><small>语言基础教程</small><ArrowUpRight size={18} /></a>
                  <a href="https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting" target="_blank" rel="noreferrer"><strong>MDN · Dynamic scripting</strong><small>网页脚本入门</small><ArrowUpRight size={18} /></a>
                  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference" target="_blank" rel="noreferrer"><strong>MDN · JavaScript Reference</strong><small>查语法与内置对象</small><ArrowUpRight size={18} /></a>
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
