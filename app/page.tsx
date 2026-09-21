import { ConceptGraph } from "@/components/ConceptGraph";
import { SiteHeader } from "@/components/SiteHeader";
import { publishedTerms, taxonomy } from "@/lib/content";
import { buildTermGraph } from "@/lib/term-graph";

export default function HomePage() {
  const graph = buildTermGraph(publishedTerms.map(({ slug, zh, en, cat, aliases, definition, relatedSlugs }) => ({ slug, zh, en, cat, aliases, definition, relatedSlugs })));
  const publishedCategories = new Set(publishedTerms.map((term) => term.cat));
  return (
    <>
      <SiteHeader wide />
      <ConceptGraph {...graph} categories={taxonomy.map(category => category.name).filter(category => publishedCategories.has(category))} />
    </>
  );
}
