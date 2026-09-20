import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY, type SimulationNodeDatum } from "d3-force";

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

export type MovingGraphNode = GraphNode & SimulationNodeDatum;

// Share the same forces between the build-time layout and the interactive graph.
// D3 mutates its nodes and links, so neither may alias the source content.
export function createGraphSimulation(nodes: GraphNode[], edges: GraphEdge[]) {
  const categories = [...new Set(nodes.map(node => node.cat))];
  const angle = (node: GraphNode) => categories.indexOf(node.cat) * Math.PI * 2 / categories.length - Math.PI / 2;
  return forceSimulation<MovingGraphNode>(nodes.map(node => ({ ...node })))
    .stop()
    .alphaDecay(.04)
    .velocityDecay(.38)
    .force("charge", forceManyBody<MovingGraphNode>().strength(-520).distanceMax(700))
    .force("links", forceLink<MovingGraphNode, GraphEdge>(edges.map(edge => ({ ...edge }))).id(node => node.slug).distance(115).strength(.12))
    .force("collision", forceCollide<MovingGraphNode>().radius(node => 22 + Math.min(node.degree, 12)).strength(.8))
    .force("x", forceX<MovingGraphNode>(node => Math.cos(angle(node)) * 780).strength(.018))
    .force("y", forceY<MovingGraphNode>(node => Math.sin(angle(node)) * 380).strength(.025));
}

export function nudgeGraph(nodes: MovingGraphNode[], x: number, y: number, radius: number, exclude?: string) {
  let moved = false;
  for (const node of nodes) {
    if (node.slug === exclude || node.fx != null || node.fy != null) continue;
    const dx = node.x - x;
    const dy = node.y - y;
    const distance = Math.hypot(dx, dy);
    if (distance < 1 || distance >= radius) continue;
    const impulse = (1 - distance / radius) * .7;
    node.vx = (node.vx || 0) + dx / distance * impulse;
    node.vy = (node.vy || 0) + dy / distance * impulse;
    moved = true;
  }
  return moved;
}

// Pre-settle a deterministic layout so the page can frame it before animation starts.
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

  const simulation = createGraphSimulation(nodes, edges);
  simulation.tick(180);
  simulation.nodes().forEach((node, index) => { nodes[index].x = node.x; nodes[index].y = node.y; });
  return { nodes, edges };
}

export function graphNeighbors(slug: string, edges: GraphEdge[]) {
  return new Set(edges.flatMap(edge => edge.source === slug ? [edge.target] : edge.target === slug ? [edge.source] : []));
}
