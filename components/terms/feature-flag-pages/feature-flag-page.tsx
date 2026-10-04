import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { featureFlagSources } from "@/lib/feature-flag-sources";
import { FeatureFlagHero } from "./feature-flag-hero";
import { FeatureFlagLesson } from "./feature-flag";

const sections: [string, string][] = [
  ["flag-deploy", "先部署代码，再决定谁看见它"],
  ["flag-evaluate", "开关不是按钮，而是一次运行时判断"],
  ["flag-rollout", "把一次全量发布拆成几次可观察的尝试"],
  ["flag-lifecycle", "开关也会过期，权限也不能靠它兜底"],
];

export function FeatureFlagTermPage() {
  return <Article slug="feature-flag" title="功能开关" subtitle="Feature Flag · 让代码先部署，再按运行时条件决定谁看到哪条路径" sources={featureFlagSources} sections={sections} hero={<FeatureFlagHero />} intro={<>新结算页还没把握时，你可以先把它和旧页面一起部署，让内部用户试用；指标稳定，再扩大到 10%，出问题就把开关关掉。功能开关把“代码已经在生产”和“用户现在能看到”拆成两个决定。</>}>
    <ArticleSection id="flag-deploy" title="先部署代码，再决定谁看见它">
      <p>没有功能开关时，发布新结算页通常是一件事：打包、部署，然后所有请求一起切过去。功能开关把新旧路径放进同一个可运行版本，代码已经到达生产，但默认仍可走旧路径。你获得的是一段观察时间，而不是一套自动正确的代码。</p>
      <p id="flag-definition" className="vp-citation-target">Martin Fowler 把 feature toggle 描述为：不改代码就能改变系统行为的一组技术。它可以用来把代码部署和功能发布分开，但每个开关也会增加配置与验证的复杂度。<Cite id="flag-definition" sources={featureFlagSources} /></p>
      <p id="flag-release" className="vp-citation-target">Azure App Configuration 将 feature management 解释为按需改变功能可用性，并明确把发布与代码部署解耦。这里的“开”只表示某条路径可以被选择，不表示这条路径已经通过了所有验收。<Cite id="flag-release" sources={featureFlagSources} /></p>
      <p>首图里的 v42 同时装着旧结算页和新结算页。把开关移到“开启”并不会重新编译 v42；它只改变下一次请求经过哪个分岔。读者如果把 flag 当成部署按钮，后面遇到回退、缓存和权限时都会做出错误判断。</p>
    </ArticleSection>
    <ArticleSection id="flag-evaluate" title="开关不是按钮，而是一次运行时判断">
      <p id="flag-context" className="vp-citation-target">OpenFeature 把 evaluation context 定义成参与 flag 评估的环境信息：可以有用户、应用、主机和自定义字段，其中 targeting key 用来稳定识别这次评估的对象。它不是随手拼一段字符串；上下文缺失或不一致，分组结果就可能漂移。<Cite id="flag-context" sources={featureFlagSources} /></p>
      <p id="flag-targeting" className="vp-citation-target">LaunchDarkly 的 targeting rule 由条件和 rollout 组成，条件可以检查用户、组织或其他上下文属性，再返回某个变体。规则有顺序和默认分支，所以要先写清“谁匹配、返回什么、没有匹配时怎么办”。<Cite id="flag-targeting" sources={featureFlagSources} /></p>
      <FeatureFlagLesson />
      <p id="flag-evaluation" className="vp-citation-target">OpenFeature 的 evaluation API 要求应用提供 flag key 和默认值，再由 provider 返回一个类型明确的结果；没有 provider 或评估异常时，应用仍需要决定默认路径。把“评估失败”当成“新功能已开启”，会把配置故障直接变成用户故障。<Cite id="flag-evaluation" sources={featureFlagSources} /></p>
    </ArticleSection>
    <ArticleSection id="flag-rollout" title="把一次全量发布拆成几次可观察的尝试">
      <p id="flag-rollout-evidence" className="vp-citation-target">分批发布的关键不是把百分比写进控制台，而是让同一个用户在观察期里稳定落在同一个 cohort。LaunchDarkly 支持按上下文属性和百分比 rollout；扩大比例前，应先看新旧变体的错误率、延迟和业务指标。<Cite id="flag-rollout-evidence" sources={featureFlagSources} /></p>
      <p id="flag-variants" className="vp-citation-target">AWS AppConfig 的 feature flag 可以只有 enable/disable，也可以声明多变体，并根据请求上下文和规则返回不同值。于是 flag 不一定是布尔按钮，但变体越多，默认值、类型和监控越要写清楚。<Cite id="flag-variants" sources={featureFlagSources} /></p>
      <p id="flag-killswitch" className="vp-citation-target">LaunchDarkly 把 kill switch 定位成紧急关闭功能或第三方依赖的永久安全机制；它通常不需要复杂的 targeting，而是把“开”和“关”作为完整的操作路径。首图最后一帧展示的就是这个止损动作：关掉暴露，旧路径接回。<Cite id="flag-killswitch" sources={featureFlagSources} /></p>
      <p>工作台里先选内部用户或 10% 分批，再推进到观测。点击“模拟回归”后，比例不会自动变成成功；点击“立即关闭开关”，所有人回到旧路径，但 v42 里的新代码仍然存在，等待修复和下一次发布决定。</p>
    </ArticleSection>
    <ArticleSection id="flag-lifecycle" title="开关也会过期，权限也不能靠它兜底">
      <p id="flag-lifecycle-cost" className="vp-citation-target">Fowler 把开关分成 release、experiment、ops 和 permissioning 等不同类别，并提醒短期 release flag 在完成发布后应当移除；长期存在的开关会让每次修改都多一条需要验证的路径。创建开关时就写负责人、用途、默认值和清理时间，比以后考古一串 `if` 更可靠。<Cite id="flag-lifecycle-cost" sources={featureFlagSources} /></p>
      <p>功能开关控制的是“功能是否暴露”，不是“用户有没有权限”。服务端仍要在每次敏感操作上检查身份、授权和数据范围；也不能因为 UI 被 flag 隐藏，就把后端接口当成不可访问。类似地，关闭 flag 不会撤销已经产生的订单、副作用或数据，需要独立的回滚和补偿方案。</p>
      <p><strong>交付前问四句：</strong>这条开关由谁维护，评估失败走哪条默认路径；哪个上下文决定分组，用户是否稳定；用什么指标判断可以扩大，什么信号触发 kill switch；功能稳定后谁负责删除 flag。功能开关给发布留出手刹，也会留下维护账单。</p>
    </ArticleSection>
  </Article>;
}
