export function locateQuote(text, anchor) {
  // ponytail: one stable paragraph per annotation; cross-paragraph selection is explicitly rejected.
  const positions = [];
  let from = 0;
  while (from <= text.length) {
    const index = text.indexOf(anchor.exact, from);
    if (index === -1) break;
    positions.push(index); from = index + 1;
  }
  if (positions.length === 1) return positions[0];
  const contextual = positions.filter(index => text.slice(Math.max(0, index - anchor.prefix.length), index) === anchor.prefix && text.slice(index + anchor.exact.length, index + anchor.exact.length + anchor.suffix.length) === anchor.suffix);
  return contextual.length === 1 ? contextual[0] : -1;
}
export function rangeForAnchor(root, anchor) {
  const block = [...root.querySelectorAll('[data-anchor]')].find(el => el.dataset.anchor === anchor.block);
  if (!block) return null;
  const start = locateQuote(block.textContent, anchor);
  if (start < 0) return null;
  const end = start + anchor.exact.length;
  const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  let node, offset = 0, started = false;
  while ((node = walker.nextNode())) {
    const next = offset + node.textContent.length;
    if (!started && start < next) { range.setStart(node, start - offset); started = true; }
    if (started && end <= next) { range.setEnd(node, end - offset); return range; }
    offset = next;
  }
  return null;
}
export function captureSelection(root) {
  const selection = window.getSelection();
  if (!selection?.rangeCount || selection.isCollapsed) return null;
  const range = selection.getRangeAt(0);
  const startElement = range.startContainer.nodeType === 1 ? range.startContainer : range.startContainer.parentElement;
  const endElement = range.endContainer.nodeType === 1 ? range.endContainer : range.endContainer.parentElement;
  const block = startElement.closest('[data-anchor]');
  if (!block || !root.contains(block)) return null;
  if (block !== endElement.closest('[data-anchor]')) return { error: '请在同一段正文中选择文字' };
  const exact = range.toString();
  if (!exact.trim() || exact.length > 5000) return null;
  const before = range.cloneRange(); before.selectNodeContents(block); before.setEnd(range.startContainer, range.startOffset);
  const start = before.toString().length;
  const text = block.textContent;
  return { anchor: { block: block.dataset.anchor, exact, start, prefix: text.slice(Math.max(0, start - 32), start), suffix: text.slice(start + exact.length, start + exact.length + 32) }, rect: range.getBoundingClientRect() };
}
