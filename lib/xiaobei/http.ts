import { NextRequest, NextResponse } from "next/server";
import { BROWSER_COOKIE, SESSION_COOKIE, digest, getStore, XiaobeiError, type HistoryIdentity } from "./store.ts";

export const privateHeaders = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow", "Vary": "Cookie" };
export function browserToken(request: NextRequest) {
  const token = request.cookies.get(BROWSER_COOKIE)?.value;
  return token && /^[\w-]{43}$/.test(token) ? token : undefined;
}
export function historyIdentity(request: NextRequest): HistoryIdentity {
  const identity = getStore().identity(request.cookies.get(SESSION_COOKIE)?.value);
  const browser = browserToken(request);
  if (!browser) throw new XiaobeiError("请刷新页面后再打开小北。", 401);
  return { ...identity, browser: digest(browser) };
}
export function setBrowserCookie(request: NextRequest, response: NextResponse, token: string) {
  response.cookies.set(BROWSER_COOKIE, token, { httpOnly: true, sameSite: "strict", secure: siteOrigin(request).startsWith("https:"), path: "/", maxAge: 365 * 24 * 60 * 60 });
}
export function siteOrigin(request: Request) {
  if (process.env.XIAOBEI_SITE_ORIGIN) return new URL(process.env.XIAOBEI_SITE_ORIGIN).origin;
  // Next may normalize request.url to localhost; the browser's actual Host stays on the request.
  const url = new URL(request.url);
  url.host = request.headers.get("host") || url.host;
  return url.origin;
}
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== siteOrigin(request) || request.headers.get("sec-fetch-site") === "cross-site") throw new XiaobeiError("请求来源无效，请在本站重试。", 403);
}
export async function readBody(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) throw new XiaobeiError("请求格式错误。", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new XiaobeiError("请求内容为空。");
  let size = 0;
  const decoder = new TextDecoder();
  let body = "";
  try {
    while (true) {
      const next = await reader.read(); if (next.done) break;
      size += next.value.byteLength;
      if (size > 2_000_000) throw new XiaobeiError("本次消息过长，请减少内容。", 413);
      body += decoder.decode(next.value, { stream: true });
    }
    return JSON.parse(body + decoder.decode());
  } catch (error) { if (error instanceof XiaobeiError) throw error; throw new XiaobeiError("请求内容无法识别。"); }
  finally { await reader.cancel().catch(() => {}); }
}
export function errorResponse(error: unknown) {
  const known = error instanceof XiaobeiError;
  return NextResponse.json({ error: known ? error.message : "小北暂时不可用，请稍后重试。" }, { status: known ? error.status : 500, headers: privateHeaders });
}
