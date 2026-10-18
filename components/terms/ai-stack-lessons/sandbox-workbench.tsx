"use client";

import { useState } from "react";
import { FileText, Key, Globe, CircleNotch } from "@phosphor-icons/react";
import { ConceptHero } from "../ConceptHero";
import styles from "./SandboxWorkbench.module.css";

const sampleCsv = "项目,金额\n纸,12\n笔,8";

export function SandboxHero() {
  return <ConceptHero slug="execution-sandbox" label="表格和计算进程留在临时边界内，项目密钥被挡在边界外；到期时内部对象消失">
    <svg className={styles.miniBox} viewBox="0 0 360 220" aria-hidden="true">
      <rect x="39" y="35" width="244" height="145" rx="22" className={styles.miniWall} />
      <text x="60" y="60">临时环境</text>
      <g className={styles.miniFiles}><path d="M67 81h39l12 12v55H67z M106 81v12h12" /><text x="73" y="115">CSV</text><path d="M81 126h24 M81 134h24" /><circle cx="163" cy="112" r="20" className={styles.miniProcess} /><path d="M154 112h18 M163 103v18" /><path d="M209 88h40v56h-40z M218 103h22 M218 115h22 M218 127h15" className={styles.miniReport} /></g>
      <g className={styles.miniKey}><circle cx="317" cy="109" r="8" /><path d="M310 115l-17 17 M298 127l5 5 M293 132l5 5" /><text x="317" y="157" textAnchor="middle">密钥</text></g>
      <circle cx="259" cy="56" r="8" className={styles.miniTimer} /><text x="161" y="117" textAnchor="middle" className={styles.miniExpired}>已销毁</text>
    </svg>
  </ConceptHero>;
}

export function SandboxWorkbench() {
  const [files, setFiles] = useState<{ csv: string; report: string | null } | null>({ csv: sampleCsv, report: null });
  const [readOnly, setReadOnly] = useState(false);
  const [exported, setExported] = useState<string | null>(null);
  const [event, setEvent] = useState({ serial: 0, kind: "ready", text: "临时目录可读写；宿主密钥和外网不在允许范围内。" });
  const expired = files === null;
  function show(kind: string, text: string) { setEvent(previous => ({ serial: previous.serial + 1, kind, text })); }
  function writeReport() {
    if (!files) { show("denied", "环境已销毁，不能继续读取或写入临时文件。"); return; }
    if (readOnly) { show("denied", "写入被拒：目录只读。已有文件保持原样。"); return; }
    const amounts = files.csv.split("\n").slice(1).map(row => Number(row.split(",")[1]));
    const report = `记录：${amounts.length} 条\n合计：${amounts.reduce((sum, value) => sum + value, 0)} 元`;
    setFiles({ ...files, report });
    show("write", "已读取当前表格，并在临时目录写出 report.txt。");
  }
  function takeReport() {
    if (!files?.report) { show("denied", expired ? "环境已销毁，临时报告无法再取回。" : "临时目录里还没有报告。"); return; }
    setExported(files.report);
    show("export", "报告已复制到环境外；临时目录里的原件仍在。");
  }
  function expire() {
    setFiles(null);
    show("expire", exported ? "到期后，本例终止运行并销毁临时目录；已取回的报告保留。" : "到期后，本例终止运行并销毁临时目录；没有取回的报告随之丢失。");
  }
  function renew() {
    setFiles({ csv: sampleCsv, report: null });
    show("ready", "已新建临时环境并重新放入示例表格；环境外的报告保持原样。");
  }
  return <figure className={styles.lab} aria-label="执行沙箱临时文件与访问边界实验">
    <div className={styles.toolbar}><span>任务：汇总表格金额</span><label><input type="checkbox" checked={readOnly} disabled={expired} onChange={e => { setReadOnly(e.target.checked); show("ready", e.target.checked ? "目录改为只读；可以读表格，不能写报告。" : "临时目录恢复可写。"); }} />临时目录只读</label></div>
    <div className={styles.workbench}>
      <div className={styles.sandbox} data-expired={expired}>
        <div className={styles.boxLabel}><CircleNotch size={17} /><span>{expired ? "临时环境已销毁" : "临时环境 · /work"}</span></div>
        {files ? <div className={styles.fileShelf}><div className={styles.file}><FileText size={23} /><b>expenses.csv</b><pre>{files.csv}</pre></div>{files.report ? <div className={`${styles.file} ${styles.report}`}><FileText size={23} /><b>report.txt</b><pre>{files.report}</pre></div> : <div className={styles.noReport}>还没有报告</div>}</div> : <div className={styles.empty} key={event.serial}>临时文件已清空</div>}
        {(event.kind === "key" || event.kind === "network") && !expired && <div key={event.serial} className={styles.probe} aria-hidden="true">{event.kind === "key" ? <Key size={20} /> : <Globe size={20} />}</div>}
      </div>
      <div className={styles.outside}><span>环境外</span><div className={styles.hostKey}><Key size={23} /><b>项目密钥</b><small>未交给本任务</small></div>{exported ? <div className={`${styles.file} ${styles.saved}`} key={exported}><FileText size={23} /><b>取回的报告</b><pre>{exported}</pre></div> : <div className={styles.noReport}>尚未取回报告</div>}</div>
    </div>
    <div className={styles.actions} role="group" aria-label="操作示例沙箱"><button type="button" onClick={writeReport}>计算并写报告</button><button type="button" onClick={takeReport}>取回报告</button><button type="button" onClick={() => show("key", expired ? "环境已销毁，不能再发起读取。" : "读取被拒：项目密钥没有交给沙箱。")}>尝试读项目密钥</button><button type="button" onClick={() => show("network", expired ? "环境已销毁，不能再发起请求。" : "访问被拒：本例没有外网连接。")}>尝试访问外网</button><button type="button" onClick={expire} disabled={expired}>模拟到期销毁</button><button type="button" onClick={renew}>新建临时环境</button></div>
    <p className={styles.result} role="status" data-denied={event.kind === "denied" || event.kind === "key" || event.kind === "network"} key={event.serial}>{event.text}</p>
    <figcaption>这是页面内的权限与文件生命周期模型：实际计算示例表格，手动触发到期。没有启动容器、读取本机密钥或发送网络请求；本例销毁的只是临时目录，持久存储需另行约定。</figcaption>
  </figure>;
}
