"use client";

import { useState } from "react";
import { CheckCircle, Cpu, Database, Gear, Globe, LockSimple, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./IntegrationTestConcept.module.css";

const labels = ["准备环境", "发出请求", "走过边界", "核对状态"];
type DbMode = "real" | "mock";
type PaymentMode = "fail" | "success";

export function IntegrationTestLesson() {
  const scene = useScene(labels.length);
  const [dbMode, setDbMode] = useState<DbMode>("real");
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("fail");
  const realDb = dbMode === "real";
  const paymentFails = paymentMode === "fail";
  const final = scene.step === labels.length - 1;
  const proven = final && realDb;
  const reset = (next: () => void) => { next(); scene.seek(0); };

  return <div ref={scene.ref} className={styles.integrationLab} role="region" aria-label="集成测试真实数据库、支付故障和最终状态工作台">
    <div className={styles.integrationLabHeader}><span>只换一个边界，看看测试到底证明了什么</span><strong>{scene.step + 1} / {labels.length}</strong></div>
    <SceneControls scene={scene} labels={labels} />
    <div className={styles.integrationLabControls} role="group" aria-label="选择集成测试边界">
      <button type="button" className={styles.integrationLabButton} aria-pressed={realDb} onClick={() => reset(() => setDbMode("real"))}>真实数据库</button>
      <button type="button" className={styles.integrationLabButton} aria-pressed={!realDb} onClick={() => reset(() => setDbMode("mock"))}>Mock 仓储</button>
      <button type="button" className={styles.integrationLabButton} aria-pressed={paymentFails} onClick={() => reset(() => setPaymentMode("fail"))}>支付返回 500</button>
      <button type="button" className={styles.integrationLabButton} aria-pressed={!paymentFails} onClick={() => reset(() => setPaymentMode("success"))}>支付成功</button>
    </div>
    <div className={styles.integrationLabGrid}>
      <div className={styles.integrationLabPanel} data-active={scene.step === 0}>
        <div className={styles.integrationLabLabel}><Gear size={16} aria-hidden="true" /><span>测试宿主</span></div>
        <h3>test host</h3>
        <div className={styles.integrationLabValue}><span>依赖布局</span><strong>{realDb ? "real DB" : "mock repo"}</strong></div>
        <small>{realDb ? "真实 schema 和事务参与" : "只验证服务如何调用替身"}</small>
      </div>
      <div className={styles.integrationLabPanel + " " + styles.integrationLabRequest} data-active={scene.step === 1}>
        <div className={styles.integrationLabLabel}><Globe size={16} aria-hidden="true" /><span>HTTP 请求</span></div>
        <h3>POST /orders</h3>
        <div className={styles.integrationLabValue}><span>payload</span><strong>order-42</strong></div>
        <small>{scene.step < 1 ? "尚未发送" : "请求经过路由和校验"}</small>
      </div>
      <div className={styles.integrationLabPanel + " " + styles.integrationLabFlow} data-active={scene.step === 2} data-danger={paymentFails && scene.step === 2}>
        <div className={styles.integrationLabLabel}><Cpu size={16} aria-hidden="true" /><span>真实协作</span></div>
        <h3>service → {paymentFails ? "payment 500" : "payment 201"}</h3>
        <div className={styles.integrationLabValue}><span>transaction</span><strong>{scene.step < 2 ? "等待" : paymentFails ? "rollback" : "commit"}</strong></div>
        <small>{paymentFails ? "用受控故障触发错误路径" : "外部依赖返回成功"}</small>
      </div>
      <div className={styles.integrationLabPanel + " " + styles.integrationLabProof} data-active={scene.step === 3} data-danger={final && !realDb}>
        <div className={styles.integrationLabLabel}>{final && !realDb ? <WarningCircle size={16} aria-hidden="true" /> : <CheckCircle size={16} aria-hidden="true" />}<span>状态证据</span></div>
        <h3>{!final ? "等待查询" : !realDb ? "证据不足" : paymentFails ? "回滚成立" : "提交成立"}</h3>
        <div className={styles.integrationLabValue}><span>response / rows</span><strong>{!final ? "—" : !realDb ? "mock / mock" : paymentFails ? "502 / 0" : "201 / 1"}</strong></div>
        <small>{!realDb ? "替身的 0 行不能证明真实数据库没有写入" : paymentFails ? "错误响应和真实行数同时核对" : "响应与持久化状态一起通过"}</small>
      </div>
    </div>
    <div className={styles.integrationLabMetrics}>
      <div><span>被测范围</span><strong>{realDb ? "3 boundaries" : "service only"}</strong></div>
      <div><span>副作用</span><strong>{!final ? "未知" : paymentFails ? "0 rows" : "1 row"}</strong></div>
      <div><span>测试结论</span><strong>{!final ? "未运行" : proven ? "可证明" : "范围不足"}</strong></div>
    </div>
    <p className={styles.integrationLabNote} data-danger={final && !realDb} role="status">
      {!final ? <><LockSimple size={17} aria-hidden="true" /><span>先配置测试宿主，再让请求走过边界；集成测试的速度可以控制，真实协作的证据不能靠口头假设。</span></> : !realDb ? <><WarningCircle size={17} aria-hidden="true" /><span>Mock 仓储可以让服务测试很快，但它没有执行真实 SQL、schema 或事务。这个结果最多证明调用协议，不足以证明集成。</span></> : paymentFails ? <><CheckCircle size={17} aria-hidden="true" /><span>支付故障被控制在外部边界，服务和数据库仍然真实；502 与 0 行记录一起出现，回滚才有证据。</span></> : <><CheckCircle size={17} aria-hidden="true" /><span>真实数据库提交了 1 行，响应也返回成功。这个测试覆盖了组件协作，不需要把整条用户旅程搬进浏览器。</span></>}
    </p>
  </div>;
}
