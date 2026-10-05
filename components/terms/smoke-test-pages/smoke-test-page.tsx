import { ArticleSection } from "../ConceptArticle";
import { Article, Cite } from "../AiStackConceptPageShared";
import { smokeTestSources } from "@/lib/smoke-test-sources";
import { SmokeTestHero } from "./smoke-test-hero";
import { SmokeTestLesson } from "./smoke-test";

const sections: [string, string][] = [
  ["smoke-purpose", "先回答：这个构建值得继续测吗"],
  ["smoke-path", "少量检查要踩中真正的入口"],
  ["smoke-boundary", "通过一盏灯，不等于整栋楼合格"],
  ["smoke-operation", "失败要关闸，也要留下下一步"],
];

export function SmokeTestTermPage() {
  return <Article slug="smoke-test" title="冒烟测试" subtitle="Smoke Test · 用几盏关键灯决定要不要继续" sources={smokeTestSources} sections={sections} hero={<SmokeTestHero />} intro={<>新版本刚部署，是先把 120 个回归用例全部点燃，还是先用几条最关键的检查确认环境没有直接坏掉？冒烟测试站在完整测试之前，负责快速回答一个很实际的问题：这个构建现在值得继续投入时间吗？</>}>
    <ArticleSection id="smoke-purpose" title="先回答：这个构建值得继续测吗">
      <p id="smoke-definition" className="vp-citation-target">Microsoft 把 smoke test 放进 build verification testing：它是测试方案基本功能的端到端检查，运行通常很快；如果这类检查失败，说明构建有严重问题。冒烟测试因此是发布流程的门槛，不是把所有质量一次测完的缩小版。<Cite id="smoke-definition" sources={smokeTestSources} /></p>
      <p id="smoke-fast" className="vp-citation-target">同一份 Microsoft 指南还强调，BVT 既要足够覆盖构建质量，又要小到能在分配的时间里执行。这里的“快”不是随便少写几条，而是只保留能改变下一步决定的检查：进程是否能响应、身份入口是否可用、最重要的业务动作能不能走通。<Cite id="smoke-fast" sources={smokeTestSources} /></p>
      <p>首图里的候选构建是 `9f31`。它先站在闸门左边，后面的 120 个回归用例锁在右边；Health、Login、Create order、Payment 四盏灯逐一亮起，任何一盏变红，闸门就应该关上。冒烟测试的产物不是一张“质量 100 分”的成绩单，而是清楚的 `PROCEED` 或 `STOP`。</p>
      <p id="smoke-build-check" className="vp-citation-target">构建验证还应把部署、卸载、配置和安装脚本看作系统的一部分。一个二进制能编译出来，却无法在目标环境启动，仍然不配进入更大的功能测试；冒烟路径要把这些最早会让测试失去意义的接缝纳入检查。<Cite id="smoke-build-check" sources={smokeTestSources} /></p>
    </ArticleSection>
    <ArticleSection id="smoke-path" title="少量检查要踩中真正的入口">
      <p id="smoke-coverage" className="vp-citation-target">GitLab 的 smoke suite 选择的是标准认证、创建项目、创建 issue、合并请求等基本功能；它没有试图覆盖每个设置组合，而是挑用户一开始就会走、失败后整个环境都不值得继续用的路径。<Cite id="smoke-coverage" sources={smokeTestSources} /></p>
      <p id="smoke-health" className="vp-citation-target">GitLab 还把 health check 单独做成更小的子集，用来监测应用状态。健康检查可以先回答“服务还活着吗”，但它不能代替登录、创建资源和核心交易；工作台故意把四盏灯并列，避免把一个 200 当成整条链路的通行证。<Cite id="smoke-health" sources={smokeTestSources} /></p>
      <SmokeTestLesson />
      <p id="smoke-priority" className="vp-citation-target">GitLab 的测试策略把这种顺序叫作 fast feedback 和 progressive testing：先跑最相关的窄检查，失败就尽快修；通过后再逐步扩大范围。冒烟套件应该有明确的 owner 和失败后的动作，否则它只是又一组会变旧的自动化脚本。<Cite id="smoke-priority" sources={smokeTestSources} /></p>
      <p id="smoke-placement" className="vp-citation-target">检查放在哪个阶段也要有理由：部署流水线适合 smoke，完整 E2E 可以放在更重的阶段。把所有检查挤在同一个发布末端，会让反馈来得太晚；把所有检查都放在最早阶段，又会让开发者每次改字都等待整座系统启动。<Cite id="smoke-placement" sources={smokeTestSources} /></p>
    </ArticleSection>
    <ArticleSection id="smoke-boundary" title="通过一盏灯，不等于整栋楼合格">
      <p id="smoke-build" className="vp-citation-target">Martin Fowler 认为，一个有意义的 build 至少应该启动应用并运行一些简单测试；他把 smoke test 比作通电时先看看有没有冒烟。更 exhaustive 的测试仍有价值，但不能用冒烟通过替代它们。<Cite id="smoke-build" sources={smokeTestSources} /></p>
      <p id="smoke-feedback" className="vp-citation-target">Fowler 还把 BVT 视为成功构建的一部分，并提醒测试不能证明“没有任何 bug”。冒烟通过只说明候选构建没有在最基本的入口上立即倒下；性能、权限、边界组合、数据迁移和完整用户旅程仍需要其他层次来回答。<Cite id="smoke-feedback" sources={smokeTestSources} /></p>
      <p>这条边界很容易在发布压力下被抹平：前三盏灯是绿的，人会本能地想“先把回归跑完再说”。但如果 Payment 已经 502，后面 120 个用例大多只会重复证明环境坏了，还会让真正的失败埋在更长的日志里。冒烟测试的价值正是帮团队省下这段无效等待。</p>
    </ArticleSection>
    <ArticleSection id="smoke-operation" title="失败要关闸，也要留下下一步">
      <p id="smoke-blocking" className="vp-citation-target">GitLab 的测试策略要求能够可靠阻塞部署或发布的测试真正承担 blocking 责任，并把 smoke 放在部署流水线的关键位置。若一个冒烟失败既不阻止发布，也没有清楚的 owner，它就很难发挥闸门作用。<Cite id="smoke-blocking" sources={smokeTestSources} /></p>
      <p id="smoke-gate" className="vp-citation-target">GitLab CI/CD 的流水线按 stage 顺序推进：前一阶段失败时，后续阶段通常不会执行。冒烟测试正好利用这个结构把“修复候选构建”置于完整回归之前；通过后才把 120 个测试解锁。<Cite id="smoke-gate" sources={smokeTestSources} /></p>
      <p id="smoke-stage" className="vp-citation-target">流水线的早停不是把错误藏起来，而是把失败放在最接近原因的位置。报告至少应记录构建版本、环境、检查名、响应或截图、耗时以及下一步；重新部署后再从同一组关键灯开始，才能知道闸门是否真的打开。<Cite id="smoke-stage" sources={smokeTestSources} /></p>
      <p><strong>写完一组冒烟检查，问四句：</strong>它覆盖的是哪个不可缺的入口；失败会阻止什么；通过后会解锁哪一步；结果谁来处理？四句都能回答，冒烟测试才是一道会做决定的门，而不是一排只会变色的装饰灯。</p>
    </ArticleSection>
  </Article>;
}
