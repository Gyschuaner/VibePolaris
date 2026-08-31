"use client";

import { CheckCircle, FileText, MagnifyingGlass, WarningCircle } from "@phosphor-icons/react";
import { useMemo, useState } from "react";

import { BespokeTermPageProps, TermLabHeader, TermLabLearning } from "@/components/terms/BespokeTermScaffold";

const evidence = [
  { id: "A", title: "退款规则", meta: "帮助中心 · v2.4", score: 94, quote: "标准订单可在签收后 7 天内申请退款；数字商品除外。", supports: "标准订单支持 7 天退款。" },
  { id: "B", title: "会员权益", meta: "会员手册 · 2026-08", score: 88, quote: "Pro 会员发起退款后，原路退回时间通常为 3–5 个工作日。", supports: "Pro 会员退款通常 3–5 个工作日到账。" },
  { id: "C", title: "特殊商品说明", meta: "商品政策 · v1.8", score: 71, quote: "定制商品一旦进入生产环节，不支持无理由退款。", supports: "定制商品进入生产后不能无理由退款。" },
] as const;

export function RagTermPage({ term, related }: BespokeTermPageProps) {
  const [query, setQuery] = useState("Pro 会员买的定制商品，可以退款吗？");
  const [selected, setSelected] = useState("A");
  const [audited, setAudited] = useState(false);
  const active = evidence.find((item) => item.id === selected)!;
  const answer = useMemo(() => [evidence[0].supports, evidence[1].supports, "但当前证据没有说明 Pro 会员是否能绕过定制商品限制。"], []);

  return (
    <main className="bespoke-term-page rag-term-page">
      <div className="bespoke-term-shell">
        <TermLabHeader term={term} eyebrow="回答证据核验" summary="先检索与你的问题有关的资料，再让模型只依据这些资料组织答案。" />
        <section className="rag-workbench" aria-labelledby="rag-workbench-title">
          <div className="rag-query-panel">
            <div className="rag-panel-kicker"><span>01</span><strong id="rag-workbench-title">提出问题</strong></div>
            <label><span>你想问什么？</span><textarea value={query} onChange={(event) => { setQuery(event.currentTarget.value); setAudited(false); }} /></label>
            <div className="rag-filter-row"><label><span>知识版本</span><select defaultValue="latest"><option value="latest">只看最新版</option><option value="all">包含历史版本</option></select></label><label><span>召回数量</span><select defaultValue="3"><option>3</option><option>5</option></select></label></div>
            <button className="lab-primary" type="button" onClick={() => setAudited(true)}><MagnifyingGlass size={17} />检索并核对引用</button>
            <p>问题里的“Pro 会员”“定制商品”“退款”会分别参与检索。</p>
          </div>

          <div className="rag-evidence-panel">
            <div className="rag-panel-kicker"><span>02</span><strong>取回证据</strong><em>3 段</em></div>
            <div className="rag-evidence-list">{evidence.map((item) => <button type="button" key={item.id} className={selected === item.id ? "is-selected" : ""} onClick={() => setSelected(item.id)} aria-pressed={selected === item.id}><FileText size={18} /><span><strong>{item.title}</strong><small>{item.meta}</small><q>{item.quote}</q></span><b>{item.score}%</b></button>)}</div>
            <div className="rag-evidence-focus"><span>当前证据 {active.id}</span><p>{active.quote}</p></div>
          </div>

          <div className="rag-answer-panel">
            <div className="rag-panel-kicker"><span>03</span><strong>生成答案</strong><em>{audited ? "已核验" : "待核验"}</em></div>
            <div className="rag-answer-card"><p>{query || "请先输入问题。"}</p>{answer.map((sentence, index) => <div className={index === 2 ? "is-missing" : "is-supported"} key={sentence}>{index === 2 ? <WarningCircle size={18} weight="fill" /> : <CheckCircle size={18} weight="fill" />}<span>{sentence}<small>{index === 2 ? "缺少直接证据" : `来源 ${index === 0 ? "A" : "B"}`}</small></span></div>)}</div>
            <div className="rag-coverage"><div><span>证据覆盖</span><strong>{audited ? "2 / 3" : "—"}</strong></div><i><b style={{ width: audited ? "66.666%" : "0%" }} /></i><p>{audited ? "这不是让模型猜，而是明确告诉你哪一句还没有依据。" : "点击核对，逐句检查答案是否有来源。"}</p></div>
          </div>
        </section>
        <TermLabLearning related={related} sources={[
          { label: "Lewis et al. · RAG", note: "检索增强生成的原始论文", url: "https://arxiv.org/abs/2005.11401" },
          { label: "OpenAI · File Search", note: "在产品中构建可追溯检索", url: "https://platform.openai.com/docs/guides/tools-file-search" },
        ]} />
      </div>
    </main>
  );
}
