import { Brain, CalendarBlank, EnvelopeSimple, GearSix, Wrench } from "@phosphor-icons/react/dist/ssr";
import { ConceptArticle, ArticleSection, ArticleCitation, ArticleAside, ConceptTerm } from "./ConceptArticle";
import { ConceptHero } from "./ConceptHero";
import { AgentLesson, LlmLesson, TokenLesson, ProbabilityHeroArt } from "./FoundationConceptLessons";
import { agentSources, llmSources, tokenSources } from "@/lib/foundation-concept-sources";
import styles from "./FoundationConcepts.module.css";

function OldAnchor({ slug, part }: { slug: string; part: string }) {
  return <span className={styles.anchor} id={`${slug}-${part}`} aria-hidden="true">{part === "definition" && <span id={`${slug}-question`} />}</span>;
}

export function LlmTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={llmSources} />;
  return <ConceptArticle slug="llm" title="LLM" sources={llmSources}
    hero={<ConceptHero slug="llm" label="已有文字之后出现不同候选，选中的片段加入句子"><ProbabilityHeroArt /></ConceptHero>}
    sections={[["generation", "文字怎样接着生成"], ["training", "训练与这次回答"], ["choice", "同一句话的不同续写"], ["evidence", "回答仍需要依据"]]}
    intro={<>大语言模型从大量数据中学习语言的规律，用学到的参数处理新的输入。对常见的生成式 LLM 来说，<strong>回答是根据前文逐步生成的 Token 序列。</strong></>}>
    <ArticleSection id="generation" title="文字怎样接着生成">
      <OldAnchor slug="llm" part="definition" />
      <p>给出“The sky is”，后面可以接 blue，也可以接 gray。哪种续写更合适，取决于已经给出的文字，以及模型在训练中学到的规律。若前文提到阴云，后面的选择也可能改变。</p>
      <p id="llm-generation" className="vp-citation-target">常见的自回归生成过程会先计算候选 <ConceptTerm slug="token">Token</ConceptTerm> 的概率，再选出一个接到序列后面。<strong>下一次预测会使用更新后的前文，包括刚刚生成的内容。</strong>这一步反复进行，才得到你看到的整段回答。<Cite id="llm-generation" /></p>
      <p>下面用很小的教学词表手动选择续写，看看一句话怎样分叉。片段和百分比均为预设，不是某个真实模型的分词或测量结果；点击候选只是把选择过程放慢给你看。</p>
      <OldAnchor slug="llm" part="scene-heading" /><LlmLesson />
      <p>先选 gray，后续就围绕“The sky is gray”继续。撤回后换成 blue，前面的选择也被替换。真实生成时由解码规则完成选择，通常不需要用户逐个点击。</p>
    </ArticleSection>
    <ArticleSection id="training" title="训练与这次回答">
      <p id="llm-training" className="vp-citation-target">训练会调整模型参数，让它逐渐学会数据中的模式；预训练之后，还可以针对任务继续微调。调用一个已经训练好的模型来处理新输入，是推理。<strong>把一段日志放进对话，通常改变的是这次输入，不是在现场重新训练模型。</strong><Cite id="llm-training" /></p>
      <div className={styles.twoTimes}><div><h3>训练时</h3><p>通过大量样例调整参数。语言、代码和任务中的规律被反映在参数里。</p></div><div><h3>使用时</h3><p>把当前任务与材料交给已有模型，由它生成这次回答。换一份材料，输入就变了。</p></div></div>
      <p>例如模型可能已经学过 Python 的语法，但要判断你的程序缺不缺冒号，仍需要看到相关代码。训练中的一般知识，不能替代这次项目的实际状态。</p>
      <ArticleAside title="模型参数与聊天记录"><p>参数属于模型本身；聊天记录、系统说明和工具结果属于本轮<ConceptTerm slug="context">上下文</ConceptTerm>。应用可能另外保存会话或用于后续训练，这取决于具体产品的数据设置，不能仅凭模型在当前对话中记得一句话判断它已被写进参数。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="choice" title="同一句话的不同续写" className={styles.offset}>
      <p id="llm-sampling" className="vp-citation-target">有了概率分布，还需要决定怎样选。贪心解码选择当前概率最高的候选；采样则按分布抽取。<ConceptTerm slug="temperature">温度</ConceptTerm>等设置可以改变选择的分散程度。因此，相同输入也可能得到不同续写。<Cite id="llm-sampling" /></p>
      <blockquote className={styles.pullquote}>候选的概率，衡量的是怎样接下去；<br />它不是一句话的事实证明。</blockquote>
      <p>写一段邀请文案，可以接受几种自然的措辞；问今天服务是否恢复，则需要运行结果。把生成调得更稳定，不能自动把缺少的日志补进来，也不能保证事实正确。</p>
      <p id="llm-stopping" className="vp-citation-target">生成还需要停止条件，例如结束标记、指定的停止序列或输出长度限制。本页为了展示有限路径，在句号处结束；实际模型不会在每个句号后都停止。达到长度上限时，回答也可能尚未写完。<Cite id="llm-stopping" /></p>
    </ArticleSection>
    <ArticleSection id="evidence" title="回答仍需要依据">
      <OldAnchor slug="llm" part="quiz-heading" /><OldAnchor slug="llm" part="prompt-heading" />
      <p id="llm-evidence" className="vp-citation-target">LLM 可以生成清楚、流畅的文字，也会产生错误或编造的内容，通常称为<ConceptTerm slug="hallucination">幻觉</ConceptTerm>。Google 的课程也将错误预测和偏见列为使用 LLM 时需要考虑的问题。<strong>语言通顺和回答正确，需要分别核对。</strong><Cite id="llm-evidence" /></p>
      <p>如果模型说“服务已经恢复”，应当能找到本次检查的状态码和结果。如果没有执行检查，这句话最多是推测。可追踪的资料、真正运行的工具和明确的验收条件，才能让你检查结论从哪里来。</p>
      <p>在 <ConceptTerm slug="agent-harness">Harness</ConceptTerm> 里，模型负责根据现有信息提出下一步；运行程序负责执行允许的操作并带回结果。把模型接入这种过程，才可能持续处理文件、日志和任务状态。单独生成一个工具名称，并不等于工具已经运行。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function TokenTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={tokenSources} />;
  return <ConceptArticle slug="token" title="Token" subtitle="词元" sources={tokenSources}
    hero={<ConceptHero slug="token" label="lower 被分为 low 与 er，再对应到编号 1 与 2"><div className={styles.tokenHero}><div><strong>low</strong><span>01</span></div><div><strong>er</strong><span>02</span></div></div></ConceptHero>}
    sections={[["pieces", "文字与编号"], ["vocabulary", "边界由词表决定"], ["decode", "从编号回到文字"], ["budget", "实际请求怎样计数"]]}
    intro={<>Token 是语言模型处理序列时使用的单位。文本先经过分词器，变成一串编号；<strong>一个 Token 可能对应一个词、词的一部分，或更小的片段。</strong></>}>
    <ArticleSection id="pieces" title="文字与编号">
      <OldAnchor slug="token" part="definition" />
      <p id="token-encoding" className="vp-citation-target">分词器先把文字拆成片段，再通过词表把片段映射为整数编号。这些编号让模型能够使用同一套离散词表处理输入。我们平时看到的彩色文字块，是编号对应内容的一种显示方式。<Cite id="token-encoding" /></p>
      <p>先用一套很小的教学词表看清这件事。切换按字符或按子词，再把文字翻到编号一面。这里的两套词表和编号都是自定义样例，只覆盖 lower 与 lowest，不代表任何真实模型。</p>
      <OldAnchor slug="token" part="scene-heading" /><TokenLesson />
      <p>lower 按字符拆成 5 个单位，按这里的子词表拆成 low 和 er 两个单位。原文没有变，表示它的编号序列变了。编号 1 在一套词表里是 l，在另一套里是 low，离开对应词表就不能直接比较。</p>
    </ArticleSection>
    <ArticleSection id="vocabulary" title="边界由词表决定">
      <p id="token-boundaries" className="vp-citation-target">按完整单词切分，遇到不常见的词可能无从表示；按字符切分，序列又容易变长。子词方法在这两者之间取舍，让常见片段可以合在一起，其他内容拆成更小的单位。<strong>所以字数、单词数和 Token 数并不是同一个数。</strong><Cite id="token-boundaries" /></p>
      <dl className={styles.pairDefinition}><div><dt>Token</dt><dd>切分后得到的一个单位，以及它在词表中的编号。</dd></div><div><dt>分词器</dt><dd>负责切分和编号转换的程序；它的词表与规则会影响结果。</dd></div></dl>
      <p id="token-vocabulary" className="vp-citation-target">BPE 是一种常见方法：训练分词器时，逐步合并经常相邻出现的片段；处理新文本时，再按学到的合并规则切分。字节级 BPE 从字节出发，因此显示成一个字符的内容也可能涉及多个单位。分词器的训练与语言模型本身的训练是不同环节。<Cite id="token-vocabulary" /></p>
      <p>这也解释了为什么换模型时不能照搬旧的计数。词表和切分规则可能不同；空格、标点、代码里的符号也可能影响边界。想知道一份材料实际占多少，应使用目标模型对应的分词器。</p>
    </ArticleSection>
    <ArticleSection id="decode" title="从编号回到文字" className={styles.offset}>
      <p id="token-decoding" className="vp-citation-target">解码按词表把编号转换回可显示的文字。Hugging Face 的课程特别提醒，解码也需要处理空格和子词连接方式，并非简单地在每个片段之间插入空格。真实分词器还可能涉及规范化或特殊标记，不能一概假设所有输入都逐字节原样返回。<Cite id="token-decoding" /></p>
      <p>在本页这个没有规范化步骤的小词表里，[1, 2] 可以还原成 lower。你点击“按编号还原”，看到的是查回 low、er 后拼接的结果；它没有查询词典，也没有理解 lower 的含义。</p>
      <blockquote className={styles.pullquote}>编号让文本可以被计算；<br />编号的大小不代表词义的大小。</blockquote>
      <p>后续模型会把编号映射到内部表示，再进行计算。Token 与<ConceptTerm slug="embedding">嵌入</ConceptTerm>有关，但不是同一件事：前者是序列里的离散单位，后者是模型使用的数值表示。</p>
    </ArticleSection>
    <ArticleSection id="budget" title="实际请求怎样计数">
      <OldAnchor slug="token" part="quiz-heading" /><OldAnchor slug="token" part="prompt-heading" />
      <p id="token-counting" className="vp-citation-target">以 Claude 的计数接口为例，可以在发送消息前估算请求的输入 Token；请求中的系统说明、工具和多模态内容也需要考虑。官方将计数结果称为估计，实际用量可能略有不同。因此，应同时查看对应接口的计数规则和实际请求返回的用量。<Cite id="token-counting" /></p>
      <p>你粘贴的正文只是输入的一部分。应用还可能加入历史消息、工具定义或检索资料；生成的回答也有自己的长度限制。规划<ConceptTerm slug="context-window">上下文窗口</ConceptTerm>时，应给输出和后续工具结果留出空间。</p>
      <p>更短的编号序列不自动意味着回答更好。删掉重复日志可能有帮助，删掉唯一的错误位置则可能让模型失去依据。控制数量时，仍要保留当前任务真正需要的内容。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function AgentTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={agentSources} />;
  return <ConceptArticle slug="agent" title="Agent" sources={agentSources}
    hero={<ConceptHero slug="agent" label="两人的日历找到共同时间，形成尚未发送的邀请草稿"><div className={styles.agendaHero}><div className={styles.heroCalendar}><CalendarBlank size={23} />{Array.from({ length: 6 }, (_, i) => <i key={i} />)}</div><div className={styles.heroInvite}><EnvelopeSimple size={23} /><strong>10:00—10:30</strong><span>邀请草稿 · 未发送</span></div></div></ConceptHero>}
    sections={[["goal", "从一个目标开始"], ["calendar", "根据查到的结果行动"], ["roles", "模型与运行程序"], ["workflow", "固定步骤与自主选择"], ["stop", "完成和停止"]]}
    intro={<>智能体围绕目标，让模型选择接下来做什么，并通过工具与环境交互。<strong>它要根据实际结果继续判断，直到完成任务，或遇到需要停下的条件。</strong></>}>
    <ArticleSection id="goal" title="从一个目标开始">
      <OldAnchor slug="agent" part="definition" />
      <p>“帮我写一封会议邀请”和“查两人的日历，找 30 分钟共同空档，只准备邀请”是两种不同的任务。后一种任务需要读到现在的安排，决定有没有合适的时间，再产生符合要求的草稿。</p>
      <p id="agent-definition-source" className="vp-citation-target">Hugging Face 的课程把智能体定义为利用 AI 模型与环境交互、实现用户目标的系统。这里谈的是基于语言模型的智能体；规划和判断依靠模型，能采取哪些动作则取决于接入的能力。<Cite id="agent-definition-source" /></p>
      <dl className={styles.taskBrief}><div><dt>目标</dt><dd>找到两人的共同空档。</dd></div><div><dt>完成证据</dt><dd>日历结果与邀请时间一致。</dd></div><div><dt>可用能力</dt><dd>读取日历、准备草稿。</dd></div><div><dt>本次边界</dt><dd>不发送邀请。</dd></div></dl>
      <p>这些条件决定什么值得去查、什么算完成。“安排好了”只是一个说法；真正能核对的结果是时间是否可用、草稿是否已准备，以及有没有越过用户给出的范围。</p>
    </ArticleSection>
    <ArticleSection id="calendar" title="根据查到的结果行动">
      <p>先让日历结果回来，再决定下一步。下面是两条固定的教学路径，点击按钮只是逐步查看动作；没有连接真实日历、调用模型或发送邀请。</p>
      <OldAnchor slug="agent" part="scene-heading" /><AgentLesson />
      <p id="agent-feedback" className="vp-citation-target">实际运行的智能体需要从工具和环境取得反馈，用来判断进度。Anthropic 的实践文章强调，应依据真实工具返回或执行结果继续，而非只依据模型先前的计划。<strong>计划要查日历，与已经查到空档，是两件事。</strong><Cite id="agent-feedback" /></p>
      <p>切到“没有共同空档”，继续执行会得到一个补充询问，而不是一张虚构的邀请。目标没有变，下一步却因为证据不同而改变。把缺少的信息说明白，也是这个系统应当具备的能力。</p>
    </ArticleSection>
    <ArticleSection id="roles" title="模型与运行程序">
      <p id="agent-parts" className="vp-citation-target">模型可以根据任务和已有信息决定使用哪种能力，但实际动作需要有相应工具。Hugging Face 用“模型”和“能力”来区分这两部分：没有接入的能力，不能仅靠一句指令自动获得。<Cite id="agent-parts" /></p>
      <dl className={styles.roleList}><div><Brain size={25} /><dt>模型</dt><dd>看到日历后，提出选择 10:00，或者询问其他时间。</dd></div><div><GearSix size={25} /><dt>Harness</dt><dd>准备本轮输入、检查请求、安排执行，并把结果送回。</dd></div><div><Wrench size={25} /><dt>工具</dt><dd>读取具体日历，或写入一份邀请草稿。</dd></div></dl>
      <p>Agent 是这些部分围绕目标一起工作的系统。<ConceptTerm slug="agent-loop">智能体循环</ConceptTerm>描述它怎样反复处理结果；<ConceptTerm slug="agent-harness">Harness</ConceptTerm>提供运行时的组织与约束。它们不是三个可以互相替换的名称。</p>
    </ArticleSection>
    <ArticleSection id="workflow" title="固定步骤与自主选择" className={styles.offset}>
      <p id="agent-workflow" className="vp-citation-target">“Agent”并没有一种覆盖所有产品的统一叫法。Anthropic 在其工程文章中区分：工作流按预先写好的代码路径组织操作；智能体则让模型动态决定过程和工具使用。对路径明确的任务，固定工作流往往更容易预测。<Cite id="agent-workflow" /></p>
      <p>比如每天把同一份报表转换格式再存档，规则已经清楚，未必需要模型临场规划。若要调查原因不明的服务故障，下一次该读哪个文件取决于刚发现的线索，才更需要动态选择。</p>
      <ArticleAside title="本页演示与真实智能体"><p>本页用写好的分支让结果稳定可复现，它本身是教学程序。真实的语言模型智能体由模型提出动作，运行程序检查和执行；模型也可能选错，所以不能把演示中两条正确路径当作实际可靠性的证明。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="stop" title="完成和停止">
      <OldAnchor slug="agent" part="quiz-heading" /><OldAnchor slug="agent" part="prompt-heading" />
      <p id="agent-stopping" className="vp-citation-target">智能体既可以在目标完成后结束，也可以在遇到阻碍时等待人类反馈。运行系统还常设置最大轮数等停止条件，限制持续执行的成本。<strong>停止是一种运行状态，不一定意味着任务成功。</strong><Cite id="agent-stopping" /></p>
      <p>本例中，草稿准备完成就是已达到这次目标；没有空档则是等待新信息。两种情况都停止，却只有前者完成了任务。发送邀请超出了本次授权，不能因为工具可用就顺手发出。</p>
      <p>真正检查一个智能体时，可以沿着同一条证据线看：它读到了什么、据此选择了什么、实际发生了什么、结果是否满足目标。若没有这些记录，一段自信的总结无法证明它做对了事。</p>
    </ArticleSection>
  </ConceptArticle>;
}
