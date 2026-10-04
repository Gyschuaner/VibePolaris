"use client";

import { ArrowRight, CheckCircle, Code, Database, ShieldWarning, UserCircle, WarningCircle } from "@phosphor-icons/react";
import { SceneControls, useScene } from "../HarnessStoryScenes";
import styles from "./ApiTestingConcept.module.css";

const steps = [
  { label: "写下期待", title: "请求旁边先放两本账", detail: "一张账记协议回执，一张账记订单状态；只看其中一本，测试会漏掉另一半。" },
  { label: "首次创建", title: "201 只是第一张回执", detail: "用户 A 创建订单，响应带回 orderId，服务端也新增一行订单。" },
  { label: "核对两侧", title: "把响应和状态放在同一屏", detail: "状态码、字段形状和订单行数要一起落在断言里，才能解释这次通过。" },
  { label: "重试原请求", title: "同一幂等键不应再造订单", detail: "网络断开后重发同一请求，结果回到原订单，数据库仍保持一行。" },
  { label: "换成用户 B", title: "格式正确也不等于有权访问", detail: "B 拿着合法的订单编号来读 A 的订单，授权检查必须挡在数据前。" },
  { label: "合并断言", title: "三组请求合成一条证据链", detail: "成功、重试、越权分别有期待；任一侧偏离，API 测试都应亮红。" },
];

const scenarios = [
  { id: "create", method: "POST", path: "/orders", actor: "用户 A", key: "order-42", status: "201 Created", body: "orderId: ord-42", rows: "1 row", note: "新订单已落库" },
  { id: "retry", method: "POST", path: "/orders", actor: "用户 A · 重试", key: "order-42", status: "200 OK", body: "same orderId", rows: "1 row", note: "幂等键命中原结果" },
  { id: "forbidden", method: "GET", path: "/orders/ord-42", actor: "用户 B", key: "—", status: "403 Forbidden", body: "access denied", rows: "1 row", note: "数据没有被读走" },
  { id: "final", method: "3 CASES", path: "response + state", actor: "A → B", key: "key retained", status: "PASS", body: "201 · 200 · 403", rows: "1 row", note: "联合断言通过" },
] as const;

function snapshot(step: number) {
  if (step === 0) return { ...scenarios[0], status: "等待请求", body: "status + schema", rows: "0 rows", note: "先写期待，再发送" };
  if (step <= 2) return scenarios[0];
  if (step === 3) return scenarios[1];
  if (step === 4) return scenarios[2];
  return scenarios[3];
}

function assertions(step: number) {
  return [
    { label: "响应", value: step === 0 ? "待核对" : step === 4 ? "403" : step === 5 ? "3 statuses" : step === 3 ? "200 + same id" : "201 + orderId", good: step >= 1 },
    { label: "副作用", value: step < 1 ? "0 rows" : step === 5 ? "1 row" : step >= 3 ? "仍为 1 row" : "新增 1 row", good: step >= 2 },
    { label: "授权", value: step < 4 ? "未换身份" : step === 5 ? "B blocked" : "B → 403", good: step >= 4 },
  ];
}

