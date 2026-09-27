'use client';

import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, CheckCircle, HardDrives, IdentificationCard, LockKey, ShieldCheck, XCircle } from '@phosphor-icons/react';
import { Reveal } from './ExtendedConceptLessons';
import s from './AccessConcepts.module.css';

export function BalanceLesson() {
  const [healthy, setHealthy] = useState([true, true, true]);
  const [counts, setCounts] = useState([0, 0, 0]);
  const [cursor, setCursor] = useState(0);
  const [last, setLast] = useState<number | null>(null);
  const [attempted, setAttempted] = useState(false);
  const send = () => {
    const next = [0, 1, 2].map(offset => (cursor + offset) % 3).find(index => healthy[index]);
    setAttempted(true);
    setLast(next ?? null);
    if (next === undefined) return;
    setCounts(previous => previous.map((count, index) => index === next ? count + 1 : count));
    setCursor((next + 1) % 3);
  };
  const reset = () => { setHealthy([true, true, true]); setCounts([0, 0, 0]); setCursor(0); setLast(null); setAttempted(false); };
  return <div className={s.lab} aria-label="轮流分配请求与实例健康状态演示">
    <div className={s.balanceStage}>
      <div className={s.incoming}><span>请求入口</span><strong>{counts.reduce((sum, count) => sum + count, 0)}</strong></div>
      <div className={s.serverCluster}>{healthy.map((available, index) => <button type="button" key={index} className={s.instance} data-healthy={available} data-picked={last === index && attempted} aria-pressed={available} aria-label={`实例 ${'ABC'[index]}：${available ? '健康' : '停用'}，已处理 ${counts[index]} 个请求；点击切换健康状态`} onClick={() => { setHealthy(current => current.map((state, position) => position === index ? !state : state)); setAttempted(false); setLast(null); }}>
        <HardDrives size={25} weight="light" /><span>实例 {'ABC'[index]}</span><strong>{counts[index]}</strong><small>{available ? '可接收' : '已停用'}</small>
      </button>)}</div>
    </div>
    <div className={s.actions}><button type="button" onClick={send}>送入一个请求 <ArrowRight size={18} /></button><button type="button" onClick={reset} aria-label="重置负载均衡演示"><ArrowCounterClockwise size={18} /></button></div>
    <Reveal open={attempted}><p className={s.feedback} role="status">{last === null ? '没有可用实例，请求不能按本例的规则分配。' : `请求分给实例 ${'ABC'[last]}。下一次会从它后面的实例继续寻找可用目标。`}</p></Reveal>
  </div>;
}

type AuthResult = 'success' | 'failure' | 'recognized' | 'anonymous' | null;
export function AuthLesson() {
  const [proof, setProof] = useState<'valid' | 'invalid'>('valid');
  const [session, setSession] = useState(false);
  const [result, setResult] = useState<AuthResult>(null);
  const signIn = () => { const valid = proof === 'valid'; setSession(valid); setResult(valid ? 'success' : 'failure'); };
  const reset = () => { setProof('valid'); setSession(false); setResult(null); };
  const message = result === 'success' ? '凭据核验通过，建立阿青的教学会话。' : result === 'failure' ? '账号或凭据不正确；未建立会话。' : result === 'recognized' ? '后续请求携带有效会话，服务识别为阿青。' : '没有有效会话，受保护资源要求重新认证。';
  return <div className={s.lab} aria-label="凭据核验和后续会话演示">
    <div className={s.authStage}>
      <div className={s.proof}><LockKey size={28} weight="light" /><strong>阿青登录</strong><label>教学凭据<select value={proof} onChange={event => { setProof(event.target.value as 'valid' | 'invalid'); setSession(false); setResult(null); }}><option value="valid">与记录匹配</option><option value="invalid">不匹配</option></select></label></div>
      <div className={s.identity} data-issued={session}><IdentificationCard size={34} weight="light" /><span>{session ? '已确认：阿青' : '尚未确认身份'}</span><small>{session ? '后续请求可携带会话' : '本例没有可用会话'}</small></div>
    </div>
    <div className={s.actions}><button type="button" onClick={signIn}>提交登录 <ArrowRight size={18} /></button><button type="button" onClick={() => setResult(session ? 'recognized' : 'anonymous')}>访问书架</button><button type="button" onClick={reset} aria-label="退出并重置认证演示"><ArrowCounterClockwise size={18} /></button></div>
    <Reveal open={result !== null}><p className={s.feedback} role="status">{message}</p></Reveal>
  </div>;
}

type Person = 'qing' | 'lan';
type Action = 'read' | 'edit';
export function AuthorizationLesson() {
  const [person, setPerson] = useState<Person>('qing');
  const [owner, setOwner] = useState<Person>('qing');
  const [action, setAction] = useState<Action>('edit');
  const [decision, setDecision] = useState<boolean | null>(null);
  const allowed = action === 'read' || person === owner;
  const names = { qing: '阿青', lan: '阿岚' };
  const reset = () => { setPerson('qing'); setOwner('qing'); setAction('edit'); setDecision(null); };
  return <div className={s.lab} aria-label="用户、文档和操作的授权判断演示">
    <div className={s.authorizationControls}>
      <label>已认证用户<select value={person} onChange={event => { setPerson(event.target.value as Person); setDecision(null); }}><option value="qing">阿青</option><option value="lan">阿岚</option></select></label>
      <label>目标文档<select value={owner} onChange={event => { setOwner(event.target.value as Person); setDecision(null); }}><option value="qing">阿青的文档</option><option value="lan">阿岚的文档</option></select></label>
      <label>操作<select value={action} onChange={event => { setAction(event.target.value as Action); setDecision(null); }}><option value="edit">修改</option><option value="read">读取</option></select></label>
    </div>
    <div className={s.policyBoard}><div className={s.policyHead}><ShieldCheck size={25} weight="light" /><strong>本例的文档规则</strong></div><div className={s.policyMatrix}><span></span><span>读取</span><span>修改</span><span>自己的文档</span><CheckCircle size={21}/><CheckCircle size={21}/><span>别人的文档</span><CheckCircle size={21}/><XCircle size={21}/></div><div className={s.policyRequest} data-allowed={decision === true} data-denied={decision === false}><span>{names[person]} → {action === 'read' ? '读取' : '修改'} → {names[owner]}的文档</span><strong>{decision === null ? '等待判断' : decision ? '允许' : '拒绝'}</strong></div></div>
    <div className={s.actions}><button type="button" onClick={() => setDecision(allowed)}>检查权限 <ArrowRight size={18}/></button><button type="button" onClick={reset} aria-label="重置授权演示"><ArrowCounterClockwise size={18}/></button></div>
    <Reveal open={decision !== null}><p className={s.feedback} role="status">{decision ? '规则允许，操作可以继续交给文档服务。' : '身份已经确认，但这项操作没有权限；本例返回 403，文档不被修改。'}</p></Reveal>
  </div>;
}
