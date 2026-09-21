import { ConceptGraph } from "@/components/ConceptGraph";
import { getTerm } from "@/lib/content";
import { buildTermGraph, type GraphTerm } from "@/lib/term-graph";

export function HarnessLearningMap({ terms, centerSlug = "agent-harness" }: { terms: GraphTerm[]; centerSlug?: string }) {
  const center = getTerm(centerSlug)!;
  const localTerms = [center, ...terms].map(({ slug, zh, en, cat, aliases, definition, relatedSlugs }) => ({ slug, zh, en, cat, aliases, definition, relatedSlugs }));
  const graph = buildTermGraph(localTerms, { centerSlug: center.slug });
  return <ConceptGraph {...graph} variant="inline" centerSlug={center.slug} />;
}
