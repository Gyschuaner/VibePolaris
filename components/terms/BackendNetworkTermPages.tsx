import { ArrowRight, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { ArticleCitation, ArticleSection, ConceptArticle } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { BackendNetworkLesson, type BackendNetworkLessonSpec } from "./backend-network-lessons/BackendNetworkLesson";
import styles from "./BackendNetworkConcepts.module.css";
import type { Source } from "@/lib/backend-network-sources";
import { rbacSources } from "@/lib/backend-network-sources";

type Block = { id: string; text: string };
type Section = { id: string; title: string; blocks: Block[]; lesson?: BackendNetworkLessonSpec };
type PageSpec = {
  slug: string;
  title: string;
  subtitle: string;
  intro: string;
  hero: { question: string; nodes: [string, string][]; proof: string };
  sections: Section[];
  sources: Source[];
  relatedIntro: string;
};

function BackendNetworkHero({ slug, hero }: { slug: string; hero: PageSpec["hero"] }) {
  return <ConceptHero slug={`backend-network-${slug}`} label={`${hero.question}：${hero.proof}`}>
    <div className={styles.heroBoard}>
      <div className={styles.heroQuestion}>{hero.question}</div>
      <div className={styles.heroPath}>
        {hero.nodes.map(([label, value], index) => <div className={styles.heroNode} key={label}>
          <span>{label}</span><strong>{value}</strong>{index < hero.nodes.length - 1 && <ArrowRight className={styles.heroArrow} size={18} aria-hidden="true" />}
        </div>)}
      </div>
      <div className={styles.heroProof}><ShieldCheck size={17} aria-hidden="true" /> {hero.proof}</div>
    </div>
  </ConceptHero>;
}

function renderBackendNetworkPage(spec: PageSpec) {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={spec.sources} />;
  return <ConceptArticle
    slug={spec.slug}
    title={spec.title}
    subtitle={spec.subtitle}
    sources={spec.sources}
    sections={spec.sections.map(({ id, title }) => [id, title])}
    relatedIntro={spec.relatedIntro}
    intro={spec.intro}
    hero={<BackendNetworkHero slug={spec.slug} hero={spec.hero} />}
  >
    {spec.sections.map(section => <ArticleSection id={section.id} title={section.title} key={section.id}>
      {section.blocks.map(block => <p id={block.id} className="vp-citation-target" key={block.id}>{block.text}<Cite id={block.id} /></p>)}
      {section.lesson ? <BackendNetworkLesson spec={section.lesson} /> : null}
    </ArticleSection>)}
  </ConceptArticle>;
}

const rbacSpec: PageSpec = {
  slug: "rbac",
  title: "基于角色的访问控制",
  subtitle: "Role-Based Access Control · 先分配角色，再决定能做什么",
  intro: "报销系统里，阿青可以查看自己的发票，财务可以审批部门发票，客服只能处理客户提交的退款问题。RBAC 把这些可重复的职责整理成角色，再把用户放入角色，让一次授权判断有可追踪的来源。",
  hero: {
    question: "用户申请查看一张发票",
    nodes: [["用户", "阿青"], ["角色", "viewer"], ["权限", "invoice:read"]],
    proof: "权限来自角色分配；对象属于谁仍需额外检查。",
  },
  sections: [
    {
      id: "rbac-definition",
      title: "先把职责放进角色",
      blocks: [
        { id: "rbac-definition", text: "RBAC 的核心关系是“用户—角色—权限”：权限描述可以执行的动作，角色把一组权限命名为一种职责，用户再被分配到一个或多个角色。访问请求到来时，系统先求出用户当前角色带来的权限集合，再判断请求的动作是否在集合内。角色不是“管理员”这个字符串本身，而是可审计、可回收的一组授权关系。" },
        { id: "rbac-roles", text: "例如 viewer 只有 invoice:read，finance 还拥有 invoice:approve；把阿青从 viewer 改为 finance，改变的是角色分配，访问判断随之改变。角色层级可以表达继承，但继承越多越要能说清楚一项权限是从哪条关系得到的，否则排查越权会变成猜测。" },
      ],
      lesson: {
        title: "一项权限怎样沿角色关系到达请求",
        ariaLabel: "用户、角色和权限三层关系的 RBAC 演示",
        steps: [
          { label: "分配角色", actors: ["阿青", "viewer", "invoice:read"], evidence: "viewer 的权限集合出现 invoice:read，尚未产生任何业务操作。" },
          { label: "发起读取", actors: ["阿青", "viewer", "GET /invoices/7"], evidence: "请求的动作与角色权限匹配，进入下一道对象检查。" },
          { label: "补充对象判断", actors: ["invoice:7", "owner=阿青", "允许"], evidence: "角色只回答“能否读这类资源”；对象归属检查才回答“能否读这一张”。" },
        ],
        failure: { label: "只看角色名", text: "把 role=admin 当成全部允许，会跳过资源范围、租户和对象归属，容易形成越权。" },
      },
    },
    {
      id: "rbac-operations",
      title: "一次判断到底检查什么",
      blocks: [
        { id: "rbac-operations", text: "一次完整授权通常至少包含主体、动作、资源和范围：谁在什么租户里，对哪张发票做什么。RBAC 很适合表达“财务可以审批发票”这类稳定职责；服务端仍要在每次敏感操作前执行检查，不能因为按钮在前端隐藏了，就认为请求已经被保护。" },
        { id: "rbac-boundary", text: "当规则依赖“只能看自己的记录”“只在工作时间允许”或“设备风险低于某值”时，角色本身就不够表达。可以把角色当作粗粒度的基础条件，再用属性或关系补充对象、时间和环境约束；这正是 ABAC、ReBAC 等模型出现的原因。" },
      ],
    },
    {
      id: "rbac-failure",
      title: "失败分支与最小授权",
      blocks: [
        { id: "rbac-failure", text: "如果用户没有对应角色，系统应拒绝请求并记录主体、动作、资源和策略结果；如果角色有 invoice:read，却试图执行 invoice:approve，也应在服务端拒绝。把所有人塞进一个超级角色，虽然短期省事，却让撤销、审计和事故范围一起变大。" },
        { id: "rbac-audit", text: "读者拿到一条角色规则时，可以先问三件事：角色授予哪些具体动作，权限是否限定资源范围，用户的角色从哪里来、何时撤销。能回答这三件事，才知道 RBAC 帮助解决了哪一层问题，也知道还缺哪一道对象授权。" },
      ],
    },
  ],
  sources: rbacSources,
  relatedIntro: "RBAC 解决角色与权限的组织方式；继续看授权、最小权限和 API 密钥，可以把“谁能做什么”与“请求怎样证明自己”分开。",
};

export function RbacTermPage() {
  return renderBackendNetworkPage(rbacSpec);
}
