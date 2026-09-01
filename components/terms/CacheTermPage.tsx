"use client";

import { ArrowCounterClockwise, CheckCircle, Database, Lightning, PaperPlaneTilt, WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

import { BespokeTermPageProps, TermLabHeader, TermLabLearning } from "@/components/terms/BespokeTermScaffold";

type Run = { id: number; source: "缓存" | "数据库"; result: number; duration: string; stale: boolean };

export function CacheTermPage({ term, related }: BespokeTermPageProps) {
  const [cacheExists, setCacheExists] = useState(true);
  const [validity, setValidity] = useState<"valid" | "expired">("valid");
  const [sourcePrice, setSourcePrice] = useState(139);
  const [runs, setRuns] = useState<Run[]>([
    { id: 3, source: "缓存", result: 129, duration: "8 ms", stale: true },
    { id: 2, source: "数据库", result: 139, duration: "82 ms", stale: false },
    { id: 1, source: "缓存", result: 129, duration: "7 ms", stale: false },
  ]);
  const latest = runs[0];

  function sendRequest() {
    const hitsCache = cacheExists && validity === "valid";
    const result = hitsCache ? 129 : sourcePrice;
    setRuns((current) => {
      const nextRun: Run = { id: (current[0]?.id ?? 0) + 1, source: hitsCache ? "缓存" : "数据库", result, duration: hitsCache ? "8 ms" : "82 ms", stale: hitsCache && result !== sourcePrice };
      return [nextRun, ...current].slice(0, 4);
    });
  }

  function reset() {
    setCacheExists(true); setValidity("valid"); setSourcePrice(139);
    setRuns([{ id: 1, source: "缓存", result: 129, duration: "8 ms", stale: true }]);
  }

  return (
    <main className="bespoke-term-page cache-term-page">
      <div className="bespoke-term-shell">
        <TermLabHeader term={term} eyebrow="数据新鲜度实验" summary="缓存用更快的旧副本换取更少的数据库请求，关键是决定它什么时候失效。" />
        <section className="cache-lab" aria-labelledby="cache-lab-title">
          <div className="cache-controls">
            <div className="cache-panel-kicker"><span>实验条件</span><strong id="cache-lab-title">改变缓存状态</strong></div>
            <label className="cache-toggle"><span><strong>缓存中有副本</strong><small>当前值固定为 ¥129</small></span><input type="checkbox" checked={cacheExists} onChange={(event) => setCacheExists(event.currentTarget.checked)} /><i /></label>
            <fieldset><legend>副本状态</legend><label className={validity === "valid" ? "is-selected" : ""}><input type="radio" name="validity" checked={validity === "valid"} onChange={() => setValidity("valid")} /><CheckCircle size={18} />有效</label><label className={validity === "expired" ? "is-selected" : ""}><input type="radio" name="validity" checked={validity === "expired"} onChange={() => setValidity("expired")} /><WarningCircle size={18} />已过期</label></fieldset>
            <label className="cache-price"><span>数据库真实价格</span><div><input type="range" min="119" max="159" step="10" value={sourcePrice} onChange={(event) => setSourcePrice(Number(event.currentTarget.value))} /><output>¥{sourcePrice}</output></div></label>
            <div className="cache-actions"><button className="lab-primary" type="button" onClick={sendRequest}><PaperPlaneTilt size={17} weight="fill" />发送请求</button><button type="button" className="lab-icon-button" onClick={reset} aria-label="重置缓存实验"><ArrowCounterClockwise size={18} /></button></div>
          </div>

          <div className="cache-trace">
            <div className="cache-panel-kicker"><span>请求路径</span><strong>这次访问了谁？</strong></div>
            <div className="trace-line"><div className="trace-node is-done"><PaperPlaneTilt size={18} /><span><strong>客户端</strong><small>发起 GET /price</small></span><b>0 ms</b></div><i /><div className="trace-node is-done"><Lightning size={18} /><span><strong>缓存层</strong><small>{latest.source === "缓存" ? "命中，直接返回" : cacheExists ? "过期，继续查询" : "没有副本，继续查询"}</small></span><b>2 ms</b></div><i className={latest.source === "缓存" ? "is-muted" : ""} /><div className={`trace-node${latest.source === "数据库" ? " is-done" : " is-muted"}`}><Database size={18} /><span><strong>数据库</strong><small>{latest.source === "数据库" ? "读取最新价格" : "本次未访问"}</small></span><b>{latest.source === "数据库" ? "76 ms" : "—"}</b></div></div>
          </div>

          <div className="cache-result">
            <div className="cache-panel-kicker"><span>返回结果</span><strong>速度与新鲜度</strong></div>
            <div className="cache-result-value"><span>用户看到</span><strong>¥{latest.result}</strong><em>{latest.duration}</em></div>
            <div className={`cache-result-state${latest.stale ? " is-stale" : ""}`}>{latest.stale ? <WarningCircle size={19} weight="fill" /> : <CheckCircle size={19} weight="fill" />}<p><strong>{latest.stale ? "快，但已经过时" : "返回的是最新值"}</strong><span>{latest.stale ? `数据库是 ¥${sourcePrice}，缓存仍是 ¥129。` : `数据来自${latest.source}。`}</span></p></div>
            <dl><div><dt>来源</dt><dd>{latest.source}</dd></div><div><dt>节省查询</dt><dd>{latest.source === "缓存" ? "1 次" : "0 次"}</dd></div></dl>
          </div>

          <div className="cache-history"><span>最近实验</span><table><thead><tr><th>编号</th><th>来源</th><th>结果</th><th>耗时</th><th>判断</th></tr></thead><tbody>{runs.map((run) => <tr key={run.id}><td>#{run.id}</td><td>{run.source}</td><td>¥{run.result}</td><td>{run.duration}</td><td className={run.stale ? "is-stale" : ""}>{run.stale ? "旧数据" : "最新"}</td></tr>)}</tbody></table></div>
        </section>
        <TermLabLearning related={related} sources={[
          { label: "MDN · HTTP Caching", note: "浏览器与 HTTP 缓存机制", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching" },
          { label: "AWS · Caching", note: "缓存策略与失效设计", url: "https://aws.amazon.com/caching/" },
        ]} />
      </div>
    </main>
  );
}
