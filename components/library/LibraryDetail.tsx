"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Copy, Check, DownloadSimple, Desktop, DeviceMobile, ArrowCounterClockwise, ArrowUpRight, Play, Pause } from "@phosphor-icons/react/dist/ssr";
import { libraryCategory, libraryCategories, libraryHref, libraryPage, libraryGroup, type LibraryItem } from "@/lib/library";
import { defaultSampleOptions, librarySource, type SampleOptions } from "@/lib/library-source";
import { LibraryPreview } from "./LibraryPreview";
import { libraryAnimation, animationCode, animationSource } from "@/lib/library-animations";
import styles from "./Library.module.css";

function CopyAction({ text, label, primary = false }: { text: string; label: string; primary?: boolean }) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function copy() {
    if (timer.current) clearTimeout(timer.current);
    try { await navigator.clipboard.writeText(text); setStatus("copied"); }
    catch { setStatus("error"); }
    timer.current = setTimeout(() => setStatus("idle"), 2200);
  }
  return <div><button type="button" className={primary ? styles.primary : styles.textButton} onClick={copy}>{status === "copied" ? <Check size={20} /> : <Copy size={20} />}{status === "copied" ? "已复制" : label}</button><span role="status" className={status === "error" ? styles.copyError : styles.srOnly}>{status === "error" ? "复制未成功，请选中内容手动复制。" : status === "copied" ? "已复制到剪贴板" : ""}</span></div>;
}

function LibraryBackLink() {
  const params = useSearchParams();
  const back = libraryHref(libraryCategory(params.get("category")), params.get("q") || "", params.get("sort") || "featured", undefined, libraryPage(params.get("page")), libraryGroup(params.get("group")));
  return <Link href={back} className={styles.back}><ArrowLeft size={21} />返回组件库</Link>;
}

