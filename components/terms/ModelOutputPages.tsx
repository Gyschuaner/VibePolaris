import { ArrowRight, Check, Code, Function, X } from '@phosphor-icons/react/dist/ssr';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { StreamingOutputLesson, StructuredOutputLesson, FunctionCallingLesson } from './ModelOutputLessons';
import { streamingSources, structuredSources, functionSources } from '@/lib/model-output-sources';
import base from './EventConcepts.module.css';
import s from './ModelOutputConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>; }

export function StreamingOutputTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={streamingSources}/>;
  return <ConceptArticle slug="streaming-output" title="流式输出" sources={streamingSources} sections={[["increment","生成与接收交错进行"],["events","文字增量与完成事件"],["framing","传输片段和语义事件"],["interruption","中断、取消与部分回答"]]}
    intro={<>流式输出让接收方在整个结果生成完之前，先拿到已经产生的部分。聊天界面可以先显示第一段，再接上后面的内容；程序也可以逐步处理。接收到文字与确认整次响应完成，是两件不同的事。</>}
    hero={<ConceptHero slug="streaming-output" label="三个文字片段依次出现并组成回答，最后出现完成标记"><div className={s.streamHero}><div><i>订单</i><i>已发货</i><i>明天送达</i><ArrowRight size={20}/></div><p><span>订单已发货，明天送达。</span></p><span><Check size={14}/> 收到完成事件</span></div></ConceptHero>}>
    <ArticleSection id="increment" title="生成与接收交错进行"><Legacy slug="streaming-output" names={["question","definition"]}/>
      <p id="stream-definition" className="vp-citation-target"><strong>流式输出把已有的部分结果先交给接收方，后续内容继续产生和传送。</strong>这里的“增量”就是已经产生的一小段结果；OpenAI 的流式文档就是这样解释长回答的：开始显示文字时，整份输出还可能在生成。本页只讲模型回复的增量接收；流式传输本身不限于某一种接口。<Cite id="stream-definition"/></p>
      <p>假设订单助手要回复一段配送说明。一次性返回时，界面等待完整结果；流式返回时，先收到“订单 A102”，再收到“已发货”，随后补上预计日期。接收程序把增量按顺序加入一个暂存这些片段的缓冲区，界面呈现当前已有的文字。</p>
      <div className={s.types}><div><h3>更早看见内容</h3><p>第一段可以在整段生成结束前出现，读者不必一直面对空白。</p></div><div><h3>仍要等待后续</h3><p>首段出现不表示回答完整，也不能由此断言总生成用时或计算量减少。</p></div></div>
    </ArticleSection>
    <ArticleSection id="events" title="文字增量与完成事件"><Legacy slug="streaming-output" names={["scene-heading"]}/>
      <p>下面使用预先写好的语义事件，不连接模型或订单系统。语义事件是带有“文字片段结束”“响应完成”或“错误”等类型的消息；可以逐条接收，也可以让页面自动播放这一段固定的事件序列。正常情境中，“文字片段结束”后还会收到一条“响应完成”；中断情境则停在部分回答。</p>
      <StreamingOutputLesson/>
      <p id="stream-completion" className="vp-citation-target">OpenAI Responses 区分文字增量和整次响应完成事件，也有错误与失败状态。<strong>某一段内容结束，不能直接当作整次响应成功。</strong>具体事件名称依接口而定；程序应按所用接口的事件顺序跟踪进度，而不是因为一段时间没有新字就显示“已完成”。<Cite id="stream-completion"/></p>
      <p>没有文本的正常结束也不等于连接失败。响应可能包含其他种类的内容，或者这次确实没有文字。接收方既要检查结束状态，也要判断最终内容是否满足任务。本例的“空文本”情境用来体会这个区别：结束状态正常，但这次没有文字。</p>
    </ArticleSection>
    <ArticleSection id="framing" title="传输片段和语义事件" className={base.offset}><Legacy slug="streaming-output" names={["quiz-heading"]}/>
      <p id="stream-framing" className="vp-citation-target">SSE 是一种把事件逐条传给浏览器的文本格式。WHATWG 规范要求按 UTF-8 解码并逐行解析，空行表示一个事件结束、可以交给程序处理。<strong>一次网络读取不一定刚好得到一个完整事件。</strong>接收程序需要先把数据按协议切成完整事件，再把事件里的文字增量加入回答；模型 token 是生成时的一小段文字，网络这次读到的字节则只是传输分块，不能把两者当成同一个单位。<Cite id="stream-framing"/></p>
      <pre className={s.miniCode}>{'网络读取 → 解码与事件解析 → 文字增量 → 回答缓冲区'}</pre>
      <p>同一个事件可能跨多次读取，也可能一次读到几个事件。模型 token、协议事件、传输分块和界面显示节奏属于不同层次。逐字显示的视觉效果本身，也不能证明后端采用了流式返回。</p>
      <ArticleAside title="流式参数与业务动作"><p>函数参数也可能逐步到达。例如第一段只有 <code>{'{"order_id":'}</code>，还不是可用参数。应等本次调用信息完整，再做参数与权限检查；不能因为界面出现函数名就提前执行业务动作。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="interruption" title="中断、取消与部分回答"><Legacy slug="streaming-output" names={["prompt-heading"]}/>
      <p id="stream-errors" className="vp-citation-target">Anthropic 的流式文档说明，连接建立之后，错误仍可能作为事件出现在流里。<strong>连接开始成功，不保证后面能正常结束。</strong>收到错误后，不能把回答标记为完整；已经展示的内容要保留，并记下这是中断。它的事件顺序和名字不同于 OpenAI，不能直接混用。<Cite id="stream-errors"/></p>
      <p id="stream-cancel" className="vp-citation-target">浏览器的 <code>AbortController.abort()</code> 取消的是本地读取：调用之后，页面不再继续接收这条响应流。<strong>“停止显示”与“取消读取”需要明确区分。</strong>实际应用应清理本次读取和回调，防止旧响应继续进入新会话；如果这条流里已经触发了下单或退款等业务动作，客户端取消也不能证明远端计算或动作已经撤回。<Cite id="stream-cancel"/></p>
      <p>本例取消后保留已收到的字，不再自动追加。再次请求时，从新的响应开始；如果使用 <ConceptTerm slug="model-fallback">备用模型</ConceptTerm>，也应决定如何处理旧内容，避免把两份回答拼成一段。记录首个有效内容时间、结束状态和完整用时，才能判断流式体验是否改善。</p>
    </ArticleSection>
  </ConceptArticle>;
}

