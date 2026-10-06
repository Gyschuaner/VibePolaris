"use client";

import { ArrowCounterClockwise, ArrowDown, ArrowRight, Browser, CheckCircle, Clock, Code, Envelope, FileText, GitBranch, Gauge, HardDrives, LockKey, Package, Scissors, ShieldCheck, Target, WarningCircle } from "@phosphor-icons/react";
import { useState, type ReactNode } from "react";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import styles from "./ProductCoreSignatureHeroes.module.css";

function Header({ eyebrow, meta }: { eyebrow: string; meta: string }) {
  return <div className={styles.header}><span>{eyebrow}</span><strong>{meta}</strong></div>;
}

function Result({ icon: Icon, title, detail }: { icon: typeof CheckCircle; title: string; detail: string }) {
  return <div className={styles.result} role="status"><Icon size={19} aria-hidden="true" /><span><strong>{title}</strong> · {detail}</span></div>;
}

function Frame({ ariaLabel, className, eyebrow, meta, labels, scene, children, result, caption }: {
  ariaLabel: string;
  className?: string;
  eyebrow: string;
  meta: string;
  labels: string[];
  scene: ReturnType<typeof useScene>;
  children: ReactNode;
  result: { icon: typeof CheckCircle; title: string; detail: string };
  caption: string;
}) {
  return <figure ref={scene.ref} className={`${styles.frame} ${className ?? ""}`} aria-label={ariaLabel} data-step={scene.step}>
    <Header eyebrow={eyebrow} meta={meta} />
    <SceneControls scene={scene} labels={labels} />
    {children}
    <Result {...result} />
    <figcaption>{caption}</figcaption>
  </figure>;
}

export function RuntimeSignatureHero() {
  const scene = useScene(4);
  const [environment, setEnvironment] = useState<"browser" | "node">("browser");
  const labels = ["放入代码", "选运行时", "对照能力", "停在边界"];
  const current = [
    { title: "代码还没有环境", detail: "同一张卡片，尚未执行", icon: Code },
    { title: environment === "browser" ? "浏览器接住它" : "Node.js 接住它", detail: environment === "browser" ? "DOM 插槽已打开" : "文件系统插槽已打开", icon: environment === "browser" ? Browser : HardDrives },
    { title: environment === "browser" ? "DOM 能力可用" : "文件能力可用", detail: environment === "browser" ? "document.querySelector()" : "fs.readFile()", icon: environment === "browser" ? CheckCircle : CheckCircle },
    { title: environment === "browser" ? "换 API 就会撞边界" : "换 API 就会撞边界", detail: environment === "browser" ? "fs 不在浏览器运行时" : "document 不在 Node 默认环境", icon: WarningCircle },
  ][scene.step];

  return <Frame ariaLabel="运行时决定一段代码能够使用哪些环境能力" className={styles.runtime} eyebrow="代码带着环境一起运行" meta="same code · different runtime" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="运行时不是把代码重新写一遍，而是决定这次执行能拿到哪些宿主能力；换环境时，先找能力边界。">
    <div className={styles.runtimeControls} role="group" aria-label="选择运行环境">
      <button type="button" aria-pressed={environment === "browser"} onClick={() => { setEnvironment("browser"); scene.seek(1); }}><Browser size={15} />浏览器</button>
      <button type="button" aria-pressed={environment === "node"} onClick={() => { setEnvironment("node"); scene.seek(1); }}><HardDrives size={15} />Node.js</button>
    </div>
    <div className={styles.runtimeBoard} data-environment={environment} data-step={scene.step}>
      <div className={styles.runtimeCode}><span>同一段代码</span><code>readThing()</code><div><b data-enabled={environment === "browser" && scene.step >= 2}>document</b><b data-enabled={environment === "node" && scene.step >= 2}>fs</b></div></div>
      <ArrowRight className={styles.runtimeArrow} size={20} aria-hidden="true" />
      <div className={styles.runtimeHost}><div className={styles.runtimeHostTop}>{environment === "browser" ? <Browser size={20} /> : <HardDrives size={20} />}<strong>{environment === "browser" ? "Browser" : "Node.js"}</strong></div><div className={styles.runtimeSlots}><span data-open={environment === "browser" && scene.step >= 2}>DOM</span><span data-open={environment === "node" && scene.step >= 2}>文件系统</span></div><small>{scene.step < 2 ? "等待环境接入" : scene.step === 2 ? "能力已挂上" : environment === "browser" ? "fs → 不存在" : "document → 不存在"}</small></div>
    </div>
  </Frame>;
}

