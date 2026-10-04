"use client";

import { ArrowRight, CheckCircle, Globe, LockKey, Pause, Play, ShieldCheck, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { firewallSources } from "@/lib/backend-boundary-sources";
import styles from "./network-boundary-pages.module.css";

const frames = [
  { label: "请求到门口", packet: "公网 → admin:22", rule: "等待比对", result: "还没有决定" },
  { label: "匹配拒绝", packet: "公网 → admin:22", rule: "deny · public · 22", result: "连接被丢弃，留下拒绝日志" },
  { label: "只放行需要的", packet: "office → report:443", rule: "allow · office · 443", result: "健康检查通过，其他入口仍关着" },
];

function FirewallHero() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setStep(current => {
        if (current >= frames.length - 1) {
          setPlaying(false);
          return current;
        }
        return current + 1;
      });
    }, 1050);
    return () => window.clearInterval(timer);
  }, [playing]);

  const current = frames[step];
  return <figure className={styles.firewallHero} data-step={step} aria-label="防火墙按来源、目标和端口决定网络请求是否通过">
    <div className={styles.firewallHeroTop}><span>仓库东门 · 一次连接</span><strong>{current.result}</strong></div>
    <div className={styles.firewallHeroFlow}>
      <div className={styles.firewallHeroPacket}><Globe size={20} aria-hidden="true" /><span>{current.packet}</span><small>新到请求</small></div>
      <ArrowRight className={styles.firewallHeroArrow} size={22} aria-hidden="true" />
      <div className={styles.firewallHeroGate}><ShieldCheck size={24} aria-hidden="true" /><span>防火墙</span><strong>{current.rule}</strong><small>先看规则，再让包裹进门</small></div>
      <ArrowRight className={styles.firewallHeroArrow} size={22} aria-hidden="true" />
      <div className={styles.firewallHeroRoom} data-allowed={step === 2}><LockKey size={22} aria-hidden="true" /><span>{step === 2 ? "报表服务" : "内部服务"}</span><strong>{step === 2 ? "443 已收到" : "尚未接收"}</strong></div>
    </div>
    <div className={styles.firewallHeroTimeline} role="group" aria-label="防火墙首图步骤">
      {frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={index === step} onClick={() => { setStep(index); setPlaying(false); }}>{frame.label}</button>)}
    </div>
    <div className={styles.firewallHeroControls} role="group" aria-label="控制防火墙首图动画">
      <button type="button" onClick={() => setPlaying(value => !value)}>{playing ? <Pause size={15} /> : <Play size={15} />} {playing ? "暂停" : "播放"}</button>
      <button type="button" onClick={() => { setStep(0); setPlaying(false); }}>重播</button>
    </div>
  </figure>;
}

function FirewallLesson() {
  const [step, setStep] = useState(0);
  const [wideRule, setWideRule] = useState(false);
  const states = [
    { packet: "公网 → admin:22", rule: "来源 public · 目标 admin · 端口 22", evidence: "匹配拒绝规则，连接在服务收到前被丢弃。", icon: <XCircle size={21} aria-hidden="true" /> },
    { packet: "office → report:443", rule: "来源 office · 目标 report · 端口 443", evidence: "只放行报表服务的 HTTPS 检查，其他端口没有顺手打开。", icon: <CheckCircle size={21} aria-hidden="true" /> },
  ];
  const current = states[step];
  return <div className={styles.firewallLab} role="region" aria-label="防火墙规则匹配演示">
    <div className={styles.firewallLabHeader}><div><span>规则匹配台</span><strong>同一个门，换一条规则会发生什么</strong></div><span>{wideRule ? "过宽规则" : step === 0 ? "步骤 1/2" : "步骤 2/2"}</span></div>
    <div className={styles.firewallLabLane}>
      <div className={styles.firewallLabNode}><Globe size={19} aria-hidden="true" /><span>来源</span><strong>{current.packet.split(" → ")[0]}</strong></div>
      <ArrowRight size={20} aria-hidden="true" />
      <div className={styles.firewallLabNode} data-warning={wideRule}><ShieldCheck size={19} aria-hidden="true" /><span>门卫比对</span><strong>{wideRule ? "allow · any · any" : current.rule}</strong></div>
      <ArrowRight size={20} aria-hidden="true" />
      <div className={styles.firewallLabNode} data-allowed={!wideRule && step === 1}><LockKey size={19} aria-hidden="true" /><span>目的服务</span><strong>{wideRule ? "不该开的也能进" : step === 1 ? "report:443" : "admin:22 · 未到达"}</strong></div>
    </div>
    <div className={styles.firewallEvidence} data-warning={wideRule}>
      {wideRule ? <WarningCircle size={21} aria-hidden="true" /> : current.icon}
      <p><strong>{wideRule ? "规则太宽" : current.packet}</strong>{wideRule ? "为了让一次检查通过而允许所有来源和端口，读者已经无法从规则解释哪些连接应该进来。" : current.evidence}</p>
    </div>
    <div className={styles.firewallControls} role="group" aria-label="切换防火墙请求和规则">
      <button type="button" aria-pressed={step === 0 && !wideRule} onClick={() => { setStep(0); setWideRule(false); }}>看被拒连接</button>
      <button type="button" aria-pressed={step === 1 && !wideRule} onClick={() => { setStep(1); setWideRule(false); }}>看必要放行</button>
      <button type="button" aria-pressed={wideRule} onClick={() => setWideRule(value => !value)}>看过宽规则</button>
    </div>
  </div>;
}

