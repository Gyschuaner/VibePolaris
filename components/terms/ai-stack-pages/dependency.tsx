import { ArrowRight, FileText, LockKey, Package } from "@phosphor-icons/react/dist/ssr";
import { ArticleSection, ArticleAside } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ConceptHero } from "../ConceptHero";
import { DependencyLesson } from "../ai-stack-lessons/dependency";
import { dependencySources } from "@/lib/ai-stack-concept-sources/dependency";
import styles from "../ToolchainConcepts.module.css";

const sections: [string, string][] = [["dependency-definition", "清单只写 A，为什么会有 B"], ["dependency-resolution", "包管理器怎样把图变成安装结果"], ["dependency-boundary", "删掉一条边会发生什么"]];

export function DependencyTermPage() {
  return <Article slug="dependency" title="依赖" subtitle="Dependency · 让安装结果沿着包之间的需要关系展开" sources={dependencySources} sections={sections}
    hero={<ConceptHero slug="dependency" label="应用声明 A，A 再声明 B；安装工具沿边展开并把具体版本写进锁文件"><div className={styles.toolchainHero}><div className={styles.dependencyHero}><div><Package size={23} /><span>应用清单</span><code>A@^1.4</code></div><ArrowRight size={18} aria-hidden="true" /><div><Package size={23} /><span>依赖图</span><code>A → B</code></div><ArrowRight size={18} aria-hidden="true" /><div><LockKey size={23} /><span>锁文件</span><code>A@1.4 · B@2.1</code></div></div><p className={styles.heroNote}>清单声明范围，包管理器解析路径，锁文件记录这次选择。</p></div></ConceptHero>}
    intro={<>你只在 `package.json` 里写了 A，安装结果里却多出一个 B。<strong>依赖不是凭空出现的名单，而是一张从应用出发、沿着包自己的声明继续展开的图。</strong>版本约束和锁文件再把“可以用哪个版本”收敛成这次实际安装的树。</>}> 
    <ArticleSection id="dependency-definition" title="清单只写 A，为什么会有 B">
      <p id="dependency-definition-text" className="vp-citation-target">`dependencies` 把包名映射到版本范围；应用自己写下的 A 是直接依赖，A 在自己的清单里继续写下的 B 则是传递依赖。安装工具从应用节点开始沿这些声明寻找完整的包树，Node 的包入口和 `exports` 再决定代码从包的哪个公开入口被加载。<Cite id="dependency-definition-text" sources={dependencySources}/></p>
      <p id="dependency-types-text" className="vp-citation-target">`devDependencies` 通常服务构建、测试或开发脚本，`optionalDependencies` 则允许工具或环境决定是否安装；它们和运行时依赖放在不同语境里。npm 的 scripts 文档也把安装生命周期脚本单独列出，所以“装进 node_modules”不等于“每次运行都由业务代码直接调用”。<Cite id="dependency-types-text" sources={dependencySources}/></p>
      <ArticleAside title="先看边，再看目录"><p>看到一个包出现在安装树里，先沿图回到应用：是哪一条声明把它带进来的？再问它是运行时、开发时还是可选用途。目录里有一个文件夹，只能说明某次安装留下了它，不能单独说明应用现在仍然需要它。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="dependency-resolution" title="包管理器怎样把图变成安装结果">
      <p id="dependency-resolution-text" className="vp-citation-target">版本范围可以写成精确版本、`~` 或 `^` 等描述；SemVer 约定了主版本、次版本和修订号怎样表达兼容变化，npm 再从满足范围的版本中解析一次具体选择。演示把 A 和 B 固定为 `A@1.4`、`B@2.1`，数字是为了看清“范围 → 选择”的动作。<Cite id="dependency-resolution-text" sources={dependencySources}/></p>
      <p id="dependency-lock-text" className="vp-citation-target">`package-lock.json` 记录 npm 这次生成的确切依赖树，让后续安装可以重建相同的版本组合；它保存的是解析结果，不是应用清单的替代品。清单改了，锁文件也应随下一次解析更新。<Cite id="dependency-lock-text" sources={dependencySources}/></p>
      <p>下面按四帧看一遍：先只有应用，再加入 A，接着展开 A 的 B，最后删掉应用到 A 的边。每一帧的报告、锁文件和节点状态都跟着当前图变化。</p>
      <DependencyLesson />
    </ArticleSection>
    <ArticleSection id="dependency-boundary" title="删掉一条边会发生什么">
      <p id="dependency-boundary-text" className="vp-citation-target">应用到 A 的边被删除后，如果图里没有别的路径指向 B，B 对应用就不再可达，安装结果需要重新解析；这不等于工具一定马上删除磁盘目录。另一个包仍然需要 B，或清理命令尚未执行时，B 仍可能留在本地。<Cite id="dependency-boundary-text" sources={dependencySources}/></p>
      <p>这也是依赖排查的顺序：先确认谁声明了谁，再确认版本范围和锁文件，最后看当前安装目录是否只是旧结果。把“我没在源码里 import 它”直接等同于“它不该存在”，会漏掉构建脚本、传递依赖和可选路径。</p>
      <p><strong>读者判断</strong>：删掉 A 后 B 还在磁盘里，下一步先看什么？答案是依赖图里是否还有别的路径，以及是否重新安装或执行了工具的清理动作。</p>
    </ArticleSection>
  </Article>;
}
