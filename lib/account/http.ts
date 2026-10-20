import { NextRequest, NextResponse } from "next/server";
import { ACCOUNT_COOKIE, getAccountStore } from "./store.ts";
import { getStore, SESSION_COOKIE, XiaobeiError } from "../xiaobei/store.ts";
import { siteOrigin } from "../xiaobei/http.ts";

export function accountIdentity(request: NextRequest, fenced = false) {
  const identity = getAccountStore().identity(request.cookies.get(ACCOUNT_COOKIE)?.value);
  if (fenced && request.headers.get("x-vp-account") !== identity.id) throw new XiaobeiError("账号已切换，请重新打开画布。", 403);
  return identity;
}
export function assistantIdentity(request: NextRequest) {
  const token = request.cookies.get(ACCOUNT_COOKIE)?.value;
  if (token) { accountIdentity(request, true); return getStore().identity(token); }
  if (request.headers.get("x-vp-account") && request.headers.get("x-vp-account") !== "guest") throw new XiaobeiError("账号已切换，请重新发起请求。", 403);
  return getStore().identity(request.cookies.get(SESSION_COOKIE)?.value);
}
export function setAccountCookie(request: NextRequest, response: NextResponse, token: string, expires: number) {
  response.cookies.set(ACCOUNT_COOKIE, token, { httpOnly: true, secure: siteOrigin(request).startsWith("https:"), sameSite: "strict", path: "/", expires: new Date(expires) });
}
