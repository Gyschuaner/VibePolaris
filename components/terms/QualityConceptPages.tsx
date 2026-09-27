import { Check, Clock, FileText, X } from '@phosphor-icons/react/dist/ssr';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { GroundingLesson, HallucinationLesson, EvaluationLesson } from './QualityConceptLessons';
import { groundingSources, hallucinationSources, evaluationSources } from '@/lib/quality-sources';
import base from './EventConcepts.module.css';
import s from './QualityConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>; }

export function GroundingTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={groundingSources}/>;
  return <ConceptArticle slug="grounding" title="基于证据回答" sources={groundingSources} sections={[["basis", "回答依据哪份材料"], ["scope", "条件不能在改写中丢掉"], ["data", "资料怎样进入本轮输入"], ["missing", "资料没说的部分"]]}
    intro={<>问退款多久能到账，回答要依据适用的退款规则。Grounding 把指定资料、检索内容或工具结果引入生成过程，让结论有可核对的依据。它不会自动保证模型只用这些资料，也不会自动保证资料正确。</>}
    hero={<ConceptHero slug="grounding" label="审核通过后与通常两个条件保留在退款时效的回答中"><div className={s.groundHero}><FileText size={25}/><div><span>审核通过后</span><span>通常</span><strong>三个工作日</strong></div><p>条件与结论一起保留</p></div></ConceptHero>}>
    <ArticleSection id="basis" title="回答依据哪份材料"><Legacy slug="grounding" names={["question", "definition"]}/>
      <p id="ground-definition" className="vp-citation-target"><strong>Grounding 让生成过程连接到具体资料，为回答提供依据。</strong>Microsoft 对 Copilot 的说明区分模型训练时获得的知识与当前提示可用的工作资料、网页和附件；这些额外信息影响回答，但仍需检查生成内容。这里讲的是更一般的概念，具体系统怎样取资料、是否搜索网页，要看实际设置。<Cite id="ground-definition"/></p>
      <p>“知道退款一般要几天”与“读到这家公司的退款规则”承担不同作用。前者可能来自模型已有知识，后者可以指出出处与适用条件。回答这家公司的现行政策时，需要能解释<strong>这句话由哪份材料支持</strong>。</p>
      <p>资料也不只是网页。用户上传的说明、刚查到的订单状态、工具返回的日志，都可能成为本轮依据。<ConceptTerm slug="citation">引用</ConceptTerm> 负责标明出处；提供依据、正确使用依据、让读者找到依据，是相互关联的几项工作。</p>
    </ArticleSection>
    <ArticleSection id="scope" title="条件不能在改写中丢掉"><Legacy slug="grounding" names={["scene-heading"]}/>
      <p>下面三份材料和退款规则都是虚构的。点击材料选择是否提供，再按渠道组织回答。演示按固定规则匹配材料与字段，没有调用模型；它展示的是系统应保留哪些范围与缺口。</p>
      <GroundingLesson/>
      <p>线上时效来自 A，门店时效来自 B；两份文件都在，也不能交换使用。费用说明 C 只适用于线上。<strong>关于同一主题的材料，不一定支持同一个对象的结论。</strong>门店退款不能因为线上免费，就被写成免费。</p>
      <p>“审核通过后”限定起点，“通常”限定确定程度。删掉它们，就把有条件的时效变成了无条件保证。回答可以压缩句子，但要保留会影响读者判断的限定；出处标得再完整，也弥补不了这种改写错误。</p>
    </ArticleSection>
    <ArticleSection id="data" title="资料怎样进入本轮输入"><Legacy slug="grounding" names={["quiz-heading"]}/>
      <p id="ground-retrieval" className="vp-citation-target"><ConceptTerm slug="rag">RAG</ConceptTerm> 是引入外部资料的一种方法。Lewis 等的论文把检索到的段落与生成模型结合，在研究任务中考察答案质量。<strong>检索增强是实现路径，Grounding 关注回答的依据关系。</strong>直接提供附件或工具结果，也可以给生成过程补充资料；不能把所有这种操作都当成论文里的 RAG 架构。<Cite id="ground-retrieval"/></p>
      <div className={s.readingSteps}><div><span>01</span><h3>找到适用资料</h3><p>问题、渠道、对象和时间要对应。找到“退款”两个字还不够。</p></div><div><span>02</span><h3>提供可用内容</h3><p>让本轮输入包含相关段落与来源信息，不只放一个未读取的网址。</p></div><div><span>03</span><h3>核对具体结论</h3><p>逐项检查回答是否保留条件，是否补出了资料没有的内容。</p></div></div>
      <p id="ground-data" className="vp-citation-target">Azure 的设计文档讨论资料相关性、更新与访问范围：有些信息需要随文档更新同步索引，有些适合在请求时从实时系统取得，并按用户权限过滤。<strong>把旧资料放进输入，可能得到有依据却已经过时的回答。</strong>具体更新方式要依据数据来源和系统设计决定。<Cite id="ground-data"/></p>
    </ArticleSection>
    <ArticleSection id="missing" title="资料没说的部分" className={base.offset}><Legacy slug="grounding" names={["prompt-heading"]}/>
      <p id="ground-insufficient" className="vp-citation-target">Anthropic 的减少幻觉指南提出允许模型承认不知道、先提取相关原文、核对陈述与引用，并明确这些方法<strong>不能完全消除错误</strong>。材料不足时，可以缩小回答、继续查找或请求补充，而不应把熟悉的说法补成确定事实。<Cite id="ground-insufficient"/></p>
      <p>演示中的“暂时无法确认”有具体原因：所选资料缺少这个渠道的费用。它不表示退款一定收费，也不表示免费。保留缺口，读者才知道接下来要找什么；把所有未知统一写成“否”，同样会制造错误。</p>
      <ArticleAside title="资料相互冲突时"><p>先检查是否属于不同渠道、版本或适用对象。无法判断哪份有效时，把冲突说明出来，并寻找当前有效来源。模型把两份矛盾规则拼成一个顺滑答案，不会消除冲突。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function HallucinationTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={hallucinationSources}/>;
  return <ConceptArticle slug="hallucination" title="幻觉" sources={hallucinationSources} sections={[["meaning", "句子通顺，事实仍可能不对"], ["checks", "与来源一致，与事实相符"], ["causes", "错误怎样进入回答"], ["uncertainty", "不确定性只是核查信号"]]}
    intro={<>回答写得具体、语气笃定，仍可能改错数字、扩大条件，或补上没有依据的细节。检查这类问题，要分清回答是否忠于材料，以及材料和回答是否符合实际情况。</>}
    hero={<ConceptHero slug="hallucination" label="旧规则三个工作日与当前规则七个工作日分别显示，忠于旧资料仍可能过时"><div className={s.hallHero}><div><FileText size={22}/><span>提供原文 · v1</span><strong>3<small>工作日</small></strong></div><div><Clock size={22}/><span>当前规则 · v2</span><strong>7<small>工作日</small></strong></div></div></ConceptHero>}>
    <ArticleSection id="meaning" title="句子通顺，事实仍可能不对"><Legacy slug="hallucination" names={["question", "definition"]}/>
      <p id="hall-definition" className="vp-citation-target">在自然语言生成中，<strong>“幻觉”常指生成内容与提供来源不符，或缺少事实依据等问题</strong>。Ji 等的综述指出，不同任务对这个词的使用范围不同，并区分忠于来源与符合现实事实。阅读研究或产品报告时，要看它究竟检查哪一种错误，不能只看一个“幻觉率”。<Cite id="hall-definition"/></p>
      <p id="hall-fluency" className="vp-citation-target">Maynez 等研究摘要生成时发现，流畅、主题相关的摘要仍可能含有来源无法支持的内容，常用的摘要相似度指标也不能充分反映这一问题。<strong>语言质量与依据质量需要分别检查。</strong>这项研究针对摘要任务，不能把其中某个实验结果当成所有模型、所有场景的错误比例。<Cite id="hall-fluency"/></p>
      <p>常见问题包括把三个工作日改成七个、把“通常”改成“保证”，或新增一项资料没提到的费用。名称、数字、日期和条件都值得逐项核对；正确的句子中也可能夹着一个错误细节。</p>
    </ArticleSection>
    <ArticleSection id="checks" title="与来源一致，与事实相符"><Legacy slug="hallucination" names={["scene-heading"]}/>
      <p id="hall-axes" className="vp-citation-target"><strong>忠于来源，检查生成内容是否得到提供材料的支持；符合事实，检查陈述是否与实际情况一致。</strong>Ji 等讨论这两种标准的区别。来源没有提到的信息可能是真的，也可能是错的，不能仅凭“没写在这里”就判为虚假。<Cite id="hall-axes"/></p>
      <p>本例的两份退款规则和“当前 v2”都是预设的虚构事实，其他费用未知。先比较回答与提供来源，再查看当前规则；演示使用固定对照，没有运行事实核查模型。</p>
      <HallucinationLesson/>
      <p>v1 写三个工作日，回答也写三个工作日，来源检查会通过；但本例当前规则是 v2 的七个工作日，事实检查会发现它已经过时。反过来，依据只有 v1 却回答七个工作日，虽然碰巧符合当前规则，也不能称为由 v1 支持。</p>
      <p className={s.pullquote}><strong>“无法核实”保留的是信息缺口，不能直接替换成“错误”或“正确”。</strong></p>
      <p>费用在两份规则里都没有出现。本例没有足够材料判断“完全免费”真假，矩阵就不替它放入一个已确定的格子。需要继续查费用说明，才能获得更多依据。</p>
    </ArticleSection>
    <ArticleSection id="causes" title="错误怎样进入回答"><Legacy slug="hallucination" names={["quiz-heading"]}/>
      <p id="hall-imitation" className="vp-citation-target">TruthfulQA 用容易诱发常见误解的问题研究模型如何模仿人类错误说法。训练材料中的流行表达并不都真实，生成一个熟悉的说法也不等于已经验证它。<strong>这项研究说明了一种错误来源，不能把所有生成错误都归因于同一个机制。</strong><Cite id="hall-imitation"/></p>
      <div className={s.causeNotes}><div><h3>依据本身有问题</h3><p>旧规则、错误记录或互相冲突的材料，可能被忠实地写进回答。检查来源与版本。</p></div><div><h3>从依据到回答时出错</h3><p>原文限定被删、数字被改、相邻条目被混用。检查每项陈述的支持范围。</p></div></div>
      <p>缺材料时让模型继续补全，也可能出现没有依据的细节。<ConceptTerm slug="grounding">基于证据回答</ConceptTerm> 与引用能提供核查入口，但仍要读原文。只有一个引用编号，无法说明这里的数字就是从那段原文正确得到的。</p>
    </ArticleSection>
    <ArticleSection id="uncertainty" title="不确定性只是核查信号" className={base.offset}><Legacy slug="hallucination" names={["prompt-heading"]}/>
      <p id="hall-detection" className="vp-citation-target">Farquhar 等研究“语义熵”：多次生成后，比较答案含义的差异，用于检测一部分会随采样变化的错误。他们明确说明，方法<strong>不保证事实正确，也无法解决系统性地重复同一错误</strong>。措辞不同可能表达同一含义；回答始终一致，也可能始终错。<Cite id="hall-detection"/></p>
      <p>实际检查可以围绕关键陈述找当前有效来源，核对对象、时间与限定条件，并明确哪些仍然未知。涉及工具动作时，还要检查实际返回与最终状态；模型说“已完成”，不等于操作确实完成。</p>
      <ArticleAside title="为什么不能只看回答的自信程度"><p>语气是输出文字的一部分。需要核对的是陈述与可验证资料之间的关系。让回答更犹豫，并不能自动纠正错误；让它说得更肯定，也没有增加证据。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function EvaluationTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={evaluationSources}/>;
  return <ConceptArticle slug="eval" title="评测" sources={evaluationSources} sections={[["task", "先说明怎样才算完成"], ["compare", "同一组案例比较改动"], ["coverage", "总分没有包含的变化"], ["trust", "评分结果也需要核对"]]}
    intro={<>改了提示词、模型或工具流程，单看一条漂亮回答很难知道效果。评测把目标变成可执行的案例，记录实际结果，再按明确规则评分。比较版本时，既要看整体变化，也要找出哪些案例变差。</>}
    hero={<ConceptHero slug="eval" label="B与C都通过六例中的五例，但B在关键案例失败，C在普通案例失败"><div className={s.evalHero}>{['B', 'C'].map(version => <div key={version}><strong>{version} · 5/6</strong><div>{Array.from({ length: 6 }, (_, i) => <span key={i} data-critical={i === 5} data-failed={i === (version === 'B' ? 5 : 2)}>{i === (version === 'B' ? 5 : 2) ? <X size={16}/> : <Check size={16}/>}</span>)}</div></div>)}<p>相同总分，失败位置不同</p></div></ConceptHero>}>
    <ArticleSection id="task" title="先说明怎样才算完成"><Legacy slug="eval" names={["question", "definition"]}/>
      <p id="eval-task" className="vp-citation-target"><strong>评测用明确输入、成功标准和评分方式，检查系统在一组任务上的表现。</strong>Anthropic 把单个任务、一次尝试、评分器、完整记录与实际结果分开：回答说完成了，还需要检查环境中的结果。当对象是智能体时，模型与 <ConceptTerm slug="agent-harness">Harness</ConceptTerm> 一起影响表现。<Cite id="eval-task"/></p>
      <p>例如“处理退款问题”太宽。可以改成：给出这份线上退款规则，询问时效，回答应保留审核条件与通常时效。另一条案例检查资料缺费用时是否承认缺口；再一条检查是否拒绝提供他人的订单。每条输入和预期行为都应具体。</p>
      <p>比较版本时，案例、判据与运行条件要对应，并记录究竟改了什么。若新版本换了模型又换了资料，结果可能变化，但不能把变化单独归功于其中一项。</p>
    </ArticleSection>
    <ArticleSection id="compare" title="同一组案例比较改动"><Legacy slug="eval" names={["scene-heading"]}/>
      <p>下面是六条虚构案例与 A、B、C 三份预先编写的回答记录。评分按每条判据检查所列短语，不调用模型，不测实时性能。本例门槛是：三个分组均有覆盖、通过率至少 80%、关键案例零失败。这些数字只用于演示。</p>
      <EvaluationLesson/>
      <p>B 与 C 都是 5/6，但 B 仍提供他人的订单，关键案例失败；C 拒绝了这个请求，却不再指出正确的申请入口。<strong>平均分、关键失败和逐例回退，回答的是不同问题。</strong>这组记录只能说明本例中的表现，六条案例通过并不构成真实产品上线依据。</p>
    </ArticleSection>
    <ArticleSection id="coverage" title="总分没有包含的变化"><Legacy slug="eval" names={["quiz-heading"]}/>
      <p id="eval-coverage" className="vp-citation-target">CheckList 提出按能力与测试类型组织行为测试，检查普通准确率可能掩盖的问题。<strong>先想要验证哪种行为，再设计能暴露它的案例。</strong>本例只看普通三题，B 能得到 100%，但没有测试资料缺失和订单访问；高分没有补上未覆盖的行为。<Cite id="eval-coverage"/></p>
      <p id="eval-metrics" className="vp-citation-target">HELM 以多种场景和指标考察语言模型，包括准确性、稳健性与效率，并明确覆盖仍不完整。<strong>一个数字无法代表所有方面。</strong>自己的任务可以分别记录正确性、延迟、费用和失败类型，说明哪些是硬性条件，哪些用于比较；无需把所有指标机械地塞进同一个总分。<Cite id="eval-metrics"/></p>
      <p id="eval-repeat" className="vp-citation-target">模型输出可能在多次运行中变化，Anthropic 因此区分任务与每次尝试，并讨论重复试验。<strong>单次成功不说明每次都能成功。</strong>本页固定记录便于看清计分；真实评测还应按任务需要重复运行、保留变动与失败记录。<Cite id="eval-repeat"/></p>
      <ArticleAside title="评测与基准测试、评分器"><p><ConceptTerm slug="benchmark">基准测试</ConceptTerm> 通常强调一套用于比较的任务与条件。评测也可以只针对自己的业务改动。<ConceptTerm slug="grader">评分器</ConceptTerm> 是判断某项表现的逻辑，一条任务可以使用多个评分器；它不是整套评测本身。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="trust" title="评分结果也需要核对" className={base.offset}><Legacy slug="eval" names={["prompt-heading"]}/>
      <p id="eval-graders" className="vp-citation-target">Anthropic 对比代码、模型与人工评分：代码检查便宜且容易复现，但可能错过有效改写；模型评分更灵活，也需要人工校准。<strong>选择判据时，要确认它确实测到目标行为。</strong>本例短语匹配只适用于预设记录，不能作为任意自然语言回答的事实核查器。<Cite id="eval-graders"/></p>
      <p id="eval-integrity" className="vp-citation-target">NIST CAISI 讨论智能体在评测中的作弊行为：系统可能利用答案泄露或评分流程的漏洞获得高分，却没有展示预期能力。<strong>分数与能力之间可能存在缺口。</strong>要阅读实际执行记录，检查数据污染、判据漏洞与异常成功，不能只收集最终百分比。<Cite id="eval-integrity"/></p>
      <p>发现失败后，先弄清是任务写得不清、资料有误、系统真的失败，还是评分器误判。保留没有参与调试的案例，再看改动能否推广到它们；否则反复针对熟悉题目修补，可能只提高这份题库的分数。</p>
    </ArticleSection>
  </ConceptArticle>;
}
