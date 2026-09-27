'use client';

import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, Brain, FileText, FolderOpen, Play, Terminal, TextT } from '@phosphor-icons/react';
import s from './SkillConcepts.module.css';

type Stage = 'idle' | 'discovered' | 'sent' | 'selected' | 'body' | 'ref' | 'exec' | 'output' | 'done' | 'general';
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
    { id: 'skill', Icon: FileText, name: 'SKILL.md', desc: '前言写 name 与 description，后面是完整指令', lit: bodyIn,
      chips: [{ on: metaIn, label: '元数据由宿主提供' }, { on: bodyIn, label: '正文已读入上下文' }] },
    { id: 'ref', Icon: FileText, name: 'references/报销规则.md', desc: '规则细节，正文提到、需要时才读', lit: refIn,
      chips: [{ on: refIn, label: '宿主按需读入' }] },
    { id: 'script', Icon: Terminal, name: 'scripts/提取字段.py', desc: '可执行代码，由宿主运行', lit: false,
      chips: [{ on: execRunning || execDone, label: execRunning ? '正在宿主环境运行' : execDone ? '已运行 · 本例未读取源码' : '未运行' }] },
  ];

  const rows = [
    { label: '已有上下文', tag: '' },
    ...(metaIn ? [{ label: 'hotel-invoices · name + description', tag: '宿主发现后提供' }] : []),
    ...(reached(['sent', 'selected', 'body', 'ref', 'exec', 'output', 'done', 'general'])
      ? [{ label: invoice ? '任务 · 核对住宿发票' : '任务 · 写一份周报', tag: '' }] : []),
    ...(reached(['selected', 'body', 'ref', 'exec', 'output', 'done']) ? [{ label: '模型选择 · hotel-invoices', tag: '根据任务与 description' }] : []),
    ...(stage === 'selected' ? [{ label: '文件访问请求 · SKILL.md', tag: '交给宿主处理' }] : []),
    ...(bodyIn ? [{ label: 'SKILL.md 完整正文', tag: '宿主读取后提供' }] : []),
    ...(refIn ? [{ label: 'references/报销规则.md', tag: '正文指引 · 宿主按需读取' }] : []),
    ...(execDone ? [{ label: '示例输出 · 发票号 0831 · ¥860 · 9月18日', tag: '脚本返回' }] : []),
    ...(stage === 'done' ? [{ label: '整理结果 · 报销核对清单', tag: '' }] : []),
    ...(stage === 'general' ? [{ label: '周报草稿', tag: '未使用技能' }] : []),
  ];

  const feedback: Record<Stage, string> = {
    idle: '窗口里只有已有上下文。hotel-invoices 目录留在窗口外，三份文件一页未读。',
    discovered: '宿主在已配置的位置发现这项技能，并把 name 与 description 提供给模型。正文、规则和脚本都还没有读取。',
    sent: invoice
      ? '任务摆在那里。是否使用技能，由模型根据这份元数据判断，或由提示明确要求——不是必然的关键字命中。'
      : '“周报”与这份技能的描述对不上。模型可以不使用技能，直接用一般能力继续。',
    selected: '模型根据任务和 description 选择技能，并请求访问 SKILL.md。此时正文还没进入上下文；宿主如何提供文件访问由具体实现决定。',
    body: '宿主通过本例提供的文件访问能力读取完整 SKILL.md，再把正文交给模型；正文指出细节在 references/报销规则.md。',
    ref: '模型按正文指引请求规则细节，宿主读取 references/报销规则.md 后提供给模型。目录其余内容仍在上下文外。',
    exec: '宿主在可用的执行环境里运行脚本。本例没有另外读取源码，所以模型等待的是执行输出。',
    output: '执行结束：示例字段清单回到上下文。若宿主或模型另行读取源码，源码也可能进入上下文。',
    done: '流程结束。宿主发现目录并提供元数据；正文和参考规则经文件访问按需读取；脚本则在执行环境运行并返回结果。',
    general: '周报用一般能力完成。技能正文与资源全程留在目录里，一页未读。',
  };

  return <div className={s.lab} aria-label="技能目录按需加载演示">
    <div className={s.lessonGrid}>
      <div className={s.dirCol}>
        <div className={s.dirPanel}>
          <p className={s.panelLabel}><FolderOpen size={18} weight="light"/>已配置的技能目录 · 文件留在上下文窗口外</p>
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
            ? <p className={s.execState} data-done={execDone}><code>scripts/提取字段.py</code><span>{execRunning ? '正在运行，等待输出…' : '运行完成，输出已交回窗口 · 本例未读取源码'}</span></p>
            : <p className={s.execIdle}>尚未运行任何脚本。</p>}
        </div>
      </div>
      <div className={s.winPanel} aria-label="上下文窗口">
        <p className={s.panelLabel}><Brain size={18} weight="light"/>上下文窗口 · 本示例</p>
        <ul className={s.winList} aria-live="polite">
          {rows.map(row => <li key={row.label}><span>{row.label}</span>{row.tag && <em>{row.tag}</em>}</li>)}
        </ul>
        <p className={s.note}>示意路径：宿主发现目录并提供元数据；模型决定是否选用，再通过宿主可用的文件能力读取正文。脚本是否可运行及怎样返回结果，也取决于宿主。</p>
      </div>
    </div>
    <div className={s.actions}>
      {stage === 'idle' && <button type="button" onClick={() => setStage('discovered')}>宿主发现已配置技能</button>}
      {stage === 'discovered' && <><button type="button" aria-pressed={invoice} onClick={() => setTask('invoice')}>核对住宿发票</button><button type="button" aria-pressed={task === 'report'} onClick={() => setTask('report')}>写一份周报</button><button type="button" disabled={task === null} onClick={() => setStage('sent')}>发送任务 <ArrowRight size={18}/></button></>}
      {stage === 'sent' && invoice && <button type="button" onClick={() => setStage('selected')}>模型选择技能并请求读取 <ArrowRight size={18}/></button>}
      {stage === 'sent' && !invoice && <button type="button" onClick={() => setStage('general')}>用一般能力完成周报 <ArrowRight size={18}/></button>}
      {stage === 'selected' && <button type="button" onClick={() => setStage('body')}>宿主读取 SKILL.md 并提供正文 <TextT size={18}/></button>}
      {stage === 'body' && <button type="button" onClick={() => setStage('ref')}>宿主按需读取 references/报销规则.md <TextT size={18}/></button>}
      {stage === 'ref' && <button type="button" onClick={() => setStage('exec')}><Play size={16}/>请求宿主运行 scripts/提取字段.py</button>}
      {stage === 'exec' && <button type="button" onClick={() => setStage('output')}>脚本执行完成 <ArrowRight size={18}/></button>}
      {stage === 'output' && <button type="button" onClick={() => setStage('done')}>整理结果并回复 <ArrowRight size={18}/></button>}
      <button type="button" onClick={reset} aria-label="重置技能演示"><ArrowCounterClockwise size={18}/></button>
    </div>
    {stage !== 'idle' && <p className={s.feedback} role="status">{feedback[stage]}</p>}
  </div>;
}
