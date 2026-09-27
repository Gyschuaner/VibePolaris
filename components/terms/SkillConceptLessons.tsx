'use client';

import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, Brain, FileText, FolderOpen, Play, Terminal, TextT } from '@phosphor-icons/react';
import s from './SkillConcepts.module.css';

type Stage = 'idle' | 'booted' | 'sent' | 'decided' | 'body' | 'ref' | 'exec' | 'output' | 'done' | 'general';
type Task = 'invoice' | 'report';

export function SkillLesson() {
  const [stage, setStage] = useState<Stage>('idle');
  const [task, setTask] = useState<Task | null>(null);
  const reset = () => { setStage('idle'); setTask(null); };

  const reached = (list: Stage[]) => list.includes(stage);
  const invoice = task === 'invoice';
  const metaIn = stage !== 'idle';
  const bodyIn = reached(['body', 'ref', 'exec', 'output', 'done']);
  const refIn = reached(['ref', 'exec', 'output', 'done']);
  const execRunning = stage === 'exec';
  const execDone = reached(['output', 'done']);

  const files = [
    { id: 'skill', Icon: FileText, name: 'SKILL.md', desc: 'name 与 description 写在前言，下面是做法步骤', lit: bodyIn,
      chips: [{ on: metaIn, label: '元数据已注入窗口' }, { on: bodyIn, label: '正文已进入窗口' }] },
    { id: 'ref', Icon: FileText, name: 'references/报销规则.md', desc: '规则细节，正文提到、需要时才读', lit: refIn,
      chips: [{ on: refIn, label: '已按需读入窗口' }] },
    { id: 'script', Icon: Terminal, name: 'scripts/提取字段.py', desc: '可执行代码，由宿主运行', lit: false,
      chips: [{ on: execRunning || execDone, label: execRunning ? '正在执行环境运行' : execDone ? '已运行 · 源码未进窗口' : '未运行' }] },
  ];

  const rows = [
    { label: '已有上下文', tag: '' },
    ...(metaIn ? [{ label: 'hotel-invoices · name + description', tag: '启动时注入' }] : []),
    ...(reached(['sent', 'decided', 'body', 'ref', 'exec', 'output', 'done', 'general'])
      ? [{ label: invoice ? '任务 · 核对住宿发票' : '任务 · 写一份周报', tag: '' }] : []),
    ...(reached(['decided', 'body', 'ref', 'exec', 'output', 'done']) ? [{ label: '决定使用 hotel-invoices', tag: '模型与宿主的判断' }] : []),
    ...(bodyIn ? [{ label: 'SKILL.md 正文', tag: '按需读取' }] : []),
    ...(refIn ? [{ label: 'references/报销规则.md', tag: '按需读取' }] : []),
    ...(execDone ? [{ label: '示例输出 · 发票号 0831 · ¥860 · 9月18日', tag: '脚本返回' }] : []),
    ...(stage === 'done' ? [{ label: '整理结果 · 报销核对清单', tag: '' }] : []),
    ...(stage === 'general' ? [{ label: '周报草稿', tag: '未使用技能' }] : []),
  ];

  const feedback: Record<Stage, string> = {
    idle: '窗口里只有已有上下文。hotel-invoices 目录留在窗口外，三份文件一页未读。',
    booted: '启动完成：此示意宿主把 name 和 description 提供给模型。正文、规则和脚本都没有进入窗口。',
    sent: invoice
      ? '任务摆在那里。是否使用技能，由模型根据这份元数据判断，或由提示明确要求——不是必然的关键字命中。'
      : '“周报”与这份技能的描述对不上。模型可以不使用技能，直接用一般能力继续。',
    decided: '此示意路径决定使用这项技能。到现在，SKILL.md 正文才第一次被读取。',
    body: 'SKILL.md 正文进入窗口，其中提到细节在 references/报销规则.md。',
    ref: '规则文档按需读取——这是第二份进入窗口的文件，目录本身仍在窗口外。',
    exec: '脚本停在执行环境里运行：源码不进入这个示例的上下文，模型只等待它的输出。',
    output: '执行结束：示例字段清单回到窗口；脚本源码仍留在 scripts/。',
    done: '流程结束。目录一直留在窗口外；本示例里的元数据、任务、正文、参考规则和输出依次进入上下文。',
    general: '周报用一般能力完成。技能正文与资源全程留在目录里，一页未读。',
  };

  return <div className={s.lab} aria-label="技能目录按需加载演示">
    <div className={s.lessonGrid}>
      <div className={s.dirCol}>
        <div className={s.dirPanel}>
          <p className={s.panelLabel}><FolderOpen size={18} weight="light"/>hotel-invoices · 技能目录 · 留在上下文窗口外</p>
          <ul className={s.fileList}>
            {files.map(({ id, Icon, name, desc, lit, chips }) => <li key={id} className={s.fileRow} data-lit={lit}>
              <Icon size={19} weight="light" aria-hidden="true"/><strong>{name}</strong><span>{desc}</span>
              <div className={s.chips}>{chips.map(chip => <i key={chip.label} data-on={chip.on}>{chip.label}</i>)}</div>
            </li>)}
          </ul>
        </div>
        <div className={s.execPanel} aria-label="执行环境">
          <p className={s.panelLabel}><Terminal size={18} weight="light"/>执行环境 · 同样在窗口外</p>
          {execRunning || execDone
            ? <p className={s.execState} data-done={execDone}><code>scripts/提取字段.py</code><span>{execRunning ? '正在运行，等待输出…' : '运行完成，输出已交回窗口 · 源码未进入上下文'}</span></p>
            : <p className={s.execIdle}>尚未运行任何脚本。</p>}
        </div>
      </div>
      <div className={s.winPanel} aria-label="上下文窗口">
        <p className={s.panelLabel}><Brain size={18} weight="light"/>上下文窗口 · 本示例</p>
        <ul className={s.winList} aria-live="polite">
          {rows.map(row => <li key={row.label}><span>{row.label}</span>{row.tag && <em>{row.tag}</em>}</li>)}
        </ul>
        <p className={s.note}>示意：这是一个支持按需读取文件、执行脚本的宿主。真实的技能发现、触发方式与脚本行为都由宿主实现决定，不是关键字命中。</p>
      </div>
    </div>
    <div className={s.actions}>
      {stage === 'idle' && <button type="button" onClick={() => setStage('booted')}>启动智能体</button>}
      {stage === 'booted' && <><button type="button" aria-pressed={invoice} onClick={() => setTask('invoice')}>核对住宿发票</button><button type="button" aria-pressed={task === 'report'} onClick={() => setTask('report')}>写一份周报</button><button type="button" disabled={task === null} onClick={() => setStage('sent')}>发送任务 <ArrowRight size={18}/></button></>}
      {stage === 'sent' && invoice && <button type="button" onClick={() => setStage('decided')}>决定使用 hotel-invoices <ArrowRight size={18}/></button>}
      {stage === 'sent' && !invoice && <button type="button" onClick={() => setStage('general')}>用一般能力完成周报 <ArrowRight size={18}/></button>}
      {stage === 'decided' && <button type="button" onClick={() => setStage('body')}>读取 SKILL.md 正文 <TextT size={18}/></button>}
      {stage === 'body' && <button type="button" onClick={() => setStage('ref')}>按需读取 references/报销规则.md <TextT size={18}/></button>}
      {stage === 'ref' && <button type="button" onClick={() => setStage('exec')}><Play size={16}/>运行 scripts/提取字段.py</button>}
      {stage === 'exec' && <button type="button" onClick={() => setStage('output')}>脚本执行完成 <ArrowRight size={18}/></button>}
      {stage === 'output' && <button type="button" onClick={() => setStage('done')}>整理结果并回复 <ArrowRight size={18}/></button>}
      <button type="button" onClick={reset} aria-label="重置技能演示"><ArrowCounterClockwise size={18}/></button>
    </div>
    {stage !== 'idle' && <p className={s.feedback} role="status">{feedback[stage]}</p>}
  </div>;
}
