import { ArrowRight, Code, DownloadSimple, Package } from "@phosphor-icons/react/dist/ssr";
import { ArticleSection, ArticleAside } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ConceptHero } from "../ConceptHero";
import { BundlerLesson } from "../ai-stack-lessons/bundler";
import { bundlerSources } from "@/lib/ai-stack-concept-sources/bundler";
import styles from "../ToolchainConcepts.module.css";

const sections: [string, string][] = [["bundler-definition", "打包器沿什么关系工作"], ["bundler-split", "为什么会有 lazy.js"], ["bundler-boundary", "打包完成之后还缺什么"]];

export function BundlerTermPage() {
  return <Article slug="bundler" title="打包器" subtitle="Bundler · 沿依赖图整理模块并划分加载边界" sources={bundlerSources} sections={sections}
    hero={<ConceptHero slug="bundler" label="静态依赖进入主包，动态依赖变成需要时再请求的按需块"><div className={styles.toolchainHero}><div className={styles.bundlerHero}><div className={styles.bundlerHeroEntry}><Code size={23} /><span>入口</span><code>main.js</code></div><ArrowRight size={20} aria-hidden="true" /><div className={styles.bundlerHeroSplit}><div><Package size={21} /><span>首屏</span><code>main.js</code></div><div><DownloadSimple size={21} /><span>按需</span><code>lazy.js</code></div></div></div><p className={styles.heroNote}>依赖图决定哪些代码先到浏览器，哪些等用户动作再到。</p></div></ConceptHero>}
    intro={<>你在源码目录里看到许多模块，浏览器却收到 `main.js` 和几个带 hash 的文件。<strong>打包器从入口追踪静态与动态导入，把依赖图整理成浏览器能加载的产物，并用动态导入划出按需加载的边界。</strong></>}> 
    <ArticleSection id="bundler-definition" title="打包器沿什么关系工作">
      <p id="bundler-definition-text" className="vp-citation-target">打包器是模块打包工具：从入口出发分析导入关系，把许多小模块组合成一个或多个输出文件。输出数量由依赖图、动态导入、外部依赖和工具配置共同决定，并不等于源码文件数量。<Cite id="bundler-definition-text" sources={bundlerSources}/></p>
      <p id="bundler-entry" className="vp-citation-target">`src/main.js` 是这次演示的入口。它静态导入的模块会沿首屏路径进入主包；入口继续动态导入的模块则保留一个运行时可请求的边。<Cite id="bundler-entry" sources={bundlerSources}/></p>
      <ArticleAside title="主包不是“把所有文件拼成一行”"><p id="bundler-tooling" className="vp-citation-target">Rollup、webpack 和 esbuild 都会建立模块图，并可能做 tree shaking、压缩、格式转换或 source map 生成；这些能力可以同时出现在工具里，但“沿依赖图生成产物”才是打包器的核心动作。<Cite id="bundler-tooling" sources={bundlerSources}/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="bundler-split" title="为什么会有 lazy.js">
      <p id="bundler-split-text" className="vp-citation-target">静态导入表示模块属于当前加载路径，动态导入返回一个在运行时解析的 Promise。打包器可以据此把动态模块拆成独立块，等用户打开对应功能时，浏览器才请求那个文件。<Cite id="bundler-split-text" sources={bundlerSources}/></p>
      <p>下面的演示固定使用入口、5 个静态依赖和 1 个动态依赖：先生成主包，再模拟按需功能请求 `lazy.js`。最后把动态导入改成静态导入，观察它如何并入主包；切换“按需块请求失败”则能看到主包和运行时请求是两条边界。</p>
      <BundlerLesson />
      <p id="bundler-dynamic" className="vp-citation-target">代码分割改变的是产物和请求时机，不是业务功能的正确性。动态块仍然需要可访问的 URL、正确的部署路径和浏览器能执行的格式；其中任一项不对，主包生成成功也不能保证按需功能加载成功。<Cite id="bundler-dynamic" sources={bundlerSources}/></p>
    </ArticleSection>
    <ArticleSection id="bundler-boundary" title="打包完成之后还缺什么">
      <p id="bundler-boundary-text" className="vp-citation-target">打包器不负责证明类型正确、接口可用或业务流程通过；它可以把输入整理成产物，但不会替你补齐缺失的运行时 API。压缩和转译也可能由同一个工具链调用，却是不同的处理步骤。<Cite id="bundler-boundary-text" sources={bundlerSources}/></p>
      <p id="bundler-runtime" className="vp-citation-target">部署后，主包和按需块的公共路径、缓存策略与服务器路由必须仍然对应。遇到“首屏正常、点开功能 404”，应先检查动态块的请求 URL 和部署产物，而不是回头把所有模块合成一个文件。<Cite id="bundler-runtime" sources={bundlerSources}/></p>
      <p><strong>读者判断</strong>：如果 `main.js` 已成功加载，而点击功能后 `lazy.js` 返回 404，哪一层先需要排查？答案是动态块的部署路径或服务器路由；主包的生成已经完成。</p>
    </ArticleSection>
  </Article>;
}
