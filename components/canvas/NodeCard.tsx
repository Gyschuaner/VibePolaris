"use client";

import { useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Plus, UploadSimple, X } from "@phosphor-icons/react";
import { editNodeTask, nodeKinds, nodePreview, nodeResource, nodeTasks, safeNodeUrl, withNodeResource, type CanvasNode } from "@/lib/canvas";
import styles from "./CanvasWorkspace.module.css";

type Props = {
  node: CanvasNode; actions: ReactNode; onChange: (patch: Partial<CanvasNode>) => void;
  onSave: () => void; onOpen: () => void; onClose: () => void; onMessage: (message: string) => void;
};

export function NodeCard({ node, actions, onChange, onSave, onOpen, onClose, onMessage }: Props) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false), [task, setTask] = useState("");
  const preview = nodePreview(node), kind = node.kind ?? "note";
  const resource = nodeResource(node), url = safeNodeUrl(resource, kind === "image");
  const tasks = nodeTasks(node.markdown);

  async function upload(file?: File) {
    if (!file) return;
    if (!/^image\/(png|jpeg|gif|webp|avif)$/.test(file.type) || file.size > 5 * 1024 * 1024) {
      onMessage("请选择 5 MB 以内的 PNG、JPEG、GIF、WebP 或 AVIF 图片。"); return;
    }
    setUploading(true);
    try {
      const source = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader(); reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("图片读取失败，请重试。")); reader.readAsDataURL(file);
      });
      onChange({ markdown: withNodeResource(node, source) });
    } catch { onMessage("图片读取失败，原内容已保留。"); }
    finally { setUploading(false); }
  }

  return <>
    <div className={styles.kindLabel}>{nodeKinds[kind]}</div>
    <header>
      <input className={styles.titleInput} aria-label="节点标题" placeholder={`未命名${nodeKinds[kind]}`} maxLength={140}
        value={node.title ?? preview.title} onChange={event => onChange({ title: event.target.value })}
        onBlur={onSave} onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); event.currentTarget.blur(); } }} />
      <div>{actions}<button className={styles.icon} aria-label="关闭简述" onClick={onClose}><X size={18} /></button></div>
    </header>
    <textarea className={styles.summaryInput} aria-label="节点摘要" placeholder="添加简短摘要…" maxLength={600} rows={2}
      value={node.summary ?? preview.summary} onChange={event => onChange({ summary: event.target.value })} onBlur={onSave} />
    {(kind === "link" || kind === "image") && <div className={styles.resource}>
      {kind === "image" && url && <button className={styles.imagePreview} aria-label="查看图片" onClick={onOpen}><img src={url} alt={preview.title} onError={event => { event.currentTarget.alt = "图片暂时无法显示，请检查地址或重新上传。"; }} /></button>}
      {!(kind === "image" && resource.startsWith("data:image/")) && <input type="url" aria-label={kind === "image" ? "图片地址" : "链接地址"}
        placeholder={kind === "image" ? "粘贴图片地址…" : "粘贴网址或 VibePolaris 词条地址…"} value={resource} disabled={uploading}
        onChange={event => onChange({ markdown: withNodeResource(node, event.target.value) })} onBlur={onSave} />}
      {resource && !url && <p className={styles.resourceError}>请输入完整的 http(s) 地址或站内路径。</p>}
      {kind === "image" && <>
        <button className={styles.uploadImage} disabled={uploading} onClick={() => fileInput.current?.click()}><UploadSimple size={16} />{uploading ? "读取中…" : resource ? "替换图片" : "上传图片"}</button>
        <input ref={fileInput} hidden type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif" aria-label="上传节点图片" onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; void upload(file); }} />
      </>}
    </div>}
    {kind === "todo" && <div className={styles.tasks}>
      <div className={styles.taskList}>{tasks.map(item => <div className={styles.taskRow} key={item.line}>
        <label><input type="checkbox" checked={item.checked} onChange={event => onChange({ markdown: editNodeTask(node.markdown, item.line, event.target.checked) })} /><span className={item.checked ? styles.completedTask : undefined}>{item.text || "待办事项"}</span></label>
        <button className={styles.icon} aria-label={`删除待办：${item.text || "待办事项"}`} onClick={() => onChange({ markdown: editNodeTask(node.markdown, item.line, null) })}><X size={14} /></button>
      </div>)}</div>
      <form className={styles.addTask} onSubmit={event => { event.preventDefault(); if (!task.trim()) return; onChange({ markdown: `${node.markdown}${node.markdown && !node.markdown.endsWith("\n") ? "\n" : ""}- [ ] ${task.trim()}` }); setTask(""); }}>
        <input aria-label="新待办事项" placeholder="添加待办…" value={task} onChange={event => setTask(event.target.value)} maxLength={300} /><button aria-label="添加待办" disabled={!task.trim()}><Plus size={17} /></button>
      </form>
    </div>}
    <footer>
      {kind === "link" && url ? <a className={styles.open} href={url} target="_blank" rel="noopener noreferrer">打开链接<ArrowUpRight size={16} /></a>
        : <button className={styles.open} onClick={onOpen}>{kind === "note" ? "打开全文" : "打开 Markdown"}<ArrowUpRight size={16} /></button>}
      <time dateTime={node.updatedAt} title={`创建：${new Date(node.createdAt).toLocaleString("zh-CN")}\n修改：${new Date(node.updatedAt).toLocaleString("zh-CN")}`}>{new Date(node.updatedAt).toLocaleDateString("zh-CN", { month: "long", day: "numeric" })}更新</time>
    </footer>
  </>;
}
