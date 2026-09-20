import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from "./ConceptArticle";
import { AgentLoopLesson, ContextLesson, ToolCallingLesson } from "./ConceptLessons";
import { agentLoopSources, contextSources, toolCallingSources } from "@/lib/concept-article-sources";
import { ArrowRight, Brain, Database, FileText, ShieldCheck, Wrench } from "@phosphor-icons/react/dist/ssr";
import styles from "./ConceptArticle.module.css";

const toolSections: [string, string][] = [["read-log", "一次日志读取"], ["request", "工具名称与参数"], ["result", "结果回到模型"], ["failures", "失败与操作权限"]];
const contextSections: [string, string][] = [["assemble", "组合本轮输入"], ["window", "窗口与外部资料"], ["selection", "选择需要的信息"], ["handoff", "换一次会话继续"]];
const loopSections: [string, string][] = [["repair-loop", "任务怎样逐轮推进"], ["round", "一轮里发生的事"], ["stopping", "循环何时结束"], ["workflow", "固定流程与临场判断"]];

export function ToolCallingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation sources={toolCallingSources} id={id} />;
  return <ConceptArticle slug="tools" title="Tool calling" sections={toolSections} sources={toolCallingSources} intro={<>工具调用把模型提出的请求接到真实操作上。<strong>模型生成工具名称和参数，运行程序执行操作，再把结果交回模型。</strong></>}>
    <ArticleSection id="read-log" title="一次日志读取">
      <p>你让模型排查一个启动失败的服务。它说“我先读一下日志”，这时文件还没有被打开。接下来必须有人接收读取请求、找到文件工具，并把实际读到的内容带回来。</p>
      <p>下面沿着 <code>server.log</code> 走一遍。可以切换读取结果，观察同一个请求怎样得到不同的后续处理。演示使用固定样例，不会读取你的文件。</p>
      <ToolCallingLesson />
      <p id="tools-contract" className="vp-citation-target">本文的文件工具由应用执行。工具也可以托管在服务提供方，例如平台内置的搜索；两种情况下，都需要有实际的执行系统完成操作。<strong>回复里出现一个函数名，不能证明工具已经运行。</strong><Cite id="tools-contract" /></p>
    </ArticleSection>
    <ArticleSection id="request" title="工具名称与参数">
      <p id="tools-definition" className="vp-citation-target">调用之前，应用先告诉模型有哪些工具可用。一份工具定义通常包含名称、用途和输入格式。例如 <code>read_file</code> 用于读取文件，参数 <code>path</code> 指定路径。用途说明帮助模型选择工具，参数约定帮助程序理解请求。<Cite id="tools-definition" /></p>
      <div className={styles.contract} role="group" aria-label="读取工具的定义"><div><Wrench size={24} /><h3>read_file</h3><p>读取指定路径的文本文件</p></div><div><span>输入参数</span><code>path: string</code><p>例如 server.log</p></div></div>
      <p>收到“排查启动失败”的任务后，模型可以提出 <code>{'{ "path": "server.log" }'}</code>。路径来自当前任务或已有信息；如果还不知道日志放在哪里，应用应当允许它查询目录或询问用户。</p>
      <p id="tools-execution" className="vp-citation-target"><ConceptTerm slug="agent-harness">Harness</ConceptTerm> 根据工具名称找到对应的程序，检查参数和操作范围，然后执行。即使请求格式正确，文件仍可能不存在，运行时也可能没有读取权限。<strong>格式正确与操作成功是两件需要分别确认的事。</strong><Cite id="tools-execution" /></p>
      <p id="tools-handoff" className="vp-citation-target">这里有一次控制权交接：模型生成完整请求后，运行程序接手执行，取得结果后才继续调用模型。Hugging Face 的公开课程用“停止生成、解析动作”解释这一步。请求既可以用结构化数据表达，也可以采用由外部环境执行的代码；都不能靠模型自行续写一个结果来代替执行。<Cite id="tools-handoff" /></p>
      <ArticleAside title="看一份简化的调用记录"><pre className={styles.code}>{`请求 #17\nname: read_file\ninput: { path: "server.log" }\n\n结果 → 请求 #17\napp.py:1 — SyntaxError: expected ':'`}</pre><p>这里用同一个编号把请求和结果对应起来。实际接口的字段名可能不同；阅读日志时，先确认看到的结果属于哪一次调用。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="result" title="结果回到模型">
      <p id="tools-result" className="vp-citation-target">工具完成后，应用把返回内容与这次请求关联，再加入后续模型调用。以 Claude 的接口为例，请求中的调用 ID 会对应结果里的 <code>tool_use_id</code>，失败时还可以标明错误状态。模型收到结果后，才能依据日志继续回答或提出下一次操作。<Cite id="tools-result" /></p>
      <div className={styles.resultFlow} aria-label="日志进入下一轮输入"><FileText size={30} weight="light" /><span>实际日志</span><ArrowRight size={20} /><span>下一轮上下文</span><ArrowRight size={20} /><Brain size={30} weight="light" /></div>
      <p>在这个例子里，模型看到“第一行缺少冒号”，才有依据查看并修改 <code>app.py</code>。如果应用把日志读出来，却没有带入下一轮<ConceptTerm slug="context">上下文</ConceptTerm>，模型仍然缺少这份信息。</p>
      <p>一次调用只完成一次具体操作。读取日志、修改代码、运行检查，是几次不同的工具操作；把它们根据返回结果接起来，就会用到<ConceptTerm slug="agent-loop">智能体循环</ConceptTerm>。</p>
    </ArticleSection>
    <ArticleSection id="failures" title="失败与操作权限">
      <p id="tools-errors" className="vp-citation-target">失败也是一种结果。文件不存在时，要保留路径和错误原因；服务超时时，要说明没有获得有效响应。<strong>不能把失败替换成一份看起来合理的成功结果。</strong>明确的错误能帮助模型补充信息、调整请求，或向用户说明当前无法继续。<Cite id="tools-errors" /></p>
      <div className={styles.distinctions}><div><FileText size={25} /><h3>没有这个文件</h3><p>确认路径，或查找实际日志位置。</p></div><div><ShieldCheck size={25} /><h3>没有操作权限</h3><p>等待授权，或请用户提供可用内容。</p></div></div>
      <p>读取和写入还应有各自的权限范围。允许查看日志，不等于允许修改配置；模型提出删除或写入请求后，运行程序仍然需要按既定规则检查。</p>
      <p id="tools-untrusted" className="vp-citation-target">工具结果也可能来自网页、用户上传的文件或第三方接口。其中的文字是待处理的资料，可能夹带错误或恶意指令。接收结果时，应保留其来源和边界，避免把外部内容直接当成系统指令。<Cite id="tools-untrusted" /></p>
    </ArticleSection>
  </ConceptArticle>;
}

