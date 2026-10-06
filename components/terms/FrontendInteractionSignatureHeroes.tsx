"use client";

import { ArrowRight, ArrowsClockwise, Browser, Check, CheckCircle, Cloud, Code, Cube, Cursor, Database, DeviceMobile, Eye, FileCode, Fingerprint, Gear, Gauge, GitBranch, Key, Layout, Lightning, MapPinLine, Monitor, Package, Ruler, ShieldCheck, SpeakerHigh, Stack, Target, WarningCircle } from "@phosphor-icons/react";
import { useScene, SceneControls } from "./HarnessStoryScenes";
import { useState } from "react";
import type { ReactNode } from "react";
import styles from "./FrontendInteractionSignatureHeroes.module.css";

type Scene = ReturnType<typeof useScene>;

function HeroShell({ scene, title, labels, children, caption, onReplay, className = "" }: { scene: Scene; title: string; labels: string[]; children: ReactNode; caption?: ReactNode; onReplay?: () => void; className?: string }) {
  return <div className={`${styles.hero} ${className}`} ref={scene.ref} role="region" aria-label={title}>
    <SceneControls scene={scene} labels={labels} compact onReplay={onReplay} />
    <div className={styles.canvas}>{children}</div>
    <div className={styles.caption} aria-live="polite" key={`${title}-${scene.step}`}><span>{String(scene.step + 1).padStart(2, "0")}</span><div>{caption ?? <strong>{labels[scene.step]}</strong>}</div></div>
  </div>;
}

const semanticLabels = ["普通容器", "区域被识别", "原生按钮"];
export function SemanticHtmlSignatureHero() {
  const scene = useScene(semanticLabels.length);
  const markup = scene.step === 0 ? "<div>" : scene.step === 1 ? "<nav> <main>" : "<button>";
  const tree = scene.step === 0 ? "generic × 6" : scene.step === 1 ? "navigation · main" : "button · Enter/Space";
  return <HeroShell scene={scene} title="语义化 HTML 如何改变机器读到的结构" labels={semanticLabels}>
    <div className={styles.semanticBoard} data-step={scene.step}>
      <div className={styles.semanticSource}><span>源代码</span><Code size={22} /><code>{markup}</code><small>{scene.step === 2 ? "操作职责被声明" : "只是视觉容器"}</small></div>
      <ArrowRight className={styles.semanticArrow} size={22} aria-hidden="true" />
      <div className={styles.semanticTree}>
        <div className={styles.treeHeader}><GitBranch size={18} aria-hidden="true" /><span>浏览器解析</span></div>
        <div className={styles.treeRoot}>DOM</div>
        <div className={styles.treeBranches}><i /><i /><i /></div>
        <div className={`${styles.semanticAssistive} ${scene.step === 0 ? styles.isMuted : ""}`}><Eye size={19} /><div><span>无障碍树</span><strong>{tree}</strong></div>{scene.step === 2 ? <CheckCircle size={18} /> : null}</div>
      </div>
    </div>
  </HeroShell>;
}

