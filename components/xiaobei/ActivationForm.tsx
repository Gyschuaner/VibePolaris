"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ActivationForm() {
  const [code, setCode] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const router = useRouter();
  return <form className="xb-activation-form" onSubmit={async event => {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/xiaobei/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "激活失败，请重试。");
      setCode(""); window.dispatchEvent(new Event("xiaobei-activated")); router.replace("/");
    } catch (failure) { setError(failure instanceof Error ? failure.message : "连接失败，请稍后再试。"); }
    finally { setBusy(false); }
  }}><label htmlFor="xb-code">邀请码</label><input id="xb-code" type="password" value={code} onChange={event => setCode(event.target.value)} placeholder="输入你收到的邀请码" autoComplete="off" autoCapitalize="none" spellCheck={false} required maxLength={100} disabled={busy} /><button type="submit" disabled={busy || !code.trim()}>{busy ? "正在激活…" : "开启小北"}</button>{error && <p role="alert">{error}</p>}</form>;
}