export function LibraryDetail({ item, animationCss }: { item: LibraryItem; animationCss?: string }) {
  const [view, setView] = useState<"preview" | "code">("preview");
  const [device, setDevice] = useState("desktop"), [format, setFormat] = useState("react");
  const [options, setOptions] = useState(defaultSampleOptions);
  const [speed, setSpeed] = useState(1), [replay, setReplay] = useState(0), [paused, setPaused] = useState(false), [manual, setManual] = useState(false);
  const animation = libraryAnimation(item.slug);
  const [origin, setOrigin] = useState("https://vibe.chuansgu.top");
  useEffect(() => { setOrigin(window.location.origin); }, []);
  const source = animation ? animationCode(animation, animationCss || "", format, speed) : librarySource(item.slug, item.category === "style" ? "css" : format, options, origin);
  const asset = item.category === "asset";
  const controls: { key: keyof SampleOptions; label: string; min: number; max: number; step: number; suffix?: string }[] = item.slug === "soft-gradient" ? [{ key: "angle", label: "角度", min: 0, max: 360, step: 5, suffix: "°" }] : item.slug === "paper-shadow" ? [{ key: "radius", label: "圆角", min: 0, max: 32, step: 1 }, { key: "depth", label: "阴影", min: 4, max: 48, step: 1 }] : [{ key: "radius", label: "圆角", min: 0, max: 32, step: 1 }, { key: "speed", label: "速度", min: 0, max: 600, step: 20, suffix: " ms" }];
  return <main className={styles.detail} id="main-content">
    <Suspense fallback={<Link href="/library" className={styles.back}><ArrowLeft size={21} />返回组件库</Link>}><LibraryBackLink /></Suspense>
    <div className={styles.detailGrid}>
      <section className={styles.content} aria-labelledby="library-title">
        <header className={styles.detailHeading}><p className={styles.breadcrumb}>{libraryCategories[item.category]} · {item.group}</p><div className={styles.titleLine}><h1 id="library-title">{item.name}</h1><span>{item.english}</span></div><p className={styles.subtitle}>{item.description}</p></header>
        <div className={styles.stage}>
          <div className={styles.stageToolbar}>
            <div className={styles.viewTabs} role="group" aria-label="展示方式"><button type="button" aria-pressed={view === "preview"} onClick={() => setView("preview")}>预览</button>{!asset && <button type="button" aria-pressed={view === "code"} onClick={() => setView("code")}>代码</button>}</div>
            {view === "preview" && !asset && <div className={styles.devices} role="group" aria-label="预览宽度"><button type="button" aria-label="桌面预览" aria-pressed={device === "desktop"} onClick={() => setDevice("desktop")}><Desktop size={23} /></button><button type="button" aria-label="手机预览" aria-pressed={device === "mobile"} onClick={() => setDevice("mobile")}><DeviceMobile size={21} /></button></div>}
            {view === "code" && <span className={styles.codeFormat}>{item.category === "style" ? "CSS" : format === "react" ? "JSX" : "HTML + CSS"}</span>}
          </div>
          {view === "preview" ? <div className={styles.stagePreview} data-device={device} data-asset={asset}><LibraryPreview slug={item.slug} options={options} animationCss={animationCss} speed={speed} replay={replay} paused={paused} manual={manual} /></div> : <pre className={styles.code} tabIndex={0} aria-label={`${item.name}代码`}><code>{source}</code></pre>}
        </div>
        {!asset && !animation && <div className={styles.controls}>{controls.map(control => <label key={control.key}><span>{control.label}</span><input type="range" style={{ "--progress": `${100 * (options[control.key] - control.min) / (control.max - control.min)}%` } as CSSProperties} min={control.min} max={control.max} step={control.step} value={options[control.key]} onChange={event => setOptions({ ...options, [control.key]: Number(event.target.value) })} /><output>{options[control.key]}{control.suffix}</output></label>)}<button type="button" className={styles.textButton} onClick={() => setOptions({ ...defaultSampleOptions })}><ArrowCounterClockwise size={19} />重置</button></div>}
        {animation && <div className={styles.motionControls}><button type="button" onClick={() => { setReplay(replay + 1); setPaused(false); setManual(true); }}><ArrowCounterClockwise size={19} />播放 / 重播</button><button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)}>{paused ? <Play size={19} /> : <Pause size={19} />}{paused ? "继续" : "暂停"}</button><label>速度<select aria-label="播放速度" value={speed} onChange={event => setSpeed(Number(event.target.value))}>{[.5, 1, 1.5, 2].map(value => <option key={value} value={value}>{value}×</option>)}</select></label></div>}
      </section>
      <aside className={styles.usePanel} aria-label="使用当前条目">
        <section><h2>用到我的项目</h2>
          {(item.category === "component" || animation) && <div className={styles.formats} role="group" aria-label="代码格式"><button type="button" aria-pressed={format === "react"} onClick={() => setFormat("react")}>React</button><button type="button" aria-pressed={format === "html"} onClick={() => setFormat("html")}>HTML + CSS</button></div>}
          {asset ? <><dl className={styles.assetInfo}><div><dt>格式</dt><dd>{item.format}</dd></div><div><dt>尺寸</dt><dd>{item.dimensions}</dd></div></dl><a className={styles.primary} href={item.file} download><DownloadSimple size={21} />下载 {item.format}</a></> : <CopyAction text={source} label={item.category === "style" ? "复制 CSS" : "复制代码"} primary />}
          {item.slug === "expandable-card" && <p className={styles.sourceNote}>代码使用本站示例封面，可替换图片地址。</p>}
        </section>
        <section className={styles.promptSection}><h2>给 AI 的描述</h2><p>{item.prompt}</p><CopyAction text={item.prompt} label="复制描述" /></section>
        {animation && <section className={styles.assetSource}><h2>来源与许可</h2><p>{animationSource(animation).name} · MIT</p><a href={animation.sourceUrl} target="_blank" rel="noreferrer">查看原始效果<ArrowUpRight size={16} /></a><a href={`/library/animations/${animation.source}-LICENSE.txt`} download>下载许可证<DownloadSimple size={16} /></a></section>}
        {asset && <section className={styles.assetSource}><h2>来源与使用</h2>{item.slug === "line-icons" ? <><p>Phosphor Icons · MIT 许可</p><a href="https://github.com/phosphor-icons/core" target="_blank" rel="noreferrer">图标来源<ArrowUpRight size={16} /></a><a href="/library/phosphor-license.txt" download>下载许可证<DownloadSimple size={16} /></a></> : <p>为 VibePolaris 生成的纸张纹理，可下载用于页面设计。</p>}</section>}
      </aside>
    </div>
  </main>;
}
