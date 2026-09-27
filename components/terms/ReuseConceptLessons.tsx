"use client";
import { useState } from "react";
import { ArrowCounterClockwise, ArrowRight, Database, Lightning, PlugsConnected, PaperPlaneTilt } from "@phosphor-icons/react";
import { initialCache, readCache, expireCache, initialPool, clientIds, borrowConnection, returnConnection, timeoutWaiting, initialReplica, replicate, bookTitles, type ClientState } from "@/lib/reuse-teaching";
import { Reveal, States } from "./ExtendedConceptLessons";
import base from "./EventConcepts.module.css";
import s from "./ReuseConcepts.module.css";
const titleNodes = bookTitles.map(title => <strong key={title}>{title}</strong>);
export function CacheLesson() {
  const [state,setState]=useState(initialCache),[result,setResult]=useState(0),[shown,setShown]=useState(false);
  const clear=()=>setShown(false);
  return <div className={`${base.lab} ${s.lab}`} aria-label="缓存副本与回源演示">
    <div className={s.cacheDesk}><div className={s.origin}><h3><Database size={22}/>数据库 · #42</h3><States index={state.source}>{titleNodes}</States><button disabled={state.source===1} onClick={()=>{setState({...state,source:1});clear();}}>只修改数据库书名</button></div><div className={s.copy}><h3><Lightning size={22}/>缓存副本</h3><code>book:42:title</code><div className={s.copyValue}><Reveal open={state.entry===null}><p>没有副本</p></Reveal>{bookTitles.map((title,i)=><Reveal key={title} open={state.entry?.version===i}><strong>{title}</strong><span>填入后保留 2 格</span></Reveal>)}</div></div></div>
    <div className={s.actions}><button onClick={()=>{const next=readCache(state);setState(next.state);setResult(next.version*2+(next.hit?1:0));setShown(true);}}>读取这册书<ArrowRight size={17}/></button><button disabled={state.entry===null} onClick={()=>{setState({...state,entry:null});clear();}}>使副本失效</button><button disabled={state.entry===null} onClick={()=>{setState(expireCache(state));clear();}}>推进 2 格到期</button><span className={s.clock}>t = {state.now}</span></div>
    <Reveal open={shown}><div className={s.cacheResult} role="status"><States index={result}>{[0,1,2,3].map(i=><div key={i}><span>{i%2===1 ? "命中 · 来自缓存" : "未命中 · 读取数据库并回填"}</span><strong>{bookTitles[Math.floor(i/2)]}</strong></div>)}</States></div></Reveal>
    <button className={base.reset} onClick={()=>{setState(initialCache());clear();}}><ArrowCounterClockwise size={17}/>恢复空缓存与原书名</button>
  </div>;
}
const statusOrder: ClientState[]=["new","active","waiting","done","timedout"];
export function PoolLesson() {
  const [state,setState]=useState(initialPool);
  return <div className={`${base.lab} ${s.lab}`} aria-label="两连接的借还与等待演示">
    <div className={s.poolBoard} aria-hidden="true"><span className={s.requestHeading}>请求</span><span className={s.slotHeading}>连接</span><span className={s.waitHeading}>等待 / 结束</span>{state.slots.map((id,i)=><div key={i} className={s.slot} data-busy={!!id} style={{top:38+i*100}}><PlugsConnected size={20}/><span>连接 {i+1}</span></div>)}{clientIds.map((id,i)=>{const slot=state.slots.indexOf(id),status=state.clients[id];return <div key={id} className={s.client} data-state={status} style={{left:status==="new"?"0%":slot>=0?"33%":"69%",top:slot>=0?76+slot*100:status==="waiting"?76:status==="new"?76+i*100:190+i*44}}><span>请求 {id}</span></div>;})}</div>
    <div className={s.requests} aria-live="polite">{clientIds.map(id=><div key={id}><button disabled={state.clients[id]!=="new"} onClick={()=>setState(borrowConnection(state,id))}>请求 {id} 借用连接</button><States index={statusOrder.indexOf(state.clients[id])}>{[<span key="new">尚未借用</span>,<span key="active">已借到连接</span>,<span key="waiting">等待空闲连接</span>,<span key="done">已归还</span>,<span key="timedout">等待超时 · 未获连接</span>]}</States></div>)}</div>
    <div className={s.actions}>{[0,1].map(i=><button key={i} disabled={state.slots[i]===null} onClick={()=>setState(returnConnection(state,i))}>完成并归还连接 {i+1}</button>)}<button disabled={!clientIds.some(id=>state.clients[id]==="waiting")} onClick={()=>setState(timeoutWaiting(state))}>让等待达到上限</button></div>
    <button className={base.reset} onClick={()=>setState(initialPool())}><ArrowCounterClockwise size={17}/>重新分配两条连接</button>
  </div>;
}
function RevisionValue({revision}:{revision:number}) {return <States index={revision}>{[...titleNodes,<strong key="deleted">0 行 · 已删除</strong>]}</States>;}
export function ReplicationLesson() {
  const [state,setState]=useState(initialReplica),[read,setRead]=useState(0),[shown,setShown]=useState(false);
  const act=(action:"rename"|"delete"|"send"|"apply")=>{setState(replicate(state,action));setShown(false);};
  return <div className={`${base.lab} ${s.lab}`} aria-label="复制接收与应用演示">
    <div className={s.replicas}><div><h3><Database size={22}/>主库</h3><span>已提交 · v{state.head}</span><RevisionValue revision={state.head}/><div className={s.actions}><button disabled={state.head!==0} onClick={()=>act("rename")}>提交书名修改</button><button disabled={state.head!==1} onClick={()=>act("delete")}>提交删除 #42</button></div></div><div><h3><Database size={22}/>副本</h3><span>已应用 · v{state.applied}</span><RevisionValue revision={state.applied}/><button onClick={()=>{setRead(state.applied);setShown(true);}}>查询副本上的 #42</button></div></div>
    <div className={s.logLane}><h3><PaperPlaneTilt size={21}/>变更记录</h3>{[1,2].map(n=><Reveal key={n} open={state.head>=n}><div className={s.log} data-phase={state.applied>=n?"applied":state.received>=n?"received":"pending"}><code>v{n}</code><strong>{n===1?"修改书名":"删除 #42"}</strong><States index={state.applied>=n?2:state.received>=n?1:0}>{[<span key="pending">主库待发送</span>,<span key="received">副本已收到</span>,<span key="applied">副本已应用</span>]}</States></div></Reveal>)}</div>
    <div className={s.actions}><button disabled={state.received>=state.head} onClick={()=>act("send")}>发送下一条变更</button><button disabled={state.applied>=state.received} onClick={()=>act("apply")}>副本应用下一条</button></div>
    <Reveal open={shown}><div className={s.replicaRead} role="status"><span>本次副本查询 · v{read}</span><RevisionValue revision={read}/></div></Reveal>
    <button className={base.reset} onClick={()=>{setState(initialReplica());setShown(false);}}><ArrowCounterClockwise size={17}/>恢复两库 v0</button>
  </div>;
}
