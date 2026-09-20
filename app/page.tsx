import { ConceptGraph } from "@/components/ConceptGraph";
import { SiteHeader } from "@/components/SiteHeader";
import { taxonomy, terms } from "@/lib/content";
import { buildTermGraph } from "@/lib/term-graph";

export default function HomePage() {
  const graph = buildTermGraph(terms.map(({ slug, zh, en, cat, aliases, definition, relatedSlugs }) => ({ slug, zh, en, cat, aliases, definition, relatedSlugs })));
  return (
    <>
      <SiteHeader wide />
      <ConceptGraph {...graph} categories={taxonomy.map(category => category.name)} />
    </>
  );
}
