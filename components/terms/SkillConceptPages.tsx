import { BookOpen, FileText, Terminal } from '@phosphor-icons/react/dist/ssr';
import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { SkillLesson } from './SkillConceptLessons';
import { skillSources } from '@/lib/skill-concept-sources';
import s from './SkillConcepts.module.css';

export function SkillTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={skillSources}/>;
  return <ConceptArticle slug="skill" title="技能" subtitle="Agent Skill" sources={skillSources}
    intro={<>阿青给智能体装了三份技能：一份教它填 PDF 表单，一份教它分析数据表，一份教它写提交说明。智能体没有一次读完这三份材料，只在任务对上时打开那一份。</>}
    sections={[["package", "可复用的经验怎样打包"], ["disclosure", "用到才进入上下文"], ["trigger", "技能怎样被选中"], ["scripts", "运行代码，不读代码"], ["boundary", "相邻概念与安全"]]}
    hero={<ConceptHero slug="skill" label="技能分三层：常驻的元数据、命中后加载的正文、需要时读取或运行的资源"><div className={s.heroLayers}>
      <div data-layer={1}><BookOpen size={20} weight="light"/><span>name + description · 启动时常驻</span></div>
      <div data-layer={2}><FileText size={20} weight="light"/><span>SKILL.md 正文 · 命中后加载</span></div>
      <div data-layer={3}><Terminal size={20} weight="light"/><span>scripts/ 与 references/ · 需要时才读取或运行</span></div>
    </div></ConceptHero>}>
    <ArticleSection id="package" title="可复用的经验怎样打包">
      <p id="skill-purpose" className="vp-citation-target"><strong>技能是把做一类任务所需的说明和材料放进一个目录，让智能体按需取用。</strong>Anthropic 把它描述为可复用、基于文件系统的资源：目录里打包指令、元数据，以及可选的脚本与模板，在任务相关时自动使用。发布公告用的类比是给新员工的入职材料——一套工作流程不必每次都在对话里重新交代，装一次就一直在那里。<Cite id="skill-purpose"/></p>
      <p id="skill-structure" className="vp-citation-target">开放的 Agent Skills 规范给这个目录定了结构：<code>SKILL.md</code> 必需，frontmatter 至少写 <code>name</code> 和 <code>description</code>；习惯上再放 <code>scripts/</code>（可执行代码）、<code>references/</code>（按需读取的详细文档）、<code>assets/</code>（模板与资源）。<code>name</code> 最长 64 个字符，只用小写字母、数字和连字符，并且与目录同名；<code>description</code> 最长 1024 个字符，要写清做什么、什么时候用。<Cite id="skill-structure"/></p>
      <pre className={s.snippet}><code>{`---\nname: pdf-forms\ndescription: Extract and fill PDF form fields. Use when the user mentions PDFs or forms.\n---`}</code></pre>
    </ArticleSection>
    <ArticleSection id="disclosure" title="用到才进入上下文">
      <p id="skill-disclosure" className="vp-citation-target"><strong>技能的三层内容在不同时刻进入上下文。</strong>启动时，智能体把每个已装技能的 <code>name</code> 和 <code>description</code> 注入系统提示，每份大约一百个 token；任务命中某个描述之后，它才读取 <code>SKILL.md</code> 正文进入上下文——规范建议正文控制在 500 行、约 5,000 token 以内；正文引用的详细文档继续放在 <code>references/</code> 里按需读取。这种渐进式披露是技能的核心设计：资料可以加得很多，因为其中大部分平时不占窗口。<Cite id="skill-disclosure"/></p>
      <p>下面的演示对比两种装载方式。教学预算设为 6,000 token 的上下文，系统提示占 800，三份技能的正文分别是 2,400、2,600 和 1,600 token；这些数字是教学样例，不是对某个真实产品的测量。逐步点按钮，盯住右侧哪些条目进入窗口。</p>
      <SkillLesson/>
    </ArticleSection>
    <ArticleSection id="trigger" title="技能怎样被选中">
      <p id="skill-trigger" className="vp-citation-target">技能没有“装好就全程生效”的开关。触发发生在模型自己的判断里：当前任务摆在那里，系统提示中各技能的元数据一直可见，智能体据此决定要不要去读某份正文。读正文之前，它对这份技能的全部了解就只有那两行元数据——这正是 <code>description</code> 承担的责任。<Cite id="skill-trigger"/></p>
      <p id="skill-description" className="vp-citation-target">规范因此要求描述里带上用户真正会说出的关键词，并直接给了反例：一句 <code>Helps with PDFs.</code> 不合格。这样的描述既对不上“帮我填这个表单”，也对不上“合并两个 PDF”，技能装了也一直轮不到它。<Cite id="skill-description"/></p>
      <ArticleAside title="没有任何技能匹配时？"><p>演示里选“写一份周报”，三份技能的描述都对不上。智能体不读取任何正文，用一般能力完成任务。技能靠匹配出场，不是靠安装数量；装了三十份，也意味着元数据里多了三十行常驻内容。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="scripts" title="运行代码，不读代码">
      <p id="skill-scripts" className="vp-citation-target">脚本走的是另一条路：智能体在代码执行环境里运行 <code>scripts/</code> 中的文件，脚本代码本身不进入上下文，只有输出消耗 token。官方示例是 PDF 技能自带的 Python 脚本提取表单字段——代码运行结果确定、可复现，比让模型逐 token 抄写每个字段可靠。这同时交代了技能的边界：<strong>它依赖宿主有读取文件和执行代码的能力</strong>，不具备这些能力的产品跑不动捆绑脚本。<Cite id="skill-scripts"/></p>
    </ArticleSection>
    <ArticleSection id="boundary" title="相邻概念与安全">
      <p id="skill-prompt-diff" className="vp-citation-target">与提示词的差别在存续方式：提示词是对话级指令，这次会话说过就这次生效；技能是放在文件系统里的持久资源，命中任务才加载，不必每次重复同一段交代。<Cite id="skill-prompt-diff"/></p>
      <div className={s.contrast}><div><h3>提示词</h3><p>随对话提出、随对话结束。适合一次性要求，重复的流程说明会反复占用输入。</p></div><div><h3>工具调用</h3><p>给智能体对外操作的接口。技能不新增接口，它教智能体怎样按顺序组合已有的操作。</p></div><div><h3>MCP</h3><p>规定外部系统与智能体怎样连接。官方工程博客把两者说成互补：MCP 接通数据与工具，技能教更完整的工作流程。<Cite id="skill-mcp"/></p></div></div>
      <blockquote className={s.quote}>技能不改模型，<br/>只改模型手头有什么资料。</blockquote>
      <p id="skill-security" className="vp-citation-target"><strong>安装技能要像安装软件一样谨慎。</strong>技能可以指挥智能体运行捆绑脚本、访问外部资源；Anthropic 的文档明确警告恶意技能可能引入漏洞、诱导数据外泄或未授权访问，即使来源可信，技能引用的外部依赖之后变更也可能让它变得危险。安装前审阅 <code>SKILL.md</code> 和脚本内容，是使用者自己的事。<Cite id="skill-security"/></p>
      <p>站内的<ConceptTerm slug="tools">工具调用</ConceptTerm>解释一次调用怎样发出与返回，<ConceptTerm slug="mcp">MCP</ConceptTerm>解释外部能力怎样被发现和接入；技能回答的是另一个问题——怎么让智能体长期“会做某件事”。上下文窗口的容量细节见<ConceptTerm slug="context">上下文</ConceptTerm>。</p>
    </ArticleSection>
  </ConceptArticle>;
}
