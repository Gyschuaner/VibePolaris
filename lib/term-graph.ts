export type GraphTerm = {
  slug: string;
  zh: string;
  en: string;
  cat: string;
  aliases: string[];
  definition: string;
  relatedSlugs: string[];
};

export type GraphNode = GraphTerm & { x: number; y: number; degree: number };
export type GraphEdge = { source: string; target: string };

// Stable positions are calculated at build time; moving a node never changes its relationships.
export function buildTermGraph(terms: GraphTerm[]) {
  const categories = [...new Set(terms.map(term => term.cat))];
  const nodes: GraphNode[] = terms.map((term, index) => {
    const cluster = categories.indexOf(term.cat) * Math.PI * 2 / categories.length - Math.PI / 2;
    const angle = index * 2.399963229728653;
    const radius = 65 + Math.sqrt(index % 53) * 37;
    return { ...term, x: Math.cos(cluster) * 980 + Math.cos(angle) * radius, y: Math.sin(cluster) * 360 + Math.sin(angle) * radius, degree: 0 };
  });
  const bySlug = new Map(nodes.map(node => [node.slug, node]));
  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  for (const node of nodes) {
    for (const slug of node.relatedSlugs) {
      const target = bySlug.get(slug);
      if (!target || slug === node.slug) continue;
      const key = [node.slug, slug].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push({ source: node.slug, target: slug });
      node.degree++;
      target.degree++;
    }
  }

  const anchors = nodes.map(node => ({ x: node.x, y: node.y }));
  const indices = new Map(nodes.map((node, i) => [node.slug, i]));
  for (let step = 0; step < 160; step++) {
    const forces = nodes.map((node, i) => ({ x: (anchors[i].x - node.x) * .008, y: (anchors[i].y - node.y) * .008 }));
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        if (distance > 380) continue;
        const strength = Math.min(12, 2500 / (distance * distance));
        const x = dx / distance * strength;
        const y = dy / distance * strength;
        forces[i].x -= x; forces[i].y -= y;
        forces[j].x += x; forces[j].y += y;
      }
    }
    for (const edge of edges) {
      const a = indices.get(edge.source)!;
      const b = indices.get(edge.target)!;
      const dx = nodes[b].x - nodes[a].x;
      const dy = nodes[b].y - nodes[a].y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const strength = (distance - 130) * .012;
      forces[a].x += dx / distance * strength; forces[a].y += dy / distance * strength;
      forces[b].x -= dx / distance * strength; forces[b].y -= dy / distance * strength;
    }
    const cooling = 1 - step / 180;
    nodes.forEach((node, i) => {
      node.x += Math.max(-16, Math.min(16, forces[i].x)) * cooling;
      node.y += Math.max(-16, Math.min(16, forces[i].y)) * cooling;
    });
  }
  return { nodes, edges };
}

export function graphNeighbors(slug: string, edges: GraphEdge[]) {
  return new Set(edges.flatMap(edge => edge.source === slug ? [edge.target] : edge.target === slug ? [edge.source] : []));
}
