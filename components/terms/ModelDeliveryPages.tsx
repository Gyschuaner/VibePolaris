import { ArrowDown, ArrowRight, Check, FileText, X } from '@phosphor-icons/react/dist/ssr';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { ModelRoutingLesson, ModelFallbackLesson, PromptCachingLesson } from './ModelDeliveryLessons';
import { routingSources, fallbackSources, promptCachingSources } from '@/lib/model-delivery-sources';
import base from './EventConcepts.module.css';
import s from './ModelDeliveryConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>; }

export function ModelRoutingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={routingSources}/>;
  return <ConceptArticle slug="model-routing" title="模型路由" sources={routingSources} sections={[["selection","根据任务选择模型"],["gate","能力、门槛与费用"],["timing","请求前选择与结果级联"],["operation","把选择放进实际服务"]]}
    intro={<>模型路由把请求分配给合适的模型或部署。选择依据可能是输入类型、任务难度、评测表现、费用或当前负载。它要解决的是“这次交给谁”，选择之后仍需要检查回答与任务结果。</>}
    hero={<ConceptHero slug="model-routing" label="订单金额请求经过条件筛选后进入模型A，另一候选B保持未选择"><div className={s.routingHero}><div><FileText size={22}/><span>订单金额</span></div><div className={s.fork}><ArrowDown size={23}/><ArrowDown size={23}/></div><div className={s.heroModels}><div data-picked><strong>A</strong><span>满足条件 · 1 单位</span><Check size={19}/></div><div><strong>B</strong><span>满足条件 · 3 单位</span></div></div><p>在合格候选中选择</p></div></ConceptHero>}>
    <ArticleSection id="selection" title="根据任务选择模型"><Legacy slug="model-routing" names={["question","definition"]}/>
      <p id="routing-definition" className="vp-citation-target"><strong>模型路由依据请求与策略，选择由哪个模型处理。</strong>RouteLLM 研究用偏好数据学习请求与强弱模型的适配关系，在质量和调用成本之间取舍。它的路由器在得到候选模型回答之前进行选择，是一种实现方式，不是所有路由都必须使用学习得到的分类器。<Cite id="routing-definition"/></p>
      <p>例如订单助手既会提取金额，也会分析多项条款，还可能读取截图。某个模型处理简单文本更便宜，却不支持图片；另一个支持图片，但不必承担每一次简单提取。先识别输入与必须满足的要求，再比较候选，选择才有依据。</p>
      <p>路由策略可以是明确规则，也可以依靠评测数据训练。<strong>模型名气、参数规模和单一榜单分数，都不能直接代替当前任务上的证据。</strong>需要持续记录选择与实际结果，检查哪些请求被分错。</p>
    </ArticleSection>
    <ArticleSection id="gate" title="能力、门槛与费用"><Legacy slug="model-routing" names={["scene-heading"]}/>
      <p>下面的 A、B 都是虚构模型。分数代表假设的离线评测摘要，费用用教学单位表示；不调用模型，也不预测某一道题一定答对。本例先排除不可用、能力不支持或分数未达门槛的候选，再从剩余候选中选费用较低者。</p>
      <ModelRoutingLesson/>
      <p>提取金额时 A、B 都达标，可以选 A；分析条款或读取截图时，门槛与能力会使 B 更合适。门槛提高到 98 后，两者都不合格。<strong>没有候选也是一种需要保留的结果。</strong>可以停止并说明限制，或进入预先允许的人工处理；不能悄悄降低要求后宣称已满足。</p>
      <p id="routing-estimate" className="vp-citation-target">Amazon Bedrock 的智能提示路由分析请求、预测候选质量，再据此选择模型。其文档也提醒特定领域任务受模型训练数据影响。<strong>预测质量不是本次回答的保证。</strong>上线前仍要用自己的输入与判据检查；本例的离线门槛规则不冒称复刻该服务的算法。<Cite id="routing-estimate"/></p>
    </ArticleSection>
    <ArticleSection id="timing" title="请求前选择与结果级联" className={base.offset}><Legacy slug="model-routing" names={["quiz-heading"]}/>
      <div className={s.timing}><div><h3>先选择，再生成</h3><p>根据请求特征决定一个目标，不必先生成所有候选回答。RouteLLM 研究这一类取舍。</p></div><div><h3>先尝试，再判断下一步</h3><p>已有一次输出后，检查它是否达到标准；必要时调用下一候选，会增加调用次数。</p></div></div>
      <p id="routing-cascade" className="vp-citation-target">FrugalGPT 研究逐级调用并评估回答的级联方案，需要样本与评分机制来学习怎样停止或继续。<strong>模型分配不一定只发生在最初的请求前。</strong>请求前选择与回答后的级联是不同机制，不能把同一个“路由”名称理解成固定的时间顺序。论文里的成本收益也不能直接套到任意业务。<Cite id="routing-cascade"/></p>
      <p><ConceptTerm slug="model-fallback">备用模型</ConceptTerm> 常在调用不可用或不满足条件时按策略接替；质量级联则可能发生在请求已经正常返回以后。选择、生成、检查、切换分别发生了什么，应在记录中分开。</p>
    </ArticleSection>
    <ArticleSection id="operation" title="把选择放进实际服务"><Legacy slug="model-routing" names={["prompt-heading"]}/>
      <p id="routing-load" className="vp-citation-target">LiteLLM 的路由器提供按部署当前未完成请求数选择的策略。<strong>路由也可以关注负载，而不只是比较回答质量。</strong>同一模型的多个部署可以分担请求；这与按任务能力选择不同模型解决的问题不同。<Cite id="routing-load"/></p>
      <p>记录请求类型、选择原因、实际模型版本、延迟、费用与评价结果。只记录平均费用下降，可能漏掉少量关键请求的质量退步；只看分配比例，也不知道是否选择正确。通过 <ConceptTerm slug="eval">评测</ConceptTerm> 检查策略改变，才能判断节省是否值得。</p>
      <ArticleAside title="不同文档中的 fallback 不一定同义"><p id="routing-names" className="vp-citation-target">Bedrock 路由文档还用 fallback model 表示质量比较的基准候选，而不只表示调用报错后的备用。阅读配置时，要以该实现的定义为准。本文备用模型页聚焦错误或不可用后的接替策略。<Cite id="routing-names"/></p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function ModelFallbackTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={fallbackSources}/>;
  return <ConceptArticle slug="model-fallback" title="备用模型" sources={fallbackSources} sections={[["replacement","主调用之后的备用路径"],["attempts","错误、兼容性与调用次数"],["policy","什么时候切换，什么时候停止"],["limits","接替后的结果仍要检查"]]}
    intro={<>备用模型是在主调用不可用或触发指定条件时，用来接替处理的候选。准备另一名字还不够：系统需要决定哪些情况允许切换、备用能否接收相同任务，以及最多继续尝试多少次。</>}
    hero={<ConceptHero slug="model-fallback" label="主调用收到429后，备用路径出现第二次调用并返回金额字段120"><div className={s.fallbackHero}><div><span>01 · 主调用</span><strong>429 <X size={19}/></strong></div><ArrowDown size={23}/><div><span>02 · 备用调用</span><strong><code>amount: 120</code><Check size={19}/></strong></div></div></ConceptHero>}>
    <ArticleSection id="replacement" title="主调用之后的备用路径"><Legacy slug="model-fallback" names={["question","definition"]}/>
      <p id="fallback-definition" className="vp-citation-target"><strong>备用路径在指定条件下，把任务交给另一个可用目标。</strong>LiteLLM 区分同一模型组里的部署接替与跨模型组的 fallback：可以先尝试同模型的健康部署，再进入另一组。备用不必一定是能力较弱的模型，也可能是另一地区部署或另一提供方。<Cite id="fallback-definition"/></p>
      <p>同一目标重新尝试通常叫 <ConceptTerm slug="retry">重试</ConceptTerm>；换目标则是接替。二者可以配合，但都增加尝试。主服务已经过载时，无限制地重试再切换，可能把问题带到备用服务。</p>
      <p>选择备用之前，核对输入类型、上下文长度、工具和输出要求。<strong>接口形式相似，不代表任务能力完全相同。</strong>要求 amount 字段的业务，仍需要在接替后检查该字段；不能收到一段文字就当作完成。</p>
    </ArticleSection>
    <ArticleSection id="attempts" title="错误、兼容性与调用次数"><Legacy slug="model-fallback" names={["scene-heading"]}/>
      <p>本例只模拟生成一份金额 JSON，不执行付款、写文件或其他外部动作。主调用与备用响应都预先写好。策略允许在 429 或超时后检查备用条件；401 则先停止并修正身份验证。总上限包括第一次主调用。</p>
      <ModelFallbackLesson/>
      <p>主调用成功就结束；失败后，也要检查预算和备用能力。不支持所需结构化输出时，不发起第二次调用；支持结构化 JSON 却返回 total 而不是 amount 时，虽然有回复，任务仍没有通过本例判据。</p>
      <p id="fallback-errors" className="vp-citation-target">RFC 6585 规定 429 表示一定时间内请求过多，响应可以带 Retry-After，说明建议等待多久。<strong>超时是没有及时收到响应，不等于收到了 429。</strong>需要分别记录已观察到的状态码与等待结束；不能凭超时猜定服务拒绝了请求。<Cite id="fallback-errors"/></p>
    </ArticleSection>
    <ArticleSection id="policy" title="什么时候切换，什么时候停止"><Legacy slug="model-fallback" names={["quiz-heading"]}/>
      <p id="fallback-policy" className="vp-citation-target">Portkey 的归档示例按目标顺序配置备用，并展示只在指定状态码出现时切换的配置。<strong>是否切换是策略，不是所有错误的统一答案。</strong>该历史示例说明机制，不能当成当前 SDK、模型清单或默认行为的配置指南。<Cite id="fallback-policy"/></p>
      <div className={s.policyNotes}><div><h3>暂时不可用</h3><p>限流或临时连接问题，可以考虑等待、重试或切换；结合剩余时间和服务容量决定。</p></div><div><h3>要求没有满足</h3><p>不兼容的输入、身份验证或权限问题，应先核查原因；备用不能用来绕过访问限制。</p></div></div>
      <p>流式回答已显示一半再失败时，还要决定保留部分内容、重新生成，还是说明中断。把另一个模型的回复直接接在半句话后面，容易造成重复或矛盾。用户看到什么，与系统发出了几次调用，应保持对应。</p>
    </ArticleSection>
    <ArticleSection id="limits" title="接替后的结果仍要检查" className={base.offset}><Legacy slug="model-fallback" names={["prompt-heading"]}/>
      <p id="fallback-bounds" className="vp-citation-target">AWS 的退避重试说明强调限制重试、避免频繁尝试加重负载，并要求有副作用的操作考虑 <ConceptTerm slug="idempotency">幂等性</ConceptTerm>。<strong>备用调用也要计入时间、费用和次数预算。</strong>换一个目标不会自动消除重复执行的风险；没有收到响应时，要核实已经发生了哪些动作。<Cite id="fallback-bounds"/></p>
      <p>如果第一次已经创建订单，只是响应丢失，再把“创建订单”交给另一个执行者，可能多出一份订单。生成回答的接替与业务动作的重放需要分开处理。用操作记录、幂等键和明确状态检查后续行为，而不是让备用从头无条件执行所有步骤。</p>
      <p>最后保留主错误、切换原因、各次目标、实际费用与结果验证。没有可用备用、预算用尽或格式仍错误时，应清楚报告未完成。<strong>可用性改善不等于答案质量或业务结果自动达标。</strong></p>
    </ArticleSection>
  </ConceptArticle>;
}