type DeepLinkBranch = "direct" | "login" | "fallback";
const deepLinkSteps: Record<DeepLinkBranch, string[]> = {
  direct: ["系统先匹配", "交给应用", "读出订单号", "打开订单 42"],
  login: ["系统先匹配", "先到登录页", "登录后保留目标", "继续订单 42"],
  fallback: ["系统先匹配", "没有可用应用", "保留原网址", "打开订单网页"],
};
export function DeepLinkSignatureHero() {
  const scene = useScene(4);
  const [branch, setBranch] = useState<DeepLinkBranch>("direct");
  const labels: Record<DeepLinkBranch, string> = { direct: "已登录", login: "未登录", fallback: "未安装" };
  const reset = () => setBranch("direct");
  return <HeroShell scene={scene} title="一条链接如何决定应用入口" labels={deepLinkSteps[branch]} onReplay={reset} className={styles.routeHero}>
    <div className={styles.branchTabs} role="group" aria-label="选择链接环境">{(Object.keys(labels) as DeepLinkBranch[]).map((key) => <button key={key} type="button" aria-pressed={branch === key} onClick={() => { setBranch(key); scene.seek(0); }}>{labels[key]}</button>)}</div>
    <div className={styles.deepLinkBoard} data-step={scene.step} data-branch={branch}>
      <div className={styles.linkTicket}><Browser size={23} /><span>活动链接</span><code>/orders/42</code></div>
      <div className={styles.routeGate}><Gear size={24} /><strong>{scene.step === 0 ? "系统匹配" : branch === "fallback" ? "交回浏览器" : "交给应用"}</strong><small>域名 · 路径</small><span className={styles.routePulse} /></div>
      <div className={styles.routeTargets}>
        <div data-active={branch !== "fallback" && (scene.step === 3 || branch === "direct" && scene.step === 2)}><CheckCircle size={19} /><span>订单 42</span><small>{scene.step === 3 && branch !== "fallback" ? "应用内页面已打开" : "目标 id=42"}</small></div>
        <div data-active={branch === "login" && scene.step > 0 && scene.step < 3}><Key size={19} /><span>登录页</span><small>returnTo=/orders/42</small>{branch === "login" && scene.step > 0 && scene.step < 3 ? <button type="button" onClick={() => scene.seek(3)}>登录并继续</button> : null}</div>
        <div data-active={branch === "fallback" && scene.step === 3}><ArrowRight size={19} /><span>网页回退</span><small>{branch === "fallback" && scene.step === 3 ? "订单网页已打开" : "原网址仍可访问"}</small></div>
      </div>
    </div>
  </HeroShell>;
}

