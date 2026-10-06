// Keep one retrieval result below the product's 10K-token target after its
// metadata and JSON envelope are added to the next model request.
export const RETRIEVAL_BODY_TOKEN_LIMIT = 8_000;

export function retrievalTextTokens(value: string) {
  const wide = value.match(/[^\x00-\x7f]/g)?.length || 0;
  return Math.ceil(wide + (value.length - wide) / 3);
}

export function retrievalChunk(text: string, offset: number) {
  const start = Math.min(Math.max(0, offset), text.length);
  const remaining = text.slice(start);
  if (retrievalTextTokens(remaining) <= RETRIEVAL_BODY_TOKEN_LIMIT) return { text: remaining, nextOffset: null };
  let low = 1, high = remaining.length;
  while (low < high) {
    const middle = Math.ceil((low + high) / 2);
    if (retrievalTextTokens(remaining.slice(0, middle)) <= RETRIEVAL_BODY_TOKEN_LIMIT) low = middle;
    else high = middle - 1;
  }
  let end = start + low;
  if (end < text.length && text.charCodeAt(end - 1) >= 0xd800 && text.charCodeAt(end - 1) <= 0xdbff) end--;
  return { text: text.slice(start, end), nextOffset: end < text.length ? end : null };
}
