import { randomBytes } from "node:crypto";
import type { NextRequest } from "next/server";
import { ACCOUNT_COOKIE } from "../account/store.ts";
import { accountIdentity } from "../account/http.ts";
import { browserToken } from "./http.ts";
import { digest, getStore, XiaobeiError } from "./store.ts";
import { aiPreferencesSchema, defaultAiPreferences, type AiPreferences } from "../canvas-ai.ts";

export function preferenceOwner(request: NextRequest) {
  if (request.cookies.get(ACCOUNT_COOKIE)?.value) return { owner: `account:${accountIdentity(request, true).id}` };
  if (request.headers.get("x-vp-account") && request.headers.get("x-vp-account") !== "guest") throw new XiaobeiError("账号已切换，请刷新后重试。", 403);
  const token = browserToken(request) ?? randomBytes(32).toString("base64url");
  return { owner: `browser:${digest(token)}`, token };
}
export function readPreferences(owner: string): AiPreferences {
  const row = getStore().db.prepare("SELECT data FROM ai_preferences WHERE owner=?").get(owner) as { data: string } | undefined;
  return row ? aiPreferencesSchema.parse(JSON.parse(row.data)) : { ...defaultAiPreferences };
}
export function requireFeature(request: NextRequest, feature: keyof AiPreferences) {
  if (!readPreferences(preferenceOwner(request).owner)[feature]) throw new XiaobeiError("请先在设置中开启这个小北功能。", 403);
}
