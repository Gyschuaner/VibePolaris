import { ArrowRight, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import { ArticleCitation, ArticleSection, ConceptArticle } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { BackendNetworkLesson, type BackendNetworkLessonSpec } from "./backend-network-lessons/BackendNetworkLesson";
import styles from "./BackendNetworkConcepts.module.css";
import type { Source } from "@/lib/backend-network-sources";
import { acidSources, apiKeySources, columnSources, nosqlSources, rbacSources, relationalDatabaseSources, rowSources } from "@/lib/backend-network-sources";

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

const relationalDatabaseSpec: PageSpec = {
  slug: "relational-database",
  title: "关系型数据库",
  subtitle: "Relational Database · 用关系、键和约束组织可查询的数据",
  intro: "订单系统里，客户、订单和订单明细彼此有关，却不应该把同一份客户地址复制到每一条订单里。关系型数据库用表中的行和列保存事实，用键表达关系，再用查询把需要的结果组合出来。",
  hero: {
    question: "查找阿青最近的一笔订单",
    nodes: [["customers", "id = 7"], ["orders", "customer_id = 7"], ["结果", "订单号 + 金额"]],
    proof: "连接条件把两张关系组合起来；约束帮助拒绝不存在的客户。",
  },
  sections: [
    {
      id: "relational-definition",
      title: "表只是关系模型的一种外观",
      blocks: [
        { id: "relational-definition", text: "关系型数据库把数据放在关系中；在常见实现里，关系以表呈现，列描述属性，行保存一条记录。客户表可以用 id、name 表示客户，订单表用 customer_id 指向客户。这个结构让每项事实有稳定位置，也让查询和约束有共同的语言。" },
        { id: "relational-constraints", text: "主键保证一行能被识别，外键表达一条关系必须指向哪里，唯一和非空约束则限制哪些值可以出现。约束不是装饰性的说明：数据库在写入时检查它们，失败就拒绝这次变化，避免错误数据悄悄进入后续查询。" },
      ],
      lesson: {
        title: "从两张关系得到一张结果关系",
        ariaLabel: "关系型数据库通过主外键和查询组合结果的演示",
        steps: [
          { label: "保留列", actors: ["customers", "id · name", "orders"], evidence: "先决定结果需要哪些属性，未用到的列不会因为存在就自动出现在结果里。" },
          { label: "连接匹配", actors: ["customers.id", "=", "orders.customer_id"], evidence: "连接条件把属于同一客户的行配在一起，不是按两张表的视觉位置硬拼。" },
          { label: "过滤结果", actors: ["customer_id=7", "amount > 100", "3 rows"], evidence: "条件只留下满足查询的组合，原始表仍保持自己的行和列。" },
        ],
        failure: { label: "没有连接条件", text: "两张表会产生笛卡尔积，结果行数突然放大；查询看似有数据，却不再代表一笔订单属于哪个客户。" },
      },
    },
    {
      id: "relational-query",
      title: "查询是在组合事实，不是复制数据",
      blocks: [
        { id: "relational-query", text: "查询可以筛选行、选择列、排序并连接多张关系。查订单时，数据库按表达式计算结果关系；这个结果通常是一次读取的视图，不会自动把新列写回原表。把“查到了”与“保存了”分开，才能理解为什么 SELECT 不会修改订单。" },
        { id: "relational-boundary", text: "关系型数据库并不规定只能有一种产品或一种扩展方式。不同实现对类型、索引、事务隔离和分布式能力的支持不同；“有表”也不等于设计合理。关键是让数据结构、访问模式和一致性要求彼此匹配。" },
      ],
    },
    {
      id: "relational-constraints",
      title: "边界：关系不是所有问题的唯一答案",
      blocks: [
        { id: "relational-integrity", text: "如果订单必须引用一个存在的客户，外键能阻止孤儿订单；如果一次转账要同时改两行，事务能把相关变化放进同一个边界。这些能力来自具体数据库的约束与事务实现，不是“关系型”三个字自动保证。" },
        { id: "relational-boundary", text: "当数据主要按文档聚合、键值查找或图关系访问时，NoSQL 等模型可能更贴合访问模式；选择它们也意味着接受不同的查询、约束和一致性取舍。读者应先描述要保存的事实、查询路径和失败后果，再决定模型，而不是按潮流选择产品。" },
      ],
    },
  ],
  sources: relationalDatabaseSources,
  relatedIntro: "关系型数据库与表、行、列、主键、外键和 SQL 互相配合；继续看 NoSQL，可以比较不同数据模型如何回应不同访问模式。",
};

export function RelationalDatabaseTermPage() {
  return renderBackendNetworkPage(relationalDatabaseSpec);
}

const nosqlSpec: PageSpec = {
  slug: "nosql",
  title: "NoSQL",
  subtitle: "NoSQL · 从访问模式出发选择非关系数据模型",
  intro: "商品页要一次读出完整的商品和库存，社交图谱要沿关系找朋友的朋友，计数器则只需按一个键快速更新。NoSQL 不是一种单一数据库，而是一组针对不同访问模式设计的数据模型。",
  hero: {
    question: "同一个业务问题，先问怎样读取",
    nodes: [["访问模式", "最近订单"], ["数据模型", "文档 / 键值"], ["取舍", "读写与一致性"]],
    proof: "模型围绕查询路径设计；NoSQL 不等于没有结构。",
  },
  sections: [
    {
      id: "nosql-models",
      title: "它是一个伞形词，不是一台产品",
      blocks: [
        { id: "nosql-models", text: "NoSQL 通常覆盖文档、键值、列族和图等多类模型。文档模型可以把订单及其明细放在同一个聚合里，键值模型按一个主键取值，图模型则把节点和边作为一等对象。它们都能有结构、索引和约束，只是结构与查询接口不再以关系表和连接为中心。" },
        { id: "nosql-query", text: "设计 NoSQL 数据时，先列出系统真正要执行的读取和写入：是按用户读取完整资料，还是按时间范围扫描事件，还是沿关系找邻居。常见做法是围绕这些访问模式组织数据，必要时把同一事实复制到多个聚合中，以减少运行时连接。" },
      ],
      lesson: {
        title: "同一批订单在不同模型里的读取路径",
        ariaLabel: "关系表、文档和键值模型针对访问模式的对照演示",
        steps: [
          { label: "读一个用户", actors: ["用户 7", "profile 文档", "1 次读取"], evidence: "完整资料和最近订单已经聚合，读取路径短，但写入重复会增加。" },
          { label: "改共享价格", actors: ["商品", "120 个订单", "更新策略"], evidence: "若把价格嵌入每个订单，改一次价格可能需要更新很多副本。" },
          { label: "选择查询模型", actors: ["访问模式", "数据布局", "可接受取舍"], evidence: "模型选择回答的是访问与一致性问题，不是给数据库贴上‘更快’标签。" },
        ],
        failure: { label: "只看存储外形", text: "把所有 JSON 文档都叫 NoSQL 方案，却没有说明查询、索引和一致性，无法预测一次业务变化会影响多少记录。" },
      },
    },
    {
      id: "nosql-tradeoff",
      title: "速度、可用性与一致性是取舍",
      blocks: [
        { id: "nosql-tradeoff", text: "某些 NoSQL 系统把高可用和分布式扩展放在前面，允许在部分故障或网络分区时继续响应；另一些系统提供更强的事务或一致性选项。论文和产品文档描述的是具体系统的取舍，不能把其中一个实现的特性推广给所有 NoSQL。" },
        { id: "nosql-boundary", text: "文档嵌套并不自动解决并发更新，键值读取也不自动提供跨记录原子性。要选型，必须写清允许多旧的数据、哪些更新必须同时成功、失败后怎样重试，以及索引和存储成本如何增长。" },
      ],
    },
    {
      id: "nosql-boundary",
      title: "失败分支：查询没设计进模型",
      blocks: [
        { id: "nosql-failure", text: "如果产品后来需要按未预想的字段组合筛选，原本为单一读取路径设计的模型可能只能全表扫描，或要求额外的投影和同步任务。新增索引、复制数据或引入另一种存储都可能增加一致性维护成本。" },
        { id: "nosql-selection", text: "读者看到“用 NoSQL 才能扩展”时，可以追问：是哪一种模型、哪种访问模式、哪一种一致性承诺，以及故障时允许什么结果。能描述这些条件，才是在谈工程取舍；只说“没有表所以灵活”还不够。" },
      ],
    },
  ],
  sources: nosqlSources,
  relatedIntro: "NoSQL 与关系型数据库不是简单的新旧替代；先读关系型数据库、行和列，再按访问模式比较不同模型。",
};

export function NosqlTermPage() {
  return renderBackendNetworkPage(nosqlSpec);
}

const rowSpec: PageSpec = {
  slug: "row",
  title: "行",
  subtitle: "Row · 在列定义下保存一条记录",
  intro: "书目表里有编号、书名和可借状态三列；某一本书的这些值放在同一行。行不是表格屏幕上的第几条，也不是永远不变的内存卡片：它由列定义组成，并在事务和排序规则下被读取。",
  hero: {
    question: "两次读取同一个订单，为什么看到的值不同",
    nodes: [["订单行", "id = 7"], ["事务版本", "已提交 / 未提交"], ["读取", "按隔离规则可见"]],
    proof: "行是记录与版本的组合；结果位置不能代替稳定身份。",
  },
  sections: [
    {
      id: "row-definition",
      title: "一行对应一条记录的当前结构",
      blocks: [
        { id: "row-definition", text: "行是一组分别落在表列中的值。订单行可能同时包含 id、customer_id、amount 和 status；列定义告诉数据库这些值的名字、类型和约束。行的含义来自这套结构，而不是来自它在查询结果里排在第一还是第二。" },
        { id: "row-identity", text: "主键通常用于稳定地识别一行，更新或删除时应通过主键或明确条件定位。自动生成的标识是业务身份的一种实现，不等于数据库展示出来的行号；没有稳定键，复制、排序和并发更新都更难解释。" },
      ],
      lesson: {
        title: "同一行的两个事务版本",
        ariaLabel: "数据库行在事务提交前后如何对不同读取者可见",
        steps: [
          { label: "旧版本", actors: ["id=7", "balance=100", "事务 B"], evidence: "B 开始读取时看到已提交的 100，位置和版本都被明确记录。" },
          { label: "未提交更新", actors: ["事务 A", "balance=80", "事务 B"], evidence: "A 的修改尚未提交，B 按自己的隔离规则仍看见 100，不会把半成品当成事实。" },
          { label: "提交后读取", actors: ["COMMIT", "id=7 · 80", "事务 C"], evidence: "C 在合适的读取时点看到已提交版本 80；这是可见性变化，不是把行号换了。" },
        ],
        failure: { label: "把结果位置当身份", text: "不加 ORDER BY 时，数据库没有承诺行的返回顺序；用‘第三行’更新记录会在计划或数据变化后指向另一条。" },
      },
    },
    {
      id: "row-versions",
      title: "读取到的是哪一个版本",
      blocks: [
        { id: "row-versions", text: "多事务数据库常用多版本并发控制，让读取者看到符合自己快照的已提交数据，同时减少读写互相阻塞。这里的“行”在实现中可能对应多个物理版本；文章讨论的是逻辑记录，不应把某个存储页地址当成永久身份。" },
        { id: "row-order", text: "查询结果的顺序需要显式 ORDER BY。即使一次运行恰好按主键返回，也可能因为索引、并行或执行计划变化而改变；想展示最新订单，应按时间列并补上处理相同时间的稳定键。" },
      ],
    },
    {
      id: "row-boundary",
      title: "边界：行不负责替你解释业务",
      blocks: [
        { id: "row-boundary", text: "一行可以通过类型和约束检查，却仍然包含业务错误，例如金额单位写错、状态迁移非法或对象属于另一个租户。行提供存储结构和可见性，业务规则、授权和跨表一致性还需要其他约束或应用逻辑。" },
        { id: "row-order", text: "读者看到“数据库返回了这行”时，应继续问：它由哪组条件定位，在哪个事务快照中可见，结果有没有明确排序，是否还经过对象授权。这样才能把记录、版本和业务结论分开。" },
      ],
    },
  ],
  sources: rowSources,
  relatedIntro: "行与列、表和主键共同描述关系数据；继续看事务与 ACID，可以理解一行在并发修改和故障恢复中的边界。",
};

export function RowTermPage() {
  return renderBackendNetworkPage(rowSpec);
}

const columnSpec: PageSpec = {
  slug: "column",
  title: "列",
  subtitle: "Column · 给每个属性规定名字、类型和约束",
  intro: "“金额”这一列到底是文字还是数字，会决定排序、求和和错误输入怎样处理。数据库列不是表头上的装饰，而是对一类属性的持续约定：新行写入时，值要按它的类型和约束接受检查。",
  hero: {
    question: "把四个金额放进同一列",
    nodes: [["输入", "2 · 10 · 9.5 · abc"], ["列类型", "NUMERIC"], ["结果", "21.5；abc 被拒"]],
    proof: "类型改变可执行的操作，也改变错误何时暴露。",
  },
  sections: [
    {
      id: "column-definition",
      title: "列定义的是一类属性",
      blocks: [
        { id: "column-definition", text: "列有名字、数据类型、默认值和可选约束。amount NUMERIC 表示这里存的是可计算的数值，created_at TIMESTAMP 表示时间，NOT NULL 则要求每一行都提供值。数据库把这些要求放在结构里，让插入和更新都经过同一套检查。" },
        { id: "column-constraints", text: "默认值只在调用方省略该列时提供一个初始值，CHECK 可以限制允许的范围，唯一约束则限制不同的行不能出现重复组合。它们共同描述“什么样的值才是可接受的”，但不自动理解更高层的业务含义。" },
      ],
      lesson: {
        title: "同一批输入在 TEXT 与 NUMERIC 列中的不同结果",
        ariaLabel: "数据库列类型改变排序、求和与拒绝输入的演示",
        steps: [
          { label: "文本列", actors: ["amount TEXT", "2 · 10 · 9.5", "字典序"], evidence: "排序会把 10 放在 2 前面；这些字符看起来像数字，却没有数值加法语义。" },
          { label: "数值列", actors: ["amount NUMERIC", "2 · 10 · 9.5", "SUM = 21.5"], evidence: "数据库按数值比较并求和，列类型让操作的含义稳定下来。" },
          { label: "错误输入", actors: ["amount NUMERIC", "abc", "拒绝写入"], evidence: "错误在写入边界暴露，避免不可计算的值悄悄进入后续报表。" },
        ],
        failure: { label: "把所有东西存成字符串", text: "看似省去类型选择，却把校验、排序和计算推给每个查询，错误会在更晚、更难追踪的地方出现。" },
      },
    },
    {
      id: "column-types",
      title: "类型会影响比较与计算",
      blocks: [
        { id: "column-types", text: "字符串“10”和数字 10 可能在显示上相似，数据库对它们的比较、排序和可用函数却不同。类型选择要看数据的真实含义：邮政编码是标识，适合字符串；金额是数量，需要数值类型；时间要带上时区和精度约定。" },
        { id: "column-operations", text: "查询可以选择某些列、计算表达式或给结果列取别名；这不会改变原列的定义。把 amount * quantity 算成 total，只创建本次结果中的一列；若要持久化 total，还要考虑它与源值不一致的更新问题。" },
      ],
    },
    {
      id: "column-boundary",
      title: "边界：类型不是业务规则的全部",
      blocks: [
        { id: "column-boundary", text: "NUMERIC 能阻止 abc，却不知道金额是否为正、币种是否匹配、订单状态是否允许退款。列约束、跨列 CHECK、外键和应用授权分别回答不同层的问题，不能把它们混成“字段校验已经完成”。" },
        { id: "column-operations", text: "读者看到一个列定义时，可以先问它保护了哪条事实，哪些输入仍会通过，查询如何使用它，以及改变类型会不会影响旧数据和索引。能预测这些后果，才真正理解列的作用。" },
      ],
    },
  ],
  sources: columnSources,
  relatedIntro: "列与行、表和数据库模式共同描述数据结构；继续看 ACID，可以理解这些定义如何参与一次可靠的事务。",
};

export function ColumnTermPage() {
  return renderBackendNetworkPage(columnSpec);
}

const acidSpec: PageSpec = {
  slug: "acid",
  title: "ACID",
  subtitle: "ACID · 事务在成功、并发与故障中的四个承诺",
  intro: "转账要么从一个账户扣款并给另一个账户入账，要么两边都不改变。ACID 把事务中常被期待的四类属性拆开：原子性、一致性、隔离性和持久性；它们分别回答不同的失败问题。",
  hero: {
    question: "一次转账遇到断电和并发读取",
    nodes: [["事务", "扣款 + 入账"], ["四项属性", "A · C · I · D"], ["结果", "全成 / 全败"]],
    proof: "ACID 不是一个保证业务正确的开关；每项都依赖约束与配置。",
  },
  sections: [
    {
      id: "acid-atomicity",
      title: "先把四个字母拆开",
      blocks: [
        { id: "acid-atomicity", text: "原子性（Atomicity）回答“事务里的变化是否全成或全败”：扣款成功、入账失败时，系统应能回滚成两边都没变。一致性（Consistency）回答“提交后是否仍满足数据库和事务写下的约束”，例如余额不能为负；它不是凭空替业务设计规则。" },
        { id: "acid-isolation", text: "隔离性（Isolation）回答并发事务怎样互相看见，取决于隔离级别和实现；持久性（Durability）回答提交成功后，系统重启或故障恢复时能否找回已提交变化。四项不是一条“安全等级”，而是四类可分别观察的承诺。" },
      ],
      lesson: {
        title: "逐项关闭条件，观察转账哪里出问题",
        ariaLabel: "ACID 四项属性分别影响转账、并发和恢复的演示",
        steps: [
          { label: "原子性", actors: ["扣款 -100", "断电", "回滚"], evidence: "入账没有完成时，扣款也被撤回；系统不留下半笔转账。" },
          { label: "隔离性", actors: ["事务 A", "并发读取", "事务 B"], evidence: "读取者只能看到符合隔离规则的版本，不把未提交余额当成已发生。" },
          { label: "持久性", actors: ["COMMIT", "WAL", "重启恢复"], evidence: "提交记录写入可恢复日志后，重启仍能重放已提交变化。" },
        ],
        failure: { label: "把一致性当真相保证", text: "数据库能检查声明的约束，却不知道‘一次转账必须经过风控’这类未写下的业务规则；规则缺失时，ACID 也不能替你补上。" },
      },
    },
    {
      id: "acid-consistency",
      title: "属性之间怎样一起工作",
      blocks: [
        { id: "acid-consistency", text: "一致性来自约束、触发器和事务逻辑的组合。把余额约束写进数据库，能让非法结果在提交时失败；但“余额足够”与“风控允许”可能需要锁、版本检查或应用服务共同决定。先明确由谁检查哪条规则，才能避免把一项属性的责任写给另一项。" },
        { id: "acid-durability", text: "许多数据库使用预写日志：先把足以恢复的变化写到日志，再确认提交。日志和存储配置决定故障后能恢复到什么点；同步提交、复制和备份是不同层次的选择，不能看到一个 WAL 文件就声称数据已经跨机房安全。" },
      ],
    },
    {
      id: "acid-boundary",
      title: "失败分支：四项都满足也不代表业务完成",
      blocks: [
        { id: "acid-boundary", text: "事务可能四项都满足，却把错误的账户当成目标；数据库守住的是程序交给它的变化。隔离级别提高通常会减少某些异常，但也可能增加等待和冲突；持久性配置越强，也可能增加写入延迟。产品需要在明确的失败后果下选择。" },
        { id: "acid-recovery", text: "读者判断“这个系统支持 ACID”时，应继续问范围是什么：单个数据库还是跨服务，哪些约束真的写入，提交确认点在哪里，故障恢复和重试怎样避免重复。没有这些限定，ACID 只是一个过于宽的标签。" },
      ],
    },
  ],
  sources: acidSources,
  relatedIntro: "ACID 建立在事务、行版本、约束和日志之上；继续看事务和备份，可以把四个属性放回具体系统边界。",
};

export function AcidTermPage() {
  return renderBackendNetworkPage(acidSpec);
}
