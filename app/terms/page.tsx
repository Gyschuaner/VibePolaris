import type { Metadata } from "next";

import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { TermsBrowser } from "@/components/TermsBrowser";
import { taxonomy, terms } from "@/lib/content";

export const metadata: Metadata = {
  title: "术语",
  description: `用你的大白话搜索 ${terms.length} 条 Vibe Coding 术语。`,
};

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <TermsBrowser terms={terms} categories={taxonomy.map((item) => item.name)} />
      <SiteFooter />
    </>
  );
}