const manifestLabels = ["声明完整", "入口缺失", "权限缺失", "链接缺失"];
type ManifestPart = "entry" | "permission" | "link";
export function AppManifestSignatureHero() {
  const scene = useScene(manifestLabels.length);
  const parts: ManifestPart[] = ["entry", "permission", "link"];
  const missing = parts[scene.step - 1] ?? null;
  const names: Record<ManifestPart, string> = { entry: "入口", permission: "相机权限", link: "链接匹配" };
  return <HeroShell scene={scene} title="应用清单怎样让平台读懂应用" labels={manifestLabels} className={styles.manifestHero}>
    <div className={styles.manifestToggles} role="group" aria-label="移除一项清单声明">{parts.map((key, index) => <button key={key} type="button" aria-pressed={missing === key} onClick={() => scene.seek(missing === key ? 0 : index + 1)}>{missing === key ? `恢复${names[key]}` : `移除${names[key]}`}</button>)}</div>
    <div className={styles.manifestBoard} data-step={scene.step} data-missing={missing ?? "none"}>
      <div className={styles.manifestFile}><FileCode size={24} /><strong>Manifest</strong><span>Android 示例</span><b>{parts.map(part => <span key={part}>{missing === part ? <del>{part}</del> : part}{" "}</span>)}</b></div>
      <div className={styles.manifestPorts}>
        <div data-missing={missing === "entry"}><span>入口</span><strong>主界面</strong><i>{missing === "entry" ? "未声明" : "可启动"}</i></div>
        <div data-missing={missing === "permission"}><span>能力</span><strong>相机</strong><i>{missing === "permission" ? "无法请求" : "可请求授权"}</i></div>
        <div data-missing={missing === "link"}><span>链接</span><strong>/orders/*</strong><i>{missing === "link" ? "不匹配" : "可处理"}</i></div>
      </div>
      <div className={styles.manifestSystem}><DeviceMobile size={25} /><span>系统结果</span><strong>{missing === "entry" ? "找不到主界面入口" : missing === "permission" ? "相机请求被拒绝" : missing === "link" ? "链接回退网页" : "主界面可启动"}</strong></div>
    </div>
  </HeroShell>;
}

const emulatorLabels = ["覆盖配置", "复现条件", "真机校验"];
export function EmulatorSignatureHero() {
  const scene = useScene(emulatorLabels.length);
  return <HeroShell scene={scene} title="同一构建如何在仿真器和真机之间分工" labels={emulatorLabels} className={styles.emulatorHero}>
    <div className={styles.emulatorBuild}><Package size={20} /><span>同一构建</span><code>build 42</code><Check size={17} /></div>
    <div className={styles.emulatorBoard} data-step={scene.step}>
      <div className={styles.deviceCard}><div className={styles.deviceTop}><Monitor size={20} /><span>仿真器</span></div><div className={styles.deviceScreen}><div className={styles.signal}><MapPinLine size={18} /><span>{scene.step > 0 ? "位置已注入" : "可配置"}</span></div><div className={styles.signal}><ArrowsClockwise size={18} /><span>{scene.step > 0 ? "网络可重复" : "网络场景"}</span></div></div><small>功能与异常可重复</small></div>
      <div className={styles.checkSpine}><span /><span /><span /></div>
      <div className={`${styles.deviceCard} ${styles.physicalDevice}`}><div className={styles.deviceTop}><DeviceMobile size={20} /><span>真机</span></div><div className={styles.deviceScreen}><div className={styles.signal}><Gauge size={18} /><span>{scene.step === 2 ? "功耗实测" : "待确认"}</span></div><div className={styles.signal}><Lightning size={18} /><span>{scene.step === 2 ? "触觉实测" : "硬件差异"}</span></div></div><small>{scene.step === 2 ? "硬件证据已补齐" : "硬件项不能假定"}</small></div>
    </div>
  </HeroShell>;
}

const signingLabels = ["生成摘要", "私钥签名", "设备验签", "篡改拒绝"];
export function CodeSigningSignatureHero() {
  const scene = useScene(signingLabels.length);
  return <HeroShell scene={scene} title="代码签名如何让篡改留下证据" labels={signingLabels} className={styles.signingHero}>
    <div className={styles.signingBoard} data-step={scene.step}>
      <div className={styles.packageCard}><Package size={24} /><strong>APK</strong><span>同一份构建产物</span><div className={styles.byteStrip}>{["A1", "C4", "7E", "09", "F2", "4B"].map((byte, index) => <b key={byte} data-changed={scene.step === 3 && index === 3}>{scene.step === 3 && index === 3 ? "00" : byte}</b>)}</div></div>
      <ArrowRight className={styles.signingArrow} size={22} aria-hidden="true" />
      <div className={styles.signatureColumn}><div className={styles.digest}><Fingerprint size={21} /><span>摘要</span><code>{scene.step === 0 ? "sha256 · 等待" : "sha256 · 已固定"}</code></div><div className={styles.keySeal}><Key size={21} /><span>私钥</span><b>{scene.step > 0 ? "已签名" : "未使用"}</b></div></div>
      <ArrowRight className={styles.signingArrow} size={22} aria-hidden="true" />
      <div className={`${styles.verifyCard} ${scene.step === 3 ? styles.isRejected : ""}`}><ShieldCheck size={24} /><span>设备验签</span><strong>{scene.step < 2 ? "尚未验证" : scene.step === 2 ? "验证通过" : "拒绝安装"}</strong>{scene.step === 3 ? <WarningCircle size={18} /> : scene.step === 2 ? <CheckCircle size={18} /> : null}</div>
    </div>
  </HeroShell>;
}

const gestureLabels = ["按下，等待更多输入", "短距离抬起", "快速移动", "停留后移动"];
const gesturePaths = ["M 46 90 L 46 90", "M 46 90 L 88 82", "M 46 90 C 105 84 160 54 222 26", "M 46 90 C 52 52 82 62 112 34 C 144 8 175 24 222 26"];
const gestureMeasures = ["1 个触点 · 0 px", "距离 42 px · 120 ms", "速度 1.8 px/ms", "持续 620 ms · 方向改变"];
export function GestureSignatureHero() {
  const scene = useScene(gestureLabels.length);
  const results = ["等待", "tap", "swipe", "drag"];
  return <HeroShell scene={scene} title="触点轨迹如何变成手势结果" labels={gestureLabels} className={styles.gestureHero}>
    <div className={styles.gestureBoard} data-step={scene.step}>
      <div className={styles.gestureTrack}><svg viewBox="0 0 260 120" role="img" aria-label="触点轨迹"><path d={gesturePaths[scene.step]} className={styles.gesturePath} /><circle cx={scene.step === 0 ? 46 : scene.step === 1 ? 88 : 222} cy={scene.step === 0 ? 90 : scene.step === 1 ? 82 : 26} r="7" className={styles.gesturePointer} /></svg><div className={styles.gestureOrigin}><Cursor size={17} />按下</div></div>
      <div className={styles.gestureReadout}><span>识别器读到</span><div className={styles.gestureMeasure}><Ruler size={18} /><strong>{gestureMeasures[scene.step]}</strong></div><div className={styles.gestureResult}><span>结果</span><b>{results[scene.step]}</b></div><small>{scene.step === 0 ? "还不能决定是哪种手势" : "阈值、方向和时间共同参与"}</small></div>
    </div>
  </HeroShell>;
}

const hapticLabels = ["选择发生", "确认成功", "警告或失败", "设备不可用"];
export function HapticFeedbackSignatureHero() {
  const scene = useScene(hapticLabels.length);
  const modes = ["selection", "success", "warning", "fallback"];
  return <HeroShell scene={scene} title="语义事件如何变成触觉并保留可见回退" labels={hapticLabels} className={styles.hapticHero}>
    <div className={styles.hapticBoard} data-step={scene.step} data-mode={modes[scene.step]} data-playing={scene.playing}>
      <div className={styles.hapticEvent}><span>语义事件</span><strong>{hapticLabels[scene.step]}</strong><small>{scene.step === 0 ? "选中一项" : scene.step === 1 ? "保存成功" : scene.step === 2 ? "操作被拒绝" : "执行器无响应"}</small></div>
      <div className={styles.hapticMode}><Lightning size={23} /><span>平台模式</span><b>{scene.step === 0 ? "selection" : scene.step === 1 ? "notification.success" : scene.step === 2 ? "notification.warning" : "无可用模式"}</b></div>
      <div className={styles.hapticActuator}><div className={styles.pulseRings} key={scene.step} aria-hidden="true">{scene.step < 3 ? Array.from({ length: scene.step + 1 }, (_, index) => <i key={index} style={{ animationDelay: `${index * .16}s` }} />) : null}</div><DeviceMobile size={26} /><span>设备执行器</span><b>{scene.step === 3 ? "不播放" : "触感示意"}</b></div>
      <div className={styles.hapticFallback}><Eye size={19} /><SpeakerHigh size={19} /><div><span>同时保留</span><strong>{scene.step === 3 ? "文字 + 视觉" : "文字 + 视觉 + 可选声音"}</strong></div></div>
    </div>
  </HeroShell>;
}

const touchLabels = ["只按图标命中", "扩大不可见热区", "重放相同落点", "发现边界相撞"];
const touchPoints = [["12%", "24%"], ["40%", "70%"], ["63%", "31%"], ["82%", "72%"], ["28%", "46%"], ["56%", "82%"], ["73%", "56%"], ["18%", "78%"], ["90%", "38%"], ["46%", "18%"]];
export function TouchTargetSignatureHero() {
  const scene = useScene(touchLabels.length);
  const target = { left: 55, top: 50 };
  const neighborLeft = scene.step === 3 ? 55 : 72;
  const radius = scene.step === 0 ? 22 : 52;
  const hits = touchPoints.map(([left, top]) => {
    const dx = Number.parseFloat(left) - target.left;
    const dy = Number.parseFloat(top) - target.top;
    return Math.hypot(dx, dy) <= radius;
  });
  return <HeroShell scene={scene} title="图标、热区和相邻间距如何共同决定命中" labels={touchLabels} className={styles.touchHero}>
    <div className={styles.touchBoard} data-step={scene.step}>
      <div className={styles.touchStage}><div className={styles.touchTarget} style={{ left: `${target.left}%`, top: `${target.top}%` }}><span className={styles.touchHitbox} /><Cube size={18} /><b>图标</b></div><div className={styles.touchNeighbor} style={{ left: `${neighborLeft}%`, top: "50%" }}><Cube size={16} /><span>邻居</span></div>{touchPoints.map(([left, top], index) => <i className={styles.touchPoint} style={{ left, top }} key={`${left}-${top}`} data-hit={hits[index]} />)}</div>
      <div className={styles.touchReadout}><Target size={23} /><span>同一组十个落点</span><strong>{scene.step < 3 ? `命中 ${hits.filter(Boolean).length} / 10` : "两块热区相撞"}</strong><small>{scene.step === 0 ? "可见像素决定命中" : scene.step === 1 ? "容器内边距扩大热区" : scene.step === 2 ? "重放输入检查漏点" : "邻居靠近后，边界开始重叠"}</small></div>
    </div>
  </HeroShell>;
}

const offlineLabels = ["断网仍可编辑", "操作进入队列", "恢复网络上传", "选择字段结果"];
export function OfflineFirstSignatureHero() {
  const scene = useScene(offlineLabels.length);
  return <HeroShell scene={scene} title="离线编辑怎样先落本地再处理同步冲突" labels={offlineLabels} className={styles.offlineHero}>
    <div className={styles.offlineBoard} data-step={scene.step}>
      <div className={styles.noteCard}><span>编辑器</span><strong>周报</strong><small>{scene.step === 0 ? "断网 · 本地已保存" : "标题改动已追踪"}</small><Code size={18} /></div>
      <div className={styles.localStack}><Database size={21} /><span>本地数据</span><b>已持久化</b><i /></div>
      <div className={styles.outboxTile}><Stack size={21} /><span>待同步队列</span><b>{scene.step === 0 ? "尚未入队" : scene.step === 1 ? "操作 7 · 待上传" : scene.step === 2 ? "上传中" : "0 条待同步"}</b></div>
      <div className={styles.serverTile}><Cloud size={22} /><span>服务器</span><b>{scene.step < 2 ? "v12" : scene.step === 2 ? "v13 · 冲突" : "v14 · 已确认"}</b></div>
      <div className={styles.conflictTile} data-visible={scene.step === 3}><GitBranch size={20} /><span>冲突选择</span><b>{scene.step === 3 ? "保留本地标题" : "等待比较"}</b></div>
    </div>
  </HeroShell>;
}

const adaptiveLabels = ["窄屏单任务", "中宽保留上下文", "宽屏改成侧栏", "焦点仍在原任务"];
export function AdaptiveLayoutSignatureHero() {
  const scene = useScene(adaptiveLabels.length);
  const [completed, setCompleted] = useState(false);
  const reset = () => setCompleted(false);
  const widths = ["390", "720", "1000", "1000"];
  return <HeroShell scene={scene} title="窗口变宽时怎样重排关系并保留任务" labels={adaptiveLabels} onReplay={reset} className={styles.adaptiveHero}>
    <div className={styles.adaptiveBoard} data-step={scene.step}>
      <div className={styles.windowBar}><Layout size={19} /><span>应用窗口</span><strong>{widths[scene.step]} · 教学示例</strong><input aria-label="拖宽窗口" type="range" min="0" max="3" value={scene.step} onChange={(event) => scene.seek(Number(event.currentTarget.value))} /></div>
      <div className={styles.adaptiveWindow}><div className={styles.adaptiveNav}><span>导航</span><i /><i /><i /></div>{scene.step < 1 ? null : <div className={styles.adaptiveList}><span>任务列表</span><b>任务 8</b><i>任务 7</i><i>任务 9</i></div>}<div className={styles.adaptiveDetail}><span>任务详情</span><strong>任务 8</strong><p>订单资料仍在这里</p><button type="button" aria-label="任务 8 完成" aria-pressed={completed} data-focused={scene.step === 0 || scene.step === 3} onClick={() => setCompleted(true)}><Check size={15} />{completed ? "已完成" : "完成"}</button></div></div>
      <div className={styles.adaptiveProof}><Target size={18} /><span>{completed ? "焦点：任务 8 · 已完成" : scene.step === 0 || scene.step === 3 ? "焦点：任务 8 · 完成" : "选中：任务 8"}</span><CheckCircle size={18} /></div>
    </div>
  </HeroShell>;
}
