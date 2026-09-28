"use client";

import { useState } from "react";
import { ArrowRight, ArrowsLeftRight, BookOpen, ChatCircleText, FileText, PencilLine, PlugsConnected, ArrowCounterClockwise, Wrench } from "@phosphor-icons/react";
import { ConceptHero } from "./ConceptHero";
import styles from "./Mcp.module.css";

export function McpHero() {
  return <ConceptHero slug="mcp-r2" label="两个 AI 应用通过 MCP 取得同一服务的能力说明">
    <div className={styles.heroArt}>
      <div className={styles.heroApps}><span><ChatCircleText size={20} />聊天助手</span><span><PencilLine size={20} />写作助手</span></div>
      <div className={styles.heroBridge}><b>MCP</b><ArrowsLeftRight size={32} weight="light" /></div>
      <div className={styles.heroService}><BookOpen size={27} weight="light" /><strong>图书馆资料服务</strong><span>同一份能力说明</span></div>
    </div>
  </ConceptHero>;
}

const apps = ["聊天助手", "写作助手"];
const phases = ["尚未接入", "工具已发现", "查询已发出", "结果已返回", "回答已生成"];
const actions = ["连接并发现工具", "发送「借书期限」", "服务查询并返回", "交给模型回答"];

export function McpLab() {
  const [app, setApp] = useState(0);
  const [phase, setPhase] = useState(0);
  const [previous, setPrevious] = useState<string | null>(null);
  const connected = phase > 0;

  function advance() {
    if (phase >= 4) return;
    if (phase === 2) setPrevious(apps[app]);
    setPhase(phase + 1);
  }

  return <figure className={styles.lab} aria-label="MCP 图书馆查询演示">
    <div className={styles.labTop}>
      <div className={styles.appTabs} aria-label="选择 AI 应用">{apps.map((name, index) => <button type="button" key={name} aria-pressed={app === index} disabled={phase === 2} onClick={() => { setApp(index); setPhase(0); }}>{index === 0 ? <ChatCircleText size={18} /> : <PencilLine size={18} />}{name}</button>)}</div>
      <button type="button" className={styles.reset} aria-label="重置整个演示" onClick={() => { setPhase(0); setApp(0); setPrevious(null); }}><ArrowCounterClockwise size={18} />重置</button>
    </div>
    <div className={styles.query}>我想知道：青禾图书馆的书能借多久？</div>
    <div className={styles.board}>
      <div className={styles.application}>
        <h3>{apps[app]} <span>AI 应用</span></h3>
        <div className={styles.client}><PlugsConnected size={18} /><span>MCP 客户端</span><b>{connected ? "已连接" : "未连接"}</b></div>
        <div className={styles.definition} data-visible={connected} aria-hidden={!connected}>
          <span>从服务取得的工具说明</span><strong><Wrench size={18} />搜索指南</strong>
          <dl><div><dt>用途</dt><dd>查询借阅规则</dd></div><div><dt>输入</dt><dd>一个文字关键词</dd></div></dl>
        </div>
        {!connected && <p className={styles.empty}>尚未取得工具说明</p>}
      </div>
      <div className={styles.bridge} data-connected={connected}><b>MCP</b><ArrowsLeftRight size={28} /><span>{connected ? "按共同约定传话" : "等待连接"}</span></div>
      <div className={styles.service}>
        <h3><BookOpen size={23} />图书馆资料服务</h3>
        <div className={styles.serverTool}><Wrench size={19} /><strong>搜索指南</strong><span>接收关键词，搜索资料</span></div>
        <div className={styles.readArrow}>↓ 读取</div>
        <div className={styles.guide}><FileText size={22} /><div><strong>图书馆借阅指南</strong><span>资料在这里</span></div></div>
      </div>
    </div>
    <div className={styles.exchange} data-phase={phase}>
      <div className={styles.track} aria-hidden="true"><span>{apps[app]}</span><i /><span>图书馆资料服务</span></div>
      <div className={styles.packet} data-location={phase === 2 ? "service" : "app"} data-visible={phase >= 2} aria-hidden={phase < 2}>
        {phase === 2 ? <><span>查询请求 →</span><strong>搜索指南</strong><p>关键词：借书期限</p></> : previous && <><span>{phase >= 3 ? "← 查询结果" : `上次查询结果 · ${previous}`}</span><strong>普通图书借期 30 天</strong><p>来源：图书馆借阅指南</p></>}
      </div>
      {phase < 2 && <p className={styles.exchangeEmpty}>{phase === 0 ? "连接后，先了解服务能做什么。" : "已知道怎样查询，还没有查询结果。"}</p>}
    </div>
    <div className={styles.answer} data-visible={phase === 4} aria-hidden={phase !== 4}>{previous && <div><ChatCircleText size={22} /><p><strong>{previous}{phase === 4 ? "的回答" : "的上次回答"}</strong>{previous === apps[0] ? "根据借阅指南，青禾图书馆的普通图书可借 30 天。" : "借书提醒：普通图书借期为 30 天，请留意到期日期。"}</p></div>}</div>
    <div className={styles.controls}>
      <span role="status">{phases[phase]}</span>
      {phase < 4 ? <button type="button" className={styles.next} onClick={advance}>{actions[phase]}<ArrowRight size={18} /></button> : <button type="button" className={styles.next} onClick={() => { setApp(app === 0 ? 1 : 0); setPhase(0); }}>换成{apps[app === 0 ? 1 : 0]}<ArrowRight size={18} /></button>}
      <button type="button" className={styles.disconnect} disabled={!connected || phase === 2} onClick={() => setPhase(0)}>断开连接</button>
    </div>
    <div className={styles.history} data-visible={previous !== null && phase < 3} aria-hidden={previous === null || phase >= 3}>{previous && <div><span>上次取得 · {previous}</span><p>普通图书借期 30 天</p></div>}</div>
  </figure>;
}
