"use client";

import { ArrowCounterClockwise, ArrowRight, CheckCircle, FileText, Pause, Play, Stack, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { ArticleCitation, ArticleSection, ConceptArticle } from "../ConceptArticle";
import { useScene } from "../HarnessStoryScenes";
import { responseBodySources } from "@/lib/transport-http-sources";
import styles from "./transport-http-pages.module.css";

const frames = [
  { label: "200 到达", status: "200 OK", encoding: "gzip", type: "application/json", bytes: "压缩字节", result: "等待解码", note: "响应头先说明这串字节怎样处理；body 还没有变成可以直接读取的对象。" },
  { label: "先解码", status: "200 OK", encoding: "identity", type: "application/json", bytes: "{\"count\":2}", result: "得到表示字节", note: "Content-Encoding 描述表示怎样被编码；先还原字节，再谈它是不是 JSON。" },
  { label: "再解析", status: "200 OK", encoding: "identity", type: "application/json", bytes: "{\"count\":2}", result: "对象 count=2", note: "Content-Type 给解析方向，但声明正确也不代表实际字节一定合法。" },
  { label: "204 空体", status: "204 No Content", encoding: "—", type: "—", bytes: "0 bytes", result: "没有可解析内容", note: "204 的成功结果就是没有 message body；把空体硬喂给 JSON 解析器会得到错误。" },
  { label: "HEAD / 304", status: "HEAD 200 / 304", encoding: "—", type: "见头部", bytes: "0 bytes", result: "只读元数据", note: "HEAD 和 304 可以带字段帮助客户端判断，却不把响应体交给这次读取。" },
  { label: "声明错了", status: "200 OK", encoding: "identity", type: "application/json", bytes: "{\"count\":}", result: "解析失败", note: "选择 JSON 解析器只是开始；坏字节仍应停在解析边界，并把错误交给调用方。" },
];

function ResponseBodyHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  const failed = scene.step === 5;
  return <figure ref={scene.ref} className={styles.bodyHero} data-step={scene.step} aria-label="HTTP 响应体从线路字节经过解码和解析到结果的过程">
    <div className={styles.bodyTop}><span>一次响应 · headers 先说规则，body 再交付字节</span><strong>{current.label}</strong></div>
    <div className={styles.bodyStage}>
      <div className={styles.bodyEnvelope}><FileText size={25} aria-hidden="true" /><span>响应头</span><code>{current.status}</code><small>{current.type}</small></div>
      <ArrowRight className={styles.bodyArrow} size={20} aria-hidden="true" />
      <div className={styles.bodyPipeline}>
        <div className={styles.bodyPipeNode} data-active={scene.step >= 0}><span>线路字节</span><code>{current.bytes}</code></div>
        <div className={styles.bodyPipeArrow}>↓</div>
        <div className={styles.bodyPipeNode} data-active={scene.step >= 1 && scene.step !== 3 && scene.step !== 4}><span>解码</span><code>{current.encoding}</code></div>
        <div className={styles.bodyPipeArrow}>↓</div>
        <div className={styles.bodyPipeNode} data-active={scene.step >= 2 && scene.step !== 3 && scene.step !== 4}><span>解析器</span><code>{current.type}</code></div>
      </div>
      <ArrowRight className={styles.bodyArrow} size={20} aria-hidden="true" />
      <div className={styles.bodyResult} data-empty={scene.step === 3 || scene.step === 4} data-failed={failed}><>{failed ? <WarningCircle size={25} aria-hidden="true" /> : scene.step === 3 || scene.step === 4 ? <WarningCircle size={25} aria-hidden="true" /> : <CheckCircle size={25} aria-hidden="true" />}</><span>调用方看到</span><strong>{current.result}</strong></div>
    </div>
    <div className={styles.bodyEvidence} aria-live="polite"><Stack size={20} aria-hidden="true" /><p key={scene.step}><strong>{current.label}</strong>{current.note}</p></div>
    <div className={styles.bodyTimeline} role="group" aria-label="响应体处理步骤">{frames.map((frame, index) => <button type="button" key={frame.label} aria-pressed={scene.step === index} onClick={() => scene.seek(index)}>{frame.label}</button>)}</div>
    <div className={styles.bodyControls} role="group" aria-label="控制响应体演示"><button type="button" aria-pressed={scene.playing} onClick={scene.toggle}>{scene.playing ? <Pause size={15} /> : scene.step === frames.length - 1 ? <ArrowCounterClockwise size={15} /> : <Play size={15} />} {scene.playing ? "暂停" : scene.step === frames.length - 1 ? "再看一次" : "播放"}</button><button type="button" onClick={() => scene.seek(0)}><ArrowCounterClockwise size={15} /> 重播</button></div>
  </figure>;
}

type BodyMode = "valid" | "empty" | "broken";

