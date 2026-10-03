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
