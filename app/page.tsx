import { ConceptGraph } from "@/components/ConceptGraph";
import { SiteHeader } from "@/components/SiteHeader";
import { publishedTerms, taxonomy } from "@/lib/content";
import { buildTermGraph } from "@/lib/term-graph";
import { redirect } from "next/navigation";
import { siteHome, siteModules } from "@/lib/site-modules";

export default function HomePage() {
  if (!siteModules.graph) redirect(siteHome());
  const graph = buildTermGraph(publishedTerms.map(({ slug, zh, en, cat, aliases, definition, relatedSlugs }) => ({ slug, zh, en, cat, aliases, definition, relatedSlugs })));
  const publishedCategories = new Set(publishedTerms.map((term) => term.cat));
  return (
    <>
      <SiteHeader wide />
      <ConceptGraph {...graph} categories={taxonomy.map(category => category.name).filter(category => publishedCategories.has(category))} />
    </>
  );
}
