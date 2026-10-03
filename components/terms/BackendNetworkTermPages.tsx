import { ArrowRight, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { ArticleCitation, ArticleSection, ConceptArticle } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { BackendNetworkLesson, type BackendNetworkLessonSpec } from "./backend-network-lessons/BackendNetworkLesson";
import styles from "./BackendNetworkConcepts.module.css";
import type { Source } from "@/lib/backend-network-sources";
import { apiKeySources, rbacSources } from "@/lib/backend-network-sources";

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

const apiKeySpec: PageSpec = {
  slug: "api-key",
  title: "API 密钥",
  subtitle: "API Key · 识别调用方的共享凭据",
  intro: "一个天气服务要知道是谁在调用、是否应该计量额度，但它不一定需要知道每位访客的登录身份。API 密钥是一串由调用方携带、服务端验证的凭据；它能帮助识别应用或项目，却不能自动证明每一次请求都被授权。",
  hero: {
    question: "天气应用请求一次城市天气",
    nodes: [["调用方", "weather-widget"], ["请求头", "X-API-Key: …"], ["服务端", "识别 / 计量"]],
    proof: "密钥只让服务识别这把钥匙；资源权限和用户身份仍要另行判断。",
  },
  sections: [
    {
      id: "api-key-definition",
      title: "它在请求里扮演什么角色",
      blocks: [
        { id: "api-key-definition", text: "API 密钥通常是一段由服务端签发的字符串，调用方在请求头或其他约定位置提交它。服务端验证密钥后，可以识别项目、统计用量、应用速率限制或选择一套 API 策略。它更像“哪一个应用在调用”的共享凭据，而不是“哪一个最终用户已经登录”的完整身份证明。" },
        { id: "api-key-storage", text: "密钥一旦被当作 bearer secret，拿到它的人通常就能以它所代表的调用方发起请求。因此服务器端应把密钥放在受保护的配置或密钥管理器里，客户端公开代码、截图、浏览器历史和 URL 都不是安全的长期存放位置。" },
      ],
      lesson: {
        title: "同一把钥匙被放在哪里，泄露面就不同",
        ariaLabel: "API 密钥在受控请求头和公开位置之间的演示",
        steps: [
          { label: "服务端代理", actors: ["浏览器", "受控服务", "天气 API"], evidence: "浏览器只拿到自己的会话，密钥停留在受控服务到天气 API 的请求里。" },
          { label: "请求头提交", actors: ["weather-widget", "X-API-Key", "服务端验证"], evidence: "请求可以按项目计量，但日志仍需要脱敏，不能把完整密钥写进去。" },
          { label: "轮换旧钥匙", actors: ["新 key", "服务端", "旧 key · 401"], evidence: "轮换后新请求继续工作，旧密钥被撤销，泄露窗口被缩短。" },
        ],
        failure: { label: "放进 URL 或前端包", text: "查询字符串会进入历史、日志和分析系统，前端包也会被任何访客下载；这不是把秘密藏起来。" },
      },
    },
    {
      id: "api-key-operations",
      title: "识别、计量和授权要分开",
      blocks: [
        { id: "api-key-operations", text: "服务可以根据 API 密钥把请求归到一个项目并扣减配额，但“这个项目能调用天气 API”仍是服务端的策略判断。若请求还涉及某位用户的私人资源，就需要登录会话、OAuth 或对象级授权等另一层证据；不能因为 key 有效就跳过用户和资源检查。" },
        { id: "api-key-boundary", text: "API 网关常把密钥和 usage plan、配额、速率限制关联起来。这些机制保护服务容量和计量口径，却不替代业务权限。一个 key 可以被限制只能调用 /weather，仍然可能需要检查地区、账户状态或数据所有权。" },
      ],
    },
    {
      id: "api-key-leak",
      title: "失效、泄露与替代路径",
      blocks: [
        { id: "api-key-leak", text: "发现密钥出现在日志、仓库或公共前端时，应先撤销或轮换，再追查使用记录；只把字符串从页面删掉并不会让旧钥匙失效。服务端应能区分过期、撤销、额度耗尽和权限不足，让调用方知道下一步是换钥匙、等待配额还是改变授权请求。" },
        { id: "api-key-rotation", text: "读者判断一条 API key 方案时，可以问：密钥代表谁、放在哪里、怎样轮换、泄露后能做多大范围的事。若需求是让用户授权第三方读取自己的资源，应沿 OAuth 等授权流程设计，而不是把用户密码或一把全能 key 交给第三方。" },
      ],
    },
  ],
  sources: apiKeySources,
  relatedIntro: "API 密钥主要识别调用方和计量；继续看授权、OAuth 与最小权限，可以理解它为什么不能单独回答“这个用户能不能操作这条数据”。",
};

export function ApiKeyTermPage() {
  return renderBackendNetworkPage(apiKeySpec);
}
