import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { AccountSettings } from "@/components/account/AccountSettings";

export const metadata: Metadata = { title: "设置", robots: { index: false, follow: false } };
export default function SettingsPage() {
  return <><SiteHeader /><AccountSettings /></>;
}