export function ApiTestingHero() {
  const scene = useScene(steps.length);
  const current = steps[scene.step];
  const data = snapshot(scene.step);
  const complete = scene.step === steps.length - 1;

  return <figure ref={scene.ref} className={styles.apiHero} data-step={scene.step} aria-label="API 测试怎样同时检查响应、副作用、幂等重试和授权">
    <div className={styles.apiHeroHeader}><span>让接口回执和服务端状态互相作证</span><strong>request → response → state</strong></div>
    <SceneControls scene={scene} labels={steps.map(step => step.label)} />
    <div className={styles.apiHeroCanvas}>
      <section className={`${styles.apiRequest} ${scene.step === 0 || scene.step === 3 || scene.step === 4 ? styles.apiActive : ""}`}>
        <div className={styles.apiEyebrow}><Code size={17} aria-hidden="true" /><span>请求包 · test input</span></div>
        <div className={styles.apiActor}><UserCircle size={20} aria-hidden="true" /><strong>{data.actor}</strong><span>{data.method}</span></div>
        <code className={styles.apiPath}>{data.path}</code>
        <div className={styles.apiRequestRows}><span>Authorization</span><b>{data.actor.includes("B") ? "user-b" : "user-a"}</b><span>Idempotency-Key</span><b>{data.key}</b></div>
        <pre>{data.method === "GET" ? "GET /orders/ord-42" : "POST /orders\n{ sku: 'book', qty: 1 }"}</pre>
        <small>{scene.step === 4 ? "编号合法，身份不匹配" : scene.step === 3 ? "连接失败后重新发送" : "接口测试不需要先打开页面"}</small>
      </section>
      <div className={styles.apiFlow} aria-hidden="true"><ArrowRight size={22} /></div>
      <section className={`${styles.apiResponse} ${scene.step === 1 || scene.step === 2 || scene.step === 4 ? styles.apiActive : ""} ${scene.step === 4 ? styles.apiDanger : ""}`}>
        <div className={styles.apiEyebrow}><ShieldWarning size={17} aria-hidden="true" /><span>响应回执 · contract</span></div>
        <div className={`${styles.apiStatus} ${scene.step === 4 ? styles.apiStatusDanger : complete ? styles.apiStatusGood : ""}`}><strong>{data.status}</strong><span>{data.body}</span></div>
        <div className={styles.apiReceipt}><span>OpenAPI 期待</span><b>{scene.step === 0 ? "201 + orderId:string" : scene.step === 4 ? "403 + no order data" : "status + schema"}</b></div>
        <div className={styles.apiChecks}>{assertions(scene.step).map(item => <div key={item.label} data-good={item.good}><span>{item.label}</span><b>{item.value}</b></div>)}</div>
        <small>{scene.step === 0 ? "先写成功和错误响应的形状" : scene.step === 4 ? "HTTP 回执挡住了越权读取" : complete ? "三组回执和状态合成一次结论" : "回执只是其中一本账"}</small>
      </section>
      <section className={`${styles.apiState} ${scene.step >= 2 ? styles.apiActive : ""} ${complete ? styles.apiComplete : ""}`}>
        <div className={styles.apiEyebrow}><Database size={17} aria-hidden="true" /><span>服务端状态 · orders</span></div>
        <div className={styles.apiRows}><div><span>订单行</span><strong>{data.rows}</strong></div><div><span>ord-42</span><strong>{scene.step < 1 ? "不存在" : "owner: user-a"}</strong></div></div>
        <div className={styles.apiStateTrace}><span data-on={scene.step >= 1}>create</span><i data-on={scene.step >= 1} /><span data-on={scene.step >= 3}>retry</span><i data-on={scene.step >= 3} /><span data-on={scene.step >= 4}>authorize</span></div>
        <small>{data.note}</small>
      </section>
    </div>
    <div className={styles.apiHeroSummary}><div><span>本轮场景</span><strong>{data.method} {data.path}</strong></div><div><span>可观察结果</span><strong>{data.status}</strong></div><div><span>最终状态</span><strong>{complete ? "PASS · 联合断言" : "等待下一组请求"}</strong></div></div>
    <div className={`${styles.apiHeroStatus} ${scene.step === 4 ? styles.apiDanger : ""}`} role="status"><span className={scene.step === 4 ? styles.apiStatusIconDanger : ""}>{scene.step === 4 ? <WarningCircle size={19} aria-hidden="true" /> : <CheckCircle size={19} aria-hidden="true" />}</span><strong>{current.title}</strong><span>· {current.detail}</span></div>
    <figcaption>API 测试把“服务收到什么”和“服务留下什么”放在一起核对。</figcaption>
  </figure>;
}
