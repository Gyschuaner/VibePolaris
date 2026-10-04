"use client";

import { ArrowCounterClockwise, ArrowRight, BracketsCurly, CheckCircle, Code, FileCode, FileText, Funnel, Gear, Globe, Pause, Play, Radio, Stack, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { mimeTypeSources } from "@/lib/backend-boundary-sources";
import styles from "./network-boundary-pages.module.css";

const frames = [
  {
    label: "声明选中 HTML",
    result: "DOM · h1",
    header: "text/html; charset=utf-8",
    body: "<h1>Hi</h1>",
    parser: "HTML tokenizer",
    parserDetail: "识别标签和文本",
    evidence: "标题节点出现",
    note: "同一串字节被声明为 HTML，接收端按 HTML 的规则拆出元素和文本；Content-Type 是解释入口。",
    active: ["label", "body", "parser", "result"],
  },
  {
    label: "换成纯文本",
    result: "literal · <h1>Hi</h1>",
    header: "text/plain; charset=utf-8",
    body: "<h1>Hi</h1>",
    parser: "text decoder",
    parserDetail: "不进入 HTML 语法",
    evidence: "尖括号原样显示",
    note: "字节没有变化，声明变了；纯文本解析器把尖括号当作字符，不会凭空长出标题节点。",
    active: ["label", "body", "parser", "result"],
  },
  {
    label: "JSON 先过语法",
    result: "SyntaxError",
    header: "application/json",
    body: '{"count": }',
    parser: "JSON parser",
    parserDetail: "期待一个值",
    evidence: "错误停在 }",
    note: "application/json 只告诉接收端用 JSON 规则尝试解析，不能把缺少值的字节修成合法 JSON。",
    active: ["label", "body", "parser", "result"],
  },
  {
    label: "压缩是另一层",
    result: "object · { count: 2 }",
    header: "application/json · Content-Encoding: gzip",
    body: "1f 8b · compressed bytes",
    parser: "gunzip → JSON",
    parserDetail: "先解码，再按类型解释",
    evidence: "得到 count=2",
    note: "Content-Encoding 负责把压缩层解开，Content-Type 仍负责说明解开后是什么格式；两层不能互相替代。",
    active: ["label", "body", "parser", "result"],
  },
];

const scenarios = [
  {
    label: "text/plain · 原样显示",
    header: "Content-Type: text/plain",
    body: "<h1>Hi</h1>",
    parser: "text decoder",
    result: "literal text",
    status: "ok",
    note: "类型声明为纯文本，接收端保留尖括号，不把它当 HTML 标签。",
  },
  {
    label: "text/html · 进入 DOM",
    header: "Content-Type: text/html",
    body: "<h1>Hi</h1>",
    parser: "HTML parser",
    result: "h1 element",
    status: "ok",
    note: "字节相同，解释规则不同；HTML 解析器会按标记构造元素树。",
  },
  {
    label: "application/json · 内容不合法",
    header: "Content-Type: application/json",
    body: '{"count": }',
    parser: "JSON.parse",
    result: "SyntaxError",
    status: "error",
    note: "声明格式不是校验通过的证明；解析器在缺少值的位置停止。",
  },
  {
    label: "multipart · boundary 分段",
    header: "Content-Type: multipart/form-data; boundary=demo",
    body: "--demo · part A · part B",
    parser: "boundary splitter",
    result: "2 parts",
    status: "ok",
    note: "multipart 是容器类型，boundary 把字段和文件分成独立部分；它不是某一种文件格式。",
  },
  {
    label: "错配 · 可能触发 sniffing",
    header: "Content-Type: text/plain",
    body: "<script>…</script>",
    parser: "user-agent policy",
    result: "不要猜成 HTML",
    status: "warning",
    note: "服务器声明和字节内容不一致时，浏览器可能按上下文嗅探；不同实现的结果和安全后果都不该靠猜。",
  },
];

function MimeTypeHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const ResultIcon = current.result === "SyntaxError" ? XCircle : CheckCircle;
  return <figure ref={scene.ref} className={styles.mimeTypeHero} data-step={scene.step} aria-label="MIME 类型从 Content-Type 声明到解析结果的过程">
    <div className={styles.mimeTypeHeroTop}><span>同一份数据 · 先看声明，再选解释器</span><strong>{current.result}</strong></div>
    <div className={styles.mimeTypeStage}>
      <div className={styles.mimeTypeLabelCard} data-active={current.active.includes("label")}>
        <div className={styles.mimeTypeCardHeading}><Radio size={21} aria-hidden="true" /><span>Content-Type</span></div>
        <code>{current.header}</code>
        <small>给接收端的类型线索</small>
      </div>
      <ArrowRight className={styles.mimeTypeArrow} size={22} aria-hidden="true" />
      <div className={styles.mimeTypeBodyCard} data-active={current.active.includes("body")}>
        <div className={styles.mimeTypeCardHeading}><FileCode size={21} aria-hidden="true" /><span>实际字节</span></div>
        <code>{current.body}</code>
        <small>声明不会修改这里</small>
      </div>
      <ArrowRight className={styles.mimeTypeArrow} size={22} aria-hidden="true" />
      <div className={styles.mimeTypeParserCard} data-active={current.active.includes("parser")}>
        <div className={styles.mimeTypeCardHeading}><Gear size={21} aria-hidden="true" /><span>解释器</span></div>
        <strong>{current.parser}</strong>
        <small>{current.parserDetail}</small>
      </div>
      <ArrowRight className={styles.mimeTypeArrow} size={22} aria-hidden="true" />
      <div className={styles.mimeTypeResultCard} data-active={current.active.includes("result")}>
        <div className={styles.mimeTypeCardHeading}><ResultIcon size={21} aria-hidden="true" /><span>接收端看到</span></div>
        <strong>{current.result}</strong>
        <small>{current.evidence}</small>
      </div>
    </div>
    <div className={styles.mimeTypeEvidence}><Globe size={17} aria-hidden="true" /><p key={scene.step}>{current.note}</p></div>
    <div className={styles.mimeTypeTimeline} role="group" aria-label="MIME 类型首图步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.mimeTypeControls} role="group" aria-label="控制 MIME 类型原理演示"><button type="button" aria-pressed={scene.playing} aria-label={scene.playing ? "暂停 MIME 类型原理演示" : "播放 MIME 类型原理演示"} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

function MimeTypeLab() {
  const [selected, setSelected] = useState(0);
  const current = scenarios[selected];
  const Icon = current.status === "ok" ? CheckCircle : current.status === "error" ? XCircle : WarningCircle;
  return <div className={styles.mimeTypeLab} role="region" aria-label="MIME 类型解释实验">
    <div className={styles.mimeTypeLabHeader}><div><span>同一串字节，换一张类型标签</span><strong>看解析器和结果怎样一起改变</strong></div><span>{selected + 1} / {scenarios.length}</span></div>
    <div className={styles.mimeTypeLabPath}>
      <div className={styles.mimeTypeLabNode}><FileText size={19} aria-hidden="true" /><span>声明与内容</span><code>{current.header}</code><code>{current.body}</code></div>
      <ArrowRight className={styles.mimeTypeArrow} size={18} aria-hidden="true" />
      <div className={styles.mimeTypeLabNode}><Code size={19} aria-hidden="true" /><span>接收端选择</span><strong>{current.parser}</strong></div>
      <ArrowRight className={styles.mimeTypeArrow} size={18} aria-hidden="true" />
      <div className={styles.mimeTypeLabNode} data-status={current.status}><Stack size={19} aria-hidden="true" /><span>可观察结果</span><strong>{current.result}</strong></div>
    </div>
    <div className={styles.mimeTypeLabEvidence} data-status={current.status}><Icon size={20} aria-hidden="true" /><p><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.mimeTypeLabControls} role="group" aria-label="选择 MIME 类型样本">{scenarios.map((scenario, index) => <button type="button" key={scenario.label} aria-pressed={selected === index} onClick={() => setSelected(index)}>{scenario.label}</button>)}</div>
  </div>;
}

