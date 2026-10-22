import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { GearSix, Sparkle, X } from "@phosphor-icons/react";
import { useAccount } from "@/components/account/AccountProvider";
import { sourceHash, type DocumentVariant } from "@/lib/canvas-ai";
import type { CanvasNode } from "@/lib/canvas";
import type { useCanvasAi } from "./useCanvasAi";
import styles from "./CanvasAiControls.module.css";

export function CanvasAiControls({ node, ai, pendingCount, variant = "draft", onVariant, onChange, onOpenArticle, onEditArticle, onCanvas, onAccept, onReject }: {
  node: CanvasNode; ai: ReturnType<typeof useCanvasAi>; variant?: DocumentVariant; onVariant?: (variant: DocumentVariant) => void;
  pendingCount: number; onChange: (patch: Partial<CanvasNode>) => void; onOpenArticle: () => void; onEditArticle: () => void; onCanvas?: () => void; onAccept: () => void; onReject: () => void;
}) {
  const { aiPreferences } = useAccount();
  const menuId = useId();
  const [menuOpen, setMenuOpen] = useState(false);
  const [expansionSource, setExpansionSource] = useState<DocumentVariant>(variant), [hash, setHash] = useState("");
  useEffect(() => { let disposed = false; void sourceHash(node.markdown).then(value => { if (!disposed) setHash(value); }); return () => { disposed = true; }; }, [node.markdown]);
  const article = node.articleProposal ?? node.article, changed = !!(node.article && hash && hash !== node.article.sourceHash);
  const organizing = ai.progress.organize?.nodeId === node.id && ai.progress.organize.running;
  const expanding = ai.progress.expand?.nodeId === node.id && ai.progress.expand.running;
  const pending = node.ai?.status === "pending";
  const failed = [ai.progress.organize, ai.progress.expand].some(progress => progress?.nodeId === node.id && progress.error);
  const cue = organizing ? "整理中" : expanding ? "扩展中" : failed ? "未完成" : pending ? "待接受" : node.articleProposal ? "待采用" : pendingCount > 0 ? `${pendingCount} 待选` : "";
  const controls = <>
    <div className={styles.row}>
      {node.ai && <span className={styles.provenance}>小北生成{pending ? " · 待接受" : ""}</span>}
      {pending ? <><button onClick={onAccept}>接受节点</button><button onClick={onReject}>不接受</button></> : <>
        {aiPreferences.organize && <button disabled={!node.markdown.trim() || !!node.articleProposal || !!ai.progress.organize?.running} onClick={() => { void ai.start("organize", node); onOpenArticle(); }}><Sparkle size={15} />{node.article ? "重新整理" : "整理成文"}</button>}
        {aiPreferences.expand && <div className={styles.expand}>
          {node.article && <select aria-label="扩展内容来源" value={expansionSource} onChange={event => setExpansionSource(event.target.value as DocumentVariant)}><option value="draft">从草稿</option><option value="article">从文章</option></select>}
          <button disabled={!!ai.progress.expand?.running || !(expansionSource === "article" ? node.article?.markdown : node.markdown)?.trim()} onClick={() => void ai.start("expand", node, expansionSource)}>扩展节点</button>
        </div>}
      </>}
      {!onVariant && article && <><button onClick={onOpenArticle}>查看文章</button><button disabled={!!organizing} onClick={onEditArticle}>编辑文章</button></>}
      <Link href="/settings" className={styles.settings} title="小北功能设置" aria-label="小北功能设置"><GearSix size={16} /></Link>
    </div>
    {onVariant && variant === "article" && article && <div className={styles.caption}>
      <span>小北整理{changed ? " · 草稿已更新" : ""}{node.articleProposal ? article.complete ? " · 新版待采用" : " · 未完成片段" : ""}</span>
      {node.articleProposal && !organizing && <><button onClick={() => onChange({ article: node.articleProposal, articleProposal: undefined })}>{article.complete ? "采用此版" : "保留为文章"}</button><button onClick={() => { onChange({ articleProposal: undefined }); if (!node.article) onVariant("draft"); }}>{node.article ? "保留原文章" : "舍弃片段"}</button></>}
    </div>}
    {pendingCount > 0 && !expanding && <div className={styles.progress} role="status"><span>还有 {pendingCount} 个候选节点，等待你的选择。</span>{onCanvas && <button onClick={onCanvas}>查看节点</button>}</div>}
    {(["organize", "expand"] as const).map(feature => { const progress = ai.progress[feature]; return progress?.nodeId === node.id && (progress.running || progress.error || (feature === "expand" && !!progress.message)) && <div key={feature} className={styles.progress} role={progress.error ? "alert" : "status"}>
      <span>{progress.message}{progress.running && progress.characters > 0 ? ` ${progress.characters} 字符` : ""}</span>
      {progress.running && <button onClick={() => ai.cancel(feature)}>停止</button>}
    </div>; })}
  </>;
  if (!onVariant) return <div className={styles.controls} data-canvas-ui>{controls}</div>;
  return <div className={`${styles.controls} ${styles.document}`} data-canvas-ui>
    {(aiPreferences.organize || article) && <div className={styles.tabs} role="group" aria-label="笔记版本">
      <button aria-pressed={variant === "draft"} onClick={() => onVariant("draft")}>草稿</button>
      <button aria-pressed={variant === "article"} disabled={!article && !organizing} onClick={() => onVariant("article")}>文章</button>
    </div>}
    <button className={styles.trigger} popoverTarget={menuId} aria-haspopup="dialog" aria-expanded={menuOpen} aria-label="小北工具">
      <Sparkle size={16} /><span>小北</span>{cue && <span className={styles.cue} role="status">{cue}</span>}
    </button>
    <div id={menuId} popover="auto" role="dialog" aria-label="小北工具" className={styles.menu} onToggle={event => setMenuOpen(event.newState === "open")}>
      <div className={styles.menuHeading}><strong>小北</strong><button popoverTarget={menuId} popoverTargetAction="hide" aria-label="关闭小北工具"><X size={17} /></button></div>
      {controls}
    </div>
  </div>;
}
