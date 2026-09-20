import type { Metadata } from "next";
import { ConceptGraph } from "@/components/ConceptGraph";
import { SiteHeader } from "@/components/SiteHeader";
import { terms } from "@/lib/content";
import { buildTermGraph } from "@/lib/term-graph";

export const metadata: Metadata = {
  title: "概念星图",
  description: "沿着概念之间的联系，探索 Vibe Coding 词条。",
};

export default function GraphPage() {
  const graph = buildTermGraph(terms.map(({ slug, zh, en, cat, aliases, definition, relatedSlugs }) => ({ slug, zh, en, cat, aliases, definition, relatedSlugs })));
  return <><SiteHeader wide /><ConceptGraph {...graph} /></>;
}