export function FirewallTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={firewallSources} />;
  return <ConceptArticle slug="firewall" title="防火墙" subtitle="Firewall · 在网络边界按规则放行或丢弃流量" sources={firewallSources} sections={[
    ["firewall-rule", "门口先看规则，不看网页按钮"],
    ["firewall-scope", "规则解决边界，不解决身份"],
    ["firewall-operation", "默认拒绝、记录和验证"],
  ]} hero={<FirewallHero />} intro={<>你在仓库里开了一扇给报表服务用的门，却发现公网一直有人敲 <code>admin:22</code>。防火墙像门口的值班员：它先看流量从哪里来、要去哪里、走哪个端口，再决定这只“包裹”能不能继续。它管的是网络边界，不是登录页面。</>}>
    <ArticleSection id="firewall-rule" title="门口先看规则，不看网页按钮">
      <p id="firewall-definition" className="vp-citation-target">防火墙可以是主机上的程序，也可以是夹在网络之间的设备或云规则。它根据来源、目标、协议、端口和方向等条件控制流量，动作通常是允许、拒绝或记录。NIST 把它描述成控制不同安全姿态的网络或主机之间流量的机制。<Cite id="firewall-definition" /></p>
      <p id="firewall-policy" className="vp-citation-target">一条规则不是“这个网页能不能打开”，而是“这类流量能不能经过这一道边界”。例如只允许办公网访问报表服务的 443 端口，意味着报表服务仍需自己检查请求、登录和数据权限；防火墙只负责把明显不该到达的流量挡在更外面。<Cite id="firewall-policy" /></p>
      <FirewallLesson />
    </ArticleSection>
    <ArticleSection id="firewall-scope" title="规则解决边界，不解决身份">
      <p id="firewall-boundary" className="vp-citation-target">把请求放行到服务器，和允许某个用户读取一份报表，是两次判断。安全组、主机防火墙和网络 ACL 可能分别位于云网络、实例和子网层；规则应用在哪一层，会改变它能看见的地址和状态。不要把一条“端口开放”读成“业务已经授权”。<Cite id="firewall-boundary" /></p>
      <p id="firewall-state" className="vp-citation-target">有状态的规则可以把已建立连接的返回流量和新连接区分开，但“有状态”不等于“永远信任这台机器”。规则仍应限制来源和目的；应用层还要处理身份、会话、对象归属和输入校验。<Cite id="firewall-state" /></p>
    </ArticleSection>
    <ArticleSection id="firewall-operation" title="默认拒绝、记录和验证">
      <p id="firewall-rules" className="vp-citation-target">规则顺序、默认动作和例外决定了维护成本。只为确实需要的路径开门，给每条例外写清用途，先在测试环境验证，再观察拒绝日志；否则一条临时“允许所有”很容易变成长期暴露。云安全组通常是有状态的，但具体默认行为和规则上限仍以产品文档为准。<Cite id="firewall-rules" /></p>
      <p id="firewall-order" className="vp-citation-target">排查“服务连不上”时，沿请求的真实路径看：它从哪个地址出发，经过哪层防火墙，目标端口是否监听，返回流量是否能回去。规则放行只证明它没有在这一关被挡住；还要用日志、抓包或应用健康检查证明请求真的到达并得到正确结果。<Cite id="firewall-order" /></p>
      <p id="firewall-testing" className="vp-citation-target"><strong>一条可用规则应能说出三件事：</strong>谁能从哪里访问谁、只需要哪个协议和端口、失败时在哪里留下证据。说不清这三点时，先缩小范围和补日志，再增加权限。</p>
    </ArticleSection>
  </ConceptArticle>;
}
