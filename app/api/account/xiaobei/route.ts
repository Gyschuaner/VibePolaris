import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { accountIdentity } from "@/lib/account/http";
import { getAccountStore } from "@/lib/account/store";
import { browserToken, errorResponse, privateHeaders, readBody, sameOrigin } from "@/lib/xiaobei/http";
import { digest, getStore, SESSION_COOKIE, XiaobeiError } from "@/lib/xiaobei/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: NextRequest) {
  try {
    sameOrigin(request);
    const identity = accountIdentity(request, true), store = getStore();
    const body = z.object({ code: z.string().trim().min(1).max(100).optional(), useCurrent: z.boolean().optional() }).strict().safeParse(await readBody(request, 4096));
    if (!body.success) throw new XiaobeiError("请输入邀请码。");
    let current;
    try { current = store.identity(request.cookies.get(SESSION_COOKIE)?.value); } catch { /* A new code may still be supplied. */ }
    const browser = browserToken(request);
    let temporary: string | undefined;
    try {
      let grant = current;
      if (!body.data.useCurrent) {
        temporary = store.activate(body.data.code || "", digest(`account-bind:${identity.id}`)).token;
        grant = store.identity(temporary);
      }
      if (!grant) throw new XiaobeiError("当前浏览器未激活小北，请输入邀请码。", 401);
      getAccountStore().bind(identity, grant.invite, current?.invite === grant.invite && browser ? digest(browser) : undefined);
    } finally { if (temporary) store.db.prepare("DELETE FROM sessions WHERE hash=?").run(digest(temporary)); }
    return NextResponse.json({ active: true }, { headers: privateHeaders });
  } catch (error) { return errorResponse(error); }
}
