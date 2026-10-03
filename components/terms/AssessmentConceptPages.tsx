import { Check, FileText, X } from '@phosphor-icons/react/dist/ssr';
import { ConceptArticle, ArticleSection, ArticleAside, ArticleCitation, ConceptTerm } from './ConceptArticle';
import { ConceptHero } from './ConceptHero';
import { BenchmarkLesson, GraderLesson, EvalDatasetLesson, EvaluationRunLesson, GradingRubricLesson } from './AssessmentConceptLessons';
import { benchmarkSources, graderSources, evalDatasetSources, evaluationRunSources, gradingRubricSources } from '@/lib/assessment-sources';
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
      <p>“A 比 B 好”需要补上条件：在哪组任务、哪个版本、哪种输入和判据下更好？两份成绩使用不同题集，分数差异就可能来自题目本身的变化，不能直接归到能力差别上。对智能体，还要说明可用工具、运行预算（单次任务允许的时间、token 或费用上限）与 <ConceptTerm slug="agent-harness">Harness</ConceptTerm>，因为这些也影响完成任务的能力。</p>
      <p id="bench-protocol" className="vp-citation-target">推理性能基准 MLPerf Inference 区分硬件与软件组成的被测系统、运行场景、准确性检查，以及不同提交类别的约束。<strong>可比条件取决于要比较什么。</strong>测试硬件时硬件本来可以不同；比较模型改动时则要尽量固定其他因素，并记录无法固定的差异。不能把“所有配置都完全相同”当成所有基准的定义；硬件、软件版本和运行协议都可能改变成绩。<Cite id="bench-protocol"/></p>
    </ArticleSection>
    <ArticleSection id="comparison" title="先对齐记录，再看成绩"><Legacy slug="benchmark" names={["scene-heading"]}/>
      <p>下面是两组虚构任务与预先写好的运行摘要，不运行模型或测速。A、B 的输入格式和判据在同一题集内相同。一般任务与业务任务各有十题；切换 B 的记录，可以看到为什么版本不一致时不能直接排名。</p>
      <BenchmarkLesson/>
      <p>一般任务中，B 通过九题，A 通过八题；业务任务中，A 仍通过八题，B 只通过七题。<strong>排名跟着任务集合变化，没有矛盾。</strong>两组任务关注的能力不同。若 B 换成 v2 的十二题，比较记录已经不对应，不能把多通过几题解释成模型更强。</p>
    </ArticleSection>
    <ArticleSection id="dimensions" title="通过更多，还是响应更快" className={base.offset}><Legacy slug="benchmark" names={["quiz-heading"]}/>
      <p id="bench-metrics" className="vp-citation-target">整体评测基准 HELM 同时考察多个场景与准确性、稳健性、效率等维度，并明确评测覆盖仍不完整。<strong>领先哪个指标，与能否满足业务要求，是不同判断。</strong>一个方案通过更多题，也可能等待更久；单一总分会省掉这些差别。延迟的中位数只说明典型请求，不能代表最慢的请求；真实服务还可能要看尾部延迟（最慢那批请求的耗时）、并发负载和失败率。<Cite id="bench-metrics"/></p>
      <div className={s.metricNotes}><div><h3>先核对底线</h3><p>需要达到的正确性、可接受的失败类型、响应时间上限，要来自实际任务要求。</p></div><div><h3>再比较取舍</h3><p>在满足必要条件的方案之间，分别看质量、延迟与费用，不把全部差异压成一个未经解释的数字。</p></div></div>
      <p>本例 A 的延迟中位数更短，却没有因此被宣布为最佳方案。怎样汇总取决于使用场景，数字旁应保留它的测量定义。</p>
    </ArticleSection>
    <ArticleSection id="scope" title="榜单以外的任务"><Legacy slug="benchmark" names={["prompt-heading"]}/>
      <p id="bench-transfer" className="vp-citation-target">Dynabench 讨论固定测试集的局限，让人针对当前模型提出挑战样本，逐轮收集新的评测数据。<strong>在熟悉的基准上得高分，不代表模型能应对新情况，也不一定处理得好自己的业务。</strong>更新评测目标可以暴露原题集没有测到的问题，但版本更新也需要清楚标记，避免混用成绩。<Cite id="bench-transfer"/></p>
      <p>选择方案时，可以先用公开基准了解表现范围，再用自己的 <ConceptTerm slug="evaluation-dataset">评测数据集</ConceptTerm> 检查真实输入、资料缺失、边界情况与关键失败。记录模型版本、运行配置和原始结果，才能在下一次改动后进行有依据的比较。</p>
      <ArticleAside title="基准测试与评测的关系"><p><ConceptTerm slug="eval">评测</ConceptTerm> 是检查系统表现的活动；基准测试通常强调组织好的比较任务与约定。业务内一次提示词改动也可以做评测，不必公开、也不必上榜单。公开与否不决定评测是否严谨。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function GraderTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={graderSources}/>;
  return <ConceptArticle slug="grader" title="评分器" sources={graderSources} sections={[["criterion", "把要求变成可检查的判据"], ["evidence", "回复与实际结果"], ["rubric", "开放回答的评分依据"], ["review", "检查评分器的判断"]]}
    intro={<>评分器根据判据检查一次尝试，输出分数、通过与否或其他评价。判据写错，评测就可能奖励错误行为。需要文件写入成功时，“回答里出现完成”与“目标文件存在且内容正确”检查的是两件事。</>}
    hero={<ConceptHero slug="grader" label="助手说已完成，但文件检查未发现answer.json，回复措辞与任务结果分开"><div className={s.gradeHero}><div><span>助手回复</span><strong>已完成。</strong></div><div><FileText size={25}/><code>answer.json</code><X size={22}/><span>文件不存在</span></div></div></ConceptHero>}>
    <ArticleSection id="criterion" title="把要求变成可检查的判据"><Legacy slug="grader" names={["question"]}/>
      <p id="grader-definition" className="vp-citation-target"><strong>评分器按事先写好的判据（也就是可检查的判定依据），把输出或执行结果转换成评价。</strong>Inspect 的评分系统支持文本匹配、数学答案、模型评分和自定义检查，再把逐条分数汇总成指标。评分器可以是程序，可以是模型，也可以是人。评分器是 <ConceptTerm slug="eval">评测</ConceptTerm> 中的一部分：题目规定要做什么，它规定怎样判断做得如何。<Cite id="grader-definition"/></p>
      <p>判据应对应任务目标。选择题可以检查选项；金额字段可以按数值核对；代码任务可以运行测试。开放回答可能需要评价准确性、相关性或写作质量，但回答写得长、说得自信，本身并不等于准确或相关；除非判据里写明了为什么可以这样判，否则不能拿它们顶替。</p>
      <p>一个任务可以有多个评分器，分别检查格式、结果和关键限制。它们不一定合成一个总分。先保留各项证据，才能看出系统是答案正确但格式不符，还是格式漂亮却做错了任务。</p>
    </ArticleSection>
    <ArticleSection id="evidence" title="回复与实际结果"><Legacy slug="grader" names={["scene-heading"]}/>
      <p id="grader-outcome" className="vp-citation-target">Anthropic 的智能体评测文章区分对话记录与实际环境结果。例如一次尝试声称“已完成”，还应去核查目标操作是否真的发生。<strong>评分需要检查目标对应的证据。</strong>关键词只能证明回复里出现了某个词，文件、数据库或工具的实际结果才可能证明动作真的发生。<Cite id="grader-outcome"/></p>
      <p>本例任务是生成 answer.json，其中 amount 为 120。四次尝试、回复和文件状态都是虚构记录；下方只运行固定检查逻辑，不访问真实文件，也不调用评分模型。先试措辞判据，再换成结果判据。</p>
      <GraderLesson/>
      <p>“已完成”却没有文件，会通过关键词判据；“文件已保存”且内容正确，反而不通过它。关键词检查不是没有用途，它只是<strong>没有测到这个任务的完成条件</strong>。文件存在也不够，还要检查内容里的金额。</p>
      <p id="grader-unscored" className="vp-citation-target">Inspect 的评分策略区分如何处理运行失败，包括保留未评分状态。检查环境不可读时，需要先辨别评测设施问题与任务本身失败。<strong>未评分不应悄悄变成通过，也不能随意当作系统失败。</strong>具体错误怎样计入指标，必须在评测规则中声明；本例选择未评分，表示这一次没有足够证据下结论。<Cite id="grader-unscored"/></p>
    </ArticleSection>
    <ArticleSection id="rubric" title="开放回答的评分依据"><Legacy slug="grader" names={["quiz-heading"]}/>
      <p id="grader-rubric" className="vp-citation-target">G-Eval 研究用模型依据任务说明、评价标准与评价步骤，对生成文本打分。<strong>把“好不好”拆成明确维度，会让评分更容易核对。</strong>论文报告模型评分与人工评分有较高相关性，但这只针对特定摘要与对话任务，不等于任意任务都能正确判分。<Cite id="grader-rubric"/></p>
      <div className={s.rubric}><h3>例：解释退款规则</h3><dl><dt>事实</dt><dd>天数、渠道和费用与提供资料一致。</dd><dt>条件</dt><dd>保留“审核通过后”和“通常”等重要限定。</dd><dt>缺口</dt><dd>资料没有费用时，不自行承诺免费。</dd></dl></div>
      <p>这些是需要分别检查的维度，不能只给评分模型一句“请给出 1 到 5 分”。评分说明还应写清各档意味着什么、遇到缺资料怎样处理，并用人工确认的样本核对评分行为。参考答案有帮助，但不应让合理的不同措辞全都失分。</p>
      <ArticleAside title="代码、模型与人工的分工"><p>明确字段与可执行测试优先交给代码。含义、写作质量等难以枚举的判断可以用模型或人工。人工样本也需要清楚判据；把分歧记录下来，比默认某一方永远正确更有助于修正标准。</p></ArticleAside>
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
  return <ConceptArticle slug="evaluation-dataset" title="评测数据集" sources={evalDatasetSources} sections={[["case", "一条样本的必要信息"], ["split", "把关联样本放在同一组"], ["holdout", "留出集要测新的输入"], ["record", "记录范围与版本"]]}
    intro={<>评测数据集收集用来检查系统表现的输入、必要背景与评价信息。选哪些案例、怎样划分开发与留出样本，决定分数能够说明什么。把几百条问题放在一起，还不足以证明它代表真实任务。</>}
    hero={<ConceptHero slug="evaluation-dataset" label="工单A的两条不同问题作为同一组移动进入开发区，不分散到留出区"><div className={s.dataHero}><div><span>工单 A · 同一背景</span><div><FileText size={17}/>A1 · 配送时间</div><div><FileText size={17}/>A2 · 物流入口</div></div><p><span>开发</span><span>留出</span></p></div></ConceptHero>}>
    <ArticleSection id="case" title="一条样本的必要信息"><Legacy slug="evaluation-dataset" names={["question", "definition"]}/>
      <p id="evaldata-definition" className="vp-citation-target"><strong>评测数据集组织一组可检查的任务样本。</strong>Anthropic 的智能体评测文章强调任务描述与成功标准应明确。样本如果只有一句问题，出题时的资料、环境和预期行为都没有留下，后来就无从重现这道题怎么判；样本数量多，也不等于覆盖了重要输入。<Cite id="evaldata-definition"/></p>
      <div className={s.caseSheet}><span>示例 · 一条退款案例</span><dl><dt>输入</dt><dd>退款多久到账？</dd><dt>背景</dt><dd>线上退款规则：审核通过后，通常三个工作日。</dd><dt>预期行为</dt><dd>回答保留审核条件与通常时效，不新增费用保证。</dd></dl></div>
      <p>有些任务有唯一标准答案，有些更适合记录期望行为与约束；不能为了方便计分，把所有任务改成精确字符串匹配。数据集保存案例，<ConceptTerm slug="grader">评分器</ConceptTerm> 根据这些信息检查尝试，它们承担不同职责。</p>
      <p>案例还应覆盖实际关心的变化：普通输入、资料缺失、模糊追问或关键限制。数量多不一定覆盖广，复制同一类简单问题也不会增加新的判断能力。</p>
    </ArticleSection>
    <ArticleSection id="split" title="把关联样本放在同一组"><Legacy slug="evaluation-dataset" names={["scene-heading"]}/>
      <p id="evaldata-groups" className="vp-citation-target">scikit-learn 的分组交叉验证，是把数据分成训练、测试几部分轮流使用的一种做法；它让同一组样本不同时出现在两侧，例如同一个人的多次记录。<strong>如何定义组，要对应你想检验的新情况：希望系统在哪种没见过的数据上也做对？</strong>若要测试新工单，同一工单的追问应考虑作为关联样本处理，不能仅因句子不同就当作彼此独立；否则测试集可能已经带着开发时见过的背景。<Cite id="evaldata-groups"/></p>
      <p>下面是三个虚构工单、每单两条不同问题。逐行交替会把每个工单拆到两边；按工单分组时，本例固定留出最后一个工单。它没有运行训练或模型，只展示样本归属和覆盖检查。</p>
      <EvalDatasetLesson/>
      <p>开发时读过工单 A 的背景，再用 A 的追问测试，可能借用了已经见过的信息。<strong>把关联样本整体分在同一侧，是针对这种泄漏的措施，不是所有评测都必须按工单划分。</strong>如果目标是检验已知工单的后续处理，划分标准会不同；先说明想检验什么。</p>
    </ArticleSection>
    <ArticleSection id="holdout" title="留出集要测新的输入" className={base.offset}><Legacy slug="evaluation-dataset" names={["quiz-heading"]}/>
      <p id="evaldata-holdout" className="vp-citation-target">Google 的机器学习课程区分训练、验证与测试集，讨论重复样本泄漏，以及反复按测试成绩调整、结果连测试题也被“练”进去的过拟合问题。<strong>留出集一旦被用来决定下一版怎么改，就不再是未见过的检验，应归回开发用例。</strong>调提示词时，开发用例与最终检查用例要分开用途。<Cite id="evaldata-holdout"/></p>
      <p>独立性和覆盖范围也需要分别看。本例按工单分组后，留出组只有 C 的关键问题，没有普通与资料缺失问题。它能检查部分权限行为，却不能据此总结全部业务表现。需要补充不同背景的新工单，而不是把 A、B 的追问重新拆进来。</p>
      <p>发现真实失败，可以把相应案例纳入后续开发并更新版本；同时准备一些没有用于修补的新样本，检验改进能不能推广到没见过的输入。留出集不必永远不变，但每次使用与更新应该能追溯，不能对熟悉题库反复调优后仍宣称未见测试成功。</p>
    </ArticleSection>
    <ArticleSection id="record" title="记录范围与版本"><Legacy slug="evaluation-dataset" names={["prompt-heading"]}/>
      <p id="evaldata-document" className="vp-citation-target">Datasheets for Datasets 建议记录数据的动机、组成、收集、用途与维护安排，也询问样本关系和推荐划分方式。<strong>数据说明让使用者判断这组样本适合测什么。</strong>还要记录版本、时间范围、缺失信息和划分变化；这些问题应按实际需要选择，并非每份评测集都要机械填写所有项目。<Cite id="evaldata-document"/></p>
      <div className={s.datasetNotes}><div><h3>这次包含什么</h3><p>样本来源、时间范围、分组与缺失信息；哪些能力有覆盖，哪些尚未检查。</p></div><div><h3>与上次有什么不同</h3><p>新增或修正了哪些案例、判据与划分。保留版本，避免把不同题集的成绩直接拼在一起。</p></div></div>
      <p>修正错误答案或更新政策时，记录变化原因，并核对受影响的预期行为。比较系统版本时，尽量用相同的有效案例与判据；案例不得不变化时，就把评测集变化与系统变化分开说明。</p>
      <ArticleAside title="评测数据集与基准测试"><p>数据集提供案例；<ConceptTerm slug="benchmark">基准测试</ConceptTerm> 还组织比较目标、指标和运行约定。公开基准可以帮助了解某类能力，自己的业务数据集则用于检查实际输入。两者都需要说明范围，不能靠样本数量代替质量。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function EvaluationRunTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={evaluationRunSources}/>;
  return <ConceptArticle slug="evaluation-run" title="评测运行" subtitle="Evaluation Run · 把一次试跑的条件、轨迹和结果绑在一起" sources={evaluationRunSources}
    sections={[['run-definition', '一次运行到底记录什么'], ['run-evidence', '从试跑到逐项证据'], ['run-compare', '什么时候可以比较'], ['run-boundary', '缺记录时不要补成分数']]}
    intro={<>评测运行是一次具体的评测执行记录：它把哪一版题集、哪一版系统、什么评分器和运行环境放在一起，并留下每道题的尝试、轨迹与汇总结果。看到“9/12”时，先问这十二道题和这些条件是否真的来自同一次、可核对的运行。</>}
    hero={<ConceptHero slug="evaluation-run" label="同一题集的两次运行保留逐项轨迹，切换版本或缺一条轨迹时停止比较"><div className={s.runHero}><div className={s.runHeroHeader}><span>评测运行记录</span><strong>run-18</strong></div><div className={s.runHeroTracks}>{['题集 support-v1', '评分器 rubric-v2', '轨迹 12/12'].map(item => <span key={item}>{item}</span>)}</div><div className={s.runHeroScore}><b>10/12</b><span>逐项证据可回查</span></div></div></ConceptHero>}>
    <ArticleSection id="run-definition" title="一次运行到底记录什么"><Legacy slug="evaluation-run" names={['question', 'definition']}/>
      <p id="evalrun-definition" className="vp-citation-target"><strong>评测运行是把一次评测执行的输入、条件、输出和判断结果放在同一份记录里的实例。</strong>OpenAI 的 evals 文档把评测组织成数据集、被测对象、运行和结果；运行记录让一次“试了什么”能够与后来的分数对应，而不是只留下一个孤立数字。<Cite id="evalrun-definition"/></p>
      <p>先把几个容易混在一起的词拆开：<ConceptTerm slug="evaluation-dataset">评测数据集</ConceptTerm> 保存要问的案例；一次运行把这组案例交给某个被测版本；<ConceptTerm slug="grader">评分器</ConceptTerm> 按判据检查每条尝试；汇总分数只是把逐条结果压缩后的读数。题集、运行和评分器各自变化，都会改变最后看到的数字。</p>
      <p id="evalrun-record" className="vp-citation-target">一条有用的运行记录至少能说明题集及其版本、被测模型或智能体版本、评分器版本、关键运行配置，以及每个样本的输出和状态。OpenAI 的评测流程支持保存运行结果与样本级评分；<strong>记录的价值在于可以从汇总回到具体样本。</strong><Cite id="evalrun-record"/></p>
      <div className={s.runChecklist}><div><span>运行前</span><strong>固定条件</strong><p>题集版本、被测版本、评分器和环境。</p></div><div><span>运行中</span><strong>留下轨迹</strong><p>输入、输出、工具调用与失败状态。</p></div><div><span>运行后</span><strong>汇总但可回查</strong><p>总分旁保留逐项结果，不只存平均数。</p></div></div>
    </ArticleSection>
    <ArticleSection id="run-evidence" title="从试跑到逐项证据"><Legacy slug="evaluation-run" names={['scene-heading']}/>
      <p id="evalrun-trace" className="vp-citation-target">对于会调用工具或经过多步推理的智能体，一次尝试不只有最后一句回复，还可能包括工具调用、环境变化和失败原因。Anthropic 将评测轨迹与任务结果放在一起讨论：要知道为什么通过或失败，必须能回到这条尝试的过程和最终状态。<strong>轨迹是解释运行结果的证据，不是装饰性的日志。</strong><Cite id="evalrun-trace"/></p>
      <p>下面不调用模型，只操作两份固定的虚构运行记录。先看题集、被测版本、评分器和逐项轨迹；再改变一个条件，观察“可以比较”“暂不比较”和“运行不完整”分别如何出现。注意每个数字都来自记录本身，按钮不会凭空重算一个更漂亮的成绩。</p>
      <EvaluationRunLesson/>
      <p id="evalrun-grader" className="vp-citation-target">评分器可以对每条样本给出通过、失败或未评分，再由运行报告汇总。OpenAI 的 graders 文档把评分逻辑与被评测输出分开：同一次运行换了评分器，也可能得到不同分数。<strong>看到汇总变化时，要同时检查逐项评分和评分器版本。</strong><Cite id="evalrun-grader"/></p>
      <p>如果一条轨迹只记录“失败”，还应保留能解释失败的最小证据，例如输入、工具返回、环境状态和评分理由。不同任务需要不同证据；代码任务可能要保存测试输出，知识问答可能需要保存引用与判据命中。运行记录不是把所有调试日志无限堆进去，而是让这次判断可复核。</p>
    </ArticleSection>
    <ArticleSection id="run-compare" title="什么时候可以比较" className={base.offset}><Legacy slug="evaluation-run" names={['quiz-heading']}/>
      <p id="evalrun-compare" className="vp-citation-target">两次运行要比较总分，至少要先对齐想要保持不变的条件：题集及版本、评分器及版本、输入约定、被测系统和相关环境。Anthropic 的评测实践强调任务、成功标准和运行条件要能重现；<strong>“同一批题”不只是题目文字相似，还包括版本和判断规则。</strong><Cite id="evalrun-compare"/></p>
      <p>条件对齐后，汇总差异才有解释空间：本例中 run-18 比 run-17 多通过一题，可以回到第几条轨迹发生了变化。若切换到 support-v2，新增或删除的题目本身就可能改变分母；若评分器从 rubric-v2 换成别的规则，变化也不能直接归因于被测版本。</p>
      <ArticleAside title="先比什么，再比多少"><p>先核对运行身份和可回查证据，再看通过率、延迟或费用。运行报告可以同时保留这些指标，但每个指标都要注明分母、排除项和测量条件；一个总分不能替代全部判断。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="run-boundary" title="缺记录时不要补成分数"><Legacy slug="evaluation-run" names={['prompt-heading']}/>
      <p id="evalrun-boundary" className="vp-citation-target">NIST AI RMF Playbook 将测量、记录和持续评估放在风险管理的治理与测量工作中；记录缺口会限制你能对系统作出的判断。<strong>一条没有输出或轨迹的样本应标为未评分或运行不完整，而不是静默地当成失败或成功。</strong><Cite id="evalrun-boundary"/></p>
      <p>这条边界很实际：运行中途断网、工具超时、评分器无法读取结果时，缺失原因可能来自评测设施，而不是被测系统的能力。把它们都塞进分母，会让分数看似完整却无法解释；把它们都删掉，也可能隐藏某类系统性失败。先记录状态，再按预先声明的规则决定是否重跑、排除或单独报告。</p>
      <p>评测运行也不能证明业务事实本身。它只能说明在给定题集、输入和判断规则下，这次执行留下了什么证据。需要改版本时，保留旧运行；需要更新题集时，给新运行新的身份。这样下一次回看，才能知道变化来自系统、题目、评分器，还是运行环境。</p>
      <ArticleAside title="读一个运行摘要的顺序"><p>先看运行 ID 与时间，再看题集和版本、被测版本、评分器和环境，最后看逐项轨迹及未评分原因。只有这些条件都足够明确，汇总分数才值得进入比较表。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}

