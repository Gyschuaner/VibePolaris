import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { infrastructureAsCodeSources } from "@/lib/infrastructure-as-code-sources";
import { InfrastructureAsCodeHero } from "./infrastructure-as-code-hero";
import { InfrastructureAsCodeLesson } from "./infrastructure-as-code";

const sections: [string, string][] = [
  ["iac-definition-section", "声明目标，而不是手写每一步"],
  ["iac-plan-section", "plan 是变更预览"],
  ["iac-state-section", "state 是映射，不是秘密保险箱"],
  ["iac-drift-section", "漂移让下一次 plan 说清现实"],
];

export function InfrastructureAsCodeTermPage() {
  return <Article slug="infrastructure-as-code" title="基础设施即代码" subtitle="Infrastructure as Code · 把基础设施改动写成可审查的配置" sources={infrastructureAsCodeSources} sections={sections} hero={<InfrastructureAsCodeHero />} intro={<>Infrastructure as Code（IaC）把网络、实例、权限和服务等基础设施写成配置，再由工具比较配置与当前现实。<strong>它的价值不在于“用文件代替点击”，而在于每次改变前都有可读的计划、可追溯的输入和明确的执行边界。</strong></>}>
    <ArticleSection id="iac-definition-section" title="声明目标，而不是手写每一步">
      <p id="iac-definition" className="vp-citation-target">IaC 用声明式配置描述想要的基础设施结果，工具再决定需要调用哪些 API、按什么依赖顺序完成它。配置表达的是目标状态，具体执行步骤由工具和提供商共同展开。<Cite id="iac-definition" sources={infrastructureAsCodeSources} /></p>
      <p id="iac-declaration" className="vp-citation-target">资源、变量、模块和引用让一份配置可以被复用、审查和版本控制；但“写进 Git”不等于“自动安全”，凭据、权限和模块来源仍要单独管理。<Cite id="iac-declaration" sources={infrastructureAsCodeSources} /></p>
      <p>首图先把配置、计划和云端分开：保存配置时云端不动，只有批准的 apply 才跨过执行边界。这比把一串命令贴在脚本里更容易复盘每次改变。</p>
      <InfrastructureAsCodeLesson />
    </ArticleSection>

    <ArticleSection id="iac-plan-section" title="plan 是变更预览">
      <p id="iac-plan" className="vp-citation-target">terraform plan 会读取配置、状态和提供商当前信息，生成新增、修改或删除的候选动作；它让操作人在 apply 前看到变更范围。<Cite id="iac-plan" sources={infrastructureAsCodeSources} /></p>
      <p id="iac-preview" className="vp-citation-target">计划不是批准书，也不是永远有效的承诺。计划生成后，输入、权限、提供商数据或远端资源可能改变；执行前仍要确认它针对的是正确工作区、正确账号和正确环境。<Cite id="iac-preview" sources={infrastructureAsCodeSources} /></p>
      <p><strong>审查 plan 时先问三件事：</strong>为什么会有这项变化？删除是否真的被允许？变化影响的网络、数据和权限边界有没有被一起看见？</p>
    </ArticleSection>

    <ArticleSection id="iac-state-section" title="state 是映射，不是秘密保险箱">
      <p id="iac-state" className="vp-citation-target">state 保存配置地址与现实资源之间的映射，以及工具识别后续变化所需的信息；它让下一次 plan 能知道“这个资源已经存在”。<Cite id="iac-state" sources={infrastructureAsCodeSources} /></p>
      <p id="iac-module" className="vp-citation-target">模块可以把一组相关资源和输入输出封装起来，让重复的基础设施模式有稳定边界。模块边界需要清楚写出哪些值由调用方提供、哪些资源会被创建，以及升级可能带来的变更。<Cite id="iac-module" sources={infrastructureAsCodeSources} /></p>
      <p>state 里可能出现地址、ID，甚至提供商返回的敏感字段。远端 state 要有锁定、最小权限、备份和加密；不要把它当作可以随手下载的构建产物。</p>
    </ArticleSection>

    <ArticleSection id="iac-drift-section" title="漂移让下一次 plan 说清现实">
      <p id="iac-drift" className="vp-citation-target">漂移指远端基础设施已经偏离配置和 state 所表达的结果。有人在控制台改了副本数、网络规则或权限时，下一次 plan 可能把差异重新显现出来。<Cite id="iac-drift" sources={infrastructureAsCodeSources} /></p>
      <p>发现漂移后不要习惯性地直接 apply：先确认手工修改是不是紧急修复、是否要把它写回配置、是否会覆盖数据或扩大权限。IaC 让差异可见，决定怎样处理差异仍然需要负责的人。</p>
      <p><strong>最后做一次回放：</strong>只改一个变量、生成 plan、审查差异、执行 apply、读取 state，再模拟一次控制台改动。读者应该能看见每个时间点发生了什么，而不是只看到“部署成功”。</p>
    </ArticleSection>
  </Article>;
}