export function StructuredOutputTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={structuredSources}/>;
  return <ConceptArticle slug="structured-output" title="结构化输出" sources={structuredSources} sections={[["format","把结果交给程序读取"],["shape","候选约束与金额检查"],["generation","生成时就限制可选的内容"],["boundary","格式之外的正确性"]]}
    intro={<>结构化输出让模型按约定的字段和类型返回结果，便于程序直接读取。例如本例把金额写成不带小数的整数，放在 <code>amount</code> 字段里，而不是一段需要重新猜测含义的说明。格式可以受到约束，数据仍需要核对。</>}
    hero={<ConceptHero slug="structured-output" label="整数格式保留120和999，排除字符串120，金额正确性仍需另外检查"><div className={s.shapeHero}><code>amount: integer</code><div><i>120</i><i>999</i><X size={20}/><code>"120"</code></div><p>类型相同，事实可能不同</p></div></ConceptHero>}>
    <ArticleSection id="format" title="把结果交给程序读取"><Legacy slug="structured-output" names={["question","definition"]}/>
      <p id="structured-definition" className="vp-citation-target"><strong>结构化输出让结果遵从预先指定的数据形状。</strong>OpenAI 文档区分 JSON 模式与遵循 schema（对字段和类型的约定）的输出：能解析成 JSON，和字段、类型都满足约定，是两项不同的要求。哪些 schema 被支持、支持到什么程度，由具体模型和接口决定，不能推广成任意模型都能接受全部 schema。<Cite id="structured-definition"/></p>
      <p>原始资料说“金额 120”。如果程序收到“这次金额大约是 120”，需要再次提取；收到 <code>{'{"amount":"120"}'}</code> 后，解析器能把它读成一个 JSON 对象，但引号里的 <code>"120"</code> 仍是文字，不能直接当作本例要求的整数参与计算。明确输出字段，可以减少下游对自由文本的猜测。</p>
      <p id="structured-fields" className="vp-citation-target"><ConceptTerm slug="json-schema">JSON Schema</ConceptTerm> 可以描述对象的字段和类型。<code>properties</code> 本身不会让字段必填，需要 <code>required</code>；若不允许额外字段，还要用 <code>additionalProperties</code> 来禁止多余字段。<strong>字段名称出现过，不等于这份数据已经满足完整约定。</strong><Cite id="structured-fields"/></p>
    </ArticleSection>
    <ArticleSection id="shape" title="候选约束与金额检查"><Legacy slug="structured-output" names={["scene-heading"]}/>
      <p>本例只要求一个名为 <code>amount</code> 的整数字段，资料固定为 120。每个按钮代表一份完整的候选结果，不是真实模型 token（模型每次产出的一小段文字）；本地规则模拟候选过滤与后续检查，不调用生成服务。被排除的候选仍可以点选，看看它为什么通不过这种格式要求。</p>
      <StructuredOutputLesson/>
      <p>在“按 schema 检查”的情境中，120 与 999 都满足整数类型，字符串和空对象被排除。只要求“能读成 JSON”时，字符串和空对象也能解析，却不满足本例字段要求。自然语言指令情境返回说明文字，不能直接交给 JSON 解析器；这三种情境分别对应格式约束、宽松解析和自由文本。</p>
      <p className={s.large}><strong>格式约束筛掉了部分错误，留下的候选仍可能写错金额。</strong></p>
    </ArticleSection>
    <ArticleSection id="generation" title="生成时就限制可选的内容"><Legacy slug="structured-output" names={["quiz-heading"]}/>
      <p id="structured-decoding" className="vp-citation-target">Anthropic 文档描述将 schema 的规则转换成语法约束，在模型逐步选择下一段文字（这一步常叫“采样”）时限制模型每一步能选哪些输出。<strong>约束生成与生成后校验发生在不同时间。</strong>前者限制哪些输出可被选择，后者检查已经产生的数据。它能支持的 schema 功能和复杂度有限，要以具体实现为准核对。<Cite id="structured-decoding"/></p>
      <p id="structured-guidance" className="vp-citation-target">Willard 与 Louf 的研究讨论按当前生成前缀（已经写出的部分）和规则筛选可用 token，把不合约束的选项排除后再采样，并研究如何高效完成这一过程。<strong>格式约束依赖已经生成的上下文，而不是最后随手补上括号。</strong>论文是这一类方法的实例，不代表所有厂商使用同一种算法。<Cite id="structured-guidance"/></p>
      <div className={s.types}><div><h3>生成时约束</h3><p>在当前前缀下限制候选，减少不符合格式的后续写法。</p></div><div><h3>生成后校验</h3><p>解析结果，检查字段与业务条件，决定是否接收、修正或停止。</p></div></div>
    </ArticleSection>
    <ArticleSection id="boundary" title="格式之外的正确性" className={base.offset}><Legacy slug="structured-output" names={["prompt-heading"]}/>
      <p id="structured-truth" className="vp-citation-target">OpenAI 文档明确说明，结构化结果仍可能包含错误。<strong>schema 不能自动证明数据来源、推理或事实正确。</strong>金额 999 可以是完全合规的整数；如果任务要求提取资料中的 120，仍需核对原文与结果。没有相关资料时，应允许明确的缺失状态，而不是强迫填出一个看似合理的数字。<Cite id="structured-truth"/></p>
      <p id="structured-terminal" className="vp-citation-target">Anthropic 文档也列出拒绝和达到输出上限等情况：响应可能没有得到正常、完整的结构化结果。<strong>先判断结束状态，再处理正常数据。</strong>不能收到 HTTP 成功就跳过完整性检查；对不合要求的结果，也不能悄悄补上缺失字段，再当成模型真的生成了这个值。<Cite id="structured-terminal"/></p>
      <ArticleAside title="用于回复，也可以用于函数参数"><p>结构化回复让程序读取答案；<ConceptTerm slug="function-calling">函数调用</ConceptTerm> 中的结构化参数则供应用执行。参数合规不授予操作权限；输出合规也不等于外部动作成功。两种用途都需要把格式、授权与业务结果分开检查。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function FunctionCallingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={functionSources}/>;
  return <ConceptArticle slug="function-calling" title="函数调用" sources={functionSources} sections={[["request","函数名称与参数构成请求"],["dispatch","应用检查后执行查询"],["result","把结果交回对应的调用"],["responsibility","工具选择与执行责任"]]}
    intro={<>函数调用让模型依据工具定义，返回函数名称和参数。应用接到这份请求后，找到对应代码、检查参数与访问权限，再决定执行。函数结果可以回到模型输入，供它继续回答或提出下一请求。</>}
    hero={<ConceptHero slug="function-calling" label="函数名get_order匹配应用注册表，执行后返回call_01对应订单状态"><div className={s.functionHero}><div><Function size={27}/><code>get_order</code><code>order_id: A102</code></div><ArrowRight size={23}/><div><Code size={27}/><code>注册函数</code><Check size={18}/></div><p><code>call_01 → status: shipped</code></p></div></ConceptHero>}>
    <ArticleSection id="request" title="函数名称与参数构成请求"><Legacy slug="function-calling" names={["question","definition"]}/>
      <p id="function-definition" className="vp-citation-target"><strong>模型返回的函数调用是一份请求，执行由应用代码完成。</strong>OpenAI 文档把用户自定义函数的流程拆成提供定义、接收调用、应用执行、返回结果和再次生成。模型回复中出现 <code>get_order</code>，本身不能证明订单系统已被查询。<Cite id="function-definition"/></p>
      <p>订单助手要回答“A102 发货了吗”。应用先告诉模型：有一个 <code>get_order</code> 函数，用途是读取订单状态，参数 <code>order_id</code> 为字符串。模型可以据此提出名称与参数。函数说明是可用能力的描述，不是业务数据，也不是授权凭证。</p>
      <pre className={s.miniCode}>{'{\n  "call_id": "call_01",\n  "name": "get_order",\n  "arguments": "{\\"order_id\\":\\"A102\\"}"\n}'}</pre>
      <p>这里的 <code>arguments</code> 是一段装着 JSON 的字符串，需要先解析成对象，程序才能读取 <code>order_id</code>。这只是本例采用的接口写法；不同服务可能直接传对象或使用不同字段名。无论哪种写法，名称、参数和调用身份（<code>call_id</code>）都要能对上。</p>
    </ArticleSection>
    <ArticleSection id="dispatch" title="应用检查后执行查询"><Legacy slug="function-calling" names={["scene-heading"]}/>
      <p>本例模拟模型已经生成的请求，不调用模型。应用只注册 get_order，并保存一条虚构订单 A102。先收到请求，再点检查与执行；可以修改参数、选择未注册函数，或关闭查询权限。此处不会读真实订单或运行任意输入代码。</p>
      <FunctionCallingLesson/>
      <p id="function-controls" className="vp-citation-target">MCP 是工具交接协议的一种，它的 2025-06-18 版工具规范要求服务端校验输入并实施访问控制，也区分协议问题与工具执行错误。<strong>参数能解析，仍不等于允许执行。</strong>本例检查函数已经注册、只提供所需的 <code>order_id</code> 字段、订单号格式正确，再检查访问权。函数调用不要求一定通过 MCP。<Cite id="function-controls"/></p>
      <p>未注册、参数错误或未授权时，函数执行次数为零。请求 A999 时，格式与权限都合规，查询确实执行，但没有对应订单。<strong>查询是否执行、业务是否成功，要分开报告。</strong>也不能拿正常情况下的结果去冒充失败情形。</p>
    </ArticleSection>
    <ArticleSection id="result" title="把结果交回对应的调用"><Legacy slug="function-calling" names={["quiz-heading"]}/>
      <p id="function-return" className="vp-citation-target">在 OpenAI Responses 中，函数结果会带回与请求相同的 <code>call_id</code>。<strong>调用身份把这次输出与这次请求对应起来。</strong>模型才能把拿到的订单记录用于后续回答。多个请求同时存在时，不能仅按返回先后或函数名称猜测结果属于哪一份。<Cite id="function-return"/></p>
      <p>本例返回 <code>status: shipped</code> 后，只展示函数结果，没有假装已经再调用模型生成最终回复。实际应用还要把结果作为一条新的消息加入本轮输入，再请求后续生成。查询失败、超时或返回不完整时，也应把实际状态传回，而不是伪造订单已发货。</p>
      <p id="function-executor" className="vp-citation-target">Anthropic 文档按代码在哪里运行，区分应用执行的客户端工具与平台执行的服务端工具。<strong>执行责任取决于工具类型。</strong>用户自定义函数通常由应用运行；平台内置工具则可能在平台设施上运行。所以执行方要看工具类型，不一定都是应用。<Cite id="function-executor"/></p>
    </ArticleSection>
    <ArticleSection id="responsibility" title="工具选择与执行责任" className={base.offset}><Legacy slug="function-calling" names={["prompt-heading"]}/>
      <p id="function-learning" className="vp-citation-target">API 可以先理解成一套让程序请求另一项能力的约定。Toolformer 论文研究模型怎样学习选择 API、调用时机、参数与结果使用，并实际执行生成的请求来取得结果。<strong>学会提出合适的请求，和可靠地执行请求，是两个问题。</strong>论文展示一种训练方法，不意味着当前每个函数调用接口都使用该训练方案。<Cite id="function-learning"/></p>
      <p>应用仍要处理重复调用、超时、取消和操作记录。只读查询与创建订单、退款等动作的风险不同：没有收到响应时，带副作用的动作可能已经完成。重试前需要核对已有记录，并按业务设计 <ConceptTerm slug="idempotency">幂等性</ConceptTerm>，也就是同一业务请求重复提交时不重复产生效果。</p>
      <ArticleAside title="函数调用、工具与 Harness"><p><ConceptTerm slug="tools">工具</ConceptTerm> 提供可执行能力，函数调用是模型表达请求的一种形式；<ConceptTerm slug="agent-harness">Harness</ConceptTerm> 可以组织请求检查、执行、结果保存和下一次生成。只在回复里打印函数名，缺少应用执行与结果交回，还没有完成这一过程。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
