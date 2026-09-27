'use client';

import { useState } from 'react';
import { ArrowCounterClockwise, ArrowRight, Check, CloudArrowDown, Globe, HardDrives, LockKey, ShieldCheck, X } from '@phosphor-icons/react';
import { Reveal } from './ExtendedConceptLessons';
import base from './EventConcepts.module.css';
import s from './EdgeConcepts.module.css';

export function ServerLesson() {
  const [running, setRunning] = useState(true);
  const [port, setPort] = useState('8000');
  const [path, setPath] = useState('/books');
  const [sent, setSent] = useState(false);
  const accepted = running && port === '8000';
  const status = !accepted ? '连接失败：目标端口没有本例的监听程序' : path === '/books' ? '200 OK · 书目列表' : '404 Not Found · 没有匹配的资源';
  const invalidate = () => setSent(false);
  return <div className={`${base.lab} ${s.lab}`} aria-label="服务器监听与请求处理演示">
    <div className={s.serverControls}><label>访问端口<select value={port} onChange={e => { setPort(e.target.value); invalidate(); }}><option>8000</option><option>8001</option></select></label><label>目标路径<select value={path} onChange={e => { setPath(e.target.value); invalidate(); }}><option>/books</option><option>/missing</option></select></label><button type="button" aria-pressed={running} onClick={() => { setRunning(v => !v); invalidate(); }}>{running ? '停止监听' : '启动监听'}</button></div>
    <div className={s.serverBoard} data-sent={sent} data-accepted={accepted}><div className={s.browserNode}><Globe size={27}/><strong>浏览器</strong><code>GET {path}</code></div><span className={s.serverTrack} aria-hidden="true"><ArrowRight size={19}/></span><div className={s.processNode}><HardDrives size={27}/><strong>同一台主机</strong><div className={s.ports}><span data-active={running}>:8000 · HTTP 程序</span><span>:8001 · 无监听</span></div></div></div>
    <div className={s.actions}><button type="button" onClick={() => setSent(true)}>发送请求<ArrowRight size={18}/></button><button type="button" onClick={() => { setPort('8000'); setPath('/books'); setRunning(true); setSent(false); }} aria-label="重置服务器演示"><ArrowCounterClockwise size={18}/></button></div>
    <Reveal open={sent}><div role="status" className={s.result} data-ok={accepted}><strong>{status}</strong><p>{!accepted ? '请求没有交给处理函数。' : path === '/books' ? '处理函数读取本例书目，再把响应交还浏览器。' : '连接已经建立；这次失败发生在资源匹配阶段。'}</p></div></Reveal>
  </div>;
}

type GateResult = { status: string; target: string; forwarded: boolean };
function gatewayResult(path: string, token: string, remaining: number): GateResult {
  if (token === 'invalid') return { status: '401 · 认证未通过', target: '没有进入后端', forwarded: false };
  if (remaining === 0) return { status: '429 · 本例配额已用完', target: '没有进入后端', forwarded: false };
  return { status: '200 · 已返回', target: path === '/orders' ? '订单服务' : '用户服务', forwarded: true };
}

