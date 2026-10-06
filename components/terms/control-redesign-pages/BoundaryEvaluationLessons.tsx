"use client";

import { useState, type ReactNode } from "react";
import styles from "./ControlRedesignConcepts.module.css";

function LessonShell({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <section className={styles.toolLesson} aria-label={title}><div className={styles.lessonHeader}><small>{eyebrow}</small><strong>{title}</strong></div>{children}</section>;
}

export function BoundaryLesson() {
  const [salary, setSalary] = useState(false);
  const [expanded, setExpanded] = useState(false);
  return <LessonShell eyebrow="提示词可以解释边界，授权层才执行边界" title="资源访问闸门"><div className={styles.lessonControls}><button type="button" aria-pressed={salary} onClick={() => setSalary(value => !value)}>{salary ? "撤回工资表请求" : "请求读取工资表"}</button><button type="button" aria-pressed={expanded} onClick={() => setExpanded(value => !value)}>{expanded ? "收回 read:salary" : "授予 read:salary"}</button><button type="button" onClick={() => { setSalary(false); setExpanded(false); }}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>令牌</span><code>{expanded ? "read:sales + read:salary" : "read:sales"}</code><em>{expanded ? "范围扩大" : "最小权限"}</em></div><div className={styles.labRow}><span>请求</span><code>{salary ? expanded ? "salary → allow" : "salary → deny" : "sales → allow"}</code><em>{salary && !expanded ? "边界拦截" : "已匹配"}</em></div><div className={styles.labRow}><span>审计</span><code>{salary ? expanded ? "授权后重试 · 记录" : "越界请求 · 记录" : "等待请求"}</code><em>{salary ? "可回查" : "尚无事件"}</em></div></div></LessonShell>;
}

export function XssLesson() {
  const [safe, setSafe] = useState(false);
  const [trusted, setTrusted] = useState(false);
  return <LessonShell eyebrow="浏览器会按插入位置解释字符串" title="评论进入 DOM"><div className={styles.lessonControls}><button type="button" aria-pressed={!safe} onClick={() => setSafe(false)}>用 innerHTML</button><button type="button" aria-pressed={safe} onClick={() => setSafe(true)}>用 textContent</button><button type="button" aria-pressed={trusted} onClick={() => setTrusted(value => !value)}>{trusted ? "关闭 Trusted Types" : "启用 Trusted Types"}</button><button type="button" onClick={() => { setSafe(false); setTrusted(false); }}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>输入</span><code>&lt;img onerror=…&gt;</code><em>不可信字符串</em></div><div className={styles.labRow}><span>DOM</span><code>{safe ? "0 个可执行节点" : trusted ? "策略拒绝危险 sink" : "1 个事件属性"}</code><em>{safe || trusted ? "按文本处理" : "被浏览器解析"}</em></div><div className={styles.labRow}><span>页面</span><code>{safe ? "字符原样可见" : trusted ? "写入被阻断" : "脚本可能执行"}</code><em>{safe || trusted ? "风险下降" : "需修复"}</em></div></div></LessonShell>;
}

export function SkillLesson() {
  const [stage, setStage] = useState<"meta" | "body" | "resource">("meta");
  const labels = { meta: "任务匹配", body: "读取 SKILL.md", resource: "调用脚本" };
  return <LessonShell eyebrow="先看描述，再把细节按需带进上下文" title="技能披露阶梯"><div className={styles.lessonControls}><button type="button" aria-pressed={stage === "meta"} onClick={() => setStage("meta")}>只看元数据</button><button type="button" aria-pressed={stage === "body"} onClick={() => setStage("body")}>匹配后读正文</button><button type="button" aria-pressed={stage === "resource"} onClick={() => setStage("resource")}>需要时读资源</button><button type="button" onClick={() => setStage("meta")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>常驻</span><code>name + description</code><em>约 100 token</em></div><div className={styles.labRow}><span>当前</span><code>{stage === "meta" ? "等待任务匹配" : stage === "body" ? "SKILL.md 已进入上下文" : "SKILL.md + 脚本输出"}</code><em>{labels[stage]}</em></div><div className={styles.labRow}><span>资源</span><code>{stage === "resource" ? "scripts/convert.py → 结果" : "暂不读取"}</code><em>{stage === "resource" ? "按需暴露" : "保持隐藏"}</em></div></div></LessonShell>;
}

export function EvaluationRunLesson() {
  const [traceComplete, setTraceComplete] = useState(false);
  const [sameSet, setSameSet] = useState(true);
  return <LessonShell eyebrow="总分、轨迹和题集是三件事，缺一个就停在不可比较" title="运行账本"><div className={styles.lessonControls}><button type="button" aria-pressed={traceComplete} onClick={() => setTraceComplete(value => !value)}>{traceComplete ? "撤回两条轨迹" : "补回两条轨迹"}</button><button type="button" aria-pressed={sameSet} onClick={() => setSameSet(value => !value)}>{sameSet ? "换一版题集" : "恢复 support-v1"}</button><button type="button" onClick={() => { setTraceComplete(false); setSameSet(true); }}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>条件</span><code>{sameSet ? "support-v1 · rubric-v2" : "support-v2 · rubric-v2"}</code><em>{sameSet ? "一致" : "题集变了"}</em></div><div className={styles.labRow}><span>结果</span><code>10 / 12 通过</code><em>独立于轨迹数</em></div><div className={styles.labRow}><span>轨迹</span><code>{traceComplete ? "12 / 12" : "10 / 12"}</code><em>{traceComplete ? "逐项可回查" : "缺两条"}</em></div><div className={styles.labRow}><span>比较</span><code>{traceComplete && sameSet ? "run-17 ↔ run-18" : "不可比较"}</code><em>{traceComplete && sameSet ? "条件满足" : "先补证据"}</em></div></div></LessonShell>;
}

export function SafetyEvaluationLesson() {
  const [risk, setRisk] = useState<"normal" | "overreach" | "leak">("normal");
  const states = { normal: ["自己的订单", "完成", "0 次敏感工具"], overreach: ["读取他人工资", "拒绝", "0 次敏感工具"], leak: ["间接注入", "阻断", "1 次泄露 · fail"] } as const;
  return <LessonShell eyebrow="拒答只是表面，工具和数据状态才是安全证据" title="风险任务闸门"><div className={styles.lessonControls}><button type="button" aria-pressed={risk === "normal"} onClick={() => setRisk("normal")}>正常任务</button><button type="button" aria-pressed={risk === "overreach"} onClick={() => setRisk("overreach")}>越权请求</button><button type="button" aria-pressed={risk === "leak"} onClick={() => setRisk("leak")}>间接注入</button><button type="button" onClick={() => setRisk("normal")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>案例</span><code>{states[risk][0]}</code><em>{risk === "normal" ? "允许" : "高风险"}</em></div><div className={styles.labRow}><span>回答</span><code>{states[risk][1]}</code><em>{risk === "normal" ? "任务完成" : "安全门"}</em></div><div className={styles.labRow}><span>副作用</span><code>{states[risk][2]}</code><em>{risk === "leak" ? "门槛失败" : "保持为零"}</em></div></div></LessonShell>;
}

export function CostEvaluationLesson() {
  const [variant, setVariant] = useState<"a" | "b" | "cache">("a");
  const values = { a: ["17 / 20", "¥0.42", "预算内"], b: ["18 / 20", "¥1.16", "超预算"], cache: ["18 / 20", "¥0.82", "条件不同"] } as const;
  return <LessonShell eyebrow="单价要放回一次完整任务的质量和消耗" title="成本与质量同屏"><div className={styles.lessonControls}><button type="button" aria-pressed={variant === "a"} onClick={() => setVariant("a")}>方案 A</button><button type="button" aria-pressed={variant === "b"} onClick={() => setVariant("b")}>方案 B · 冷缓存</button><button type="button" aria-pressed={variant === "cache"} onClick={() => setVariant("cache")}>方案 B · 命中缓存</button><button type="button" onClick={() => setVariant("a")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>质量</span><code>{values[variant][0]}</code><em>20 条固定题</em></div><div className={styles.labRow}><span>成本</span><code>{values[variant][1]}</code><em>{variant === "b" ? "含重试" : variant === "cache" ? "缓存命中" : "一次工具调用"}</em></div><div className={styles.labRow}><span>结论</span><code>{values[variant][2]}</code><em>{variant === "cache" ? "先统一条件" : "预算 ¥1.00"}</em></div></div></LessonShell>;
}

export function LatencyEvaluationLesson() {
  const [state, setState] = useState<"normal" | "tail" | "timeout">("normal");
  const values = { normal: ["420ms", "1.8s", "3.4s", "p95 3.8s"], tail: ["420ms", "1.8s", "3.4s", "p95 4.8s"], timeout: ["420ms", "5.0s 超时", "未完成", "不纳入完成分布"] } as const;
  return <LessonShell eyebrow="用户先看到首字，系统后来才完成任务" title="等待时间拆解"><div className={styles.lessonControls}><button type="button" aria-pressed={state === "normal"} onClick={() => setState("normal")}>正常完成</button><button type="button" aria-pressed={state === "tail"} onClick={() => setState("tail")}>放大长尾</button><button type="button" aria-pressed={state === "timeout"} onClick={() => setState("timeout")}>工具超时</button><button type="button" onClick={() => setState("normal")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>首字</span><code>{values[state][0]}</code><em>开始反馈</em></div><div className={styles.labRow}><span>工具</span><code>{values[state][1]}</code><em>{state === "timeout" ? "等待失败" : "返回"}</em></div><div className={styles.labRow}><span>完成</span><code>{values[state][2]}</code><em>{values[state][3]}</em></div></div></LessonShell>;
}

export function PassFailLesson() {
  const [result, setResult] = useState<"pass" | "fail" | "unscored">("pass");
  const values = { pass: ["answer.json + amount=120", "pass", "允许进入门槛"], fail: ["answer.json + amount=90", "fail", "进入修复"], unscored: ["环境不可读", "unscored", "暂停并重跑"] } as const;
  return <LessonShell eyebrow="先写成功证据，再把缺证据和失败分开" title="三态判定器"><div className={styles.lessonControls}><button type="button" aria-pressed={result === "pass"} onClick={() => setResult("pass")}>证据正确</button><button type="button" aria-pressed={result === "fail"} onClick={() => setResult("fail")}>字段错误</button><button type="button" aria-pressed={result === "unscored"} onClick={() => setResult("unscored")}>环境不可读</button><button type="button" onClick={() => setResult("pass")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>检查</span><code>{values[result][0]}</code><em>可观察证据</em></div><div className={styles.labRow}><span>结果</span><code>{values[result][1]}</code><em>{result === "unscored" ? "暂时无结论" : "判据有结论"}</em></div><div className={styles.labRow}><span>门槛</span><code>{values[result][2]}</code><em>动作已写明</em></div></div></LessonShell>;
}

export function RubricLesson() {
  const [sample, setSample] = useState<"complete" | "missing" | "overclaim">("complete");
  const values = { complete: ["事实 ✓ · 条件 ✓ · 风险 ✓", "3 / 3", "可复核"], missing: ["事实 ✓ · 条件 ✕ · 风险 ✓", "2 / 3", "回到缺失条件"], overclaim: ["事实 ? · 条件 ✕ · 风险 ✕", "0 / 3", "没有支持证据"] } as const;
  return <LessonShell eyebrow="量表把一句印象拆成逐项证据" title="评分规则试算"><div className={styles.lessonControls}><button type="button" aria-pressed={sample === "complete"} onClick={() => setSample("complete")}>保留条件</button><button type="button" aria-pressed={sample === "missing"} onClick={() => setSample("missing")}>漏掉条件</button><button type="button" aria-pressed={sample === "overclaim"} onClick={() => setSample("overclaim")}>越界承诺</button><button type="button" onClick={() => setSample("complete")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>回答</span><code>{sample === "complete" ? "审核后，三个工作日到账" : sample === "missing" ? "三个工作日到账" : "马上到账且一定免费"}</code><em>同一题</em></div><div className={styles.labRow}><span>逐项</span><code>{values[sample][0]}</code><em>维度不合并</em></div><div className={styles.labRow}><span>总分</span><code>{values[sample][1]}</code><em>{values[sample][2]}</em></div></div></LessonShell>;
}

export function HumanGraderLesson() {
  const [caseType, setCaseType] = useState<"agree" | "split" | "missing">("agree");
  const values = { agree: ["甲 4/5 · 乙 4/5", "一致", "保留共同理由"], split: ["甲 4/5 · 乙 2/5", "第三人 3/5", "写回校准样例"], missing: ["甲 unscored · 乙 unscored", "等待证据", "不塞进通过率"] } as const;
  return <LessonShell eyebrow="人工的价值不是永远一致，而是把分歧留下来" title="双人评审校准"><div className={styles.lessonControls}><button type="button" aria-pressed={caseType === "agree"} onClick={() => setCaseType("agree")}>评分一致</button><button type="button" aria-pressed={caseType === "split"} onClick={() => setCaseType("split")}>出现分歧</button><button type="button" aria-pressed={caseType === "missing"} onClick={() => setCaseType("missing")}>证据不足</button><button type="button" onClick={() => setCaseType("agree")}>重置</button></div><div className={styles.labGrid}><div className={styles.labRow}><span>独立分数</span><code>{values[caseType][0]}</code><em>先遮住彼此结果</em></div><div className={styles.labRow}><span>校准</span><code>{values[caseType][1]}</code><em>{caseType === "split" ? "回到规则" : "记录状态"}</em></div><div className={styles.labRow}><span>留下</span><code>{values[caseType][2]}</code><em>可供下轮复查</em></div></div></LessonShell>;
}