export function PromptCachingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={promptCachingSources}/>;
  return <ConceptArticle slug="prompt-caching" title="提示缓存" sources={promptCachingSources} sections={[["computation","复用处理输入的计算"],["prefix","从输入开头连续匹配"],["conditions","相同文字不保证命中"],["lifetime","缓存可用期与实际收益"]]}
    intro={<>提示缓存复用模型已经处理过的相同输入前缀，减少重复计算。长指令、工具说明和背景资料保持稳定时，下一次请求可以从已有计算继续处理。它保存的不是供用户直接领取的一份旧答案。</>}
    hero={<ConceptHero slug="prompt-caching" label="两次输入的前三段共享计算，末尾问题变化后仍单独处理并生成新回答"><div className={s.cachingHero}><span>首次输入</span><div>{['指令','资料','格式','问题 A'].map(text => <i key={text}>{text}</i>)}</div><span>下一次输入</span><div>{['复用','复用','复用','问题 B'].map((text,i) => <i key={i} data-reuse={i < 3}>{text}</i>)}</div><p><ArrowRight size={18}/>生成本次回答</p></div></ConceptHero>}>
    <ArticleSection id="computation" title="复用处理输入的计算"><Legacy slug="prompt-caching" names={["question","definition"]}/>
      <p id="pcache-definition" className="vp-citation-target"><strong>提示缓存复用相同前缀的中间计算状态。</strong>OpenAI 文档以 KV 状态解释这种复用：新请求不必重新处理已经匹配的输入部分，继续处理剩余输入，再生成回复。缓存命中不表示直接返回上次的回答。<Cite id="pcache-definition"/></p>
      <p>模型处理一段输入后，会留下注意力计算可用的键和值等状态，通常称作 KV cache。提示缓存把可复用的部分留给后续请求。它与一次生成内部用来避免反复计算历史输入的缓存有关，但这里关注的是不同请求之间的共享前缀。</p>
      <div className={s.cacheContrast}><div><h3>处理输入</h3><p>稳定前缀可以复用已有计算；新增或改变的后续内容仍要处理。</p></div><div><h3>生成回答</h3><p>依据本次完整输入继续生成。问题和资料变了，回答也应按本次内容产生。</p></div></div>
    </ArticleSection>
    <ArticleSection id="prefix" title="从输入开头连续匹配"><Legacy slug="prompt-caching" names={["scene-heading"]}/>
      <p id="pcache-prefix" className="vp-citation-target">vLLM 的前缀缓存按块保存 KV 状态，块的标识既依赖自身 token，也依赖前面的前缀。因此，<strong>中间改了一段，后面的相同文字也不能直接跳过这次改动复用。</strong>相同段落放在不同前文后，计算所处的上下文已经不同。<Cite id="pcache-prefix"/></p>
      <p>本例把输入分成四个逻辑段，只保存前三段计算。它们不是实际 token 块，也不代表厂商最小缓存长度。首次固定输入询问到账时间；第二次可以改问题、资料或指令，观察哪些片段仍能复用。展示的回答是对应情境的预设文本。</p>
      <PromptCachingLesson/>
      <p>只改末尾问题时，前三段仍连续相同。改第二段资料时，只剩第一段匹配；第三段格式即使没变，也跟在新的资料后面，需要重新计算。首段改变、模型改变或缓存失效时，本例不复用任何片段。</p>
    </ArticleSection>
    <ArticleSection id="conditions" title="相同文字不保证命中" className={base.offset}><Legacy slug="prompt-caching" names={["quiz-heading"]}/>
      <p id="pcache-conditions" className="vp-citation-target">Anthropic 文档说明缓存涉及指定边界之前的完整前缀，包括工具、系统指令和消息，并要求匹配内容一致；它还规定可缓存长度、有效期与隔离范围。<strong>命中条件取决于具体实现。</strong>不能仅看某段可见正文没变，就断言整次请求一定命中。<Cite id="pcache-conditions"/></p>
      <p>让稳定指令、工具与资料位于可复用的前部，把变化频繁的问题和时间信息放在后部，通常更有利于匹配。但这种编排不能牺牲正确性：资料更新就应使用新资料，不能为了命中保留过时规则。</p>
      <ArticleAside title="与回答缓存、检索和记忆的区别"><p>回答缓存可以保存完整响应并按规则直接返回；提示缓存复用的是输入计算。<ConceptTerm slug="retrieval">检索</ConceptTerm> 选择本次需要的资料，<ConceptTerm slug="memory">记忆</ConceptTerm> 保留供以后使用的信息。它们可以配合，但输入计算命中不代表自动找到了新资料或记住了业务事实。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="lifetime" title="缓存可用期与实际收益"><Legacy slug="prompt-caching" names={["prompt-heading"]}/>
      <p id="pcache-eviction" className="vp-citation-target">SGLang 的 RadixAttention 用前缀树管理 token 序列与 KV 状态的对应，并在内存有限时淘汰缓存。<strong>以前处理过，不代表现在仍有可复用状态。</strong>缓存是资源管理的一部分，不是永久保存全部输入的承诺。<Cite id="pcache-eviction"/></p>
      <p>观察实际命中的输入量、首次写入与后续读取费用、首个输出出现的时间和整个回答的用时。重复前缀长、请求能在有效期内复用时，收益可能更明显；输入很短或经常改变时，效果会不同。没有测量，不能把论文或厂商的最高节省比例当成当前服务的收益。</p>
      <p><strong>缓存不修正资料错误，也不保证回答正确。</strong>它优化的是重复输入计算。模型、配置、缓存隔离与数据保留政策仍要按使用的平台核对；费用与有效期会变化，直接查看书目中的现行文档。</p>
    </ArticleSection>
  </ConceptArticle>;
}
