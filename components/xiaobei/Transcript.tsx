"use client";

import { memo, useEffect, useId, useState } from "react";
import Link from "next/link";
import Markdown from "react-markdown";
import remarkCjkFriendly from "remark-cjk-friendly/parseOnly";
import remarkGfm from "remark-gfm";
import { BookOpen, Brain, CaretRight, MagnifyingGlass, Newspaper } from "@phosphor-icons/react";
import { TermIcon } from "@/components/terms/TermIcon";
import { partitionTranscript, type ActivityBlock, type ChatBlock } from "@/lib/xiaobei/events";
import { remarkTermLinks } from "@/lib/xiaobei/citations";

export function Answer({ text, termNames, newsNames, close }: { text: string; termNames: Record<string, string>; newsNames: Record<string, string>; close: () => void }) {
  return <div className="xb-answer"><Markdown remarkPlugins={[remarkGfm, remarkCjkFriendly, [remarkTermLinks, termNames, newsNames]]} skipHtml components={{
    a: ({ href, children }) => {
      if (href?.startsWith("/terms/") && termNames[href]) return <Link className="xb-citation" href={href} onClick={close}><TermIcon slug={href.slice("/terms/".length)} size={16} /><span>{termNames[href]}</span></Link>;
      if (href?.startsWith("/news/") && newsNames[href]) return <Link className="xb-citation xb-news-citation" href={href} onClick={close}><Newspaper size={13} aria-hidden="true" /><span>{newsNames[href]}</span></Link>;
      return href && /^\/(?:guides\/(?:html|css|javascript)|about)?$/.test(href)
        ? <Link href={href} onClick={close}>{children}</Link> : <>{children}</>;
    },
    img: () => null,
    table: ({ children }) => <div className="xb-table"><table>{children}</table></div>,
  }}>{text}</Markdown></div>;
}

function Elapsed({ block }: { block: ActivityBlock }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (block.state !== "running") return;
    const timer = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(timer);
  }, [block.state]);
  return <span className="xb-elapsed">{(Math.max(0, (block.finishedAt ?? now) - block.startedAt) / 1000).toFixed(1)}s</span>;
}

function Activity({ block }: { block: ActivityBlock }) {
  const think = block.kind === "think";
  const label = think ? "Think" : block.name === "search_terms" ? "搜索词条" : block.name === "read_term" ? "读取词条" : block.name === "search_news" ? "搜索新闻" : block.name === "read_news" ? "读取新闻" : "工具";
  const preview = think ? (block.state === "running" ? block.text.trim().split("\n").at(-1) : block.text.split("\n")[0]) : block.summary;
  const stateLabel = { running: "进行中", complete: "已完成", error: "未完成", stopped: "已停止" }[block.state];
  const Icon = think ? Brain : block.name === "search_terms" || block.name === "search_news" ? MagnifyingGlass : block.name === "read_news" ? Newspaper : BookOpen;
  if (!think) return <div className="xb-activity xb-tool" data-state={block.state} role="group" aria-label={`${label} · ${stateLabel} · ${preview || ""}`}>
    <Icon size={15} /><span className="xb-activity-label">{label}</span><span className="xb-activity-preview">{preview}</span>
    {(block.state === "error" || block.state === "stopped") && <span>{stateLabel}</span>}
  </div>;
  return <details className="xb-activity" data-state={block.state}>
    <summary aria-label={`${label} · ${stateLabel} · ${preview || ""}`}>
      <Icon size={15} /><span className="xb-activity-label">{label}</span><Elapsed block={block} />
      <span className="xb-activity-preview">{block.state === "error" || block.state === "stopped" ? stateLabel : preview}</span><CaretRight size={12} className="xb-chevron" />
    </summary>
    <div className="xb-activity-body"><p>{block.text}</p></div>
  </details>;
}

export const Transcript = memo(function Transcript({ blocks, termNames, newsNames, close }: { blocks: ChatBlock[]; termNames: Record<string, string>; newsNames: Record<string, string>; close: () => void }) {
  const { process, answer } = partitionTranscript(blocks);
  const [expandedAnswer, setExpandedAnswer] = useState("");
  const processId = useId();
  // Tie the choice to this answer, so subsequent tokens never re-collapse it.
  const expanded = !answer || expandedAnswer === answer.id;
  const render = (block: ChatBlock) => block.kind === "text"
    ? <div className="xb-text-block" data-phase={block.phase} key={block.id}><Answer text={block.text} termNames={termNames} newsNames={newsNames} close={close} /></div>
    : <Activity block={block} key={block.id} />;
  return <>
    {process.length > 0 && <>
      {answer && <button type="button" className="xb-process-toggle" aria-expanded={expanded} aria-controls={processId} onClick={() => setExpandedAnswer(expanded ? "" : answer.id)}>
        <CaretRight size={13} className="xb-chevron" />{expanded ? "收起过程" : "查看过程"}
      </button>}
      <div id={processId} className="xb-process" hidden={!expanded}>{process.map(render)}</div>
    </>}
    {answer && render(answer)}
  </>;
});
