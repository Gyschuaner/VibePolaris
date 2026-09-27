import { BookOpen, FileText, Terminal } from '@phosphor-icons/react/dist/ssr';
import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { SkillLesson } from './SkillConceptLessons';
import { skillSources } from '@/lib/skill-concept-sources';
import s from './SkillConcepts.module.css';

export function SkillTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={skillSources}/>;
  return <ConceptArticle slug="skill" title="技能" subtitle="Agent Skill" sources={skillSources}
    intro={<>Agent Skill 是一个可复用的目录，用来打包工作步骤和可选资源。宿主可以按需向智能体提供这些内容；目录格式相通，具体怎么触发和读取则取决于宿主。</>}
    sections={[['package', '把流程装进目录'], ['disclosure', '需要哪页，就读哪页'], ['trigger', '模型怎样选中它'], ['scripts', '指令与执行环境'], ['boundary', '相邻概念与安全']]}
    hero={<ConceptHero slug="skill" label="Skill 的内容分层进入模型上下文：宿主先提供元数据，选用后读取正文，再按需读取引用材料"><div className={s.heroLayers}>
      <div data-layer="metadata"><BookOpen size={20} weight="light"/><span><strong>name + description</strong><small>宿主发现后提供给模型</small></span></div>
      <div data-layer="instructions"><FileText size={20} weight="light"/><span><strong>SKILL.md 正文</strong><small>模型选用后，通过宿主读取</small></span></div>
      <div data-layer="resources"><Terminal size={20} weight="light"/><span><strong>references/ 与 scripts/</strong><small>按需读取；脚本由宿主执行</small></span></div>
    </div></ConceptHero>}>
    <ArticleSection id="package" title="把流程装进目录">
      <p id="skill-purpose" className="vp-citation-target"><strong>Skill 把重复要交代的流程收进一个文件夹，供智能体在相似任务中复用。</strong>核心是可读的工作说明；目录还可以带参考资料、模板和脚本。它包装的是做事的方法与材料，不是训练出一种新模型能力。<Cite id="skill-purpose"/></p>
      <p id="skill-structure" className="vp-citation-target">开放的 Agent Skills 规范要求目录里有 <code>SKILL.md</code>，文件以 YAML frontmatter 开头，至少包含 <code>name</code> 和 <code>description</code>，后面接 Markdown 指令正文。<code>scripts/</code>、<code>references/</code>、<code>assets/</code> 都是可选目录：放可运行代码、按需查阅的材料、模板或数据。是否能执行脚本，要看宿主是否提供相应环境。<Cite id="skill-structure"/></p>
      <div className={s.packageGrid}>
        <pre className={s.snippet}><code>{`hotel-invoices/\n├── SKILL.md                 # 必需：元数据 + 步骤\n├── references/               # 可选：详细规则\n│   └── 报销规则.md\n├── scripts/                  # 可选：可执行代码\n│   └── 提取字段.py\n└── assets/                   # 可选：模板、资源`}</code></pre>
        <div className={s.frontmatter}>
          <p>SKILL.md 的开头</p>
          <pre><code>{`---\nname: hotel-invoices\ndescription: 提取住宿发票字段并按报销规则核对。用户要求检查住宿发票、核对费用凭证时使用。\n---\n\n# 核对住宿发票\n1. 提取发票字段。\n2. 按需查阅报销规则。\n3. 标出缺项，交由用户复核。`}</code></pre>
        </div>
      </div>
      <p id="skill-description" className="vp-citation-target">规范给 <code>name</code> 和 <code>description</code> 设了格式边界：<code>name</code> 为 1–64 个小写字母、数字或连字符，不能以连字符开头/结尾、不能连写，并且与父目录同名；<code>description</code> 为 1–1024 个字符，要说明技能做什么、什么时候使用，并包含有助识别任务的关键词。<Cite id="skill-description"/></p>
    </ArticleSection>
    <ArticleSection id="disclosure" title="需要哪页，就读哪页">
      <p id="skill-disclosure" className="vp-citation-target">Agent Skills 规范约定目录格式，并建议渐进披露：兼容的运行时发现可用技能后，先让模型看到各项 <code>name</code> 与 <code>description</code>；模型选用某项技能后，再通过宿主提供的能力读取完整 <code>SKILL.md</code>；正文引用的其他材料，等任务需要时再读取。规范建议元数据约一百个 token、正文少于五千 token 和五百行。这些是组织建议；具体怎样发现目录、提供元数据、访问文件及安排时机，取决于宿主。<Cite id="skill-disclosure"/></p>
      <p>下面用一张住宿发票走一遍目录与上下文的边界。示意路径会显示一个兼容的宿主如何发现目录、把读取请求落实为文件访问，并在支持时运行脚本；Agent Skills 格式本身不规定这些运行接口。</p>
      <SkillLesson/>
    </ArticleSection>
    <ArticleSection id="trigger" title="模型怎样选中它">
      <p id="skill-trigger" className="vp-citation-target"><code>description</code> 帮模型判断一项技能和当前任务是否相关，但它不是所有产品通用的关键词路由规则。以 OpenAI 的 API 文档为例，模型可以按元数据决定是否使用 Skill；如果希望更确定，也能在提示里明确要求使用。模型判断的路径因此取决于宿主和请求方式。<Cite id="skill-trigger"/></p>
      <div className={s.descriptionCompare}>
        <div><span>信息不足</span><code>Helps with PDFs.</code><p>没有说清要处理哪类文件、完成什么操作。</p></div>
        <div><span>可供判断</span><code>提取住宿发票字段，并按报销规则检查缺项。用户要求核对住宿费用凭证时使用。</code><p>明确任务和适用场景；仍不保证模型每次都会调用。</p></div>
      </div>
      <p id="skill-description-example" className="vp-citation-target">开放规范把 <code>Helps with PDFs.</code> 列作较差示例，因为它没有具体说明技能能做什么、何时使用。写清用户的目标比写“擅长某个领域”更有助于发现相关技能，但最终是否触发仍由具体运行时决定。<Cite id="skill-description-example"/></p>
      <ArticleAside title="没有匹配的技能时？"><p>当前任务可以继续用智能体已有的一般能力处理，也可以转向其他工具或技能。安装一个目录本身不会让每个请求都加载它的正文。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="scripts" title="指令与执行环境">
      <p id="skill-scripts" className="vp-citation-target">说明正文告诉智能体怎么做；参考文件补充细节；脚本则可能把重复操作交给可执行程序。开放规范允许 Skill 带脚本，但支持的语言和运行方式由宿主决定。Anthropic 描述的 Claude VM 示例会通过 shell 运行脚本，模型收到的是运行结果而不是源码；这是该环境的行为示例，不能推成所有 Skill 都能这样执行。<Cite id="skill-scripts"/></p>
    </ArticleSection>
    <ArticleSection id="boundary" title="相邻概念与安全">
      <div className={s.contrast}>
        <div><h3>提示词</h3><p id="skill-prompt-diff" className="vp-citation-target">提示词表达当前请求或对话的要求；Skill 把可重复的流程整理成可复用文件夹。<Cite id="skill-prompt-diff"/></p></div>
        <div><h3>工具调用</h3><p id="skill-tools" className="vp-citation-target">工具提供一次具体操作的接口，例如读文件、运行代码或查询服务。Skill 可以指导智能体何时、按什么顺序使用现有工具，但不会因此自动增加接口。<Cite id="skill-tools"/></p></div>
        <div><h3>MCP</h3><p id="skill-mcp" className="vp-citation-target">MCP 连接模型与外部数据、工具和受控操作；Skill 复用围绕这些能力的工作步骤。两者可以配合：一个接通能力，一个说明如何完成流程。<Cite id="skill-mcp"/></p></div>
        <div><h3>记忆</h3><p id="skill-memory" className="vp-citation-target">记忆通常保存以后还可能用到的事实、偏好或先前决定；Skill 保存反复执行的步骤和配套资源。产品里的记忆机制各不相同，例如 ChatGPT Memory 和 Claude memory tool 都能在后续对话提供相关信息。<Cite id="skill-memory"/></p></div>
      </div>
      <blockquote className={s.quote}>Skill 装的是“怎么做”；<br/>记忆留的是“之前知道什么”。</blockquote>
      <p id="skill-security" className="vp-citation-target"><strong>把 Skill 当作需要审阅的代码与指令。</strong>它可能影响模型的规划和工具使用，也可能带有脚本或外部依赖；安装前应检查整个目录，而不只看 <code>SKILL.md</code>。实际可做的操作仍受宿主提供的工具、沙箱和权限策略限制。<Cite id="skill-security"/></p>
      <p>站内的<ConceptTerm slug="tools">工具调用</ConceptTerm>解释一次操作怎样发出与返回，<ConceptTerm slug="mcp">MCP</ConceptTerm>解释外部能力怎样被连接；<ConceptTerm slug="context">上下文</ConceptTerm>说明模型当前能读取哪些内容。</p>
    </ArticleSection>
  </ConceptArticle>;
}
