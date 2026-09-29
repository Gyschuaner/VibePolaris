import type { Metadata } from "next";
import { ActivationForm } from "@/components/xiaobei/ActivationForm";

export const metadata: Metadata = { title: "小北 · 邀请激活", robots: { index: false, follow: false } };
export default function ActivateXiaobeiPage() {
  return <main className="xb-activation"><div className="xb-activation-card"><span className="xb-activation-star" aria-hidden="true">✦</span><p className="xb-eyebrow">VIBEPOLARIS · 内部邀请</p><h1>和小北一起，<br />把概念聊明白。</h1><p className="xb-activation-intro">输入邀请码，开启你的站内答疑助手。</p><ActivationForm /></div></main>;
}
