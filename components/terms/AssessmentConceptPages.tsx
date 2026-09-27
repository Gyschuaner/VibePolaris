import { Check, FileText, X } from '@phosphor-icons/react/dist/ssr';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { BenchmarkLesson, GraderLesson, EvalDatasetLesson } from './AssessmentConceptLessons';
import { benchmarkSources, graderSources, evalDatasetSources } from '@/lib/assessment-sources';
import base from './EventConcepts.module.css';
import s from './AssessmentConcepts.module.css';
function Legacy({ slug, names }: { slug: string; names: string[] }) { return <>{names.map(name => <span key={name} id={`${slug}-${name}`} className={base.anchor} aria-hidden="true"/>)}</>; }

export function BenchmarkTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={benchmarkSources}/>;
  return <ConceptArticle slug="benchmark" title="基准测试" sources={benchmarkSources} sections={[["suite", "任务、指标与比较条件"], ["comparison", "先对齐记录，再看成绩"], ["dimensions", "通过更多，还是响应更快"], ["scope", "榜单以外的任务"]]}
    intro={<>基准测试把一组任务、指标和运行约定组织起来，让不同方案的成绩有比较依据。读一个排名之前，先看它测了哪些任务、按什么规则计分，以及模型、工具和运行条件分别是什么。</>}
    hero={<ConceptHero slug="benchmark" label="A与B两条成绩带对齐到同一题集版本，显示八题与九题通过"><div className={s.benchHero}><p>同一题集 · v1</p>{['A', 'B'].map((name, i) => <div key={name}><strong>{name}</strong><div>{Array.from({ length: 10 }, (_, n) => <span key={n} data-pass={n < 8 + i}/>)}</div><span>{8 + i}/10</span></div>)}<p>先对齐，再比较</p></div></ConceptHero>}>
    <ArticleSection id="suite" title="任务、指标与比较条件"><Legacy slug="benchmark" names={["question", "definition"]}/>
      <p id="bench-definition" className="vp-citation-target"><strong>基准测试是一套用于比较表现的任务和评测约定。</strong>GLUE 把九种自然语言理解任务放入同一评测平台，各任务使用相应指标，并提供诊断数据。它测的是这些任务上的表现，不是模型的一切能力。一个基准可以包含多种任务，也不必只报告一个分数。<Cite id="bench-definition"/></p>
      <p>“A 比 B 好”需要补上条件：在哪组任务、哪个版本、哪种输入和判据下更好？两份成绩使用不同题集，分数差异就可能同时来自题目变化。对智能体，还要说明可用工具、运行预算与 <ConceptTerm slug="agent-harness">Harness</ConceptTerm>，因为这些也影响完成任务的能力。</p>
      <p id="bench-protocol" className="vp-citation-target">MLPerf Inference 区分硬件与软件组成的被测系统、运行场景、准确性检查，以及不同提交类别的约束。<strong>可比条件取决于要比较什么。</strong>测试硬件时硬件本来可以不同；比较模型改动时则要尽量固定其他因素，并记录无法固定的差异。不能把“所有配置都完全相同”当成所有基准的定义。<Cite id="bench-protocol"/></p>
    </ArticleSection>
    <ArticleSection id="comparison" title="先对齐记录，再看成绩"><Legacy slug="benchmark" names={["scene-heading"]}/>
      <p>下面是两组虚构任务与预先写好的运行摘要，不运行模型或测速。A、B 的输入格式和判据在同一题集内相同。一般任务与业务任务各有十题；切换 B 的记录，可以看到为什么版本不一致时不能直接排名。</p>
      <BenchmarkLesson/>
      <p>一般任务中，B 通过九题，A 通过八题；业务任务中，A 仍通过八题，B 只通过七题。<strong>排名跟着任务集合变化，没有矛盾。</strong>两组任务关注的能力不同。若 B 换成 v2 的十二题，比较记录已经不对应，不能把多通过几题解释成模型更强。</p>
    </ArticleSection>
    <ArticleSection id="dimensions" title="通过更多，还是响应更快" className={base.offset}><Legacy slug="benchmark" names={["quiz-heading"]}/>
      <p id="bench-metrics" className="vp-citation-target">HELM 同时考察多个场景与准确性、稳健性、效率等维度，并明确评测覆盖仍不完整。<strong>领先哪个指标，与能否满足业务要求，是不同判断。</strong>一个方案通过更多题，也可能等待更久；单一总分会省掉这些差别。<Cite id="bench-metrics"/></p>
      <div className={s.metricNotes}><div><h3>先核对底线</h3><p>需要达到的正确性、可接受的失败类型、响应时间上限，要来自实际任务要求。</p></div><div><h3>再比较取舍</h3><p>在满足必要条件的方案之间，分别看质量、延迟与费用，不把全部差异压成一个未经解释的数字。</p></div></div>
      <p>本例 A 的延迟中位数更短，却没有因此被宣布为最佳方案。中位数也不说明最慢请求需要等多久；真实服务可能还要看尾部延迟、并发负载和失败率。怎样汇总取决于使用场景，数字旁应保留它的测量定义。</p>
    </ArticleSection>
    <ArticleSection id="scope" title="榜单以外的任务"><Legacy slug="benchmark" names={["prompt-heading"]}/>
      <p id="bench-transfer" className="vp-citation-target">Dynabench 讨论固定测试集的局限，让人针对当前模型提出挑战样本，逐轮收集新的评测数据。<strong>在熟悉的基准上得高分，不自动说明能处理新的困难或自己的业务。</strong>更新评测目标可以暴露原题集没有测到的问题，但版本更新也需要清楚标记，避免混用成绩。<Cite id="bench-transfer"/></p>
      <p>选择方案时，可以先用公开基准了解表现范围，再用自己的 <ConceptTerm slug="evaluation-dataset">评测数据集</ConceptTerm> 检查真实输入、资料缺失、边界情况与关键失败。记录模型版本、运行配置和原始结果，才能在下一次改动后进行有依据的比较。</p>
      <ArticleAside title="基准测试与评测的关系"><p><ConceptTerm slug="eval">评测</ConceptTerm> 是检查系统表现的活动；基准测试通常强调组织好的比较任务与约定。业务内一次提示词改动也可以做评测，不需要先成为公开榜单。公开与否不决定评测是否严谨。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function GraderTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={graderSources}/>;
  return <ConceptArticle slug="grader" title="评分器" sources={graderSources} sections={[["criterion", "把要求变成可检查的判据"], ["evidence", "回复与实际结果"], ["rubric", "开放回答怎样评分"], ["review", "检查评分器的判断"]]}
    intro={<>评分器根据判据检查一次尝试，输出分数、通过与否或其他评价。判据写错，评测就可能奖励错误行为。需要文件写入成功时，“回答里出现完成”与“目标文件存在且内容正确”检查的是两件事。</>}
    hero={<ConceptHero slug="grader" label="助手说已完成，但文件检查未发现answer.json，回复措辞与任务结果分开"><div className={s.gradeHero}><div><span>助手回复</span><strong>已完成。</strong></div><div><FileText size={25}/><code>answer.json</code><X size={22}/><span>文件不存在</span></div></div></ConceptHero>}>
    <ArticleSection id="criterion" title="把要求变成可检查的判据"><Legacy slug="grader" names={["question", "definition"]}/>
      <p id="grader-definition" className="vp-citation-target"><strong>评分器把输出或执行结果，按指定规则转换成评价。</strong>Inspect 的评分系统支持文本匹配、数学答案、模型评分和自定义检查，再把逐条分数汇总成指标。评分器是 <ConceptTerm slug="eval">评测</ConceptTerm> 中的一部分：题目规定要做什么，它规定怎样判断做得如何。<Cite id="grader-definition"/></p>
      <p>判据应对应任务目标。选择题可以检查选项；金额字段可以按数值核对；代码任务可以运行测试。开放回答可能需要评价准确性、相关性或写作质量，但“写得长”“说得自信”不能未经说明就替代这些要求。</p>
      <p>一个任务可以有多个评分器，分别检查格式、结果和关键限制。它们不一定合成一个总分。先保留各项证据，才能看出系统是答案正确但格式不符，还是格式漂亮却做错了任务。</p>
    </ArticleSection>
    <ArticleSection id="evidence" title="回复与实际结果"><Legacy slug="grader" names={["scene-heading"]}/>
      <p id="grader-outcome" className="vp-citation-target">Anthropic 的智能体评测文章区分对话记录与实际环境结果。例如任务声称完成，还应核查目标操作是否发生。<strong>评分需要检查目标对应的证据。</strong><Cite id="grader-outcome"/></p>
      <p>本例任务是生成 answer.json，其中 amount 为 120。四次尝试、回复和文件状态都是虚构记录；下方只运行固定检查逻辑，不访问真实文件，也不调用评分模型。先试措辞判据，再换成结果判据。</p>
      <GraderLesson/>
      <p>“已完成”却没有文件，会通过关键词判据；“文件已保存”且内容正确，反而不通过它。关键词检查不是没有用途，它只是<strong>没有测到这个任务的完成条件</strong>。文件存在也不够，还要检查内容里的金额。</p>
      <p id="grader-unscored" className="vp-citation-target">Inspect 的评分策略区分如何处理运行失败，包括保留未评分状态。检查环境不可读时，需要先辨别评测设施问题与任务本身失败。<strong>未评分不应悄悄变成通过，也不能随意当作系统失败。</strong>具体错误怎样计入指标，必须在评测规则中声明；本例选择未评分。<Cite id="grader-unscored"/></p>
    </ArticleSection>
    <ArticleSection id="rubric" title="开放回答怎样评分"><Legacy slug="grader" names={["quiz-heading"]}/>
      <p id="grader-rubric" className="vp-citation-target">G-Eval 研究用模型依据任务说明、评价标准与评价步骤，对生成文本打分。<strong>把“好不好”拆成明确维度，会让评分更容易核对。</strong>论文针对特定摘要与对话任务，和人工评分的相关性不等于任意任务都能正确判分。<Cite id="grader-rubric"/></p>
      <div className={s.rubric}><h3>例：解释退款规则</h3><dl><dt>事实</dt><dd>天数、渠道和费用与提供资料一致。</dd><dt>条件</dt><dd>保留“审核通过后”和“通常”等重要限定。</dd><dt>缺口</dt><dd>资料没有费用时，不自行承诺免费。</dd></dl></div>
      <p>这些是需要分别检查的维度，不能只给评分模型一句“请给出 1 到 5 分”。评分说明还应写清各档意味着什么、遇到缺资料怎样处理，并用人工确认的样本核对评分行为。参考答案有帮助，但不应让合理的不同措辞全都失分。</p>
      <ArticleAside title="代码、模型与人工怎样配合"><p>明确字段与可执行测试优先交给代码。含义、写作质量等难以枚举的判断可以用模型或人工。人工样本也需要清楚判据；把分歧记录下来，比默认某一方永远正确更有助于修正标准。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="review" title="检查评分器的判断" className={base.offset}><Legacy slug="grader" names={["prompt-heading"]}/>
      <p id="grader-bias" className="vp-citation-target">MT-Bench 与 Chatbot Arena 的研究检查了模型裁判的位置、长度和自我偏好等偏差。<strong>模型评分也有需要验证的行为。</strong>交换候选回答的顺序、抽样与人工对照，可以发现评分信号是否受无关因素影响；这些检查本身不保证消除全部偏差。<Cite id="grader-bias"/></p>
      <p>保留原回答、判据、评分器版本、评价与可核对证据。系统改动后成绩提高时，也要确认是否同时改了评分规则。更宽松的判据可能提高数字，却没有改善任务结果。</p>
      <p>发现反常分数时，回到具体样本，检查输入是否足够、结果是否可观察、判据是否误测了措辞。<strong>评分器不是最终事实来源，它是需要校验的判断工具。</strong></p>
    </ArticleSection>
  </ConceptArticle>;
}