export function MimeTypeTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={mimeTypeSources} />;
  return <ConceptArticle slug="mime-type" title="MIME 类型" subtitle="Media Type · 给字节挑一条解释规则" sources={mimeTypeSources} sections={[["mime-type-shape", "一条类型名有两半"], ["mime-type-content", "Content-Type 选解释器"], ["mime-type-parameters", "参数补足细节"], ["mime-type-multipart", "一份消息也能装多个部分"], ["mime-type-sniffing", "声明错了，浏览器可能猜"]]} hero={<MimeTypeHero />} intro={<>MIME 类型像贴在数据外面的解释标签：<code>text/html</code>、<code>image/png</code>、<code>application/json</code> 会告诉接收端该用哪类规则处理字节。<strong>标签不会替你修改内容，也不会替你证明内容合法。</strong><Cite id="mime-type-content-type" /></>}>
    <ArticleSection id="mime-type-shape" title="一条类型名有两半">
      <p id="mime-type-shape-detail" className="vp-citation-target">媒体类型由 <code>type/subtype</code> 组成，后面可以跟用分号分开的参数。type 先划出大类，subtype 再说明具体格式；两部分的名字不区分大小写，<code>application/problem+json</code> 里的 <code>+json</code> 还可以表示它遵循某种结构化语法。<Cite id="mime-type-shape" /></p>
      <p id="mime-type-parameters" className="vp-citation-target">这串名字不是文件扩展名的另一种写法。扩展名是文件名的一部分，媒体类型是协议和接收端使用的表示描述；一个文件可以被改名，字节本身却没有因此换格式。<Cite id="mime-type-parameters" /></p>
      <MimeTypeLab />
    </ArticleSection>
    <ArticleSection id="mime-type-content" title="Content-Type 选解释器">
      <p id="mime-type-content-type" className="vp-citation-target">HTTP 的 <code>Content-Type</code> 说明响应表示采用哪种媒体类型，接收端再在当前消息语义下决定怎样处理它。服务器返回同一串 <code>&lt;h1&gt;Hi&lt;/h1&gt;</code>，声明为 <code>text/html</code> 时可以构造元素，声明为 <code>text/plain</code> 时则把尖括号当作普通字符。<Cite id="mime-type-content-type" /></p>
      <p id="mime-type-application" className="vp-citation-target"><code>application</code> 顶层类型通常表示需要应用程序进一步处理的数据，所以 <code>application/json</code> 不是“浏览器已经帮我解析好的对象”，而是“请按 JSON 的格式尝试处理”。<Cite id="mime-type-application" /></p>
    </ArticleSection>
    <ArticleSection id="mime-type-parameters-section" title="参数补足细节">
      <p id="mime-type-charset" className="vp-citation-target">对文本类型来说，<code>charset</code> 说明字节该按哪种字符集解码。它和 <code>text/html</code> 是两件事：前者回答“这些字节怎样变成文字”，后者回答“文字和标记按什么媒体类型处理”。<Cite id="mime-type-charset" /></p>
      <p id="mime-type-encoding" className="vp-citation-target"><code>Content-Encoding: gzip</code> 也不是 MIME 类型。它是外层内容编码：接收端先解压，再按 <code>Content-Type</code> 解释解压后的表示。把 gzip 写成 <code>application/gzip</code> 和给 JSON 响应加 gzip 编码，表达的是两件不同的事。<Cite id="mime-type-encoding" /></p>
    </ArticleSection>
    <ArticleSection id="mime-type-multipart" title="一份消息也能装多个部分">
      <p id="mime-type-multipart-detail" className="vp-citation-target"><code>multipart</code> 是复合媒体类型：一条消息里可以封装多个各自带媒体类型的部分。<code>boundary</code> 参数把这些部分隔开，接收端按边界拆出字段、文件或不同版本；它描述的是容器结构，不是某一个文件后缀。<Cite id="mime-type-multipart" /></p>
    </ArticleSection>
    <ArticleSection id="mime-type-sniffing" title="声明错了，浏览器可能猜">
      <p id="mime-type-sniffing-detail" className="vp-citation-target">服务器没有给出正确的 <code>Content-Type</code> 时，用户代理有时会查看内容来猜一个有效类型；不同上下文和实现可能得出不同结果。尤其是用户上传的文件，如果服务器以低权限类型声明，浏览器却把内容当成 HTML，原本想展示的文件可能获得执行脚本的待遇。<Cite id="mime-type-sniffing" /></p>
      <p>所以排查“浏览器为什么这样处理”时，要把响应头、字符集、内容编码和实际字节一起记录。状态码是 <code>200</code>，只说明请求层成功，并不能替内容通过对应格式的解析。<Cite id="mime-type-sniffing" /></p>
    </ArticleSection>
  </ConceptArticle>;
}