function ResponseBodyLab() {
  const [mode, setMode] = useState<BodyMode>("valid");
  const cases = {
    valid: { label: "200 · JSON", status: "200 OK", headers: "Content-Encoding: gzip · Content-Type: application/json", body: "{\"count\":2}", result: "解析成对象", note: "先解压，再按 JSON 规则读取。" },
    empty: { label: "204 · 无体", status: "204 No Content", headers: "Content-Type: —", body: "(empty)", result: "返回空结果", note: "协议已经说明没有 body；调用方应按状态处理，不要盲目调用 json()。" },
    broken: { label: "200 · 坏 JSON", status: "200 OK", headers: "Content-Type: application/json", body: "{\"count\":}", result: "SyntaxError", note: "Content-Type 选择了解析器，却不能替内容补上缺失的值。" },
  } satisfies Record<BodyMode, { label: string; status: string; headers: string; body: string; result: string; note: string }>;
  const current = cases[mode];
  return <div className={styles.bodyLab} role="region" aria-label="响应体状态与解析演示">
    <div className={styles.bodyLabHead}><div><span>只切换响应状态和字节</span><strong>看看调用方为什么不能只看 200</strong></div><span>{current.label}</span></div>
    <div className={styles.bodyLabBoard}>
      <div className={styles.bodyLabNode}><FileText size={21} aria-hidden="true" /><span>响应</span><code>{current.status}</code><small>{current.headers}</small></div><ArrowRight className={styles.bodyArrow} size={19} aria-hidden="true" />
      <div className={styles.bodyLabNode}><Stack size={21} aria-hidden="true" /><span>body bytes</span><code>{current.body}</code></div><ArrowRight className={styles.bodyArrow} size={19} aria-hidden="true" />
      <div className={styles.bodyLabNode}>{mode === "broken" || mode === "empty" ? <WarningCircle size={21} aria-hidden="true" /> : <CheckCircle size={21} aria-hidden="true" />}<span>调用方</span><strong>{current.result}</strong></div>
    </div>
    <div className={styles.bodyLabResult} data-failed={mode === "broken"} data-empty={mode === "empty"}><p><strong>{mode === "broken" ? "解析边界" : mode === "empty" ? "协议边界" : "读取路径"}</strong>{current.note}</p></div>
    <div className={styles.bodyLabControls} role="group" aria-label="选择响应体案例">{Object.entries(cases).map(([key, item]) => <button type="button" key={key} aria-pressed={mode === key} onClick={() => setMode(key as BodyMode)}>{item.label}</button>)}</div>
  </div>;
}

export function ResponseBodyTermPage() {
  const Cite = ({ id }: { id: string }) => <ArticleCitation id={id} sources={responseBodySources} />;
  return <ConceptArticle slug="response-body" title="响应体" subtitle="Response Body · headers 说明规则，body 承载表示" sources={responseBodySources} sections={[["body-message-section", "body 到底承载了什么"], ["body-decode-section", "先还原字节，再选择解析器"], ["body-no-content-section", "没有 body 也是协议结果"], ["body-boundary-section", "解析成功不等于业务成功"]]} hero={<ResponseBodyHero />} intro={<>HTTP 响应里的 status 和 headers 先交代上下文，响应体才承载这次返回的表示。它可能是一段压缩字节、一份 JSON、一个 HTML 文档，也可能因为 HEAD、204 或 304 而根本没有可读取的 body；读取前要先看协议给出的边界。</>}>
    <ArticleSection id="body-message-section" title="body 到底承载了什么">
      <p id="body-message" className="vp-citation-target">HTTP message 把状态行、字段和可选的 message body 分开。body 是服务器交付的表示字节，不是“200 的另一种写法”；状态和字段可以已经告诉客户端如何解释、缓存或处理它。<Cite id="body-message" /></p>
      <p id="body-representation" className="vp-citation-target">同一个资源可以用 JSON、HTML、图片或其他媒体类型表示。响应体的字节只是载荷，Content-Type、Content-Encoding 和状态码共同决定接收端应怎样读取它。<Cite id="body-representation" /></p>
      <ResponseBodyLab />
    </ArticleSection>
    <ArticleSection id="body-decode-section" title="先还原字节，再选择解析器">
      <p id="body-decode" className="vp-citation-target">Content-Encoding 描述表示在传输前使用了什么编码，例如 gzip。客户端应先按编码还原表示，再把还原后的字节交给 JSON、HTML 或文本解析器；把压缩字节直接当 JSON 读，失败的原因就已经错位了。<Cite id="body-decode" /></p>
      <p id="body-parse" className="vp-citation-target">调用 response.json() 会读取 body 并按 JSON 语法解析；它不是“把任意响应变成对象”的魔法。Content-Type 写成 JSON 也不能修复缺逗号、缺值或截断的字节，解析错误要回到调用方处理。<Cite id="body-parse" /></p>
    </ArticleSection>
    <ArticleSection id="body-no-content-section" title="没有 body 也是协议结果">
      <p id="body-method" className="vp-citation-target">HEAD 请求沿用 GET 的响应字段，却不返回这次响应的 message body；客户端可以用 Content-Length、ETag 等元数据判断下一步，而不是等待一段不存在的内容。<Cite id="body-method" /></p>
      <p id="body-no-content" className="vp-citation-target">204 No Content 和 304 Not Modified 也表达了“这次没有响应体”的语义。它们不是服务器忘了填 body；调用方如果无条件调用 json()，得到的往往是空体解析错误。<Cite id="body-no-content" /></p>
      <p id="body-empty" className="vp-citation-target">遇到空体时，先按状态码决定是否有内容，再决定是否解析。把“没有内容”与“内容损坏”分开记录，排查时才不会把协议分支误报成 JSON 服务故障。<Cite id="body-empty" /></p>
    </ArticleSection>
    <ArticleSection id="body-boundary-section" title="解析成功不等于业务成功">
      <p>body 被成功解析，只说明字节符合所选格式；字段是否齐全、权限是否允许、金额是否可信，仍是应用层自己的判断。响应体也可能包含错误说明或部分结果，不能只因状态码是 200 就跳过业务校验。</p>
      <p>排查一条异常响应时，按顺序记录 method、status、Content-Encoding、Content-Type、实际 body 长度和解析错误。先确认有没有 body，再确认有没有正确解码，最后才判断 JSON 或 HTML 内容本身。</p>
    </ArticleSection>
  </ConceptArticle>;
}