export function EvalDatasetTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={evalDatasetSources}/>;
  return <ConceptArticle slug="evaluation-dataset" title="评测数据集" sources={evalDatasetSources} sections={[["case", "一条样本要交代什么"], ["split", "把关联样本放在同一组"], ["holdout", "留出集要测新的输入"], ["record", "记录范围与版本"]]}
    intro={<>评测数据集收集用来检查系统表现的输入、必要背景与评价信息。选哪些案例、怎样划分开发与留出样本，决定分数能够说明什么。把几百条问题放在一起，还不足以证明它代表真实任务。</>}
    hero={<ConceptHero slug="evaluation-dataset" label="工单A的两条不同问题作为同一组移动进入开发区，不分散到留出区"><div className={s.dataHero}><div><span>工单 A · 同一背景</span><div><FileText size={17}/>A1 · 配送时间</div><div><FileText size={17}/>A2 · 物流入口</div></div><p><span>开发</span><span>留出</span></p></div></ConceptHero>}>
    <ArticleSection id="case" title="一条样本要交代什么"><Legacy slug="evaluation-dataset" names={["question", "definition"]}/>
      <p id="evaldata-definition" className="vp-citation-target"><strong>评测数据集组织一组可检查的任务样本。</strong>Anthropic 的智能体评测文章强调任务描述与成功标准应明确。只有一句问题，往往无法重现当时的资料、环境和预期行为。<Cite id="evaldata-definition"/></p>
      <div className={s.caseSheet}><span>示例 · 一条退款案例</span><dl><dt>输入</dt><dd>退款多久到账？</dd><dt>背景</dt><dd>线上退款规则：审核通过后，通常三个工作日。</dd><dt>预期行为</dt><dd>回答保留审核条件与通常时效，不新增费用保证。</dd></dl></div>
      <p>有些任务有唯一标准答案，有些更适合记录期望行为与约束；不能为了方便计分，把所有任务改成精确字符串匹配。数据集保存案例，<ConceptTerm slug="grader">评分器</ConceptTerm> 根据这些信息检查尝试，它们承担不同职责。</p>
      <p>案例还应覆盖实际关心的变化：普通输入、资料缺失、模糊追问或关键限制。数量多不一定覆盖广，复制同一类简单问题也不会增加新的判断能力。</p>
    </ArticleSection>
    <ArticleSection id="split" title="把关联样本放在同一组"><Legacy slug="evaluation-dataset" names={["scene-heading"]}/>
      <p id="evaldata-groups" className="vp-citation-target">scikit-learn 的分组交叉验证让同一组样本不同时出现在训练与测试两侧，例如同一个人的多次记录。<strong>如何定义组，要对应希望检验的推广对象。</strong>若要测试新工单，同一工单的追问应考虑作为关联样本处理，不能仅因句子不同就当作彼此独立。<Cite id="evaldata-groups"/></p>
      <p>下面是三个虚构工单、每单两条不同问题。逐行交替会把每个工单拆到两边；按工单分组时，本例固定留出最后一个工单。它没有运行训练或模型，只展示样本归属和覆盖检查。</p>
      <EvalDatasetLesson/>
      <p>开发时读过工单 A 的背景，再用 A 的追问测试，可能借用了已经见过的信息。<strong>组间隔开是针对这一种泄漏的措施，不是所有评测都必须按工单划分。</strong>如果目标是检验已知工单的后续处理，划分标准会不同；先说明想检验什么。</p>
    </ArticleSection>
    <ArticleSection id="holdout" title="留出集要测新的输入" className={base.offset}><Legacy slug="evaluation-dataset" names={["quiz-heading"]}/>
      <p id="evaldata-holdout" className="vp-citation-target">Google 的机器学习课程区分训练、验证与测试集，讨论重复样本泄漏，以及反复依据测试成绩调整造成的隐性拟合。<strong>留出集参与了反复调试，就不再是未见过的检验。</strong>这个原则也提醒我们：调提示词时，应把开发用例与最终检查用例的用途分开。<Cite id="evaldata-holdout"/></p>
      <p>独立性和覆盖范围也需要分别看。本例按工单分组后，留出组只有 C 的关键问题，没有普通与资料缺失问题。它能检查部分权限行为，却不能据此总结全部业务表现。需要补充不同背景的新工单，而不是把 A、B 的追问重新拆进来。</p>
      <p>发现真实失败，可以把相应案例纳入后续开发并更新版本；同时准备新的、没有用于修补的样本检查推广。留出集不必永远不变，但每次使用与更新应该能追溯，不能对熟悉题库反复调优后仍宣称未见测试成功。</p>
    </ArticleSection>
    <ArticleSection id="record" title="记录范围与版本"><Legacy slug="evaluation-dataset" names={["prompt-heading"]}/>
      <p id="evaldata-document" className="vp-citation-target">Datasheets for Datasets 建议记录数据的动机、组成、收集、用途与维护安排，也询问样本关系和推荐划分方式。<strong>数据说明让使用者判断这组样本适合测什么。</strong>这些问题应按实际需要选择，并非每份评测集都要机械填写所有项目。<Cite id="evaldata-document"/></p>
      <div className={s.datasetNotes}><div><h3>这次包含什么</h3><p>样本来源、时间范围、分组与缺失信息；哪些能力有覆盖，哪些尚未检查。</p></div><div><h3>与上次有什么不同</h3><p>新增或修正了哪些案例、判据与划分。保留版本，避免把不同题集的成绩直接拼在一起。</p></div></div>
      <p>修正错误答案或更新政策时，记录变化原因，并核对受影响的预期行为。比较系统版本时，尽量用相同的有效案例与判据；案例不得不变化时，就把评测集变化与系统变化分开说明。</p>
      <ArticleAside title="评测数据集与基准测试"><p>数据集提供案例；<ConceptTerm slug="benchmark">基准测试</ConceptTerm> 还组织比较目标、指标和运行约定。公开基准可以帮助了解某类能力，自己的业务数据集则用于检查实际输入。两者都需要说明范围，不能靠样本数量代替质量。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
