import { ArrowRight, Broadcast, Code, Cube, Gauge, UserCircle } from "@phosphor-icons/react/dist/ssr";
import { ArticleSection, ArticleAside, ConceptTerm } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ConceptHero } from "../ConceptHero";
import { HmrLesson } from "../ai-stack-lessons/hmr";
import { hmrSources } from "@/lib/ai-stack-concept-sources/hmr";
import styles from "../ToolchainConcepts.module.css";

const sections: [string, string][] = [["hmr-definition", "HMR 到底替换了什么"], ["hmr-loop", "一个模块怎样走到页面"], ["hmr-boundary", "为什么有时还是会整页刷新"]];

export function HmrTermPage() {
  return <Article slug="hmr" title="热模块替换" subtitle="Hot Module Replacement · 只把受影响模块送进正在运行的页面" sources={hmrSources} sections={sections}
    hero={<ConceptHero slug="hmr" label="Button 变化只走一条模块消息，运行时 dispose → accept，计数和姓名继续留在页面"><div className={styles.toolchainHero}><div className={styles.hmrHero}><div><Code size={23} /><span>Button.tsx</span><code>改动 1 / 20</code></div><ArrowRight size={18} aria-hidden="true" /><div><Broadcast size={23} /><span>更新消息</span><code>update: Button</code></div><ArrowRight size={18} aria-hidden="true" /><div><Gauge size={23} /><span>运行时</span><code>dispose → accept</code></div><ArrowRight size={18} aria-hidden="true" /><div><UserCircle size={23} /><span>页面状态</span><code>7 · 小林</code></div></div><p className={styles.heroNote}>局部替换能保留状态，但前提是更新边界愿意接住这次变化。</p></div></ConceptHero>}
    intro={<>你只改了一个 `Button` 模块，页面里的计数和表单姓名却没有消失。<strong>HMR 把变化的模块送进已经运行的页面，再由运行时决定这次更新能不能在原地接住。</strong>它追求的是短路径更新，状态是否保留要看边界。</>}> 
    <ArticleSection id="hmr-definition" title="HMR 到底替换了什么">
      <p id="hmr-definition-text" className="vp-citation-target">HMR（Hot Module Replacement，热模块替换）在开发期间把发生变化的模块送到浏览器运行时，让运行中的应用尝试替换它，而不必先整页重载。webpack 把它定义成开发时替换或增删模块的机制；Vite 的 HMR API 也把模块更新、接受和清理作为一组运行时接口。<Cite id="hmr-definition-text" sources={hmrSources}/></p>
      <p>“只改一个模块”不是说服务器只知道一个文件，而是这次消息带着受影响的模块边界。页面里其余模块、表单和计数仍在原来的运行时里，所以它们有机会继续工作。</p>
      <ArticleAside title="它和整页热重载的分界"><p id="hmr-boundary-text" className="vp-citation-target">整页热重载会重建页面脚本；HMR 则先尝试局部替换。局部替换成功时状态可以留下，边界不接受时通常要回退到整页刷新。两者都需要开发服务器提供文件变化和更新消息。<Cite id="hmr-boundary-text" sources={hmrSources}/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="hmr-loop" title="一个模块怎样走到页面">
      <p id="hmr-update" className="vp-citation-target">一次 HMR 更新可以沿四个节点观察：文件变化进入开发服务器，服务器发送 `Button` 模块，浏览器运行时执行旧模块的清理，再把新模块交给可接受更新的边界。只有消息抵达不代表页面已经应用了它。<Cite id="hmr-update" sources={hmrSources}/></p>
      <p id="hmr-accept" className="vp-citation-target">更新边界是模块或框架声明的“我能接住这次变化”的位置。Vite 用 `import.meta.hot.accept()` 和 `dispose()` 暴露接受与清理接口；在 React Refresh 这类工具里，组件能否保留状态还受组件结构和依赖关系限制。<Cite id="hmr-accept" sources={hmrSources}/></p>
      <p>切换下面的两个结果：接受分支会让 Button 变更而计数仍是 7；拒绝分支会走同一条消息路径，却在边界处转向整页重载。</p>
      <HmrLesson />
    </ArticleSection>
    <ArticleSection id="hmr-boundary" title="为什么有时还是会整页刷新">
      <p id="hmr-fallback" className="vp-citation-target">如果模块本身、它的父模块或框架运行时没有可接受的更新边界，开发工具无法安全地把新模块接在旧状态上，就会退回整页重载。演示把计数从 7 变成 0，是为了显示这条回退路径，不是说所有 HMR 失败都只表现为这一种错误。<Cite id="hmr-fallback" sources={hmrSources}/></p>
      <p>即便更新被接受，状态也不是无条件永久保存：被替换模块自己持有的局部状态可能重新初始化，副作用清理如果写错也会留下重复订阅。排查问题时要同时看开发服务器消息、运行时日志和模块的 accept/dispose 代码。</p>
      <p><strong>读者判断</strong>：如果 `Button` 已经变绿，但计数和姓名仍在，说明局部更新边界接住了它；如果页面闪过整页重建，先检查哪个模块没有接受这次更新。</p>
    </ArticleSection>
  </Article>;
}