export function GradingRubricTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={gradingRubricSources}/>;
  return <ConceptArticle slug="grading-rubric" title="评分规则" subtitle="Grading Rubric · 把“好不好”拆成可核对的要求" sources={gradingRubricSources}
    sections={[['rubric-definition', '评分规则不是一句“请打分”'], ['rubric-dimensions', '把回答拆成多个维度'], ['rubric-calibration', '让不同评分有共同尺度'], ['rubric-boundary', '规则能判断什么，不能判断什么']]}
    intro={<>评分规则把一个开放目标拆成维度、等级和判定依据，让人、程序或模型可以逐项检查。它不是把“感觉不错”换成一个更大的数字，而是先说明哪些证据算满足、缺什么会扣分，以及资料不足时如何停在未评分。</>}
    hero={<ConceptHero slug="grading-rubric" label="一条回答按事实、条件和越界承诺三条规则逐项检查，显示哪些要求满足"><div className={s.rubricHero}><div className={s.rubricHeroAnswer}><span>回答样本</span><strong>审核通过后，通常三个工作日到账。</strong></div><div className={s.rubricHeroChecks}>{['事实准确', '条件保留', '没有越界承诺'].map((item, i) => <span key={item} data-delay={i}>{item}<Check size={17}/></span>)}</div><p>3 / 3 项满足</p></div></ConceptHero>}>
    <ArticleSection id="rubric-definition" title="评分规则不是一句“请打分”"><Legacy slug="grading-rubric" names={['question', 'definition']}/>
      <p id="rubric-definition" className="vp-citation-target"><strong>评分规则（rubric）是一份把任务要求写成可检查维度、等级和证据的说明。</strong>OpenAI 的 graders 文档把评分标准作为评分器输入的一部分：评分器负责执行判定，规则先说明什么结果算好、什么结果不满足。<Cite id="rubric-definition"/></p>
      <p>“请给这段回答打 1 到 5 分”没有告诉评分者怎样区分 2 分和 4 分，也没有告诉它缺少关键资料时该怎么办。一个可用的规则会把任务目标写成几条可以回看的要求，例如事实是否正确、前提是否保留、有没有添加资料没有支持的承诺。评分器是执行者，规则是它执行的标准，两者不要混成同一个词。</p>
      <div className={s.rubricAnatomy}><div><span>维度</span><strong>检查哪件事</strong><p>事实、条件、范围或格式。</p></div><div><span>等级</span><strong>满足到什么程度</strong><p>通过、部分满足、未满足。</p></div><div><span>证据</span><strong>凭什么这样判</strong><p>回答中的句子或外部结果。</p></div></div>
    </ArticleSection>
    <ArticleSection id="rubric-dimensions" title="把回答拆成多个维度"><Legacy slug="grading-rubric" names={['scene-heading']}/>
      <p id="rubric-dimensions" className="vp-citation-target">G-Eval 研究让模型按照任务说明、评价标准与评价步骤进行判断，并将开放式质量拆成更具体的评价过程。<strong>维度拆开后，评分者可以指出是事实错了，还是条件漏了，而不是只留下一个无法解释的总分。</strong><Cite id="rubric-dimensions"/></p>
      <p>下面的固定样本回答同一条退款规则。选择不同回答并运行评分，会看到三个维度分别亮起或变灰；这不是对语言风格的偏好，而是把资料里的事实、条件和禁止越界承诺逐项对照。实际项目可以有更多维度，但每增加一条，都要说明它测什么、证据在哪里。</p>
      <GradingRubricLesson/>
      <p>维度之间也可能冲突：回答事实正确，却因为漏掉重要限制而不满足任务；回答很完整，却添加了资料没有支持的保证。把维度分开保留，后续才能决定是修正系统、补充资料，还是调整规则，而不是盲目追逐总分。</p>
    </ArticleSection>
    <ArticleSection id="rubric-calibration" title="让不同评分有共同尺度" className={base.offset}><Legacy slug="grading-rubric" names={['quiz-heading']}/>
      <p id="rubric-calibration" className="vp-citation-target">智能体评测需要明确任务和成功标准，并用样本检查评分是否与目标一致。Anthropic 的评测实践强调先定义成功，再用真实任务验证评测；<strong>规则写得越清楚，人工、程序和模型评分才越有机会落在同一尺度上。</strong><Cite id="rubric-calibration"/></p>
      <p>校准可以从一小组共同样本开始：让两位评分者独立应用规则，比较分歧，补充“通常”“资料不足”“无法观察”等边界的写法，再重新评分。规则变更要记录版本；否则下一次分数变化时，你无法区分回答变好了，还是评分方式变宽了。</p>
      <ArticleAside title="等级不是越多越精确"><p>三档足够表达通过、部分满足和未满足时，不必为了看起来精细而加到十档。等级太多却没有稳定证据，可能只制造假精度。先让相邻等级有可观察差别，再决定是否需要更细。</p></ArticleAside>
    </ArticleSection>
    <ArticleSection id="rubric-boundary" title="规则能判断什么，不能判断什么"><Legacy slug="grading-rubric" names={['prompt-heading']}/>
      <p id="rubric-boundary" className="vp-citation-target">Inspect 的评分系统区分不同评分方法与未评分情况，提醒评测设计者明确运行失败、证据不足和任务失败怎样进入结果。<strong>规则只能根据声明的证据判断，不应把看不到的事实当成已满足。</strong><Cite id="rubric-boundary"/></p>
      <p>如果回答声称“已经退款”，但运行记录没有实际支付状态，规则最多能判断它是否使用了合适的措辞，不能证明退款真的发生。若工具超时导致结果不可读，应标为未评分或设施失败，不能随意给零分。规则也不能替代业务政策：政策改变后，先更新规则和样本，再解释新旧分数。</p>
      <p>最后检查规则是否测到了真正的目标：它是否奖励了真实结果，而不是长度、自信语气或某个固定短语？保留逐项理由、规则版本和样本证据，才能在一次异常评分后回到具体判断。</p>
      <ArticleAside title="评分规则的最小审查表"><p>每条维度都应回答：检查什么、需要什么证据、缺证据怎样处理、与相邻等级差在哪里。四个问题有一个答不上来，就先把规则当成草稿。</p></ArticleAside>
    </ArticleSection>
  </ConceptArticle>;
}
