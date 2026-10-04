"use client";

import { ArrowRight, CheckCircle, Cpu, Database, Gear, Globe, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./IntegrationTestConcept.module.css";

const steps = [
  { label: "配置宿主", title: "给测试装一座小型现场", detail: "订单服务和测试数据库用真实实现，支付边界可以受控。", Icon: Gear },
  { label: "准备数据", title: "先把 schema 和起始状态写清", detail: "测试知道自己从哪张空桌子开始。", Icon: Database },
  { label: "发出请求", title: "让请求穿过真实接口边界", detail: "POST /orders 经过路由、校验、事务和存储。", Icon: Globe },
  { label: "注入故障", title: "支付返回 500，事务必须回滚", detail: "外部故障被控制，内部数据库仍然真实。", Icon: WarningCircle },
  { label: "核对两侧", title: "响应和数据库一起给证据", detail: "502 与 0 行记录同时成立，才证明没有留下订单。", Icon: CheckCircle },
];

export function IntegrationTestHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const request = scene.step >= 2;
  const failed = scene.step === 3;
  const verified = scene.step === 4;

  return <figure ref={scene.ref} className={styles.integrationHero} data-step={scene.step} aria-label="集成测试如何让请求穿过真实服务、数据库和受控外部故障">
    <div className={styles.integrationHeroHeader}><span>一笔订单怎样穿过真实边界再留下证据</span><strong>host → request → transaction → proof</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.integrationHeroBoard}>
      <div className={styles.integrationHeroRequest} data-active={scene.step === 2}>
        <div className={styles.integrationHeroLabel}><Globe size={17} aria-hidden="true" /><span>请求入口</span></div>
        <h3>POST /orders</h3>
        <code>{request ? "order-42 · ¥128" : "等待测试客户端"}</code>
        <div className={styles.integrationHeroRequestState}>{request ? "HTTP request" : "not sent"}</div>
        <small>不是直接调用某个函数，而是走一条接口边界。</small>
      </div>
      <div className={styles.integrationHeroArrow} aria-hidden="true"><span /><ArrowRight size={21} /></div>
      <div className={styles.integrationHeroRuntime} data-active={scene.step === 0 || scene.step === 1 || scene.step === 2 || failed} data-danger={failed}>
        <div className={styles.integrationHeroLabel}><Cpu size={17} aria-hidden="true" /><span>被测运行现场</span></div>
        <h3>Order Service</h3>
        <div className={styles.integrationHeroRuntimeRow}><Database size={14} aria-hidden="true" /><strong>PostgreSQL</strong><small>{scene.step === 1 ? "schema + seed=0" : "真实 schema"}</small></div>
        <div className={styles.integrationHeroRuntimeRow}><Gear size={14} aria-hidden="true" /><strong>Payment</strong><small>{failed ? "受控返回 500" : "外部边界"}</small></div>
        <div className={styles.integrationHeroRuntimeNote} data-danger={failed}>{failed ? <><WarningCircle size={15} aria-hidden="true" />rollback transaction</> : scene.step === 1 ? "schema ready · seed rows 0" : "service + database + dependency"}</div>
      </div>
      <div className={styles.integrationHeroArrow} aria-hidden="true"><span /><ArrowRight size={21} /></div>
      <div className={styles.integrationHeroProof} data-active={verified} data-danger={scene.step === 3}>
        <div className={styles.integrationHeroLabel}><CheckCircle size={17} aria-hidden="true" /><span>双重证据</span></div>
        <h3>{verified ? "回滚已证明" : "等待查询"}</h3>
        <div className={styles.integrationHeroProofRow}><span>response</span><strong>{verified ? "502" : "—"}</strong></div>
        <div className={styles.integrationHeroProofRow}><span>orders / outbox</span><strong>{verified ? "0 / 0 rows" : "—"}</strong></div>
        <small>{verified ? "HTTP 结果和真实状态同时对上" : "只看响应还不够"}</small>
      </div>
    </div>
    <div className={styles.integrationHeroSignal} data-active={failed || verified} data-danger={failed}><WarningCircle size={17} aria-hidden="true" /><span>{failed ? "支付失败被注入，内部事务应该回到起点" : verified ? "两个观察点同时成立，才是集成证据" : "把真实边界和受控故障放在同一场景里"}</span></div>
    <div className={styles.integrationHeroMetrics}>
      <div><span>真实组件</span><strong>service + DB</strong></div>
      <div><span>外部依赖</span><strong>{failed ? "500 可重现" : "可控制"}</strong></div>
      <div><span>最终证据</span><strong>{verified ? "response + rows" : "等待"}</strong></div>
    </div>
    <div className={styles.integrationHeroStatus} role="status"><current.Icon size={19} aria-hidden="true" /><span><strong>{current.title}</strong> · {current.detail}</span></div>
    <figcaption>集成测试把“组件之间能否一起工作”变成一条可观察的路径：依赖可以有控制面，但真正要验证的边界仍然要让真实协议、配置和状态参与。</figcaption>
  </figure>;
}
