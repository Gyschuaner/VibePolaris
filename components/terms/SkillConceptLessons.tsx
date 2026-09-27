'use client';

import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, Brain, FileText, Play, TextT } from '@phosphor-icons/react';
import { Reveal } from './ExtendedConceptLessons';
import s from './SkillConcepts.module.css';

const SYSTEM = 800, TASK = 25, BUDGET = 6000, OUTPUT = 45;
const skills = [
  { id: 'pdf-forms', desc: '提取并填写 PDF 表单字段', meta: 95, body: 2400 },
  { id: 'data-analysis', desc: '分析表格数据并生成图表', meta: 110, body: 2600 },
  { id: 'commit-helper', desc: '把代码改动写成提交说明', meta: 80, body: 1600 },
];
const META = skills.reduce((sum, skill) => sum + skill.meta, 0);
const BODIES = skills.reduce((sum, skill) => sum + skill.body, 0);
const PDF_BODY = skills[0].body;
const fmt = (n: number) => n.toLocaleString('en-US');

type Mode = 'progressive' | 'eager';
type Stage = 'idle' | 'booted' | 'sent' | 'body' | 'ran';

export function SkillLesson() {
  const [mode, setMode] = useState<Mode>('progressive');
  const [stage, setStage] = useState<Stage>('idle');
  const [task, setTask] = useState<'pdf' | 'report' | null>(null);
  const reset = () => { setStage('idle'); setTask(null); };
  const switchMode = (next: Mode) => { setMode(next); reset(); };

  const used = stage === 'idle' ? SYSTEM
    : SYSTEM + (mode === 'eager' ? BODIES : META) + (stage === 'sent' || stage === 'body' || stage === 'ran' ? TASK : 0)
      + (mode === 'progressive' && (stage === 'body' || stage === 'ran') ? PDF_BODY : 0)
      + (stage === 'ran' ? OUTPUT : 0);
  const matched = task === 'pdf';
  const entries = [
    { label: '系统提示', tokens: SYSTEM, always: true },
    ...(stage !== 'idle' ? (mode === 'eager'
      ? skills.map(skill => ({ label: `${skill.id} 正文`, tokens: skill.body, always: true }))
      : [{ label: '3 × name + description', tokens: META, always: true }]) : []),
    ...(stage === 'sent' || stage === 'body' || stage === 'ran' ? [{ label: task === 'pdf' ? '任务 · 填写 PDF 表单' : '任务 · 写一份周报', tokens: TASK, always: true }] : []),
    ...(mode === 'progressive' && (stage === 'body' || stage === 'ran') ? [{ label: 'pdf-forms 正文', tokens: PDF_BODY, always: true }] : []),
    ...(stage === 'ran' ? [{ label: '脚本输出 · output.pdf', tokens: OUTPUT, always: true }] : []),
  ];
  const feedback = {
    idle: '窗口里只有系统提示。三份技能安静地待在文件目录里。',
    booted: mode === 'progressive'
      ? `启动完成：${fmt(META)} token 的元数据常驻，正文一行未读。`
      : `还没执行任何任务，三份正文共 ${fmt(BODIES)} token 已把窗口挤到预算之外。`,
    sent: matched ? '任务与 pdf-forms 的描述匹配。另外两份技能的正文仍未进入窗口。' : '三份描述都对不上“周报”。没有正文被读取，智能体用一般能力处理。',
    body: mode === 'progressive'
      ? `读取 pdf-forms 正文：+${fmt(PDF_BODY)} token，窗口仍有一多半余量。`
      : '正文早已在启动时进入——渐进模式下，这一步才花掉这 2,400 token。',
    ran: '脚本已在执行环境运行：代码不进上下文，输出只加 45 token——表单已填写，保存为 output.pdf。',
  };

  return <div className={s.lab} aria-label="技能渐进加载与上下文占用演示">
    <div className={s.lessonGrid}>
      <div className={s.skillList} aria-label="已安装技能">
        <p className={s.panelLabel}>已安装的三份技能</p>
        {skills.map(skill => {
          const lit = mode === 'eager' ? stage !== 'idle' : skill.id === 'pdf-forms' && (stage === 'body' || stage === 'ran');
          return <div key={skill.id} className={s.skillCard} data-lit={lit} data-match={skill.id === 'pdf-forms' && matched && stage === 'sent'}>
            <FileText size={19} weight="light"/><strong>{skill.id}</strong><span>{skill.desc}</span>
            <div className={s.chips}>
              <i data-on={stage !== 'idle'}>元数据 {fmt(skill.meta)}</i>
              <i data-on={lit}>正文 {fmt(skill.body)}</i>
              {skill.id === 'pdf-forms' && <i data-on={stage === 'ran'}>脚本输出 45</i>}
            </div>
          </div>;
        })}
      </div>
      <div className={s.ctxPanel}>
        <p className={s.panelLabel}><Brain size={18} weight="light"/>上下文窗口 · 教学预算 {fmt(BUDGET)} token</p>
        <div className={s.bar} aria-hidden="true"><div className={s.barFill} data-over={used > BUDGET} style={{ width: `${Math.min(used / BUDGET, 1) * 100}%` }}/></div>
        <p className={s.usedLine} data-over={used > BUDGET}>{fmt(used)} / {fmt(BUDGET)} token{used > BUDGET ? ` · 超出 ${fmt(used - BUDGET)}` : ''}</p>
        <ul className={s.ctxList}>
          {entries.map(entry => <li key={entry.label}><span>{entry.label}</span><code>+{fmt(entry.tokens)}</code></li>)}
        </ul>
      </div>
    </div>
    <div className={s.actions} role="group" aria-label="装载方式">
      <button type="button" aria-pressed={mode === 'progressive'} onClick={() => switchMode('progressive')}>渐进加载</button>
      <button type="button" aria-pressed={mode === 'eager'} onClick={() => switchMode('eager')}>全部塞进提示词</button>
    </div>
    <div className={s.actions}>
      {stage === 'idle' && <button type="button" onClick={() => setStage('booted')}>启动智能体</button>}
      {stage === 'booted' && <><button type="button" aria-pressed={task === 'pdf'} onClick={() => setTask('pdf')}>填写 PDF 表单</button><button type="button" aria-pressed={task === 'report'} onClick={() => setTask('report')}>写一份周报</button><button type="button" disabled={task === null} onClick={() => setStage('sent')}>发送任务 <ArrowRight size={18}/></button></>}
      {stage === 'sent' && matched && <button type="button" onClick={() => setStage('body')}>读取 pdf-forms 正文 <TextT size={18}/></button>}
      {stage === 'body' && <button type="button" onClick={() => setStage('ran')}><Play size={16}/>运行 scripts/fill_form.py</button>}
      <button type="button" onClick={reset} aria-label="重置技能演示"><ArrowCounterClockwise size={18}/></button>
    </div>
    <Reveal open={stage !== 'idle'}><p className={s.feedback} role="status">{feedback[stage]}</p></Reveal>
  </div>;
}
