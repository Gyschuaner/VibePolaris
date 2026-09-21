export const queryBooks = [
  { id: 1, title: "星空手记", tag: "science", label: "科学" },
  { id: 2, title: "色彩散步", tag: "art", label: "艺术" },
  { id: 3, title: "潮汐与月亮", tag: "science", label: "科学" },
  { id: 4, title: "画室来信", tag: "art", label: "艺术" },
  { id: 5, title: "森林日历", tag: "nature", label: "自然" },
  { id: 6, title: "山间植物", tag: "nature", label: "自然" },
];

export function readBookQuery(raw: string) {
  const params = new URLSearchParams(raw);
  const tags = params.getAll("tag");
  const q = params.get("q") ?? "";
  return {
    firstTag: params.get("tag"), tags, q,
    encoded: params.toString(),
    ids: queryBooks.filter(book => (!tags.length || tags.includes(book.tag)) && book.title.includes(q)).map(book => book.id),
  };
}

type RouteResult = {
  route: "static" | "dynamic" | "none";
  value: string;
  status: number;
  message: string;
  reader?: { id: number; name: string };
};

// ponytail: two exact teaching routes, not a general router; use the project's router for real endpoints.
export function matchReader(path: string, staticFirst: boolean, allowOther: boolean): RouteResult {
  const match = /^\/readers\/([^/?#]+)$/.exec(path);
  if (!match) return { route: "none", value: "", status: 404, message: "没有匹配的路径" };
  if (staticFirst && path === "/readers/me") return { route: "static", value: "当前登录者", status: 200, message: "读取当前读者", reader: { id: 42, name: "林舟" } };
  let value: string;
  try { value = decodeURIComponent(match[1]); }
  catch { return { route: "dynamic", value: match[1], status: 400, message: "路径编码不完整" }; }
  const base = { route: "dynamic" as const, value };
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) return { ...base, status: 422, message: "id 必须是可安全表示的正整数" };
  const id = Number(value);
  // The sample uses a simple permission switch; no private data is returned on denial.
  if (id !== 42 && !allowOther) return { ...base, status: 403, message: "没有读取其他读者的权限" };
  const name = id === 42 ? "林舟" : id === 43 ? "许青" : undefined;
  if (!name) return { ...base, status: 404, message: "编号有效，但没有这位读者" };
  return { ...base, status: 200, message: "按编号读取", reader: { id, name } };
}

export type BodyFormat = "json" | "form";
export function encodeBooking(title: string, seats: string, format: BodyFormat) {
  return format === "json"
    ? { type: "application/json", text: JSON.stringify({ title, seats: seats.trim() ? Number(seats) : null }, null, 2) }
    : { type: "application/x-www-form-urlencoded", text: new URLSearchParams({ title, seats }).toString() };
}

type BodyResult = { status: number; message: string; booking?: { title: string; seats: number } };
// ponytail: the sample accepts exactly two media types and two fields; it is not a production parser.
export function receiveBooking(text: string, contentType: string): BodyResult {
  let data: unknown;
  if (contentType === "application/json") {
    try { data = JSON.parse(text); }
    catch { return { status: 400, message: "JSON 语法错误，尚未校验字段" }; }
  } else if (contentType === "application/x-www-form-urlencoded") {
    const fields = new URLSearchParams(text);
    if (fields.getAll("title").length !== 1 || fields.getAll("seats").length !== 1) return { status: 422, message: "title 和 seats 必须各提供一次" };
    data = { title: fields.get("title"), seats: Number(fields.get("seats")) };
  } else return { status: 415, message: "接收端不支持这种内容类型" };
  if (!data || typeof data !== "object" || Array.isArray(data)) return { status: 422, message: "需要包含 title 和 seats 的对象" };
  const { title, seats } = data as { title?: unknown; seats?: unknown };
  if (typeof title !== "string" || !title.trim() || title.trim().length > 60) return { status: 422, message: "书名需要 1 到 60 个字符" };
  if (typeof seats !== "number" || !Number.isInteger(seats) || seats < 1 || seats > 5) return { status: 422, message: "名额需要是 1 到 5 的整数" };
  return { status: 200, message: "解析与校验通过", booking: { title: title.trim(), seats } };
}
