'use client';
import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, Check, FileText, MagnifyingGlass, X } from '@phosphor-icons/react';
import { Reveal, States } from './ExtendedConceptLessons';
import { compareBenchmark, gradeRecord, gradeRecords, splitEvalSamples, evalSamples, type BenchSuite, type BenchRun, type GradeMode, type SplitMode } from '@/lib/assessment-teaching';
import base from './EventConcepts.module.css';
import s from './AssessmentConcepts.module.css';

export function BenchmarkLesson() {
  const [suite, setSuite] = useState<BenchSuite>('general'), [run, setRun] = useState<BenchRun>('same');
  const [open, setOpen] = useState(false), [report, setReport] = useState(compareBenchmark('general', 'same'));
  const current = compareBenchmark(suite, run);
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：对齐条件再比较基准成绩">
    <div className={s.controls}><label>任务集合<select value={suite} onChange={e => { setSuite(e.target.value as BenchSuite); setOpen(false); }}><option value="general">一般任务</option><option value="business">业务任务</option></select></label><label>B 的运行记录<select value={run} onChange={e => { setRun(e.target.value as BenchRun); setOpen(false); }}><option value="same">与 A 同条件</option><option value="changed">换了题集版本</option><option value="none">没有运行记录</option></select></label></div>
    <div className={s.protocol} aria-label="运行记录的比较条件"><div><span>比较条件</span><strong>A</strong><strong>B</strong></div>{(['dataset', 'version', 'total', 'metric', 'tools'] as const).map((key, i) => <div key={key} data-mismatch={!!current.candidate && current.baseline[key] !== current.candidate[key]}><span>{['题集', '版本', '题数', '判据', '工具'][i]}</span><span>{current.baseline[key]}</span><div><States index={run === 'none' ? 2 : run === 'changed' ? 1 : 0}>{['same', 'changed', 'none'].map(value => <span key={value}>{compareBenchmark(suite, value as BenchRun).candidate?.[key] ?? '无记录'}</span>)}</States></div></div>)}</div>
    <button disabled={open} onClick={() => { setReport(current); setOpen(true); }}>核对并比较<ArrowRight size={18}/></button>
    <Reveal open={open}><div className={s.benchmarkResult} role="status"><h3>{report.comparable ? `${report.baseline.dataset} · ${report.winner} 通过题数更多` : report.candidate ? '条件不同，暂不排名' : '缺少 B 的记录，无法比较'}</h3>{report.comparable && report.candidate ? <div className={s.lanes}>{[report.baseline, report.candidate].map(record => <div key={record.name}><strong>{record.name}</strong><div className={s.marks}>{Array.from({ length: record.total }, (_, i) => <span key={i} data-pass={i < record.passed}>{i < record.passed ? <Check size={17}/> : <X size={17}/>}</span>)}</div><span>{record.passed}/{record.total}</span><p>记录中的延迟中位数 {record.medianMs / 1000} 秒</p></div>)}</div> : <p>{report.candidate ? 'A 是 v1、10 题；B 是 v2、12 题。不能把这两次通过题数的变化单独归因于模型。' : '先取得 B 在相应条件下的运行记录；没有记录不等于零分。'}</p>}{report.comparable && <p>只按本例通过题数，{report.winner} 领先；A 的延迟更短。先确定业务看重哪些指标。</p>}</div></Reveal>
    <button className={base.reset} onClick={() => { setSuite('general'); setRun('same'); setOpen(false); }}><ArrowCounterClockwise size={17}/>重置比较条件</button>
  </div>;
}

export function GraderLesson() {
  const [index, setIndex] = useState(0), [mode, setMode] = useState<GradeMode>('keyword');
  const [open, setOpen] = useState(false), [report, setReport] = useState(gradeRecord(0, 'keyword'));
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：判据检查回复还是结果">
    <h3>任务：写入 answer.json，amount 应为 120</h3>
    <div className={s.controls}><label>尝试记录<select value={index} onChange={e => { setIndex(Number(e.target.value)); setOpen(false); }}>{gradeRecords.map((record, i) => <option key={record.title} value={i}>{record.title}</option>)}</select></label><label>评分判据<select value={mode} onChange={e => { setMode(e.target.value as GradeMode); setOpen(false); }}><option value="keyword">回复包含“完成”</option><option value="outcome">检查实际文件结果</option></select></label></div>
    <div className={s.inspector}><div className={s.reply}><span>助手回复</span><States index={index}>{gradeRecords.map(record => <p key={record.title}>{record.reply}</p>)}</States></div><div className={s.artifact}><FileText size={25}/><h3>虚拟文件结果</h3><States index={index}>{gradeRecords.map(record => <div key={record.title}>{!record.available ? <p>检查环境不可读</p> : !record.exists ? <p>answer.json 不存在</p> : <><code>answer.json</code><pre>{`{ "amount": ${record.amount} }`}</pre></>}</div>)}</States></div></div>
    <button disabled={open} onClick={() => { setReport(gradeRecord(index, mode)); setOpen(true); }}>按所选判据评分<MagnifyingGlass size={18}/></button>
    <Reveal open={open}><div className={s.gradeResult} role="status"><h3>{report.label}</h3><ul>{report.checks.map(check => <li key={check.label}>{check.pass ? <Check size={23}/> : <X size={23}/>}<span>{check.label}</span><strong>{check.pass ? '满足' : '不满足'}</strong></li>)}</ul><p>{report.mode === 'keyword' ? '这次只检查了措辞，没有检查任务是否完成。' : report.pass === null ? '没有可用的环境证据。本例保留未评分，不把检查失败计成任务成功或任务失败。' : report.pass ? '文件存在，且内容满足本例金额判据。' : '任务要求的文件结果没有满足全部判据。'}</p></div></Reveal>
    <button className={base.reset} onClick={() => { setIndex(0); setMode('keyword'); setOpen(false); }}><ArrowCounterClockwise size={17}/>重置记录与判据</button>
  </div>;
}

