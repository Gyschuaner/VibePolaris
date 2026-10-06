import { ArticleSection } from "../ConceptArticle";
import { GitArticle, Cite } from "../GitConceptPageShared";
import { RollbackHero } from "./rollback-hero";
import { rollbackSources } from "@/lib/git-concept-sources/rollback";

const sections: [string, string][] = [
  ["rollback-trigger", "先确认故障和可回退目标"],
  ["rollback-route", "把流量切回已知可用制品"],
  ["rollback-boundary", "恢复服务后还要处理什么"],
];

export function RollbackTermPage() {
  return <GitArticle
    slug="rollback"
    title="回滚"
    subtitle="Rollback · 把运行中的服务恢复到已知可用版本"
    sources={rollbackSources}
    sections={sections}
    hero={<RollbackHero />}
    intro={<>回滚是在故障处理中把生产服务、工作负载或流量指针切回一个已经保留并知道如何运行的版本。它的价值是缩短用户受影响的时间；它不会把数据库写入、已发出的消息或外部 API 调用自动变成从未发生过。</>}
  >
    <ArticleSection id="rollback-trigger" title="先确认故障和可回退目标">
      <p id="rollback-incident" className="vp-citation-target">看到错误率升高或核心流程失败时，先确认当前生产部署确实异常，记录版本、时间和影响范围，再选择回退目标。回滚不是在事故现场重新构建旧源码，而是使用部署系统已经保存的、可以识别的版本或制品。<Cite id="rollback-incident" sources={rollbackSources} /></p>
      <p id="rollback-target" className="vp-citation-target">目标版本应来自部署历史，并且曾经在这个生产边界中可用。平台可能只允许回到曾绑定过生产域名的部署；Kubernetes 通过 rollout history 管理可回到的 revision，GitLab 则保留每个环境的部署记录。<Cite id="rollback-target" sources={rollbackSources} /></p>
      <p id="rollback-history" className="vp-citation-target">“上一版”是一个需要证据的说法：要确认提交、制品摘要、配置和数据模式是否彼此匹配。Kubernetes 的 <code>rollout undo</code> 可以回到上一版本或指定 revision，但回到历史版本仍要经过当前系统的健康检查。<Cite id="rollback-history" sources={rollbackSources} /></p>
    </ArticleSection>

    <ArticleSection id="rollback-route" title="把流量切回已知可用制品">
      <p id="rollback-switch" className="vp-citation-target">有些平台的即时回滚只重新把域名或流量指向已经存在的部署，不重新构建；这可以在秒级恢复服务，但它也意味着旧部署携带的配置可能已经过时。切换前要确认实际会改变哪些域名、区域和流量入口。<Cite id="rollback-switch" sources={rollbackSources} /></p>
      <p id="rollback-revision" className="vp-citation-target">在工作负载编排系统里，回滚通常由控制器重新采用某个历史 revision，并等待新的副本通过就绪和健康检查。自动化回滚也有前提：ECS circuit breaker 需要找到最近一个 <code>COMPLETED</code> 的部署，否则只能停住，不能凭空生成稳定版本。<Cite id="rollback-revision" sources={rollbackSources} /></p>
      <p id="rollback-auto" className="vp-citation-target">自动回滚把“什么算失败”写进了系统规则，例如启动失败、任务不达稳态或健康检查持续失败。规则触发后仍要保留事件和原因，避免只看到流量切回却不知道哪项证据触发了动作。<Cite id="rollback-auto" sources={rollbackSources} /></p>
      <p id="rollback-health" className="vp-citation-target">流量切换完成不代表恢复完成。要重新检查错误率、延迟和核心业务流程，并确认新旧版本与数据库模式兼容；指标恢复后才可以把回滚标记为成功。<Cite id="rollback-health" sources={rollbackSources} /></p>
    </ArticleSection>

    <ArticleSection id="rollback-boundary" title="恢复服务后还要处理什么">
      <p id="rollback-config" className="vp-citation-target">回滚到旧部署时，环境变量、定时任务、域名别名和外部连接不一定随代码一起回到旧状态。要把这些配置列为回滚前的确认项，不能用“代码版本相同”替代配置审查。<Cite id="rollback-config" sources={rollbackSources} /></p>
      <p id="rollback-data" className="vp-citation-target">数据库迁移、消息发送和第三方 API 调用可能已经发生。回滚应用版本不会自动撤销这些副作用；需要通过向后兼容的读取、补偿交易、消息去重或单独的数据修复流程处理。<Cite id="rollback-data" sources={rollbackSources} /></p>
      <p id="rollback-git-boundary" className="vp-citation-target">生产回滚和 Git 的两个命令解决的是不同层次的问题：rollback 切换已经部署的制品、工作负载或流量指针；<code>git revert</code> 在源代码历史追加一个反向提交；<code>git reset</code> 移动本地的 HEAD、引用或工作树。后两者都不会把生产流量自动切回稳定版本，生产回滚也不会改写 Git 历史。<Cite id="rollback-revert" sources={rollbackSources} /><Cite id="rollback-reset" sources={rollbackSources} /></p>
      <p id="rollback-verify" className="vp-citation-target">恢复后应保留“回到了哪个版本、何时切换、哪些检查转绿、哪些副作用待补偿”的记录。Vercel 的回滚流程会显示受影响域名并要求核对外部 API、数据库和 CMS 的行为；这正是发布记录的一部分，而不是事后凭记忆补写。<Cite id="rollback-verify" sources={rollbackSources} /></p>
      <p id="rollback-record" className="vp-citation-target">GitLab 把回滚视为一次新的部署记录，它指向要恢复的旧提交，而不是删除事故中的部署记录。这样后续排查仍能看到坏版本曾经发生、回滚何时发生，以及当前环境最后采用了哪个提交。<Cite id="rollback-record" sources={rollbackSources} /></p>
      <p id="rollback-new-deployment" className="vp-citation-target">修复完成后应重新构建并发布一个新的版本；如果部署过程需要重新生成制品，不能只重跑一半步骤就把旧制品当成新修复。回滚先恢复服务，根因修复仍要走正常验证和发布路径。<Cite id="rollback-new-deployment" sources={rollbackSources} /></p>
      <p><strong>读者判断：</strong>遇到线上故障时，先问“当前流量能否安全切回哪一个已知版本、恢复证据是什么、哪些数据或外部动作不能撤销”，再选择回滚、热修复或补偿方案。回滚是恢复手段，不是把事故从历史中抹掉。</p>
    </ArticleSection>
  </GitArticle>;
}
