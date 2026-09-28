import { ArticleAside, ArticleCitation, ArticleSection, ConceptArticle, ConceptTerm } from "./ConceptArticle";
import { AgentLoopLesson, ContextLesson, ToolCallingLesson } from "./ConceptLessons";
import { agentLoopSources, contextSources, toolCallingSources } from "@/lib/concept-article-sources";
import { ArrowRight, Brain, Database, FileText, ShieldCheck, Wrench } from "@phosphor-icons/react/dist/ssr";
import styles from "./ConceptArticle.module.css";

const toolSections: [string, string][] = [["read-log", "一次日志读取"], ["request", "工具名称与参数"], ["result", "结果回到模型"], ["failures", "失败与操作权限"]];
const contextSections: [string, string][] = [["assemble", "组合本轮输入"], ["window", "窗口与外部资料"], ["selection", "选择需要的信息"], ["handoff", "换一次会话继续"]];
const loopSections: [string, string][] = [["repair-loop", "任务的逐轮推进"], ["round", "一轮里发生的事"], ["stopping", "循环何时结束"], ["workflow", "固定流程与临场判断"]];

export function ToolCallingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation sources={toolCallingSources} id={id} />;
  return <ConceptArticle slug="tools" title="Tool calling" sections={toolSections} sources={toolCallingSources} intro={<>工具调用把模型提出的请求和真实操作接起来。<strong>模型生成工具名称和参数，运行程序执行操作，再把结果交回模型。</strong></>}>
    <ArticleSection id="read-log" title="一次日志读取">
      <p>一个给网页提供数据的程序启动失败了，这类程序常叫“服务”。它会把运行过程和报错写进日志文件。你请 AI 查原因，它说“我先读一下日志”——仅凭这句话，文件还没有被打开。</p>
      <p>工具是应用提供给模型使用的程序能力，例如读文件、查天气或计算总额。要读日志，模型得提出读取请求，应用再调用文件工具，把实际内容取回来。工具调用连接了模型的判断和这些具体操作。</p>
      <p>下面沿着 <code>server.log</code> 走一遍。可以切换读取结果，观察同一个请求怎样得到不同的后续处理。演示使用固定样例，不会读取你的文件。</p>
      <ToolCallingLesson />
      <p id="tools-contract" className="vp-citation-target">这里的“应用”就是你使用的 AI 软件，文件工具由它接入并调用。另一些工具由提供模型的服务平台运行，例如平台内置的搜索。两者可以出现在同一个聊天窗口里，但在哪儿执行、能访问什么资料，取决于工具的接入方式和权限。<strong>聊天回复里写出工具名，不能证明工具已经运行。</strong><Cite id="tools-contract" /></p>
    </ArticleSection>
    <ArticleSection id="request" title="工具名称与参数" className={styles.splitSection}>
      <p id="tools-definition" className="vp-citation-target">调用之前，应用先告诉模型有哪些工具可用。每个工具都要说明名称、用途，以及需要什么输入。这里把读取工具命名为 <code>read_file</code>；<strong>参数就是调用时补充的具体信息</strong>，例如这次要读哪个文件。<Cite id="tools-definition" /></p>
      <div className={styles.contract} role="group" aria-label="读取工具的定义"><div><Wrench size={24} /><h3>read_file</h3><p>读取指定位置的文本文件</p></div><div><span>参数：文件在哪里</span><code>path</code><p>填写一段表示文件位置的文字，例如 server.log</p></div></div>
      <p><code>path</code> 表示文件路径，也就是文件在什么位置。<code>server.log</code> 是这个例子里的日志文件名，工具约定从项目文件夹里找它；如果放在里面的 logs 文件夹，就要写成 <code>logs/server.log</code>。模型得从任务或已有资料中取得位置，不知道时需要先查找或询问。</p>
      <p>请求中可以写成 <code>{'{ "path": "server.log" }'}</code>。把它读成“文件位置是 server.log”就行，不用先学这段格式。工具定义像一份使用说明；真正打开文件的程序，需要由应用另外接好。</p>
      <p id="tools-execution" className="vp-citation-target">开发者会在应用里实现一部分运行管理程序，让模型与工具配合工作，这部分通常叫 <ConceptTerm slug="agent-harness">Harness</ConceptTerm>。它根据工具名找到对应程序，检查参数和操作范围，再决定是否执行。即使格式正确、允许读取，文件也可能已经被移走。<strong>收到读取成功的结果之前，还不能说读到了日志。</strong><Cite id="tools-execution" /></p>
      <p id="tools-handoff" className="vp-citation-target">在这次读取中，模型发出请求后先停下来，由应用接手执行，再把结果交给模型继续处理。Hugging Face 的公开课程把这一步称为“停止生成、解析动作”。这里需要确实执行并取回结果，不能让模型接着编一份日志充数。<Cite id="tools-handoff" /></p>
      <ArticleAside title="看一份简化的调用记录"><pre className={styles.code}>{`请求 #17\nname: read_file\ninput: { path: "server.log" }\n\n结果 → 请求 #17\napp.py:1 — SyntaxError: expected ':'`}</pre><p>这份记录用同一个编号把请求和结果对应起来。实际接口的字段名可能不同；阅读日志时，先确认看到的结果属于哪一次调用。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="result" title="结果回到模型">
      <p id="tools-result" className="vp-citation-target">工具完成后，应用给模型提供返回内容，并标明它对应哪次请求。例如给读取请求编上号，再让结果带上同一个编号，就能把两者对应起来。读取失败时，也要把失败原因交回来。<Cite id="tools-result" /></p>
      <div className={styles.resultFlow} aria-label="日志进入下一轮输入"><FileText size={30} weight="light" /><span>实际日志</span><ArrowRight size={20} /><span>下一轮上下文</span><ArrowRight size={20} /><Brain size={30} weight="light" /></div>
      <p>日志里的 <code>app.py:1</code> 指代码文件的第一行，后面的报错说这里缺少冒号。这个例子用 Python 编程语言写代码，按它的语法，这一行需要以冒号结尾；漏掉它，程序就无法读懂这行代码，服务也没能启动。日志给了模型一个排查方向，还需要查看代码来确认怎么改。</p>
      <p>如果应用读出日志，却没有放进模型下一轮能参考的<ConceptTerm slug="context">上下文</ConceptTerm>，模型仍然缺少这份信息。应用可以提供完整内容，也可以选取相关片段；模型能依据的，是这一次实际交给它的材料。</p>
      <p>读到日志也不等于服务修好了。这个工具只负责读取；修改代码和运行检查，还要继续调用相应工具。把这些操作根据返回结果接起来，就会用到<ConceptTerm slug="agent-loop">智能体循环</ConceptTerm>。</p>
    </ArticleSection>
    <ArticleSection id="failures" title="失败与操作权限">
      <p id="tools-errors" className="vp-citation-target">失败也是一种结果。文件不存在时，要保留路径和错误原因；服务超时时，要说明没有获得有效响应。<strong>不能把失败替换成一份看起来合理的成功结果。</strong>明确的错误能帮助模型补充信息、调整请求，或向用户说明当前无法继续。<Cite id="tools-errors" /></p>
      <div className={styles.distinctions}><div><FileText size={25} /><h3>没有这个文件</h3><p>确认路径，或查找实际日志位置。</p></div><div><ShieldCheck size={25} /><h3>没有操作权限</h3><p>等待授权，或请用户提供可用内容。</p></div></div>
      <p>读取和写入还应有各自的权限范围。允许查看日志，不等于允许修改配置；模型提出删除或写入请求后，运行程序仍然需要按既定规则检查。</p>
      <p id="tools-untrusted" className="vp-citation-target">工具结果也可能来自网页、用户上传的文件或第三方接口。其中的文字是待处理的资料，可能夹带错误或恶意指令。接收结果时，要标明内容来自哪里，并把这些外部资料与应用原本的指令分开。<Cite id="tools-untrusted" /></p>
    </ArticleSection>
  </ConceptArticle>;
}

