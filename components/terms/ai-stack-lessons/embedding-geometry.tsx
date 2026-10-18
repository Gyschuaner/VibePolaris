"use client";

import { useState, type CSSProperties } from "react";
import { ConceptHero } from "../ConceptHero";
import styles from "./EmbeddingGeometry.module.css";

const documents = [
  { id: "A", angle: 30, title: "邮件链接重置密码", text: "在登录页选择“忘记密码”，用绑定邮箱接收重置链接。", year: "2026" },
  { id: "B", angle: 75, title: "找回登录账号", text: "如果记不住账号，可以先用绑定手机号找到登录账号。", year: "2026" },
  { id: "C", angle: 145, title: "上传新的头像", text: "打开个人资料，选择头像图片并保存。", year: "2026" },
  { id: "D", angle: 53, title: "旧版密码找回说明", text: "2020 年的说明要求拨打旧客服号；该号码已停用。", year: "2020 · 已过期" },
];
function vector(angle: number) {
  const radians = angle * Math.PI / 180;
  return [Math.cos(radians), Math.sin(radians)] as const;
}
function point(angle: number) {
  const [x, y] = vector(angle);
  return { x: 180 + x * 126, y: 177 - y * 126 };
}
function cosine(a: number, b: number) {
  const [ax, ay] = vector(a), [bx, by] = vector(b);
  return ax * bx + ay * by;
}

export function EmbeddingHero() {
  const from = point(50), to = point(142);
  return <ConceptHero slug="embedding" label="文字在示意空间中各有一个位置；查询从密码区域移向头像区域，文档点保持不动">
    <div className={styles.miniSpace}><svg viewBox="0 0 360 230" aria-hidden="true">
      <path className={styles.miniOrbit} d="M54 177 A126 126 0 0 1 306 177" />
      {documents.map(doc => { const p = point(doc.angle); return <g key={doc.id}><circle cx={p.x} cy={p.y} r="4" className={styles.docDot} /><text x={p.x} y={p.y - 22} textAnchor="middle">{doc.id === "C" ? "改头像" : doc.id === "A" ? "重置密码" : doc.id === "B" ? "找回账号" : "旧说明"}</text></g>; })}
      <g className={styles.miniQuery} style={{ "--from-x": `${from.x}px`, "--from-y": `${from.y}px`, "--to-x": `${to.x}px`, "--to-y": `${to.y}px` } as CSSProperties}><circle r="14" /><text y="29" textAnchor="middle">?</text></g>
      <text x="180" y="207" textAnchor="middle">换个问题，相近的材料也会变</text>
    </svg></div>
  </ConceptHero>;
}

export function EmbeddingGeometryLab() {
  const [angle, setAngle] = useState(50);
  const [query, setQuery] = useState("忘记密码");
  const [selectedId, setSelectedId] = useState("D");
  const selected = documents.find(doc => doc.id === selectedId)!;
  const selectedPoint = point(selected.angle);
  const ranked = documents.map(doc => ({ ...doc, score: cosine(angle, doc.angle) })).sort((a, b) => b.score - a.score);
  const queryVector = vector(angle);
  return <figure className={styles.lab} aria-label="嵌入向量几何与相似度实验">
    <div className={styles.queryChoices} role="group" aria-label="选择示意查询"><span>查询</span>{[{ label: "忘记密码", angle: 50 }, { label: "修改头像", angle: 142 }].map(item => <button type="button" key={item.label} aria-pressed={query === item.label} onClick={() => { setQuery(item.label); setAngle(item.angle); }}>{item.label}</button>)}</div>
    <div className={styles.board}>
      <svg className={styles.space} viewBox="0 0 360 285" role="img" aria-label={`二维单位向量示意图，查询为 ${query}，当前最相近的文档是 ${ranked[0].id}`}>
        <circle cx="180" cy="177" r="126" className={styles.orbit} /><path d="M22 177H338 M180 28V270" className={styles.axes} />
        <text x="323" y="195">x</text><text x="190" y="34">y</text><text x="169" y="194">0</text>
        <line x1="180" y1="177" x2={selectedPoint.x} y2={selectedPoint.y} className={styles.docRay} />
        {documents.map(doc => { const p = point(doc.angle); return <g key={doc.id} data-selected={selectedId === doc.id} className={styles.docPoint}><circle cx={p.x} cy={p.y} r="6" /><text x={p.x} y={p.y - 21} textAnchor="middle">{doc.id}</text></g>; })}
        <g className={styles.queryVector} style={{ transform: `translate(180px, 177px) rotate(${-angle}deg)` }}><line x2="126" className={styles.queryRay} /><g transform="translate(126, 0)"><circle r="12" /><text className={styles.queryLabel} style={{ transform: `rotate(${angle}deg)` }} y="26" textAnchor="middle">?</text></g></g>
        <text x="180" y="251" textAnchor="middle" className={styles.vectorLabel}>查询 [{queryVector[0].toFixed(2)}, {queryVector[1].toFixed(2)}]</text>
      </svg>
      <div className={styles.ranking}><span>按余弦相似度排列</span><div className={styles.rankSlots}>{ranked.map((doc, index) => <button type="button" key={doc.id} className={styles.candidate} style={{ top: `${index * 59}px` }} aria-pressed={selectedId === doc.id} onClick={() => setSelectedId(doc.id)} aria-label={`查看文档 ${doc.id}：${doc.title}，相似度 ${doc.score.toFixed(3)}`}><b>{doc.id}</b><span>{doc.title}<i>{doc.year}</i></span><code>{doc.score.toFixed(3)}</code></button>)}</div></div>
    </div>
    <label className={styles.angleControl}>移动教学查询向量 <input type="range" min="10" max="170" value={angle} onChange={event => { setAngle(Number(event.target.value)); setQuery("手动移动的教学向量"); }} /><output>{angle}°</output></label>
    <div className={styles.original} aria-live="polite"><span>文档 {selected.id} · 原文</span><p>{selected.text}</p></div>
    <figcaption>坐标和文档均为教学构造，没有调用嵌入模型；显示分数由图中的二维单位向量实际计算。真实模型有更多维度，二维投影未必保留原空间距离。</figcaption>
  </figure>;
}
