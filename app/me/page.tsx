import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { AccountHome } from "@/components/account/AccountHome";

export const metadata: Metadata = { title: "我的主页", robots: { index: false, follow: false } };

export default function AccountHomePage() {
  return <><SiteHeader /><AccountHome /></>;
}
