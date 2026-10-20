import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ACCOUNT_COOKIE, getAccountStore } from "@/lib/account/store";
import { accountIdentity, setAccountCookie } from "@/lib/account/http";
import { browserToken, errorResponse, privateHeaders, readBody, sameOrigin } from "@/lib/xiaobei/http";
import { digest, getStore, SESSION_COOKIE, XiaobeiError } from "@/lib/xiaobei/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    let identity;
    try { identity = accountIdentity(request); }
    catch (error) { if (error instanceof XiaobeiError && error.status === 401) return NextResponse.json({ account: null }, { headers: privateHeaders }); throw error; }
    const store = getAccountStore(), grant = store.grant(identity.id);
    let canBindCurrent = false;
    try {
      const guest = getStore().identity(request.cookies.get(SESSION_COOKIE)?.value), browser = browserToken(request);
      canBindCurrent = !!browser && (!grant || (guest.invite === grant.id && !!store.store.db.prepare("SELECT 1 FROM conversations WHERE invite=? AND browser=? LIMIT 1").get(guest.invite, digest(browser))));
    } catch { /* No guest grant. */ }
    return NextResponse.json({ account: store.profile(identity), xiaobei: { bound: !!grant, active: !!grant && !grant.disabled && (grant.expires === null || grant.expires > Date.now()), canBindCurrent } }, { headers: privateHeaders });
  } catch (error) { return errorResponse(error); }
}
export async function POST(request: NextRequest) {
  try {
    sameOrigin(request);
    const body = z.object({ username: z.string().max(100), password: z.string().max(128), register: z.boolean() }).strict().safeParse(await readBody(request, 4096));
    if (!body.success) throw new XiaobeiError("请填写用户名和密码。");
    const session = await getAccountStore().authenticate(body.data.username, body.data.password, body.data.register);
    const response = NextResponse.json({ account: session.account }, { headers: privateHeaders });
    setAccountCookie(request, response, session.token, session.expires);
    return response;
  } catch (error) { return errorResponse(error); }
}
export async function DELETE(request: NextRequest) {
  try {
    sameOrigin(request);
    try { getAccountStore().logout(accountIdentity(request)); }
    catch (error) { if (!(error instanceof XiaobeiError && error.status === 401)) throw error; }
    const response = NextResponse.json({ account: null }, { headers: privateHeaders });
    response.cookies.set(ACCOUNT_COOKIE, "", { path: "/", maxAge: 0 });
    return response;
  } catch (error) { return errorResponse(error); }
}