export function PackageSignatureHero() {
  const scene = useScene(4);
  const [resolution, setResolution] = useState<"range" | "lock">("lock");
  const labels = ["写下范围", "展开依赖", "盖上锁印", "隔天重装"];
  const current = [
    { title: "范围还没变成版本", detail: "A ^1.2.0 · 允许一段 1.x", icon: Package },
    { title: "直接依赖带出间接依赖", detail: "A → B → color-utils", icon: GitBranch },
    { title: "精确版本被记录", detail: "lockfile · integrity", icon: LockKey },
    { title: resolution === "lock" ? "同一棵树可重现" : "范围相同也可能换版本", detail: resolution === "lock" ? "color-utils 1.4.2" : "color-utils 1.5.0", icon: resolution === "lock" ? CheckCircle : WarningCircle },
  ][scene.step];

  return <Frame ariaLabel="包管理把版本范围解析成可复现的依赖树" className={styles.package} eyebrow="范围不是一棵树，锁文件才是一次安装的快照" meta="range → tree → lock" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="package.json 说允许哪些版本，锁文件记录这次究竟装了哪些版本；它让安装可复现，却不替你判断依赖是否安全。">
    <div className={styles.packageControls} role="group" aria-label="选择安装是否使用锁文件">
      <button type="button" aria-pressed={resolution === "lock"} onClick={() => { setResolution("lock"); scene.seek(3); }}><LockKey size={15} />按锁文件</button>
      <button type="button" aria-pressed={resolution === "range"} onClick={() => { setResolution("range"); scene.seek(3); }}><Package size={15} />只按范围</button>
    </div>
    <div className={styles.packageBoard} data-resolution={resolution} data-step={scene.step}>
      <div className={styles.packageManifest}><span>package.json</span><code>A: ^1.2.0</code><small>允许范围</small></div>
      <div className={styles.packageTree}><span className={styles.treeLabel}>依赖树</span><div className={styles.treeRoot}>A <small>1.2.0</small></div><div className={styles.treeBranches}><b>B <small>2.0.1</small></b><b>color-utils <small>{resolution === "lock" ? "1.4.2" : "1.5.0"}</small></b></div><i className={styles.treeLine} aria-hidden="true" /></div>
      <div className={styles.packageLock} data-visible={scene.step >= 2 && resolution === "lock"}><LockKey size={20} /><strong>{resolution === "lock" ? "package-lock" : "再解析"}</strong><small>{scene.step >= 2 && resolution === "lock" ? "exact + integrity" : "没有精确印记"}</small></div>
    </div>
  </Frame>;
}

export function TypeScriptSignatureHero() {
  const scene = useScene(4);
  const [payload, setPayload] = useState<"valid" | "unknown">("unknown");
  const labels = ["收到未知值", "压过类型尺", "编译通过", "运行时再验"];
  const current = [
    { title: "外部数据没有类型承诺", detail: "payload: unknown", icon: FileText },
    { title: "类型尺要求先缩窄", detail: "typeof payload === 'object'", icon: ShieldCheck },
    { title: "静态检查通过", detail: "编译器只检查写出来的路径", icon: CheckCircle },
    { title: payload === "valid" ? "运行时形状匹配" : "运行时仍可能撞墙", detail: payload === "valid" ? "name 是字符串" : "name 实际是数字", icon: payload === "valid" ? CheckCircle : WarningCircle },
  ][scene.step];

  return <Frame ariaLabel="TypeScript 的静态类型检查与运行时输入校验是两道不同的门" className={styles.typescript} eyebrow="类型尺能提前看见一部分错误" meta="static check ≠ runtime proof" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="TypeScript 的类型在编译检查里发挥作用；来自网络、文件或用户的值仍要在运行时验证，类型通过不等于数据已经可信。">
    <div className={styles.typescriptControls} role="group" aria-label="选择运行时输入形状">
      <button type="button" aria-pressed={payload === "unknown"} onClick={() => { setPayload("unknown"); scene.seek(3); }}><WarningCircle size={15} />未校验 JSON</button>
      <button type="button" aria-pressed={payload === "valid"} onClick={() => { setPayload("valid"); scene.seek(3); }}><CheckCircle size={15} />通过运行时校验</button>
    </div>
    <div className={styles.typescriptBoard} data-payload={payload} data-step={scene.step}>
      <div className={styles.typeSource}><span>源代码</span><code><b>type</b> Profile = &#123; name: string &#125;</code><code>const p: Profile = payload</code><small>编译器看到的约束</small></div>
      <ArrowDown className={styles.typeArrow} size={19} aria-hidden="true" />
      <div className={styles.typeRuntime}><div className={styles.typeRuntimeHead}><FileText size={19} /><strong>真实输入</strong></div><code>&#123; name: {payload === "valid" ? '"Lin"' : "42"} &#125;</code><div className={styles.typeGate}><ShieldCheck size={14} /><span>{scene.step < 3 ? "尚未校验" : payload === "valid" ? "shape ok" : "shape mismatch"}</span></div></div>
      <div className={styles.typeBadge} data-visible={scene.step >= 2}>{scene.step >= 2 ? "类型尺已移开" : "类型尺"}</div>
    </div>
  </Frame>;
}

