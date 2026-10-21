import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse, privateHeaders, readBody, sameOrigin, setBrowserCookie } from "@/lib/xiaobei/http";
import { preferenceOwner, readPreferences } from "@/lib/xiaobei/preferences";
import { getStore, XiaobeiError } from "@/lib/xiaobei/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const { owner, token } = preferenceOwner(request);
    const response = NextResponse.json(readPreferences(owner), { headers: privateHeaders });
    if (token) setBrowserCookie(request, response, token);
    return response;
  } catch (error) { return errorResponse(error); }
}
export async function PATCH(request: NextRequest) {
  try {
    sameOrigin(request);
    const { owner, token } = preferenceOwner(request);
    const input = z.object({ feature: z.enum(["completion", "organize", "expand"]), enabled: z.boolean() }).strict().safeParse(await readBody(request, 1000));
    if (!input.success) throw new XiaobeiError("设置格式错误。");
    const store = getStore();
    const value = store.transaction(() => {
      const next = { ...readPreferences(owner), [input.data.feature]: input.data.enabled };
      store.db.prepare("INSERT INTO ai_preferences(owner,data) VALUES(?,?) ON CONFLICT(owner) DO UPDATE SET data=excluded.data").run(owner, JSON.stringify(next));
      return next;
    });
    const response = NextResponse.json(value, { headers: privateHeaders });
    if (token) setBrowserCookie(request, response, token);
    return response;
  } catch (error) { return errorResponse(error); }
}
