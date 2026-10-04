import { ArrowRight, Code, GitBranch, Tag } from "@phosphor-icons/react/dist/ssr";
import { ArticleSection, ArticleAside } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { ConceptHero } from "../ConceptHero";
import { SemanticVersioningLesson } from "../ai-stack-lessons/semantic-versioning";
import { semanticVersioningSources } from "@/lib/ai-stack-concept-sources/semantic-versioning";
import styles from "../ToolchainConcepts.module.css";

const sections: [string, string][] = [["semver-definition", "三段数字先说清什么"], ["semver-choice", "从一次改动选下一版"], ["semver-boundary", "版本号没有替你检查什么"]];

export function SemanticVersioningTermPage() {
  return <Article slug="semantic-versioning" title="语义化版本" subtitle="Semantic Versioning · 用版本号传达兼容性变化" sources={semanticVersioningSources} sections={sections}
    hero={<ConceptHero slug="semantic-versioning" label="从 1.4.2 出发，先判断旧调用是否还能工作，再决定升 PATCH、MINOR 还是 MAJOR"><div className={styles.toolchainHero}><div className={styles.semverHero}><div><Tag size={23} /><span>当前版本</span><strong>1.4.2</strong></div><ArrowRight size={18} aria-hidden="true" /><div><Code size={23} /><span>公开 API</span><strong>看兼容性</strong></div><ArrowRight size={18} aria-hidden="true" /><div><GitBranch size={23} /><span>下一版本</span><strong>1.4.3 / 1.5.0 / 2.0.0</strong></div></div><p className={styles.heroNote}>数字变化是对使用方的提示：这次发布会不会让旧调用失效。</p></div></ConceptHero>}
    intro={<>你维护一个已经发布的包，当前版本是 `1.4.2`。这次可能只是修 Bug，也可能加了新能力，甚至删掉一个公开 API。<strong>语义化版本把这三种兼容性变化写进 MAJOR.MINOR.PATCH 三段数字。</strong>读者先判断旧调用，再决定下一版。</>}> 
    <ArticleSection id="semver-definition" title="三段数字先说清什么">
      <p id="semver-definition-text" className="vp-citation-target">语义化版本（SemVer）把版本写成 `MAJOR.MINOR.PATCH`：向后兼容的缺陷修复增加 PATCH，向后兼容的功能新增增加 MINOR，不兼容的公开 API 变化增加 MAJOR。它要求发布者先说清自己的公开 API，版本号才有可解释的含义。<Cite id="semver-definition-text" sources={semanticVersioningSources}/></p>
      <p id="semver-choice-text" className="vp-citation-target">从 `1.4.2` 到 `1.4.3`，使用方可以把它理解为修复而不是接口改名；从 `1.4.2` 到 `1.5.0`，表示多了兼容功能；如果旧调用已经不能成立，就应到 `2.0.0`。npm 也把这三类变化分别对应到第三、第二、第一段数字。<Cite id="semver-choice-text" sources={semanticVersioningSources}/></p>
      <ArticleAside title="先定义公开 API"><p>公开 API 可以是导出的函数、组件、命令和配置格式，也可以是文档承诺的行为。没有这条基线，“改动很大”或“只改了一行”都不能直接推出应该升哪一段。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="semver-choice" title="从一次改动选下一版">
      <p>下面不让数字自己跳出来。先从“修一个兼容 Bug”“加兼容功能”“删公开 API”里选一个，再逐步观察：读旧调用、点亮该变的段、写给使用方的发布提示。</p>
      <SemanticVersioningLesson />
      <p id="semver-range-text" className="vp-citation-target">版本范围还会影响使用方接受哪些更新：npm 文档用 `~1.0.4` 表示同一 minor 下的补丁更新，用 `^1.0.4` 表示兼容的 minor 和 patch 更新；`package.json` 保存的是范围，实际安装还会经过解析和锁定。<Cite id="semver-range-text" sources={semanticVersioningSources}/></p>
    </ArticleSection>
    <ArticleSection id="semver-boundary" title="版本号没有替你检查什么">
      <p id="semver-boundary-text" className="vp-citation-target">SemVer 是发布者和使用方之间的约定，规范不会自动检查实现是否真的兼容。`0.y.z` 仍处于初始开发阶段，任何一段都可能变化；预发布标识还有自己的优先级规则。即使版本号写对了，迁移文档、测试和依赖范围也仍要单独维护。<Cite id="semver-boundary-text" sources={semanticVersioningSources}/></p>
      <p>因此，看到一个 `2.0.0` 不要只问“是不是大改版”，要回到具体接口：哪个旧调用会失效？能不能给出替代写法？看到一个 `1.4.3` 也不要把它当成质量证明，它只是发布者对变化类型的声明。</p>
      <p><strong>读者判断</strong>：如果删除了一个仍被用户调用的公开函数，下一步先写什么？答案是把它归为破坏性变化，升主版本，并同时写迁移说明。</p>
    </ArticleSection>
  </Article>;
}