export function MvpSignatureHero() {
  const scene = useScene(4);
  const [scope, setScope] = useState<"minimum" | "full">("minimum");
  const labels = ["写下假设", "选关键任务", "砍掉外围", "留下证据"];
  const current = [
    { title: "先写要验证的猜测", detail: "邀请码能被找到吗？", icon: Target },
    { title: "只保留一条关键任务", detail: "进入空间 → 找到邀请码", icon: Gauge },
    { title: scope === "minimum" ? "外围功能先留在桌上" : "功能太多，证据被摊薄", detail: scope === "minimum" ? "支付 · 多语言 · 分享" : "无法知道哪一项改变结果", icon: Scissors },
    { title: scope === "minimum" ? "任务留下可观察证据" : "还没学到关键答案", detail: scope === "minimum" ? "3/3 找到邀请码" : "完成 ≠ 验证假设", icon: scope === "minimum" ? CheckCircle : WarningCircle },
  ][scene.step];

  return <Frame ariaLabel="MVP 通过缩小范围验证一个关键产品假设" className={styles.mvp} eyebrow="少做一点，是为了更快知道什么是真的" meta="hypothesis · task · evidence" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="MVP 的最小指的是验证范围，不是粗糙程度；留下关键任务和证据，才能知道下一轮该保留、修改还是放弃。">
    <div className={styles.mvpControls} role="group" aria-label="选择产品范围"><button type="button" aria-pressed={scope === "minimum"} onClick={() => { setScope("minimum"); scene.seek(3); }}><Target size={15} />一个假设</button><button type="button" aria-pressed={scope === "full"} onClick={() => { setScope("full"); scene.seek(3); }}><Gauge size={15} />完整愿望单</button></div>
    <div className={styles.mvpBoard} data-scope={scope} data-step={scene.step}>
      <div className={styles.mvpTarget}><Target size={22} /><span>本轮假设</span><strong>邀请码能找到</strong><small>判断：用户是否完成关键任务</small></div>
      <div className={styles.mvpChips} aria-label="功能筹码">{["入口", "邀请码", "支付", "分享", "多语言"].map((item, index) => <span key={item} data-keep={index < 2 && scene.step >= 1} data-extra={index > 1}>{item}</span>)}</div>
      <div className={styles.mvpEvidence}><span>证据槽</span><strong>{scope === "minimum" && scene.step >= 3 ? "3 / 3" : "—"}</strong><small>{scope === "minimum" && scene.step >= 3 ? "找到邀请码" : "等待可观察结果"}</small></div>
    </div>
  </Frame>;
}

export function UserFlowSignatureHero() {
  const scene = useScene(4);
  const [branch, setBranch] = useState<"success" | "expired">("expired");
  const labels = ["发出任务票", "打开入口", "遇到分支", "回到任务"];
  const current = [
    { title: "任务从一个真实入口开始", detail: "找回账号 · 邮件链接", icon: Envelope },
    { title: "入口把人带到当前任务", detail: "输入新密码", icon: ArrowRight },
    { title: branch === "expired" ? "票据过期，不把人丢在门外" : "票据有效，任务继续", detail: branch === "expired" ? "重新发送 → 原任务" : "验证通过 → 保存", icon: branch === "expired" ? Clock : CheckCircle },
    { title: branch === "expired" ? "恢复点保留了原任务" : "成功也要落到明确结果", detail: branch === "expired" ? "邮箱字段仍在" : "账号已恢复", icon: branch === "expired" ? ArrowCounterClockwise : CheckCircle },
  ][scene.step];

  return <Frame ariaLabel="用户流程把入口、分支和恢复点接成一条可回来的任务" className={styles.userFlow} eyebrow="画的是任务怎样回来，不是页面怎样排队" meta="entry · branch · recovery" labels={labels} scene={scene} result={{ icon: current.icon, title: current.title, detail: current.detail }} caption="用户流程要把失败也接回目标；过期链接是一次分支，重新发送后仍应回到原来的任务，而不是回到无关首页。">
    <div className={styles.userFlowControls} role="group" aria-label="选择用户流程分支"><button type="button" aria-pressed={branch === "expired"} onClick={() => { setBranch("expired"); scene.seek(2); }}><Clock size={15} />链接过期</button><button type="button" aria-pressed={branch === "success"} onClick={() => { setBranch("success"); scene.seek(2); }}><CheckCircle size={15} />链接有效</button></div>
    <div className={styles.userFlowBoard} data-branch={branch} data-step={scene.step}>
      <div className={styles.flowTicket}><Envelope size={20} /><span>入口票据</span><strong>找回账号</strong><small>邮件链接</small></div>
      <div className={styles.flowTurn}><div className={styles.flowGate}><span>{branch === "expired" ? "过期" : "有效"}</span><b>{branch === "expired" ? "重新发送" : "保存新密码"}</b></div><i className={styles.flowArc} aria-hidden="true" /><ArrowRight size={19} aria-hidden="true" /></div>
      <div className={styles.flowHome}><span>恢复点</span><strong>{branch === "expired" ? "继续输入" : "账号已恢复"}</strong><small>{branch === "expired" ? "原任务仍在" : "完成状态"}</small></div>
    </div>
  </Frame>;
}
