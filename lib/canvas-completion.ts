export const COMPLETION_PREFIX_LIMIT = 6000;
export function completionContext(markdown: string, cursor: number, title: string) {
  const before = markdown.slice(0, cursor);
  const outline = before.match(/^#{1,6} .+$/gm)?.join("\n") || "";
  return { title: title.slice(0, 160), outline: outline.slice(-1500), prefix: before.slice(-COMPLETION_PREFIX_LIMIT) };
}

export function shortCompletion(value: string, prefix = "") {
  let chars = Array.from(value.replace(/\r\n/g, "\n").trimEnd());
  // Models sometimes repeat the unfinished phrase. Remove an exact overlap,
  // while keeping short words, whitespace and intentional Markdown prefixes.
  for (let length = Math.min(Array.from(prefix).length, chars.length); length >= 4; length--) {
    const overlap = chars.slice(0, length).join("");
    if (Array.from(overlap.trim()).length >= 4 && prefix.endsWith(overlap)) { chars = chars.slice(length); break; }
  }
  if (chars.length <= 100) return chars.join("");
  const clipped = chars.slice(0, 100).join("");
  const sentence = clipped.match(/^[\s\S]{20,}[。！？.!?](?=\s|$|[^\x00-\x7f])/u)?.[0];
  return sentence || clipped;
}
