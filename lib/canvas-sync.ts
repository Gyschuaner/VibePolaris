import type { CanvasData, CanvasNode } from "./canvas.ts";

export function sameValue(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (!a || !b || typeof a !== "object" || typeof b !== "object") return false;
  const left = Object.keys(a), right = Object.keys(b);
  return left.length === right.length && left.every(key => Object.hasOwn(b, key) && sameValue((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key]));
}
export function sameCanvas(a: CanvasData, b: CanvasData) {
  return sameValue(a.nodes, b.nodes) && sameValue(a.edges, b.edges);
}
export function mergeCanvas(base: CanvasData, local: CanvasData, remote: CanvasData): CanvasData | null {
  let conflict = false;
  function choose<T>(before: T, here: T, there: T): T {
    if (sameValue(here, before)) return there;
    if (sameValue(there, before) || sameValue(here, there)) return here;
    conflict = true; return here;
  }
  function entities<T extends { id: string }>(before: T[], here: T[], there: T[], merge?: (b: T, l: T, r: T) => T): T[] {
    const b = new Map(before.map(item => [item.id, item])), l = new Map(here.map(item => [item.id, item])), r = new Map(there.map(item => [item.id, item]));
    return [...new Set([...r.keys(), ...l.keys(), ...b.keys()])].flatMap(id => {
      const old = b.get(id), left = l.get(id), right = r.get(id);
      const value = old && left && right && merge ? merge(old, left, right) : choose(old, left, right);
      return value ? [value] : [];
    });
  }
  const nodes = entities(base.nodes, local.nodes, remote.nodes, (b, l, r) => {
    const value = { ...r };
    for (const key of ["markdown", "fileName", "kind", "title", "summary", "createdAt", "article", "articleProposal", "ai", "annotations"] as const) {
      const next = choose(b[key], l[key], r[key]);
      if (next === undefined) delete value[key]; else Object.assign(value, { [key]: next });
    }
    const position = choose({ x: b.x, y: b.y }, { x: l.x, y: l.y }, { x: r.x, y: r.y });
    Object.assign(value, position);
    value.updatedAt = l.updatedAt > r.updatedAt ? l.updatedAt : r.updatedAt;
    return value as CanvasNode;
  });
  const ids = new Set(nodes.map(node => node.id)), pairs = new Set<string>();
  const edges = entities(base.edges, local.edges, remote.edges, (b, l, r) => {
    const value = { ...r };
    for (const key of ["from", "to", "fromPort", "toPort", "direction", "dashed"] as const) {
      const next = choose(b[key], l[key], r[key]);
      if (next === undefined) delete value[key]; else Object.assign(value, { [key]: next });
    }
    return value;
  }).filter(edge => {
    const pair = [edge.from, edge.to].sort().join("\0");
    if (!ids.has(edge.from) || !ids.has(edge.to) || pairs.has(pair)) return false;
    pairs.add(pair); return true;
  });
  // Viewport is device-local; synchronizing a camera would move another device while reading.
  return conflict ? null : { ...local, nodes, edges };
}
