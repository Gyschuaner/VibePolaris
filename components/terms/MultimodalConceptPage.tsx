"use client";

import { ArrowRight, CheckCircle, Eye, FileText, Image as ImageIcon, MagnifyingGlass, TextT, WarningCircle, XCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { Article, Cite } from "./AiStackConceptPageShared";
import { ArticleAside, ArticleSection } from "./ConceptArticle";
import { SceneControls, useScene } from "./HarnessStoryScenes";
import { multimodalConceptSources } from "@/lib/multimodal-sources";
import styles from "./MultimodalConceptPage.module.css";

const frames = [
  { label: "问题先到", phase: "QUESTION", image: false, focus: "none", result: "看不到票面", note: "“这张票”只是文字里的指代，图片还没有进入请求。" },
  { label: "票面进来", phase: "IMAGE", image: true, focus: "none", result: "材料已到位", note: "图片和文字各自保留，先确认两份材料确实在同一次请求里。" },
  { label: "取景对准", phase: "LENS", image: true, focus: "date", result: "日期字段被圈出", note: "问题把取景框对准票面上的日期，其他像素仍是背景。" },
  { label: "回答有出处", phase: "ANSWER", image: true, focus: "date", result: "2026 · 10 · 03", note: "回答回到被圈出的像素；读者可以把它和原图逐字核对。" },
  { label: "图片被拿掉", phase: "MISSING", image: false, focus: "none", result: "不能凭文字报日期", note: "同一句问题失去票面后，答案范围应收窄，不补一个看似完整的日期。" },
] as const;

function Ticket({ image, focus }: { image: boolean; focus: "none" | "date" | "gate" }) {
  return <div className={styles.ticket} data-visible={image} aria-label={image ? "票面图片" : "没有票面图片"}>
    {image ? <>
      <div className={styles.ticketTop}><span>BOARDING PASS</span><span>VBP 031</span></div>
      <div className={styles.ticketFields}>
        <div className={styles.ticketField} data-focus={focus === "date"}><small>DATE</small><strong>2026 · 10 · 03</strong></div>
        <div className={styles.ticketField} data-focus={focus === "gate"}><small>GATE</small><strong>A12</strong></div>
        <div className={styles.ticketField}><small>NAME</small><strong>READER</strong></div>
      </div>
      <div className={styles.ticketStripe} aria-hidden="true" />
    </> : <div className={styles.ticketMissing}><ImageIcon size={22} aria-hidden="true" /><span>图片未提交</span><code>input_image = ∅</code></div>}
  </div>;
}

function MultimodalHero() {
  const scene = useScene(frames.length);
  const current = frames[scene.step];
  return <figure ref={scene.ref} className={styles.hero} aria-label="文字问题如何在票面图片上找到对应证据的多模态演示">
    <div className={styles.heroTop}><span>EVIDENCE LENS / MULTIMODAL INPUT</span><strong>{current.phase} · {scene.step + 1}/5</strong></div>
    <SceneControls scene={scene} labels={frames.map((frame) => frame.label)} />
    <div className={styles.lensBoard} data-phase={current.phase}>
      <div className={styles.questionCard}>
        <TextT size={19} aria-hidden="true" /><span>文字条件</span><strong>这张票上的日期是什么？</strong><code>input_text · present</code>
      </div>
      <div className={styles.lensColumn}>
        <div className={styles.lensBeam} aria-hidden="true"><i /><ArrowRight size={19} /></div>
        <div className={styles.lensLabel}><MagnifyingGlass size={14} aria-hidden="true" /><span>{current.focus === "date" ? "取景：DATE" : "等待对应像素"}</span></div>
      </div>
      <Ticket image={current.image} focus={current.focus} />
      <div className={styles.resultCard} data-danger={current.phase === "MISSING"}>
        {current.phase === "MISSING" ? <XCircle size={20} aria-hidden="true" /> : current.phase === "ANSWER" ? <CheckCircle size={20} aria-hidden="true" /> : <Eye size={20} aria-hidden="true" />}
        <span>可核对的回答</span><strong>{current.result}</strong><code>{current.phase === "ANSWER" ? "来自票面像素" : current.phase === "MISSING" ? "证据范围收窄" : "尚未读取"}</code>
      </div>
    </div>
    <div className={styles.heroNote} data-danger={current.phase === "MISSING"} role="status" aria-live="polite"><span><strong>{current.label}</strong> · {current.note}</span></div>
    <figcaption>多模态把不同形式的材料放进同一个任务；它扩大的是可读取的输入范围，不是替模型凭空补材料。</figcaption>
  </figure>;
}

type LensQuery = "date" | "gate";

function MultimodalLensLab() {
  const scene = useScene(3);
  const [query, setQuery] = useState<LensQuery>("date");
  const [keepImage, setKeepImage] = useState(true);
  const imageInRequest = keepImage && scene.step > 0;
  const focus = imageInRequest && scene.step === 2 ? query : "none";
  const answer = !imageInRequest ? "无法从缺失图片读取" : scene.step < 2 ? "等待取景" : query === "date" ? "2026 · 10 · 03" : "A12";
  return <div ref={scene.ref} className={styles.lab} role="region" aria-label="多模态取景与证据范围实验">
    <div className={styles.labTop}><span>LOCAL VIEWFINDER / NO MODEL CALL</span><strong>只模拟材料边界</strong></div>
    <SceneControls scene={scene} labels={["问题进入", "带上票面", "对准字段"]} />
    <div className={styles.labControls} role="group" aria-label="改变取景条件">
      <button type="button" aria-pressed={query === "date"} onClick={() => { setQuery("date"); scene.seek(2); }}>问日期</button>
      <button type="button" aria-pressed={query === "gate"} onClick={() => { setQuery("gate"); scene.seek(2); }}>问登机口</button>
      <button type="button" onClick={() => { setKeepImage((value) => !value); scene.seek(2); }}>{keepImage ? "移除票面" : "重新带上票面"}</button>
    </div>
    <div className={styles.labBoard} data-missing={!imageInRequest}>
      <div className={styles.labPrompt}><FileText size={20} aria-hidden="true" /><span>这次问题</span><strong>{query === "date" ? "读出日期" : "读出登机口"}</strong><code>input_text · present</code></div>
      <div className={styles.labTicket}><Ticket image={imageInRequest} focus={focus} /></div>
      <ArrowRight size={19} className={styles.labArrow} aria-hidden="true" />
      <div className={styles.labAnswer} data-danger={!imageInRequest}><span>回答范围</span><strong>{answer}</strong><small>{!imageInRequest ? "没有对应像素，先补材料" : scene.step < 2 ? "问题和图片已进入，尚未取景" : "保留原图可复核这次读取"}</small></div>
    </div>
    <div className={styles.labStatus} data-danger={!imageInRequest} role="status" aria-live="polite">{!imageInRequest ? <WarningCircle size={16} aria-hidden="true" /> : <CheckCircle size={16} aria-hidden="true" />}<span><strong>{!imageInRequest ? "证据不足" : "问题和图片共同决定取景"}</strong> · {!imageInRequest ? "文字里的“这张票”不能替代图片；模型应说明缺少什么。" : "换问题只移动取景框，移除图片则让回答回到可观察证据。"}</span></div>
  </div>;
}

const sections: [string, string][] = [["multimodal-input", "先确认材料真的进来了"], ["multimodal-alignment", "问题怎样对准画面"], ["multimodal-boundary", "图片不在时，答案要变窄"]];

export function MultimodalConceptTermPage() {
  return <Article slug="multimodal" title="多模态" subtitle="Multimodal · 让图和字在同一任务里互相约束" sources={multimodalConceptSources} sections={sections} hero={<MultimodalHero />} intro={<>你说“读一下这张票”，模型并不会因此获得一张票。<strong>多模态的边界先在输入处：文字问题、图片或音频必须真的进入同一次请求，模型才能把它们放在同一个任务里对照。</strong></>}>
    <ArticleSection id="multimodal-input" title="先确认材料真的进来了"><p id="mm-input" className="vp-citation-target">多模态不是“模型突然会看”。一次请求里有哪些材料，取决于调用方实际提交了什么。OpenAI 的视觉输入接口把文字和图片写成同一条消息里的不同内容块，图片可以来自 URL、Base64 数据或文件 ID；没有这个图片块，问题里的“这张票”仍只是文字。<Cite id="mm-input" sources={multimodalConceptSources} /></p><p id="mm-capability" className="vp-citation-target">具体能处理什么也由模型和接口决定。Google 的图像理解文档列出图片描述、分类、视觉问答等任务，并支持 URL、内联数据和文件上传；这说明“支持多模态”不等于所有模型都接受相同格式或返回相同模态。<Cite id="mm-capability" sources={multimodalConceptSources} /></p><MultimodalLensLab /></ArticleSection>
    <ArticleSection id="multimodal-alignment" title="问题怎样对准画面"><p id="mm-alignment" className="vp-citation-target">模型要先把不同材料变成可以一起计算的表示。CLIP 的训练任务是让图片和对应文字彼此匹配，文字因此可以用来指向视觉概念；这能帮助“找相似”，却不能保证每张图片上的细节都被准确读出。<Cite id="mm-alignment" sources={multimodalConceptSources} /></p><p id="mm-bridge" className="vp-citation-target">Flamingo 展示了另一条路线：把视觉模型和语言模型接起来，并处理交错出现的图片与文字。它说明多模态系统需要明确的连接机制，视觉输入不会因为靠近一句话就自动变成语言模型已经核对过的事实。<Cite id="mm-bridge" sources={multimodalConceptSources} /></p><p>在票面例子里，问题里的“日期”是取景条件，票面像素是材料。先找到对应字段，再把读出的字符放回回答，读者才有机会沿着原图检查它。</p></ArticleSection>
    <ArticleSection id="multimodal-boundary" title="图片不在时，答案要变窄"><p id="mm-boundary" className="vp-citation-target">图片质量、尺寸、格式和上传方式都会影响可读取范围；Google 还提醒开发者处理视觉输入的安全与结果质量。接口支持某种图片，不代表这张图片里每个小字都能被可靠识别。<Cite id="mm-boundary" sources={multimodalConceptSources} /></p><p id="mm-risk" className="vp-citation-target">NIST 的生成式 AI 风险框架提到，多模态系统可以生成逼真的图像和音视频，细小改动也可能影响人和机器的判断。遇到票据、证件、医疗影像或个人照片时，应保留原材料、标出不确定处，并安排人工或原文核对。<Cite id="mm-risk" sources={multimodalConceptSources} /></p><p><strong>读者判断</strong>：先问“这份材料真的提交了吗”，再问“模型支持这种格式和任务吗”，最后把回答落回可以定位的图像区域。看不见的部分，就让答案明确停在看不见的位置。</p><ArticleAside title="和 OCR、检索怎样分工"><p>OCR 专门把图像中的文字转成字符；检索从已有资料里找回内容；多模态系统可以把图片、文字问题和其他输入放在同一个任务里，但它是否调用 OCR、怎样表示画面，取决于具体实现。把“图片进入请求”和“答案已经核对”分开记录，排错时会清楚很多。</p></ArticleAside></ArticleSection>
  </Article>;
}