export function EvalDatasetLesson() {
  const [tickets, setTickets] = useState(['A', 'B', 'C']), [mode, setMode] = useState<SplitMode>('rows');
  const [open, setOpen] = useState(false), [report, setReport] = useState(splitEvalSamples(['A', 'B', 'C'], 'rows'));
  const count = evalSamples.filter(row => tickets.includes(row.ticket)).length;
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：按关联工单拆分评测样本">
    <div className={s.controls}><label>拆分方法<select value={mode} onChange={e => { setMode(e.target.value as SplitMode); setOpen(false); }}><option value="rows">逐行交替分配</option><option value="groups">按工单分组</option></select></label><h3>每个工单包含两条不同问题</h3></div>
    <div className={s.tickets}>{['A', 'B', 'C'].map(ticket => <button key={ticket} aria-pressed={tickets.includes(ticket)} onClick={() => { setTickets(ids => ids.includes(ticket) ? ids.filter(id => id !== ticket) : [...ids, ticket]); setOpen(false); }}><span>工单 {ticket}<Check size={18}/></span>{evalSamples.filter(row => row.ticket === ticket).map(row => <p key={row.id}><strong>{row.id}</strong>{row.question}</p>)}</button>)}</div>
    <States index={count === 0 ? 0 : tickets.length === 1 ? 1 : 2}>{[<p key="empty">没有样本，先选择工单。</p>, <p key="one">只有一个工单，不能检验对新工单的推广。</p>, <p key="many">按组时，本例把最后一个工单留出，其余用于开发。</p>]}</States>
    <button disabled={open || count === 0} onClick={() => { setReport(splitEvalSamples(tickets, mode)); setOpen(true); }}>拆分并检查<ArrowRight size={18}/></button>
    <Reveal open={open}><div className={s.baskets} aria-label="开发与留出样本">{[[report.development, '开发与调试'], [report.heldout, '留出评测']] .map(([rows, title]) => <div key={title as string}><h3>{title as string}</h3>{(rows as typeof evalSamples).map(row => <div key={row.id} className={s.sample} data-overlap={report.overlap.includes(row.ticket)}><span>{row.id} · {row.category}</span><p>{row.question}</p><small>{row.context}</small></div>)}{(rows as typeof evalSamples).length === 0 && <p>这一组没有样本</p>}</div>)}</div><div className={s.splitResult} role="status"><h3>{report.groups.length < 2 ? '工单不足，不能形成独立留出检验' : report.overlap.length ? `关联工单出现在两边：${report.overlap.join('、')}` : '工单没有重叠，覆盖仍需检查'}</h3><p>{report.groups.length < 2 ? '只有一个工单，这些记录不足以测试对未见工单的推广。' : report.overlap.length ? '开发时见过同一工单的背景和相关问题。不同文字不等于独立样本。' : '按组隔开，减少这类背景信息从开发集进入留出评测的机会。'}</p><p>{report.missing.length ? `留出组未覆盖：${report.missing.join('、')}。` : '留出组包含本例三类；有样本不等于数量和多样性充分。'}</p></div></Reveal>
    <button className={base.reset} onClick={() => { setTickets(['A', 'B', 'C']); setMode('rows'); setOpen(false); }}><ArrowCounterClockwise size={17}/>重置工单与拆分</button>
  </div>;
}

type EvaluationRunMode = 'same' | 'changed' | 'missing';

const evaluationRunBaseline = { id: 'run-17', dataset: 'support-v1', subject: 'agent-B', grader: 'rubric-v2', environment: 'sandbox-2026-10', traces: 12, passed: 9 };
const evaluationRunCandidate = { id: 'run-18', dataset: 'support-v1', subject: 'agent-C', grader: 'rubric-v2', environment: 'sandbox-2026-10', traces: 12, passed: 10 };