export function ContextTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation sources={contextSources} id={id} />;
  return <ConceptArticle slug="context" title="Context" sections={contextSections} sources={contextSources} intro={<>上下文是模型<strong>这一轮实际能参考的信息</strong>。你说的话、任务要求、被选中的文件和工具结果，共同影响这一次回答。</>}>
    <ArticleSection id="assemble" title="组合本轮输入">
      <p>同样问“服务为什么启动失败”，只给一句描述，与同时提供启动日志，模型能依据的信息很不一样。日志存放在电脑里，并不表示模型已经读到了它。</p>
      <p>试着把下面的材料加入本轮输入，再查看回答。这里的回复是预设教学样例，用来观察资料变化带来的差别。</p>
      <ContextLesson />
      <p id="context-input" className="vp-citation-target">一次请求的上下文可以包含指令、对话、文件内容、工具定义和工具结果。应用决定本轮实际发送哪些内容。<strong>对话界面里保留的历史，与某次请求实际携带的内容，不一定完全相同。</strong><Cite id="context-input" /></p>
      <p>把本次日志加入后，回答才有了“第一行缺少冒号”这个依据。再加入“修改后检查 /health”的要求，回答就能对应验收条件。上周的端口问题可以作为背景，但不足以解释这次报错。</p>
    </ArticleSection>
    <ArticleSection id="window" title="窗口与外部资料">
      <p><ConceptTerm slug="context-window">上下文窗口</ConceptTerm>是容量限制，上下文则是这次放进去的内容。两者经常一起出现，但一个说的是“最多能容纳多少”，另一个说的是“当前具体有哪些信息”。</p>
      <div className={styles.distinctions}><div><Database size={28} weight="light" /><h3>保存在外部</h3><p>项目文件、完整日志、历史记录</p></div><div><Brain size={28} weight="light" /><h3>这次提供给模型</h3><p>当前任务、相关片段、必要约束</p></div></div>
      <p id="context-budget" className="vp-citation-target">窗口通常按 <ConceptTerm slug="token">Token</ConceptTerm> 计量。除了输入，还要考虑输出所需的空间；具体如何计数和限制，取决于模型与接口。超出预算时，需要减少、整理或分批提供材料，不能假设所有内容都会被自动保留。<Cite id="context-budget" /></p>
      <p>这里也要区分训练中学到的知识。模型可能知道 Python 函数定义需要冒号，但你电脑上的哪一行缺了冒号，需要这次提供的代码或日志来确定。</p>
    </ArticleSection>
    <ArticleSection id="selection" title="选择需要的信息">
      <p id="context-selection" className="vp-citation-target">上下文变长，不保证回答更好。Anthropic 在上下文工程的实践中建议围绕任务选择相关信息，控制工具说明、历史消息和检索内容的规模。<strong>保留足够依据，同时让当前问题容易被找到。</strong><Cite id="context-selection" /></p>
      <p>修这个服务时，可以先给出启动命令、最近的错误和相关代码。几万行历史访问日志、已经解决的旧问题、与服务无关的文档，可以先留在外部，需要时再取。</p>
      <p id="context-retrieval" className="vp-citation-target">文件很大时，可以先搜索关键词，再读取命中位置附近的片段。检索和<ConceptTerm slug="tools">工具调用</ConceptTerm>负责取得材料；取得的内容还要加入本轮输入，才成为模型继续判断的依据。<Cite id="context-retrieval" /></p>
      <p id="context-strategies" className="vp-citation-target">LangChain 把常见做法归纳为保存、选择、压缩和隔离。放到这个排错任务中，可以这样理解：<Cite id="context-strategies" /></p>
      <dl className={styles.contextStrategies}><div><dt>保存进度</dt><dd>把已做的修改与未解决问题写到外部记录。</dd></div><div><dt>选择材料</dt><dd>这一轮先读报错行附近的代码，需要时再取其他文件。</dd></div><div><dt>压缩历史</dt><dd>旧轮次整理成摘要，保留关键错误与检查结果。</dd></div><div><dt>分开任务</dt><dd>若把日志分析交给单独的智能体，只提供它需要的材料，再带回结论与依据。</dd></div></dl>
      <ArticleAside title="一份排错输入可以怎样整理"><div className={styles.inputExample}><p><strong>目标</strong>服务成功启动，/health 返回 200。</p><p><strong>现状</strong>启动失败，尚未改动文件。</p><p><strong>证据</strong>最近一次日志，以及报错行附近的代码。</p><p><strong>约束</strong>保留原配置，修改后运行检查。</p></div><p>材料之间如果互相冲突，标出时间和来源。例如“上周端口占用”与“这次缺少冒号”属于两次运行，不能混成同一个事实。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="handoff" title="换一次会话继续">
      <p id="context-handoff" className="vp-citation-target">长任务可能需要换一次会话继续。Anthropic 的长任务实验使用进度文件和 Git 记录交接工作，让新的会话先读取当前状态，再处理未完成事项。<strong>把进度保存下来之后，还要在恢复时重新读入。</strong><Cite id="context-handoff" /></p>
      <div className={styles.handoff}><FileText size={28} weight="light" /><blockquote>已补上 app.py 的冒号。服务能启动，/health 仍返回 500。下一步检查返回值，尚未完成验收。</blockquote></div>
      <p id="context-summary" className="vp-citation-target">摘要可以保留当前目标、决策和未完成事项，减少重复历史占用；它也可能漏掉细节。原始文件和关键结果仍应能查回，恢复工作时还要确认摘要是否过时。<Cite id="context-summary" /></p>
      <p><ConceptTerm slug="memory">记忆</ConceptTerm>可以把信息保存在多次会话之外；<ConceptTerm slug="agent-harness">Harness</ConceptTerm>负责选择什么时候读取。读回并进入当前请求的那一部分，才是模型此刻能参考的上下文。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function AgentLoopTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation sources={agentLoopSources} id={id} />;
  return <ConceptArticle slug="agent-loop" title="Agent loop" sections={loopSections} sources={agentLoopSources} intro={<>智能体循环把多次判断和操作接起来：执行一个动作，取得结果，更新任务状态，再决定下一步。<strong>每一轮都应该有继续或停止的依据。</strong></>}>
    <ArticleSection id="repair-loop" title="任务怎样逐轮推进">
      <p>服务没启动。第一轮读日志，发现少了冒号；第二轮补上冒号，检查却返回 500；第三轮根据新错误修正返回值，检查才通过。第一次修改解决了一个问题，但任务还没有结束。</p>
      <p>下面把这个过程压缩成三个预设回合。每轮包含一次模型判断，以及它请求的一组工具操作。可以改变轮数上限，或切换成反复读取同一份日志，观察系统停在哪里。</p>
      <AgentLoopLesson />
      <p id="loop-feedback" className="vp-citation-target">实际运行中，模型根据工具返回的结果选择后续动作，<ConceptTerm slug="agent-harness">Harness</ConceptTerm>负责执行、保存状态并组织下一次调用。新的错误、成功结果或缺少的信息，都可能改变接下来的路径。<Cite id="loop-feedback" /></p>
    </ArticleSection>
    <ArticleSection id="round" title="一轮里发生的事">
      <p>从模型这边看，一轮调用接收当前输入，生成回复或工具请求。从运行程序这边看，还要处理请求、等待执行完成，再把结果放回后续<ConceptTerm slug="context">上下文</ConceptTerm>。一次请求可以包含多个工具调用，所以“模型轮数”和“工具调用次数”不一定相等。</p>
      <div className={styles.resultFlow} aria-label="循环中的反馈路径"><Brain size={30} weight="light" /><span>提出动作</span><ArrowRight size={19} /><Wrench size={27} weight="light" /><span>取得结果</span><ArrowRight size={19} /><FileText size={28} weight="light" /></div>
      <p id="loop-observation" className="vp-citation-target">ReAct 研究讨论了判断与行动交替进行的方式：行动取得外部信息，新的观察帮助模型调整后续计划。这里最值得注意的是反馈这一步。<strong>执行结果必须影响下一轮，而不是原样重发同一个请求。</strong><Cite id="loop-observation" /></p>
      <p id="loop-evidence" className="vp-citation-target">Hugging Face 的课程把观察解释为环境带回的反馈，例如接口数据、错误消息和执行日志。对应到修服务：模型说“已经改好”，还只是它的回复；实际启动与检查返回了什么，才是判断任务状态的依据。运行程序要把这些结果带回下一轮，而不只是再次询问模型“成功了吗”。<Cite id="loop-evidence" /></p>
      <p>在演示里，500 响应应该推动模型继续查返回值。如果它仍不断读取相同日志，却不修改代码、不取得新证据，轮数虽然增加，任务状态并没有推进。</p>
      <ArticleAside title="执行记录里要能看见什么"><div className={styles.inputExample}><p><strong>这一轮依据</strong>上次检查返回 500，还未满足验收条件。</p><p><strong>请求的操作</strong>查看并修正健康检查函数的返回值。</p><p><strong>实际结果</strong>修改已保存，重新检查返回 200。</p><p><strong>后续状态</strong>验收通过，可以结束任务。</p></div><p id="loop-react" className="vp-citation-target">ReAct 是研究这类交替过程的一种方法，不能把所有智能体循环都等同于同一种提示格式。本文演示展示的是简化的操作依据与结果，没有展示模型内部思考。<Cite id="loop-react" /></p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="stopping" title="循环何时结束">
      <p id="loop-stop" className="vp-citation-target">循环需要明确的结束方式。完成目标时返回结果；缺少信息或授权时等待用户；到达预先设定的轮数或时间上限时停下。Anthropic 的实践文章也将环境反馈、人工检查点和停止条件视为运行智能体时需要考虑的部分。<Cite id="loop-stop" /></p>
      <div className={styles.stopConditions}><div><strong>完成</strong><p>检查通过，返回结果与依据。</p></div><div><strong>等待</strong><p>缺少必要信息或操作授权。</p></div><div><strong>暂停</strong><p>到达上限，或连续没有进展。</p></div></div>
      <p><strong>达到上限只能说明这次运行结束，不能说明任务成功。</strong>例如演示最多进行两轮时，服务仍返回 500，应保留这个未完成状态，而不是给出“已经修好”的结论。</p>
      <p>还可以记录每轮有没有取得新证据、错误是否变化、同一请求重复了几次。重试应有目的和次数限制；需要额外权限时，就把请求交回用户处理。</p>
    </ArticleSection>
    <ArticleSection id="workflow" title="固定流程与临场判断">
      <p id="loop-workflow" className="vp-citation-target">预先写好“读取、修改、检查”的固定路径，通常属于工作流。如果模型能根据结果临时决定读哪个文件、是否继续排查，就包含了动态决策。实际系统可以结合这两种方式：路径允许变化，权限与验收规则保持明确。<Cite id="loop-workflow" /></p>
      <p>页面里的修复路线是预设教学样例。真实任务未必三轮结束，也未必沿着同样的文件和错误前进。观察一个循环是否有效，可以先看：每轮得到了什么新结果，这个结果怎样改变了下一步。</p>
      <p>单个<ConceptTerm slug="tools">工具调用</ConceptTerm>完成具体操作，循环把这些操作根据反馈接起来。Harness 还需要处理工具接入、上下文准备、状态保存等工作；循环是其中组织执行的一部分。</p>
    </ArticleSection>
  </ConceptArticle>;
}
