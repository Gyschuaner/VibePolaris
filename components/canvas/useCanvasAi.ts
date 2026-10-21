import { useEffect, useRef, useState } from "react";
import { ownerHeaders, useAccount } from "@/components/account/AccountProvider";
import { addSuggestions, sourceHash, type CanvasAiFeature, type DocumentVariant, type NodeSuggestion } from "@/lib/canvas-ai";
import { nodePreview, type CanvasData, type CanvasNode } from "@/lib/canvas";

export type AiProgress = { nodeId: string; running: boolean; characters: number; message: string; error?: boolean };
type Running = { controller: AbortController; save: () => void };
export function useCanvasAi(data: CanvasData, update: (change: (value: CanvasData) => CanvasData, immediate?: boolean) => void, flush: () => Promise<void>) {
  const { account, aiPreferences } = useAccount();
  const [progress, setProgress] = useState<Partial<Record<CanvasAiFeature, AiProgress>>>({});
  const running = useRef<Partial<Record<CanvasAiFeature, Running>>>({}), mounted = useRef(true);
  const [expanded, setExpanded] = useState(0);
  useEffect(() => {
    mounted.current = true;
    const stop = () => { for (const task of Object.values(running.current)) { task.save(); task.controller.abort(); } void flush(); };
    const beforeChange = (event: Event) => { stop(); (event as CustomEvent<Promise<unknown>[]>).detail.push(flush()); };
    window.addEventListener("vp-account-before-change", beforeChange); window.addEventListener("pagehide", stop);
    return () => { stop(); mounted.current = false; window.removeEventListener("vp-account-before-change", beforeChange); window.removeEventListener("pagehide", stop); };
  }, [flush]);
  useEffect(() => {
    for (const feature of ["organize", "expand"] as const) if (!aiPreferences[feature]) running.current[feature]?.controller.abort();
  }, [aiPreferences]);

  async function start(feature: CanvasAiFeature, node: CanvasNode, variant: DocumentVariant = "draft") {
    if (running.current[feature] || !aiPreferences[feature]) return;
    const markdown = feature === "organize" || variant === "draft" ? node.markdown : node.article?.markdown ?? "";
    if (!markdown.trim() || (feature === "organize" && node.articleProposal)) return;
    const controller = new AbortController();
    let text = "", hash = "", lastSaved = 0, completed = false;
    const generatedAt = new Date().toISOString();
    const report = (value: Partial<AiProgress>) => { if (mounted.current) setProgress(previous => ({ ...previous, [feature]: { nodeId: node.id, running: true, characters: text.length, message: "正在连接小北…", ...previous[feature], ...value } })); };
    const save = () => {
      if (!text || feature !== "organize") return;
      update(value => ({ ...value, nodes: value.nodes.map(item => item.id === node.id ? { ...item, articleProposal: { markdown: text, sourceHash: hash, generatedAt, complete: false }, updatedAt: new Date().toISOString() } : item) }), true);
    };
    running.current[feature] = { controller, save };
    report({ nodeId: node.id, running: true, characters: 0, message: "正在连接小北…", error: false });
    try {
      hash = await sourceHash(markdown); controller.signal.throwIfAborted();
      const response = await fetch(`/api/xiaobei/canvas/${feature}`, { method: "POST", signal: controller.signal,
        headers: { "Content-Type": "application/json", ...ownerHeaders(account?.id) },
        body: JSON.stringify({ requestId: crypto.randomUUID(), title: nodePreview(node).title, markdown, existing: feature === "expand" ? data.nodes.map(item => nodePreview(item).title) : [] }),
      });
      if (!response.ok) { const body = await response.json(); throw new Error(body.error || "小北暂时不可用。"); }
      if (!response.body) throw new Error("没有收到生成内容，请重试。");
      const reader = response.body.getReader(), decoder = new TextDecoder();
      let buffer = "", suggestions: NodeSuggestion[] | undefined;
      try {
        while (true) {
          const chunk = await reader.read(); if (chunk.done) break;
          buffer += decoder.decode(chunk.value, { stream: true });
          let end: number;
          while ((end = buffer.indexOf("\n")) >= 0) {
            const event = JSON.parse(buffer.slice(0, end)); buffer = buffer.slice(end + 1);
            controller.signal.throwIfAborted();
            if (event.type === "error") throw new Error(event.message);
            if (event.type === "stage") report({ message: event.text });
            if (event.type === "delta") {
              text += event.text;
              if (Date.now() - lastSaved > 300) { save(); lastSaved = Date.now(); report({ characters: text.length, message: "正在整理文章…" }); }
            }
            if (event.type === "progress") report({ characters: event.characters, message: "正在生成候选节点…" });
            if (event.type === "suggestions") suggestions = event.nodes;
            if (event.type === "done") completed = true;
          }
        }
      } finally { await reader.cancel().catch(() => {}); }
      controller.signal.throwIfAborted();
      if (!completed) throw new Error("连接中断，已生成的文章片段已保留。");
      if (feature === "organize") {
        if (!text.trim()) throw new Error("没有收到文章，请重试。");
        const article = { markdown: text, sourceHash: hash, generatedAt, complete: true };
        update(value => ({ ...value, nodes: value.nodes.map(item => item.id !== node.id ? item : { ...item, ...(item.article ? { articleProposal: article } : { article, articleProposal: undefined }), updatedAt: new Date().toISOString() }) }), true);
        report({ running: false, characters: text.length, message: node.article ? "新版已整理，采用后替换当前文章。" : "文章已整理，草稿已保留。" });
      } else {
        if (!suggestions) throw new Error("没有收到候选节点，请重试。");
        let count = 0, exists = false;
        update(value => { exists = value.nodes.some(item => item.id === node.id); const next = addSuggestions(value, node.id, variant, suggestions!); count = next.nodes.length - value.nodes.length; return next; }, true);
        if (!exists) throw new Error("来源节点已删除，本次没有添加新节点。");
        report({ running: false, message: count ? "" : "建议与已有节点重复，没有重复添加。" });
        if (count) setExpanded(value => value + 1);
      }
    } catch (cause) {
      save();
      report({ running: false, characters: text.length, error: !controller.signal.aborted, message: controller.signal.aborted ? text ? "已停止，生成片段已保留。" : "已停止。" : cause instanceof Error ? cause.message : "连接失败，请重试。" });
    } finally { delete running.current[feature]; await flush(); }
  }
  return { start, progress, expanded, cancel: (feature: CanvasAiFeature) => running.current[feature]?.controller.abort() };
}
