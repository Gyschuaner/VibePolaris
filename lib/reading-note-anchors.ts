import { locateQuote, type NoteAnchor } from "./reading-notes";

// Anchor only reading blocks, never note UI, hidden term explanations or controls.
const excluded = '[data-note-ui], [popover], [aria-hidden="true"], nav, [role="dialog"], [aria-live], script, style, textarea, input, select';
export function prepareBlocks(root: HTMLElement): HTMLElement[] {
  const blocks = [...root.querySelectorAll<HTMLElement>("main p, main li, main blockquote")].filter(block => !block.closest(excluded) && !block.querySelector("p, li, blockquote") && !!block.textContent?.trim());
  const counts = new Map<string, number>();
  for (const block of blocks) {
    const section = block.closest("section[id], article[id], main[id]")?.id ?? "article";
    const index = counts.get(section) ?? 0; counts.set(section, index + 1);
    block.dataset.noteBlock = block.id ? `id:${block.id}` : `${section}:${index}`;
  }
  return blocks;
}
function nodesOf(block: HTMLElement): Text[] {
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT, { acceptNode: node => node.parentElement?.closest(`${excluded}, sup`) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
  const nodes: Text[] = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node as Text);
  return nodes;
}
function selectedText(range: Range, nodes: Text[]) {
  return nodes.filter(node => range.intersectsNode(node)).map(node => node.data.slice(node === range.startContainer ? range.startOffset : 0, node === range.endContainer ? range.endOffset : node.length)).join("");
}
function makeRange(nodes: Text[], start: number, length: number): Range | null {
  const range = document.createRange();
  let offset = 0, started = false;
  for (const node of nodes) {
    const end = offset + node.length;
    if (!started && start < end) { range.setStart(node, start - offset); started = true; }
    if (started && start + length <= end) { range.setEnd(node, start + length - offset); return range; }
    offset = end;
  }
  return null;
}
export function rangeForAnchor(root: HTMLElement, anchor: NoteAnchor): Range | null {
  const blocks = prepareBlocks(root);
  const candidates = blocks.map(block => { const nodes = nodesOf(block); return { block, nodes, start: locateQuote(nodes.map(node => node.data).join(""), anchor) }; }).filter(item => item.start >= 0);
  const identified = candidates.find(item => item.block.dataset.noteBlock === anchor.block);
  const match = identified ?? (candidates.length === 1 ? candidates[0] : undefined);
  return match ? makeRange(match.nodes, match.start, anchor.exact.length) : null;
}
export function captureNoteSelection(root: HTMLElement): { anchor: NoteAnchor; rect: DOMRect } | { error: string } | null {
  prepareBlocks(root);
  const selection = window.getSelection();
  if (!selection?.rangeCount || selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);
  const element = (node: Node) => node instanceof Element ? node : node.parentElement;
  const start = element(range.startContainer), end = element(range.endContainer);
  const block = start?.closest<HTMLElement>("[data-note-block]");
  if (!block || !root.contains(block) || start?.closest(excluded) || end?.closest(excluded)) return null;
  // ponytail: one reading block per annotation; retain a quote rather than guess cross-block offsets.
  if (block !== end?.closest("[data-note-block]")) return { error: "请在同一段正文中选择文字" };
  const nodes = nodesOf(block), exact = selectedText(range, nodes);
  if (!exact.trim()) return null;
  if (exact.length > 5000) return { error: "一次最多标注 5000 字" };
  const before = range.cloneRange(); before.selectNodeContents(block); before.setEnd(range.startContainer, range.startOffset);
  const offset = selectedText(before, nodes).length, text = nodes.map(node => node.data).join("");
  return { anchor: { block: block.dataset.noteBlock!, exact, start: offset, prefix: text.slice(Math.max(0, offset - 32), offset), suffix: text.slice(offset + exact.length, offset + exact.length + 32) }, rect: range.getBoundingClientRect() };
}
