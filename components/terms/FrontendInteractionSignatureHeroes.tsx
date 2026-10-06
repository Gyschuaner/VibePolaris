"use client";

import { ArrowRight, ArrowsClockwise, Browser, Check, CheckCircle, Code, Cursor, DeviceMobile, Eye, FileCode, Fingerprint, Gear, Gauge, GitBranch, Key, Lightning, MapPinLine, Monitor, Package, Ruler, ShieldCheck, WarningCircle } from "@phosphor-icons/react";
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

const deepLinkLabels = ["系统先匹配", "已登录直达", "登录后续走", "网页回退"];
type DeepLinkBranch = "direct" | "login" | "fallback";
export function DeepLinkSignatureHero() {
  const scene = useScene(deepLinkLabels.length);
  const [branch, setBranch] = useState<DeepLinkBranch>("direct");
  const labels: Record<DeepLinkBranch, string> = { direct: "已登录", login: "未登录", fallback: "未安装" };
  const reset = () => setBranch("direct");
  return <HeroShell scene={scene} title="一条链接如何决定应用入口" labels={deepLinkLabels} onReplay={reset} className={styles.routeHero}>
    <div className={styles.branchTabs} role="group" aria-label="选择链接环境">{(Object.keys(labels) as DeepLinkBranch[]).map((key) => <button key={key} type="button" aria-pressed={branch === key} onClick={() => { setBranch(key); scene.seek(0); }}>{labels[key]}</button>)}</div>
    <div className={styles.deepLinkBoard} data-step={scene.step} data-branch={branch}>
      <div className={styles.linkTicket}><Browser size={23} /><span>活动链接</span><code>/orders/42</code></div>
      <div className={styles.routeGate}><Gear size={24} /><strong>系统匹配</strong><small>域名 · 路径 · 会话</small><span className={styles.routePulse} /></div>
      <div className={styles.routeTargets}>
        <div data-active={branch === "direct" && scene.step > 0}><CheckCircle size={19} /><span>订单 42</span><small>应用内目标</small></div>
        <div data-active={branch === "login" && scene.step > 1}><Key size={19} /><span>登录页</span><small>保留 returnTo</small></div>
        <div data-active={branch === "fallback" && scene.step > 2}><ArrowRight size={19} /><span>网页回退</span><small>应用未安装</small></div>
      </div>
    </div>
  </HeroShell>;
}

const manifestLabels = ["声明完整", "入口缺失", "权限缺失", "链接缺失"];
type ManifestPart = "entry" | "permission" | "link";
export function AppManifestSignatureHero() {
  const scene = useScene(manifestLabels.length);
  const [missing, setMissing] = useState<ManifestPart | null>(null);
  const names: Record<ManifestPart, string> = { entry: "入口", permission: "相机权限", link: "链接匹配" };
  const reset = () => setMissing(null);
  return <HeroShell scene={scene} title="应用清单怎样让平台读懂应用" labels={manifestLabels} onReplay={reset} className={styles.manifestHero}>
    <div className={styles.manifestToggles} role="group" aria-label="移除一项清单声明">{(Object.keys(names) as ManifestPart[]).map((key) => <button key={key} type="button" aria-pressed={missing === key} onClick={() => { setMissing(key); scene.seek(0); }}>{missing === key ? `已移除${names[key]}` : `移除${names[key]}`}</button>)}</div>
    <div className={styles.manifestBoard} data-step={scene.step} data-missing={missing ?? "none"}>
      <div className={styles.manifestFile}><FileCode size={24} /><strong>Manifest</strong><span>平台读取的声明</span><b>entry · permission · link</b></div>
      <div className={styles.manifestPorts}>
        <div data-missing={missing === "entry"}><span>入口</span><strong>主界面</strong><i>{missing === "entry" ? "未声明" : "可启动"}</i></div>
        <div data-missing={missing === "permission"}><span>能力</span><strong>相机</strong><i>{missing === "permission" ? "无法请求" : "已声明"}</i></div>
        <div data-missing={missing === "link"}><span>链接</span><strong>/orders/*</strong><i>{missing === "link" ? "不匹配" : "可处理"}</i></div>
      </div>
      <div className={styles.manifestSystem}><DeviceMobile size={25} /><span>系统结果</span><strong>{scene.step === 0 ? "按声明启动" : missing === "entry" ? "没有入口" : missing === "permission" ? "运行时需另行请求" : missing === "link" ? "回退网页" : "读取声明"}</strong></div>
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
