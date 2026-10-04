import { ArrowRight, FileCode, FolderOpen, GitBranch, Package, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { ArticleSection, ArticleAside } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ConceptHero } from "../ConceptHero";
import { BuildToolLesson } from "../ai-stack-lessons/build-tool";
import { buildToolSources } from "@/lib/ai-stack-concept-sources/build-tool";
import styles from "../ToolchainConcepts.module.css";

const sections: [string, string][] = [["build-tool-definition", "构建工具在安排什么"], ["build-tool-graph", "任务怎样等待和并行"], ["build-tool-boundary", "有了 dist 还没上线"]];

export function BuildToolTermPage() {
  return <Article slug="build-tool" title="构建工具" subtitle="Build Tool · 把项目任务按依赖组织成一次构建" sources={buildToolSources} sections={sections}
    hero={<ConceptHero slug="build-tool" label="检查阻塞转译，资源独立并行，两个分支汇合成未部署的本机产物"><div className={styles.toolchainHero}><div className={styles.buildToolHero}><div className={styles.buildHeroNode}><FileCode size={22} /><span>源码</span><strong>3 模块</strong></div><ArrowRight size={18} aria-hidden="true" /><div className={styles.buildHeroSplit}><div><ShieldCheck size={20} /><span>检查 → 转译</span></div><div><Package size={20} /><span>资源复制</span></div></div><ArrowRight size={18} aria-hidden="true" /><div className={styles.buildHeroNode}><FolderOpen size={22} /><span>本机产物</span><strong>dist · 未部署</strong></div></div><p className={styles.heroNote}>构建结束说明产物准备好了，不说明它已经被服务器接收。</p></div></ConceptHero>}
    intro={<>你执行一条 `build` 命令时，背后可能同时发生类型检查、源码转换、模块整理和资源复制。<strong>构建工具负责读配置、安排这些任务的依赖关系，并把成功结果汇总成一组本机文件。</strong>它让流程可重复，但不会把每个下游动作都变成自己的职责。</>}> 
    <ArticleSection id="build-tool-definition" title="构建工具在安排什么">
      <p id="build-definition" className="vp-citation-target">构建工具把项目输入、配置和一组任务连成可执行的流程：任务有自己的输入和输出，依赖决定谁必须先完成，最后由流程汇总产物。Vite 的文档也把开发服务器和生产构建命令分开描述，说明“能本地反馈”和“生成生产静态资源”是不同入口。<Cite id="build-definition" sources={buildToolSources}/></p>
      <p id="build-scripts" className="vp-citation-target">在 npm 项目里，`scripts` 是一组可命名的命令，`pre` 和 `post` 生命周期还能在主脚本前后自动运行。脚本可以成为构建入口，但脚本本身只是命令连接方式；依赖关系和失败策略仍要由构建工具或项目配置定义。<Cite id="build-scripts" sources={buildToolSources}/></p>
      <ArticleAside title="为什么一次构建会调用多个工具"><p id="build-vite" className="vp-citation-target">Vite 把开发服务器、构建命令、插件和配置放在同一个工具链里；类似工具也可能调用编译器、转译器、打包器或资源处理器。看到多个工具出现在日志中，不代表它们都是“构建工具”的同义词。<Cite id="build-vite" sources={buildToolSources}/></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="build-tool-graph" title="任务怎样等待和并行">
      <p id="build-graph" className="vp-citation-target">任务图的关键是依赖边：类型检查通过后才能解锁转译，资源复制如果只依赖图片输入，就可以和检查分支同时开始。Make 用目标和依赖表达“目标何时需要更新”，现代构建系统还会据此缓存或并行安排工作。<Cite id="build-graph" sources={buildToolSources}/></p>
      <p>下面的演示把两条分支画出来：左边是“检查 → 转译”，右边是“资源复制”，最后都汇合到 `dist`。切换到“检查失败”，你会看到转译变成被阻塞；资源分支可以完成，但流程不会把它和未验证的代码拼成新版本。</p>
      <BuildToolLesson />
      <p id="build-parallel" className="vp-citation-target">可并行不等于无条件同时运行：构建工具还要考虑资源、缓存、机器并发和任务是否会写同一个输出。Bazel 把构建描述为可复用的目标图，能在依赖满足时复用或并行执行目标。<Cite id="build-parallel" sources={buildToolSources}/></p>
    </ArticleSection>
    <ArticleSection id="build-tool-boundary" title="有了 dist 还没上线">
      <p id="build-boundary" className="vp-citation-target">`dist` 只是一次构建产生的本机目录，里面可以有 JavaScript、CSS、图片和清单。它还需要由发布或部署流程上传、挂载或交给服务器；构建成功不等于访问路径、权限、环境变量和业务验收都已经正确。<Cite id="build-boundary" sources={buildToolSources}/></p>
      <p id="build-failure" className="vp-citation-target">任一关键任务失败时，构建应报告失败并保留可诊断的日志；把旧的 `dist` 和新生成的半成品混在一起，会让后续发布误以为这次构建完整。任务图的失败边界要和项目的产物清理、缓存策略一起定义。<Cite id="build-failure" sources={buildToolSources}/></p>
      <p id="build-lifecycle" className="vp-citation-target">npm 的生命周期脚本可以串起准备、构建和测试等步骤，但它们仍是项目约定的入口。排查“本地 build 通过、上线失败”时，要继续检查构建产物、部署动作和生产环境，而不能停在命令退出码。<Cite id="build-lifecycle" sources={buildToolSources}/></p>
      <p><strong>读者判断</strong>：如果 `dist` 已经有四类文件，但服务器还没有收到它们，当前流程停在哪里？答案是构建完成、部署尚未开始。</p>
    </ArticleSection>
  </Article>;
}