export function GatewayLesson() {
  const [path, setPath] = useState('/orders');
  const [token, setToken] = useState('valid');
  const [remaining, setRemaining] = useState(2);
  const [orders, setOrders] = useState(0);
  const [users, setUsers] = useState(0);
  const [result, setResult] = useState<GateResult | null>(null);
  const send = () => { const next = gatewayResult(path, token, remaining); setResult(next); if (next.forwarded) { setRemaining(n => n - 1); if (path === '/orders') setOrders(n => n + 1); else setUsers(n => n + 1); } };
  return <div className={`${base.lab} ${s.lab}`} aria-label="API 网关策略与路由演示">
    <div className={s.serverControls}><label>请求路径<select value={path} onChange={e => { setPath(e.target.value); setResult(null); }}><option>/orders</option><option>/users</option></select></label><label>访问凭据<select value={token} onChange={e => { setToken(e.target.value); setResult(null); }}><option value="valid">有效凭据</option><option value="invalid">无效凭据</option></select></label></div>
    <div className={s.gatewayBoard}><div className={s.gateRequest}><Globe size={26}/><code>GET {path}</code></div><div className={s.policyStack}><div data-blocked={result?.status.startsWith('401')}><LockKey size={21}/><span>认证</span></div><div data-blocked={result?.status.startsWith('429')}><ShieldCheck size={21}/><span>配额 {remaining} / 2</span></div></div><div className={s.backends}><div data-lit={result?.forwarded && result.target === '订单服务'}><HardDrives size={21}/>订单服务 <strong>{orders}</strong></div><div data-lit={result?.forwarded && result.target === '用户服务'}><HardDrives size={21}/>用户服务 <strong>{users}</strong></div></div></div>
    <div className={s.actions}><button type="button" onClick={send}>发送到统一入口<ArrowRight size={18}/></button><button type="button" onClick={() => { setPath('/orders'); setToken('valid'); setRemaining(2); setOrders(0); setUsers(0); setResult(null); }} aria-label="重置网关演示"><ArrowCounterClockwise size={18}/></button></div>
    <Reveal open={result !== null}><div role="status" className={s.result} data-ok={result?.forwarded}><strong>{result?.status}</strong><p>{result?.target}。订单服务收到 {orders} 次，用户服务收到 {users} 次。</p></div></Reveal>
  </div>;
}

export function ProxyLesson() {
  const [path, setPath] = useState('/images/logo.png');
  const [trustSpoofed, setTrustSpoofed] = useState(false);
  const [forwarded, setForwarded] = useState(false);
  const [returned, setReturned] = useState(false);
  const upstream = path.startsWith('/images') ? '静态资源服务' : '应用服务';
  const resetFlow = () => { setForwarded(false); setReturned(false); };
  return <div className={`${base.lab} ${s.lab}`} aria-label="反向代理转发与返回演示">
    <div className={s.serverControls}><label>公开路径<select value={path} onChange={e => { setPath(e.target.value); resetFlow(); }}><option>/images/logo.png</option><option>/app/home</option></select></label><label className={s.check}><input type="checkbox" checked={trustSpoofed} onChange={e => { setTrustSpoofed(e.target.checked); resetFlow(); }}/>应用信任客户端自填 X-Forwarded-For</label></div>
    <div className={s.proxyBoard} data-forwarded={forwarded} data-returned={returned}><div className={s.proxyClient}><Globe size={27}/><strong>客户端</strong><code>proxy.example{path}</code></div><div className={s.proxyEntrance}><CloudArrowDown size={29}/><strong>公开代理</strong><span>按路径选择上游</span></div><div className={s.proxyUpstreams}><div data-picked={upstream === '静态资源服务'}><HardDrives size={20}/>静态资源服务</div><div data-picked={upstream === '应用服务'}><HardDrives size={20}/>应用服务</div></div></div>
    <div className={s.actions}><button type="button" disabled={forwarded} onClick={() => setForwarded(true)}>转交请求<ArrowRight size={18}/></button><button type="button" disabled={!forwarded || returned} onClick={() => setReturned(true)}>带回响应<ArrowRight size={18}/></button><button type="button" onClick={() => { setPath('/images/logo.png'); setTrustSpoofed(false); resetFlow(); }} aria-label="重置反向代理演示"><ArrowCounterClockwise size={18}/></button></div>
    <Reveal open={forwarded}><div className={s.result} role="status" data-ok={!trustSpoofed}><strong>{returned ? '200 · 经公开入口返回客户端' : `已转交 ${upstream}`}</strong><p>应用识别到的客户端地址：{trustSpoofed ? '1.2.3.4（客户端伪造）' : '198.51.100.8（可信代理写入）'} {trustSpoofed ? <X size={17} aria-label="不可信"/> : <Check size={17} aria-label="可信"/>}</p></div></Reveal>
  </div>;
}
