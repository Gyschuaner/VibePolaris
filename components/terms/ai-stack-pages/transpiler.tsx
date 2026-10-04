import { ArrowsLeftRight, Code, FileCode } from "@phosphor-icons/react/dist/ssr";
import { ArticleSection, ArticleAside } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ConceptHero } from "../ConceptHero";
import { TranspilerLesson } from "../ai-stack-lessons/transpiler";
import { transpilerSources } from "@/lib/ai-stack-concept-sources/transpiler";
import styles from "../ToolchainConcepts.module.css";

const sections: [string, string][] = [["transpiler-definition", "转译器到底改了什么"], ["transpiler-process", "从类型节点到目标源码"], ["transpiler-boundary", "输出源码之后还缺什么"]];

export function TranspilerTermPage() {
  return <Article slug="transpiler" title="转译器" subtitle="Transpiler · 把一种源代码改写成另一种源代码" sources={transpilerSources} sections={sections}
    hero={<ConceptHero slug="transpiler" label="类型标注被移除，赋值结构和可读源码被保留下来"><div className={styles.toolchainHero}><div className={styles.transpilerHero}><div className={styles.transpilerHeroCard}><FileCode size={24} /><span>TypeScript</span><code>const n: number = 3</code></div><ArrowsLeftRight size={22} aria-hidden="true" /><div className={styles.transpilerHeroCard}><Code size={24} /><span>JavaScript</span><code>const n = 3</code></div></div><p className={styles.heroNote}>转译改变语言层的写法，输出仍是一份人能读的源码。</p></div></ConceptHero>}
    intro={<>你写下的 TypeScript 带有类型标注，开发工具可以借它检查错误；浏览器里的 JavaScript 运行时并不认识这段标注。<strong>转译器把类型节点移除或改写成目标语言能继续处理的源码，同时尽量保留原来的结构和行为。</strong></>}> 
    <ArticleSection id="transpiler-definition" title="转译器到底改了什么">
      <p id="transpiler-definition-text" className="vp-citation-target">转译器做的是源代码到源代码的转换：输入和输出都仍然是可阅读的程序文本。TypeScript 是 JavaScript 的带类型超集，类型检查发生在执行前；类型标注在生成普通 JavaScript 时会被擦除。<Cite id="transpiler-definition-text" sources={transpilerSources}/></p>
      <p id="transpiler-type" className="vp-citation-target">以 <code>const n: number = 3</code> 为例，`: number` 告诉开发工具 n 应该是数字；转成 JavaScript 后变成 <code>const n = 3</code>，赋值仍然存在。删掉标注不等于检查通过，也不等于运行时会自动提供新的 API。<Cite id="transpiler-type" sources={transpilerSources}/></p>
      <ArticleAside title="为什么 Babel 和 SWC 也会出现在这条链路"><p id="transpiler-tooling" className="vp-citation-target">Babel 和 SWC 都提供可配置的源码转换能力，可以按目标语法和插件规则处理输入；它们是转译链路中的工具，不等于依赖打包器或生产服务器。<Cite id="transpiler-tooling" sources={transpilerSources}/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="transpiler-process" title="从类型节点到目标源码">
      <p id="transpiler-transform" className="vp-citation-target">一次转译可以拆成读取源码、识别语法结构、应用转换规则和输出目标源码。转换规则可以移除类型节点，也可以把目标环境不支持的语法改写成另一种写法；具体规则由工具和配置决定。<Cite id="transpiler-transform" sources={transpilerSources}/></p>
      <p>下面的演示把“移除”和“保留”放在同一行代码里：悬停或选择 `: number`，你会看到它在输出侧消失；选择赋值结构，`const n = 值` 会被标成保留。切到类型不匹配场景，诊断会出现，但转译仍不会替你修正值。</p>
      <TranspilerLesson />
      <p id="transpiler-sourcemap" className="vp-citation-target">如果错误来自生成后的 JavaScript，source map（记录转译前后位置对应关系的文件）可以把构建文件的行列位置指回 TypeScript 原文件；它帮助定位，不会修复代码，也不会把输出变回原始执行过程。<Cite id="transpiler-sourcemap" sources={transpilerSources}/></p>
    </ArticleSection>
    <ArticleSection id="transpiler-boundary" title="输出源码之后还缺什么">
      <p id="transpiler-boundary-text" className="vp-citation-target">转译成功只说明语言层改写完成。输出还可能需要打包、解析依赖或交给运行时；如果代码调用了目标环境没有的 API，转译器不会凭空补上它。<Cite id="transpiler-boundary-text" sources={transpilerSources}/></p>
      <p id="transpiler-config" className="vp-citation-target">目标版本、模块格式、输出目录和 source map 等选项通常由 TSConfig 或同类配置决定。换一份配置，可能得到不同的目标语法和调试位置；因此排查“本地能跑、构建失败”时要把源码、转译配置和后续构建一起看。<Cite id="transpiler-config" sources={transpilerSources}/></p>
      <p><strong>读者判断</strong>：如果 `: number` 已经消失，但页面仍然报 “fetch is not defined”，你能指出这是谁的责任吗？答案是目标运行时或垫片，而不是转译器的源码改写步骤。</p>
    </ArticleSection>
  </Article>;
}