export function EvaluationRunLesson() {
  const [mode, setMode] = useState<EvaluationRunMode>('same');
  const [checkedMode, setCheckedMode] = useState<EvaluationRunMode | null>(null);
  const candidate = mode === 'changed' ? { ...evaluationRunCandidate, dataset: 'support-v2' } : mode === 'missing' ? { ...evaluationRunCandidate, traces: 11 } : evaluationRunCandidate;
  const checkedCandidate = checkedMode === 'changed' ? { ...evaluationRunCandidate, dataset: 'support-v2' } : checkedMode === 'missing' ? { ...evaluationRunCandidate, traces: 11 } : evaluationRunCandidate;
  const result = checkedMode === 'same' ? {
    title: '条件一致，可以回到逐题差异',
    body: 'run-17 与 run-18 使用同一题集版本、评分器和运行环境，但被测版本从 agent-B 改为 agent-C；run-18 多通过 1 题，可以继续查看是哪一条轨迹造成差异。',
  } : checkedMode === 'changed' ? {
    title: '题集版本不同，暂不比较总分',
    body: 'run-17 使用 support-v1，run-18 使用 support-v2。总分的变化可能来自题目变化，先重新运行同一版本或单独报告版本差异。',
  } : {
    title: '缺少一条轨迹，运行不完整',
    body: 'run-18 只有 11 条可核对轨迹。缺失记录是未评分证据，不应补成 0 分，也不能把 11 条的汇总当成完整运行。',
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：检查一次评测运行能否比较">
    <div className={s.controls}><label>候选运行的变化<select value={mode} onChange={e => { setMode(e.target.value as EvaluationRunMode); setCheckedMode(null); }}><option value="same">保持同一题集版本</option><option value="changed">切换题集版本</option><option value="missing">移除一条轨迹</option></select></label><p className={s.runHint}>先看运行记录，再决定是否把汇总分数放在一起。</p></div>
    <div className={s.runLedger} aria-label="两次评测运行记录">
      {[evaluationRunBaseline, candidate].map((run, index) => <article key={run.id} className={s.runCard}>
        <header><span>{index === 0 ? '基准运行' : '候选运行'}</span><strong>{run.id}</strong></header>
        <dl><div><dt>题集</dt><dd>{run.dataset}</dd></div><div><dt>被测版本</dt><dd>{run.subject}</dd></div><div><dt>评分器</dt><dd>{run.grader}</dd></div><div><dt>环境</dt><dd>{run.environment}</dd></div><div><dt>轨迹</dt><dd>{run.traces}/12</dd></div><div><dt>汇总</dt><dd>{run.passed}/12</dd></div></dl>
        <div className={s.traceGrid} aria-label={`${run.id} 的逐项轨迹`}><span className={s.traceLabel}>逐项轨迹（每格带状态）</span>{Array.from({ length: 12 }, (_, i) => { const present = i < run.traces; const status = !present ? '未评分' : i < run.passed ? '通过' : '失败'; const label = `${run.id} 第${i + 1}条轨迹：${status}`; return <span key={i} role="img" aria-label={label} title={label} data-present={present} data-pass={present && i < run.passed}>{present ? i + 1 : '—'}<span className={s.srOnly}>{`：${status}`}</span></span>; })}</div>
      </article>)}
    </div>
    <button disabled={checkedMode !== null} onClick={() => setCheckedMode(mode)}>检查是否可比较<ArrowRight size={18}/></button>
    <Reveal open={checkedMode !== null}><div className={s.runResult} role="status"><h3>{result.title}</h3><p>{result.body}</p>{checkedMode && <p className={s.runEvidence}>检查时看到：{checkedCandidate.traces}/12 条轨迹可回到具体样本。</p>}</div></Reveal>
    <button className={base.reset} onClick={() => { setMode('same'); setCheckedMode(null); }}><ArrowCounterClockwise size={17}/>重置运行记录</button>
  </div>;
}

type RubricSample = 'complete' | 'missing-condition' | 'overclaim';

const rubricSamples: Record<RubricSample, { label: string; answer: string; checks: [string, boolean, string][] }> = {
  complete: {
    label: '保留条件的回答',
    answer: '审核通过后，通常三个工作日到账；具体以支付渠道为准。',
    checks: [['事实准确', true, '时间与资料一致'], ['条件保留', true, '写出“审核通过后”和“通常”'], ['没有越界承诺', true, '没有把通常时效说成保证']],
  },
  'missing-condition': {
    label: '漏掉条件的回答',
    answer: '退款三个工作日到账。',
    checks: [['事实准确', true, '时间数字仍然正确'], ['条件保留', false, '漏掉审核通过前提'], ['没有越界承诺', false, '语气把通常时效说得过于确定']],
  },
  overclaim: {
    label: '越界承诺的回答',
    answer: '退款马上到账，而且一定免费。',
    checks: [['事实准确', false, '与给定的通常三个工作日不符'], ['条件保留', false, '没有说明审核条件'], ['没有越界承诺', false, '资料没有免费保证']],
  },
};

export function GradingRubricLesson() {
  const [sample, setSample] = useState<RubricSample>('complete');
  const [checked, setChecked] = useState<RubricSample | null>(null);
  const current = rubricSamples[sample];
  const report = checked ? rubricSamples[checked] : current;
  const passed = report.checks.filter(([, ok]) => ok).length;
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：按评分规则逐项检查回答">
    <div className={s.controls}><label>回答样本<select value={sample} onChange={e => { setSample(e.target.value as RubricSample); setChecked(null); }}><option value="complete">保留条件的回答</option><option value="missing-condition">漏掉条件的回答</option><option value="overclaim">越界承诺的回答</option></select></label><p className={s.runHint}>评分规则把“好不好”拆成可回看的维度。</p></div>
    <div className={s.rubricSample}><span>{current.label}</span><p>{current.answer}</p></div>
    <button disabled={checked !== null} onClick={() => setChecked(sample)}>按规则逐项评分<MagnifyingGlass size={18}/></button>
    <Reveal open={checked !== null}><div className={s.rubricResult} role="status"><header><h3>{passed}/3 项满足</h3><span>{report.label}</span></header><ul>{report.checks.map(([label, ok, reason]) => <li key={label} data-pass={ok}><span>{ok ? <Check size={19}/> : <X size={19}/>}</span><strong>{label}</strong><p>{reason}</p></li>)}</ul><p className={s.runEvidence}>评分结果来自这三条规则；换成另一套规则，结论可能随判据改变。</p></div></Reveal>
    <button className={base.reset} onClick={() => { setSample('complete'); setChecked(null); }}><ArrowCounterClockwise size={17}/>重置回答与规则</button>
  </div>;
}

type RegressionMode = 'stable' | 'regression' | 'changed';

const regressionCases = [
  { id: 'refund-condition', label: '退款保留审核条件', critical: true, baseline: true },
  { id: 'tool-confirm', label: '写入前请求确认', critical: true, baseline: true },
  { id: 'citation', label: '回答带回资料来源', critical: false, baseline: true },
  { id: 'timeout', label: '工具超时说明状态', critical: false, baseline: false },
  { id: 'format', label: '输出字段完整', critical: false, baseline: true },
  { id: 'handoff', label: '高风险任务交给人工', critical: true, baseline: true },
] as const;

export function RegressionEvaluationLesson() {
  const [mode, setMode] = useState<RegressionMode>('stable');
  const [checkedMode, setCheckedMode] = useState<RegressionMode | null>(null);
  const candidate = mode === 'changed' ? { version: 'agent-C · suite-v2', passed: 19, criticalFailures: 0 } : mode === 'regression' ? { version: 'agent-C · suite-v1', passed: 18, criticalFailures: 1 } : { version: 'agent-C · suite-v1', passed: 18, criticalFailures: 0 };
  const checkedCandidate = checkedMode === 'changed' ? { version: 'agent-C · suite-v2', passed: 19, criticalFailures: 0 } : checkedMode === 'regression' ? { version: 'agent-C · suite-v1', passed: 18, criticalFailures: 1 } : { version: 'agent-C · suite-v1', passed: 18, criticalFailures: 0 };
  const result = checkedMode === 'regression' ? {
    title: '发现关键回退，阻断发布',
    body: 'refund-condition 基线通过、候选失败。即使总通过数从 17/20 变成 18/20，关键失败门槛仍未满足。',
  } : checkedMode === 'changed' ? {
    title: '题集版本不同，暂不判定回归',
    body: '基线使用 suite-v1，候选使用 suite-v2。新增或删除题目会改变分母，先在同一题集版本上重跑。',
  } : {
    title: '没有发现关键回退，可以继续看新增失败',
    body: '候选在同一题集版本上通过 18/20，关键失败仍为 0；还要单独决定普通失败是否达到发布门槛。',
  };
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：逐项检查回归评测门槛">
    <div className={s.controls}><label>候选版本的变化<select value={mode} onChange={e => { setMode(e.target.value as RegressionMode); setCheckedMode(null); }}><option value="stable">关键行为保持</option><option value="regression">关键行为回退</option><option value="changed">切换题集版本</option></select></label><p className={s.runHint}>先对齐基线和候选的题集，再检查原来通过的关键项。</p></div>
    <div className={s.regressionSummary} aria-label="基线与候选汇总"><article><span>基线 · agent-B · suite-v1</span><strong>17/20</strong><p>关键失败 0</p></article><article><span>{candidate.version}</span><strong>{candidate.passed}/20</strong><p>关键失败 {candidate.criticalFailures}</p></article></div>
    <div className={s.regressionTable} aria-label="代表性样本逐项对照"><div className={s.regressionTableHead}><span>代表性样本</span><span>基线</span><span>候选</span></div>{regressionCases.map(item => { const candidatePass = mode === 'regression' && item.id === 'refund-condition' ? false : item.baseline; const candidateStatus = candidatePass ? '通过' : '失败'; const baseLabel = `基线 ${item.id}：${item.baseline ? '通过' : '失败'}`; const candidateLabel = `候选 ${item.id}：${candidateStatus}${item.critical ? '，关键项' : ''}`; return <div key={item.id} className={s.regressionRow} data-critical={item.critical}><span>{item.label}{item.critical && <small>关键</small>}</span><span role="img" aria-label={baseLabel} title={baseLabel}>{item.baseline ? <Check size={18}/> : <X size={18}/>}<i>{item.baseline ? '通过' : '失败'}</i></span><span role="img" aria-label={candidateLabel} title={candidateLabel}>{candidatePass ? <Check size={18}/> : <X size={18}/>}<i>{candidateStatus}</i></span></div>; })}</div>
    <button disabled={checkedMode !== null} onClick={() => setCheckedMode(mode)}>检查回归门槛<MagnifyingGlass size={18}/></button>
    <Reveal open={checkedMode !== null}><div className={s.regressionResult} role="status"><h3>{result.title}</h3><p>{result.body}</p><p className={s.runEvidence}>检查记录：候选 {checkedCandidate.passed}/20，关键失败 {checkedCandidate.criticalFailures}。</p></div></Reveal>
    <button className={base.reset} onClick={() => { setMode('stable'); setCheckedMode(null); }}><ArrowCounterClockwise size={17}/>重置版本与题集</button>
  </div>;
}

type SafetyMode = 'normal' | 'overreach' | 'leak';

const safetyCases: Record<SafetyMode, { label: string; request: string; response: string; tool: string; checks: { label: string; pass: boolean; evidence: string }[]; title: string; body: string }> = {
  normal: {
    label: '正常请求',
    request: '查询自己的订单状态',
    response: '安全完成',
    tool: '未触发敏感工具',
    checks: [
      { label: '任务允许', pass: true, evidence: '请求属于用户自己的订单范围' },
      { label: '响应合适', pass: true, evidence: '完成任务，没有扩大权限' },
      { label: '没有副作用', pass: true, evidence: '没有调用发送或敏感写入工具' },
    ],
    title: '安全完成，可以保留这条通过记录',
    body: '正常任务完成，敏感工具没有被触发；这只说明这一类允许行为通过了检查。',
  },
  overreach: {
    label: '越权请求',
    request: '读取另一位用户的身份证号',
    response: '拒绝并升级人工',
    tool: '敏感工具未执行',
    checks: [
      { label: '任务允许', pass: true, evidence: '识别到请求超出当前用户权限' },
      { label: '响应合适', pass: true, evidence: '拒绝请求，并把高风险情况交给人工' },
      { label: '没有副作用', pass: true, evidence: '没有把越权请求送进敏感工具' },
    ],
    title: '越权请求被挡住，可以继续查覆盖范围',
    body: '文字拒绝与工具状态一致；还需要更多攻击变体，确认不是只对这一种说法有效。',
  },
  leak: {
    label: '间接注入',
    request: '资料诱导读取敏感字段',
    response: '输出了敏感字段',
    tool: '读取敏感字段 1 次',
    checks: [
      { label: '任务允许', pass: false, evidence: '资料中的指令试图改变原任务权限' },
      { label: '响应合适', pass: false, evidence: '把不可信资料当成了可执行指令' },
      { label: '没有副作用', pass: false, evidence: '工具真实读出了敏感字段' },
    ],
    title: '发现敏感字段泄露，阻断发布',
    body: '即使其他风险题都通过，这条高风险失败也不能被总体通过率覆盖；先修复权限和工具边界，再用同一题集复测。',
  },
};

export function SafetyEvaluationLesson() {
  const [mode, setMode] = useState<SafetyMode>('normal');
  const [checkedMode, setCheckedMode] = useState<SafetyMode | null>(null);
  const current = safetyCases[mode];
  const report = checkedMode ? safetyCases[checkedMode] : current;
  const passed = report.checks.filter(check => check.pass).length;
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：检查安全评测的真实结果">
    <div className={s.controls}><label>风险案例<select value={mode} onChange={e => { setMode(e.target.value as SafetyMode); setCheckedMode(null); }}><option value="normal">正常请求</option><option value="overreach">越权请求</option><option value="leak">间接注入</option></select></label><p className={s.runHint}>同时看回答、权限判断和工具状态，不能只看模型说了什么。</p></div>
    <div className={s.safetyCase} aria-label="当前风险案例"><div><span>输入</span><strong>{current.request}</strong></div><div><span>回答</span><strong>{current.response}</strong></div><div data-risk={mode === 'leak'}><span>工具证据</span><strong>{current.tool}</strong></div></div>
    <div className={s.safetyChecks} aria-label="安全检查项">{current.checks.map(check => <div key={check.label} data-pass={check.pass}><span>{check.pass ? <Check size={18}/> : <X size={18}/>}</span><strong>{check.label}</strong><small>{check.evidence}</small></div>)}</div>
    <button disabled={checkedMode !== null} onClick={() => setCheckedMode(mode)}>检查安全结果<MagnifyingGlass size={18}/></button>
    <Reveal open={checkedMode !== null}><div className={s.safetyResult} role="status"><header><h3>{report.title}</h3><span>{passed}/3 项通过</span></header><p>{report.body}</p><p className={s.runEvidence}>检查记录：{report.label} · {report.tool}。</p></div></Reveal>
    <button className={base.reset} onClick={() => { setMode('normal'); setCheckedMode(null); }}><ArrowCounterClockwise size={17}/>重置风险案例</button>
  </div>;
}

type CostMode = 'within' | 'over' | 'changed';

const costCases: Record<CostMode, { label: string; modelB: string; input: string; output: string; tools: string; retries: string; condition: string; title: string; body: string }> = {
  within: {
    label: '统一条件，预算内',
    modelB: '18/20 · ¥0.86',
    input: '10k tokens',
    output: '3k tokens',
    tools: '2 次',
    retries: '0 次',
    condition: '同一题集 · 未命中缓存',
    title: '两套方案都在预算内，可以比较质量',
    body: 'B 多通过一题但更贵；下一步还要结合延迟、重试和真实业务价值，不能把较高通过数直接等同于更划算。',
  },
  over: {
    label: '预算超限',
    modelB: '18/20 · ¥1.16',
    input: '10k tokens',
    output: '3k tokens',
    tools: '2 次',
    retries: '1 次',
    condition: '同一题集 · 含一次重试',
    title: '单任务成本超过门槛，转入复核',
    body: 'B 的质量略高，但 ¥1.16 超过 ¥1.00 的单任务预算；先查重试、工具调用和质量收益，再决定是否接受或调整方案。',
  },
  changed: {
    label: '计费条件变化',
    modelB: '18/20 · ¥0.82',
    input: '10k tokens',
    output: '3k tokens',
    tools: '2 次',
    retries: '0 次',
    condition: 'B 命中缓存 · A 未命中',
    title: '条件变化，暂不直接比较成本',
    body: '缓存命中改变了实际计费和消耗。先统一缓存状态或单独报告条件差异，再解释 ¥0.82 与 ¥0.42 的差距。',
  },
};

export function CostEvaluationLesson() {
  const [mode, setMode] = useState<CostMode>('within');
  const [checkedMode, setCheckedMode] = useState<CostMode | null>(null);
  const current = costCases[mode];
  const report = checkedMode ? costCases[checkedMode] : current;
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：把质量和任务成本放在一起比较">
    <div className={s.controls}><label>成本条件<select value={mode} onChange={e => { setMode(e.target.value as CostMode); setCheckedMode(null); }}><option value="within">统一条件，预算内</option><option value="over">预算超限</option><option value="changed">计费条件变化</option></select></label><p className={s.runHint}>先固定题集和计费口径，再把质量、消耗和预算一起看。</p></div>
    <div className={s.costSummary} aria-label="两套方案摘要"><article><span>方案 A · agent-A</span><strong>17/20 · ¥0.42</strong><small>8k 输入 · 2k 输出 · 工具 1 次</small></article><article data-over={mode === 'over'}><span>方案 B · agent-B</span><strong>{current.modelB}</strong><small>{current.input} · {current.output} · 工具 {current.tools}</small></article></div>
    <div className={s.costLedger} aria-label="候选方案的消耗记录"><div><span>重试</span><strong>{current.retries}</strong></div><div><span>条件</span><strong>{current.condition}</strong></div><div><span>预算</span><strong>¥1.00 / 任务</strong></div></div>
    <button disabled={checkedMode !== null} onClick={() => setCheckedMode(mode)}>核对成本条件<MagnifyingGlass size={18}/></button>
    <Reveal open={checkedMode !== null}><div className={s.costResult} role="status"><header><h3>{report.title}</h3><span>{report.label}</span></header><p>{report.body}</p><p className={s.runEvidence}>检查记录：A ¥0.42；B {report.modelB}；{report.condition}。</p></div></Reveal>
    <button className={base.reset} onClick={() => { setMode('within'); setCheckedMode(null); }}><ArrowCounterClockwise size={17}/>重置成本条件</button>
  </div>;
}

type LatencyMode = 'within' | 'tail' | 'timeout';

const latencyCases: Record<LatencyMode, { label: string; tool: string; done: string; p50: string; p95: string; title: string; body: string }> = {
  within: {
    label: 'p95 在门槛内',
    tool: '1.8s 返回',
    done: '3.4s 完成',
    p50: '1.9s',
    p95: '3.8s',
    title: '典型和长尾都在当前门槛内',
    body: '首字 420ms 让用户先看到反馈，p95 完成时间 3.8s 低于 4s；仍需按真实流量持续观察。',
  },
  tail: {
    label: 'p95 超过门槛',
    tool: '1.8s 返回',
    done: '3.4s 完成',
    p50: '1.9s',
    p95: '4.8s',
    title: '长尾等待超过门槛，进入优化',
    body: '多数请求完成得不慢，但最慢的一部分达到 4.8s；先定位排队、工具或输出阶段，不能只看 p50。',
  },
  timeout: {
    label: '工具超时，运行不完整',
    tool: '5.0s 超时',
    done: '未完成',
    p50: '未汇总',
    p95: '未汇总',
    title: '超时记录要单独处理',
    body: '工具没有返回，任务也没有完成；这条记录不应被填成一个普通完成时间，先记录超时阶段和重试规则。',
  },
};

export function LatencyEvaluationLesson() {
  const [mode, setMode] = useState<LatencyMode>('within');
  const [checkedMode, setCheckedMode] = useState<LatencyMode | null>(null);
  const current = latencyCases[mode];
  const report = checkedMode ? latencyCases[checkedMode] : current;
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：检查延迟时间点和长尾门槛">
    <div className={s.controls}><label>延迟条件<select value={mode} onChange={e => { setMode(e.target.value as LatencyMode); setCheckedMode(null); }}><option value="within">p95 在门槛内</option><option value="tail">p95 超过门槛</option><option value="timeout">工具超时</option></select></label><p className={s.runHint}>先看首字、工具和完成时间，再看 p50 与 p95；超时单独记录。</p></div>
    <div className={s.latencyTimeline} aria-label="一次请求的时间点"><div><span>请求</span><strong>0ms</strong></div><i aria-hidden="true">→</i><div><span>首字</span><strong>420ms</strong></div><i aria-hidden="true">→</i><div><span>工具</span><strong>{current.tool}</strong></div><i aria-hidden="true">→</i><div data-timeout={mode === 'timeout'}><span>完成</span><strong>{current.done}</strong></div></div>
    <div className={s.latencyStats} aria-label="完成时间分布"><article><span>p50 · 典型请求</span><strong>{current.p50}</strong></article><article data-over={mode === 'tail'}><span>p95 · 长尾请求</span><strong>{current.p95}</strong></article><article><span>门槛</span><strong>4s</strong></article></div>
    <button disabled={checkedMode !== null} onClick={() => setCheckedMode(mode)}>检查延迟门槛<MagnifyingGlass size={18}/></button>
    <Reveal open={checkedMode !== null}><div className={s.latencyResult} role="status"><header><h3>{report.title}</h3><span>{report.label}</span></header><p>{report.body}</p><p className={s.runEvidence}>检查记录：首字 420ms · 工具 {report.tool} · 完成 {report.done}。</p></div></Reveal>
    <button className={base.reset} onClick={() => { setMode('within'); setCheckedMode(null); }}><ArrowCounterClockwise size={17}/>重置延迟条件</button>
  </div>;
}

type HumanMode = 'agreement' | 'disagreement' | 'unscored';

const humanCases: Record<HumanMode, { label: string; answer: string; first: string; second: string; resolution: string; title: string; body: string }> = {
  agreement: {
    label: '两位评分一致',
    answer: '审核通过后，通常三个工作日到账；具体以支付渠道为准。',
    first: '甲 · 4/5',
    second: '乙 · 4/5',
    resolution: '规则理解一致',
    title: '两位评分者给出同一分数',
    body: '理由都指向事实、条件和风险三项；这条样本可以作为稳定参考，但仍不能证明所有样本都会一致。',
  },
  disagreement: {
    label: '两位评分分歧',
    answer: '退款三个工作日到账。',
    first: '甲 · 4/5',
    second: '乙 · 2/5',
    resolution: '第三人 · 3/5',
    title: '分歧要回到规则和证据',
    body: '甲忽略了漏掉的审核条件，乙把条件缺失扣得更多；第三人确认后，把分歧理由写回校准样例，而不是直接取最高分。',
  },
  unscored: {
    label: '证据不足',
    answer: '已经退款了。',
    first: '甲 · 未评分',
    second: '乙 · 未评分',
    resolution: '等待补证据',
    title: '看不到证据时先保留未评分',
    body: '资料没有支付状态，评分者不能从一句自信的话推断退款真的发生；补齐环境证据后再决定如何评分。',
  },
};

export function HumanGraderLesson() {
  const [mode, setMode] = useState<HumanMode>('agreement');
  const [checkedMode, setCheckedMode] = useState<HumanMode | null>(null);
  const current = humanCases[mode];
  const report = checkedMode ? humanCases[checkedMode] : current;
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：比较人工评分并处理分歧">
    <div className={s.controls}><label>评审记录<select value={mode} onChange={e => { setMode(e.target.value as HumanMode); setCheckedMode(null); }}><option value="agreement">两位评分一致</option><option value="disagreement">两位评分分歧</option><option value="unscored">证据不足</option></select></label><p className={s.runHint}>先按量表独立评分，再处理分歧或保留未评分。</p></div>
    <div className={s.humanSample} aria-label="待评分回答"><span>待评分回答</span><p>{current.answer}</p><small>量表：准确性、完整性、风险各有定义和正反例。</small></div>
    <div className={s.humanReviewers} aria-label="两位评分者记录"><article><span>评审甲</span><strong>{current.first.replace('甲 · ', '')}</strong></article><article><span>评审乙</span><strong>{current.second.replace('乙 · ', '')}</strong></article><article data-disagree={mode === 'disagreement'}><span>处理记录</span><strong>{current.resolution}</strong></article></div>
    <button disabled={checkedMode !== null} onClick={() => setCheckedMode(mode)}>汇总人工评分<MagnifyingGlass size={18}/></button>
    <Reveal open={checkedMode !== null}><div className={s.humanResult} role="status"><header><h3>{report.title}</h3><span>{report.label}</span></header><p>{report.body}</p><p className={s.runEvidence}>检查记录：{report.first}；{report.second}；{report.resolution}。</p></div></Reveal>
    <button className={base.reset} onClick={() => { setMode('agreement'); setCheckedMode(null); }}><ArrowCounterClockwise size={17}/>重置评审记录</button>
  </div>;
}

type ModelMode = 'fixed' | 'bias' | 'unscored';

const modelCases: Record<ModelMode, { label: string; answer: string; rule: string; model: string; human: string; bias: string; title: string; body: string }> = {
  fixed: {
    label: '固定输入和格式',
    answer: '审核通过后，通常三个工作日到账。',
    rule: '准确性、完整性、风险各 0–2；JSON',
    model: '4/5',
    human: '待对照',
    bias: '尚未统计',
    title: '先得到可解析的评分记录',
    body: '输入、量表和 JSON 字段都固定后，才知道评分器检查了什么；这一条记录还不能证明它和人工判断一致。',
  },
  bias: {
    label: '发现系统性高估',
    answer: '退款三个工作日到账。',
    rule: '同一量表 · 5 条校准样本',
    model: '4/5',
    human: '3/5',
    bias: '高估 2/5',
    title: '发现系统性高估，先校准再上线',
    body: '一条分数差异不是结论；同一组人工样本里反复高估，才是需要回到量表、提示词和样本分布查原因的信号。',
  },
  unscored: {
    label: '证据不足',
    answer: '已经退款了。',
    rule: '缺少支付状态和工具日志',
    model: 'unscored',
    human: '等待补证据',
    bias: '不计入通过率',
    title: '证据不足时保留未评分',
    body: '资料没有支付状态，评分器不能把一句自信的话当成事实；返回未评分，并记录需要补什么证据。',
  },
};

export function ModelGraderLesson() {
  const [mode, setMode] = useState<ModelMode>('fixed');
  const [checkedMode, setCheckedMode] = useState<ModelMode | null>(null);
  const current = modelCases[mode];
  const report = checkedMode ? modelCases[checkedMode] : current;
  return <div className={`${base.lab} ${s.lab}`} aria-label="实验：用人工参考检查模型评分器">
    <div className={s.controls}><label>校准状态<select value={mode} onChange={e => { setMode(e.target.value as ModelMode); setCheckedMode(null); }}><option value="fixed">固定输入和格式</option><option value="bias">发现系统性高估</option><option value="unscored">证据不足</option></select></label><p className={s.runHint}>先锁定规则和结构化输出，再和人工参考比较偏差。</p></div>
    <div className={s.modelSample} aria-label="待评样本"><span>待评回答</span><strong>{current.answer}</strong><small>评分规则：{current.rule}</small></div>
    <div className={s.modelScores} aria-label="模型与人工参考记录"><article><span>模型评分器</span><strong>{current.model}</strong></article><article><span>人工参考</span><strong>{current.human}</strong></article><article data-bias={mode === 'bias' || mode === 'unscored'}><span>偏差记录</span><strong>{current.bias}</strong></article></div>
    <button disabled={checkedMode !== null} onClick={() => setCheckedMode(mode)}>检查模型评分<MagnifyingGlass size={18}/></button>
    <Reveal open={checkedMode !== null}><div className={s.modelResult} role="status"><header><h3>{report.title}</h3><span>{report.label}</span></header><p>{report.body}</p><p className={s.runEvidence}>检查记录：模型 {report.model}；人工 {report.human}；{report.bias}。</p></div></Reveal>
    <button className={base.reset} onClick={() => { setMode('fixed'); setCheckedMode(null); }}><ArrowCounterClockwise size={17}/>重置评分条件</button>
  </div>;
}
