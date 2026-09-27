'use client';

import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, Browser, CheckCircle, Fingerprint, LockKey, ShieldCheck, XCircle } from '@phosphor-icons/react';
import { Reveal } from './ExtendedConceptLessons';
import s from './IdentityConcepts.module.css';

export function SessionLesson() {
  const [active, setActive] = useState(false);
  const [hasCookie, setHasCookie] = useState(false);
  const [result, setResult] = useState<'created' | 'accepted' | 'ended' | 'rejected' | null>(null);
  const message = {
    created: '登录核验后，服务建立记录并把不透明的会话 ID 交给浏览器。',
    accepted: '请求带回 ID，服务查到仍有效的记录，识别为阿青。',
    ended: '服务端记录已失效；浏览器即使还留着旧 ID，也不能继续使用。',
    rejected: hasCookie ? '旧 ID 查不到有效记录，请求需要重新认证。' : '浏览器没有会话 ID，请求需要先完成认证。',
  };
  const reset = () => { setActive(false); setHasCookie(false); setResult(null); };
  return <div className={s.lab} aria-label="浏览器和服务端的会话生命周期演示">
    <div className={s.sessionStage}>
      <div className={s.sessionSide}><Browser size={27} weight="light"/><strong>浏览器</strong><span className={s.sessionCookie} data-active={hasCookie}>{hasCookie ? 'Cookie · sid=7c4…' : '没有会话 Cookie'}</span></div>
      <div className={s.sessionTransfer} data-active={active}><ArrowRight size={25}/></div>
      <div className={s.sessionSide}><LockKey size={27} weight="light"/><strong>服务端记录</strong><span className={s.sessionRecord} data-active={active}>{active ? '7c4… → 阿青 · 有效' : result === null ? '还没有会话' : '7c4… → 已失效'}</span></div>
    </div>
    <div className={s.actions}><button type="button" onClick={() => { setActive(true); setHasCookie(true); setResult('created'); }}>登录并建会话</button><button type="button" onClick={() => setResult(active ? 'accepted' : 'rejected')}>访问书架</button><button type="button" disabled={!active} onClick={() => { setActive(false); setResult('ended'); }}>退出</button><button type="button" onClick={reset} aria-label="重置会话演示"><ArrowCounterClockwise size={18}/></button></div>
    <Reveal open={result !== null}><p className={s.feedback} role="status">{result && message[result]}</p></Reveal>
  </div>;
}

type TokenVariant = 'original' | 'tampered' | 'expired';
export function JwtLesson() {
  const [variant, setVariant] = useState<TokenVariant>('original');
  const [checked, setChecked] = useState(false);
  const result = variant === 'original' ? '示意结果：签名与声明均通过，接收方才继续处理请求。' : variant === 'tampered' ? '载荷变了，原签名无法通过验证；“可读”不代表“可随意修改”。' : '签名仍可能有效，但 exp 已过；接收方拒绝这份过期令牌。';
  return <div className={s.lab} aria-label="签名 JWT 的载荷、签名和过期检查演示">
    <div className={s.tokenStrip} data-variant={variant}>
      <div><span>Header</span><code>{'{ "alg": "HS256" }'}</code></div><i aria-hidden="true">.</i><div><span>Payload · 可解码</span><code>{variant === 'tampered' ? '{ "sub": "管理员" }' : variant === 'expired' ? '{ "sub": "阿青", "exp": "已过期" }' : '{ "sub": "阿青", "exp": "有效" }'}</code></div><i aria-hidden="true">.</i><div><span>Signature</span><code>原始签名</code></div>
    </div>
    <div className={s.tokenCheck}><Fingerprint size={32} weight="light"/><span>接收方按约定规则验证签名、签发者、用途和有效期</span><strong data-pass={checked && variant === 'original'}>{checked ? variant === 'original' ? <><CheckCircle size={21}/> 通过</> : <><XCircle size={21}/> 拒绝</> : '等待验证'}</strong></div>
    <div className={s.actions}><button type="button" aria-pressed={variant === 'original'} onClick={() => { setVariant('original'); setChecked(false); }}>原始令牌</button><button type="button" aria-pressed={variant === 'tampered'} onClick={() => { setVariant('tampered'); setChecked(false); }}>改写载荷</button><button type="button" aria-pressed={variant === 'expired'} onClick={() => { setVariant('expired'); setChecked(false); }}>过期令牌</button><button type="button" onClick={() => setChecked(true)}>验证 <ArrowRight size={18}/></button></div>
    <Reveal open={checked}><p className={s.feedback} role="status">{result}</p></Reveal>
  </div>;
}

type GrantStage = 'request' | 'code' | 'token' | 'data' | 'denied' | 'invalid';
export function OAuthLesson() {
  const [stage, setStage] = useState<GrantStage>('request');
  const [validVerifier, setValidVerifier] = useState(true);
  const reset = () => { setStage('request'); setValidVerifier(true); };
  const status = { request: '应用请求读取阿青的头像。', code: '阿青同意；授权服务把一次性授权码交给应用。', token: '校验通过，应用拿到仅用于读取头像的访问令牌。', data: '资源服务接受令牌并返回头像；应用没有获得阿青的密码。', denied: '阿青拒绝，应用拿不到授权码或访问令牌。', invalid: '授权码与这次校验材料不匹配，换取令牌失败。' };
  return <div className={s.lab} aria-label="OAuth 授权码与 PKCE 示意演示">
    <div className={s.consentCard} data-stage={stage}>
      <div className={s.consentHeading}><ShieldCheck size={29} weight="light"/><strong>图片整理器请求访问</strong></div>
      <div className={s.permission}><span>阿青的头像</span><strong>仅读取</strong></div>
      <div className={s.grantTrack} aria-label={`当前授权状态：${status[stage]}`}><span data-on={stage !== 'request' && stage !== 'denied'}>授权码</span><span data-on={stage === 'token' || stage === 'data'}>访问令牌</span><span data-on={stage === 'data'}>头像</span></div>
    </div>
    <div className={s.actions}>{stage === 'request' ? <><button type="button" onClick={() => setStage('code')}>同意读取</button><button type="button" onClick={() => setStage('denied')}>拒绝</button></> : null}{stage === 'code' ? <><label className={s.verifierLabel}>PKCE 校验材料<select value={validVerifier ? 'matching' : 'different'} onChange={event => setValidVerifier(event.target.value === 'matching')}><option value="matching">与本次请求匹配</option><option value="different">不匹配</option></select></label><button type="button" onClick={() => setStage(validVerifier ? 'token' : 'invalid')}>用授权码换令牌</button></> : null}{stage === 'token' ? <button type="button" onClick={() => setStage('data')}>读取头像 <ArrowRight size={18}/></button> : null}<button type="button" onClick={reset} aria-label="重置 OAuth 演示"><ArrowCounterClockwise size={18}/></button></div>
    <p className={s.feedback} role="status">{status[stage]}</p>
  </div>;
}