export function ContextTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation sources={contextSources} id={id} />;
  return <ConceptArticle slug="context" title="Context" sections={contextSections} sources={contextSources} intro={<>上下文是模型<strong>这一轮直接参考的信息</strong>。除了你刚发的话，还可以有之前的对话、任务要求，以及应用提供的文件内容和工具结果。</>}>
    <ArticleSection id="assemble" title="组合本轮输入">
      <p>假设你做了一个网页，负责给网页提供数据的程序启动失败了。这类程序常叫“服务”，它会把运行过程和报错记在日志里。你问 AI“服务为什么启动失败”，只说这句话，和同时给出最近的日志，模型判断的依据就很不一样。</p>
      <p>日志即使保存在电脑里，也要由应用读出并提供给模型，才能成为这次回答的依据。这里把“应用这一次交给模型的材料”叫作本轮输入。选了哪些材料，决定了模型这次能看到哪些具体信息。</p>
      <p>下面已经备好了三份材料，让你代替应用选入本轮输入。改选后，演示会收起旧回答，等你用新输入再生成一次。移出材料不会删除原文件，也不代表撤销真实聊天中的历史回答。这里使用固定样例，没有调用真实模型。</p>
      <ContextLesson />
      <p id="context-input" className="vp-citation-target">应用决定本轮实际发送哪些内容，包括指令、对话和文件内容。它还可以告诉模型有哪些工具可用，以及工具执行后得到了什么。“工具”是搜索、读取文件这类可调用的程序。<strong>对话界面里保留的历史，与某次请求实际携带的内容，不一定完全相同。</strong>例如，旧对话仍显示在界面里，应用这次可能只发送了整理后的摘要。<Cite id="context-input" /></p>
      <p>本次日志给出的线索是“第一行缺少冒号”。这个例子中的代码用 Python 编写，该位置漏写冒号会违反语法，使程序无法启动。日志只指出排查方向，还需要查看实际代码来确认。</p>
      <p id="context-health" className="vp-citation-target">任务要求中的 <code>/health</code> 是本例服务用来报告自身状态的检查地址，<code>200</code> 表示这次请求成功。把这项要求也加进输入，模型才知道你希望怎样算检查通过。<Cite id="context-health" /></p>
      <p>上周的“端口占用”则是另一次故障：当时服务要用的连接入口被别的程序占了。上次是端口问题，不能据此断定这次也是。</p>
    </ArticleSection>
    <ArticleSection id="window" title="窗口与外部资料" className={styles.windowSection}>
      <p><ConceptTerm slug="context-window">上下文窗口</ConceptTerm>是容量限制，上下文则是这次放进去的内容。两者经常一起出现，但一个说的是“最多能容纳多少”，另一个说的是“当前具体有哪些信息”。</p>
      <div className={styles.distinctions}><div><Database size={28} weight="light" /><h3>保存在外部</h3><p>项目文件、完整日志、历史记录</p></div><div><Brain size={28} weight="light" /><h3>这次提供给模型</h3><p>当前任务、相关片段、必要约束</p></div></div>
      <p id="context-budget" className="vp-citation-target">窗口通常按 <ConceptTerm slug="token">Token</ConceptTerm> 计量，Token 是模型处理文字时划分出的单位，不等于一个字或一个单词。窗口里除了输入，还要留出生成回答的空间；具体如何计数和限制，取决于模型与接口。材料放不下时，需要减少、整理或分批提供，不能假设应用会自动保留你在意的内容。继续重要任务前，可以把关键要求和当前进度明确放进新输入。<Cite id="context-budget" /></p>
      <p>模型在训练中学到的知识也不同于本轮上下文。它可能已经知道 Python 的语法，却不能仅凭这些通用知识判断你电脑上的哪一行写错了。你这次提供的代码和日志，才把问题落实到具体文件。</p>
    </ArticleSection>
    <ArticleSection id="selection" title="选择需要的信息">
      <p id="context-selection" className="vp-citation-target">材料越多，模型要从中分辨的信息也越多。Anthropic 的上下文工程实践建议围绕当前任务选择相关内容，减少无关的工具说明、旧消息和搜索结果。<strong>先给出足够判断问题的依据，需要更多时再补充。</strong>这样做是为了让当前问题更清楚，并不保证每次回答都正确。<Cite id="context-selection" /></p>
      <p>修这个服务时，可以先给出启动命令、最近的错误和相关代码。几万行历史访问日志、已经解决的旧问题、与服务无关的文档，可以先留在外部，需要时再取。</p>
      <p id="context-retrieval" className="vp-citation-target">文件很大时，可以先搜索关键词，再读取找到的位置附近的片段。这样查找并取回相关资料的过程叫检索，可以通过<ConceptTerm slug="tools">工具调用</ConceptTerm>完成。取得的内容还要加入本轮输入，才成为模型继续判断的依据。<Cite id="context-retrieval" /></p>
      <p id="context-strategies" className="vp-citation-target">LangChain 把常见做法归纳为保存、选择、压缩和隔离。放到这个排错任务中，可以这样理解：<Cite id="context-strategies" /></p>
      <dl className={styles.contextStrategies}><div><dt>保存进度</dt><dd>把已做的修改与未解决问题写到外部记录。</dd></div><div><dt>选择材料</dt><dd>这一轮先读报错行附近的代码，需要时再取其他文件。</dd></div><div><dt>压缩历史</dt><dd>旧轮次整理成摘要，保留关键错误与检查结果。</dd></div><div><dt>分开任务</dt><dd>若把日志分析交给另一个 AI 助手，只提供它需要的材料，再带回结论与依据。</dd></div></dl>
      <ArticleAside title="一份排错输入"><div className={styles.inputExample}><p><strong>目标</strong>服务成功启动，/health 返回 200。</p><p><strong>现状</strong>启动失败，尚未改动文件。</p><p><strong>证据</strong>最近一次日志，以及报错行附近的代码。</p><p><strong>约束</strong>保留原配置，修改后运行检查。</p></div><p>材料之间如果互相冲突，标出时间和来源。例如“上周端口占用”与“这次缺少冒号”属于两次运行，不能混成同一个事实。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="handoff" title="换一次会话继续">
      <p id="context-handoff" className="vp-citation-target">开一个新聊天继续旧任务时，新会话需要重新取得相关材料。Anthropic 的长任务实验把进度写进文件，并用 Git 这种代码版本管理工具记录改动，让新的会话先读取当前状态，再处理未完成事项。<strong>保存进度是为了下次能取用，保存本身并不等于已经交给模型。</strong><Cite id="context-handoff" /></p>
      <div className={styles.handoff}><FileText size={28} weight="light" /><blockquote>已补上 app.py 的冒号。服务能启动，/health 仍返回 500。下一步检查返回值，尚未完成验收。</blockquote></div>
      <p id="context-check-result" className="vp-citation-target">这份摘要里的 <code>500</code> 表示检查请求遇到了服务端错误，所以还不能宣布任务完成。<Cite id="context-check-result" /></p>
      <p id="context-summary" className="vp-citation-target">摘要留下了已做的修改和未解决的问题，减少了重新翻阅全部历史的需要；它也可能漏掉细节或已经过时。继续工作时，仍应能查回原文件和检查结果。<Cite id="context-summary" /></p>
      <p><ConceptTerm slug="memory">记忆</ConceptTerm>可以让有用的信息在多次会话之间保留下来。应用负责运行管理的部分，也就是 <ConceptTerm slug="agent-harness">Harness</ConceptTerm>，安排什么时候把它读回来。读回并放入当前请求的内容，才进入了这次回答的上下文。你能否查看或调整这些安排，取决于具体应用；不能只凭“已经保存”就认定这次一定用上了。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function AgentLoopTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation sources={agentLoopSources} id={id} />;
  return <ConceptArticle slug="agent-loop" title="Agent loop" sections={loopSections} sources={agentLoopSources} intro={<>智能体循环把多次判断和操作接起来：执行一个动作，取得结果，更新任务状态，再决定下一步。<strong>每一轮都应该有继续或停止的依据。</strong></>}>
    <ArticleSection id="repair-loop" title="任务的逐轮推进">
      <p>服务没启动。第一轮读日志，发现少了冒号；第二轮补上冒号，检查却返回 500；第三轮根据新错误修正返回值，检查才通过。第一次修改解决了一个问题，但任务还没有结束。</p>
      <p>下面把这个过程压缩成三个预设回合。每轮包含一次模型判断，以及它请求的一组工具操作。可以改变轮数上限，或切换成反复读取同一份日志，观察系统停在哪里。</p>
      <AgentLoopLesson />
      <p id="loop-feedback" className="vp-citation-target">实际运行中，模型根据工具返回的结果选择后续动作，<ConceptTerm slug="agent-harness">Harness</ConceptTerm>负责执行、保存状态并组织下一次调用。新的错误、成功结果或缺少的信息，都可能改变接下来的路径。<Cite id="loop-feedback" /></p>
    </ArticleSection>
    <ArticleSection id="round" title="一轮里发生的事">
      <p>从模型这边看，一轮调用接收当前输入，生成回复或工具请求。从运行程序这边看，还要处理请求、等待执行完成，再把结果放回后续<ConceptTerm slug="context">上下文</ConceptTerm>。一次请求可以包含多个工具调用，所以“模型轮数”和“工具调用次数”不一定相等。</p>
      <p id="loop-observation" className="vp-citation-target">ReAct 研究讨论了判断与行动交替进行的方式：行动取得外部信息，新的观察帮助模型调整后续计划。这里最值得注意的是反馈这一步。<Cite id="loop-observation" /></p>
      <p className={styles.pullquote}><strong>执行结果必须影响下一轮，而不是原样重发同一个请求。</strong></p>
      <p id="loop-evidence" className="vp-citation-target">Hugging Face 的课程把观察解释为环境带回的反馈，例如接口数据、错误消息和执行日志。对应到修服务：模型说“已经改好”，还只是它的回复；实际启动与检查返回了什么，才是判断任务状态的依据。运行程序要把这些结果带回下一轮，而不只是再次询问模型“成功了吗”。<Cite id="loop-evidence" /></p>
      <p>在演示里，500 响应应该推动模型继续查返回值。如果它仍不断读取相同日志，却不修改代码、不取得新证据，轮数虽然增加，任务状态并没有推进。</p>
      <ArticleAside title="可追溯的执行记录"><div className={styles.inputExample}><p><strong>这一轮依据</strong>上次检查返回 500，还未满足验收条件。</p><p><strong>请求的操作</strong>查看并修正健康检查函数的返回值。</p><p><strong>实际结果</strong>修改已保存，重新检查返回 200。</p><p><strong>后续状态</strong>验收通过，可以结束任务。</p></div><p id="loop-react" className="vp-citation-target">ReAct 是研究这类交替过程的一种方法，不能把所有智能体循环都等同于同一种提示格式。本文演示展示的是简化的操作依据与结果，没有展示模型内部思考。<Cite id="loop-react" /></p></ArticleAside>
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
