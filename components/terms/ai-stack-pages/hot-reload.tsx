import { ArrowCounterClockwise, ArrowRight, FileCode, Globe, HardDrive } from "@phosphor-icons/react/dist/ssr";
import { ArticleSection, ArticleAside, ConceptTerm } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ConceptHero } from "../ConceptHero";
import { HotReloadLesson } from "../ai-stack-lessons/hot-reload";
import { hotReloadSources } from "@/lib/ai-stack-concept-sources/hot-reload";
import styles from "../ToolchainConcepts.module.css";

const sections: [string, string][] = [["hot-reload-definition", "热重载先重载了什么"], ["hot-reload-loop", "保存一次文件发生什么"], ["hot-reload-boundary", "哪些状态会留下来"]];

export function HotReloadTermPage() {
  return <Article slug="hot-reload" title="热重载" subtitle="Hot Reload · 保存后让开发页面整页重新加载" sources={hotReloadSources} sections={sections}
    hero={<ConceptHero slug="hot-reload" label="保存 button.css，开发服务发出 reload，浏览器整页重建，页面内存回到初始值"><div className={styles.toolchainHero}><div className={styles.hotReloadHero}><div><FileCode size={23} /><span>button.css</span><code>保存</code></div><ArrowRight size={18} aria-hidden="true" /><div><HardDrive size={23} /><span>开发服务</span><code>reload()</code></div><ArrowRight size={18} aria-hidden="true" /><div><Globe size={23} /><span>浏览器</span><code>计数 7 → 0</code></div></div><p className={styles.heroNote}>新文件生效的同时，页面运行时也被重新创建。</p></div></ConceptHero>}
    intro={<>你在本地页面里点了几次按钮，计数停在 7；保存一份 CSS 后，页面突然重新出现，计数回到了 0。<strong>这条开发反馈路径做的是整页 reload：新文件被送到浏览器，旧页面运行时随之结束。</strong>热重载解决的是“保存后看到新代码”，不承诺保留页面内存。</>}> 
    <ArticleSection id="hot-reload-definition" title="热重载先重载了什么">
      <p id="hot-reload-definition-text" className="vp-citation-target">热重载是开发阶段的一种更新方式：开发服务器或监听器发现源码变化，处理完文件后让浏览器重新加载页面。它依赖开发工具提供监听与通知，浏览器本身不会因为磁盘文件变化就自动重建当前页面。<Cite id="hot-reload-definition-text" sources={hotReloadSources}/></p>
      <p id="hot-reload-reload" className="vp-citation-target">浏览器的 `Location.reload()` 会重新加载当前资源；在这个动作里，页面脚本和组件树会重新初始化。演示里的 7 是页面内存中的计数，因此它会随着整页重建回到初始值。<Cite id="hot-reload-reload" sources={hotReloadSources}/></p>
      <ArticleAside title="为什么它不是普通浏览器刷新"><p id="hot-reload-dev-server" className="vp-citation-target">开发服务器会在文件保存后参与这条链路：它监听变化、准备新的开发资源，再决定向页面发出刷新或模块更新。webpack 的 devServer 也把文件监听和自动刷新作为开发配置的一部分；生产网站不会因此获得同样的监听通道。<Cite id="hot-reload-dev-server" sources={hotReloadSources}/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="hot-reload-loop" title="保存一次文件发生什么">
      <p id="hot-reload-update" className="vp-citation-target">把一次保存拆开看：`button.css` 先从未保存变成已保存，开发服务捕获变化并发出整页 reload，浏览器重新请求页面，新的按钮颜色才出现。通知发出和页面重建之间有一个短暂的过渡，不能把“文件已经保存”当成“页面已经更新”。<Cite id="hot-reload-update" sources={hotReloadSources}/></p>
      <p>下面的演示让同一条路径停在每个中间点。点击“保存 button.css”会直接跳到保存事件；再逐步播放，你能看到通知尚未执行时计数仍是 7，直到整页重建才回到 0。</p>
      <HotReloadLesson />
    </ArticleSection>
    <ArticleSection id="hot-reload-boundary" title="哪些状态会留下来">
      <p id="hot-reload-state" className="vp-citation-target">整页重载会丢掉页面 JavaScript 运行时里的临时状态，例如组件计数、未提交的表单草稿或内存缓存。React Refresh 这类开发工具会尝试在局部更新时保留组件状态，但那是另一条 HMR 路径，并且受模块边界和组件写法限制。<Cite id="hot-reload-state" sources={hotReloadSources}/></p>
      <p id="hot-reload-boundary-text" className="vp-citation-target">已经写入数据库、浏览器持久化存储或服务器会话的状态属于页面之外，不会因为一次整页 reload 自动消失；相反，页面只是“记住”了它们的地方，就会随着脚本重启而丢失。排查保存后状态归零时，先判断它存在哪里，再决定是接受整页重建还是需要 HMR。<Cite id="hot-reload-boundary-text" sources={hotReloadSources}/></p>
      <p><strong>读者判断</strong>：如果按钮颜色变了，但页面计数从 7 回到 0，你看到的是整页重载；如果只替换按钮模块且计数仍为 7，才该继续检查 HMR 更新边界。</p>
    </ArticleSection>
  </Article>;
}
