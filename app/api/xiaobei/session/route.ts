import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse, privateHeaders, readBody, sameOrigin, siteOrigin } from "@/lib/xiaobei/http";
import { digest, getStore, SESSION_COOKIE, XiaobeiError } from "@/lib/xiaobei/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (!token) return NextResponse.json({ active: false }, { headers: privateHeaders });
    const store = getStore(); const identity = store.identity(token);
    return NextResponse.json({ active: true, credits: store.balance(identity.invite) / 1e6 }, { headers: privateHeaders });
  } catch (error) {
    if (error instanceof XiaobeiError && error.status === 401) return NextResponse.json({ active: false }, { headers: privateHeaders });
    return errorResponse(error);
  }
}
export async function POST(request: NextRequest) {
  try {
    sameOrigin(request);
    const parsed = z.object({ code: z.string().trim().min(1).max(100) }).strict().safeParse(await readBody(request));
    if (!parsed.success) throw new XiaobeiError("请输入有效的邀请码。");
    const store = getStore();
    // A global internal-site gate needs no client-controlled IP/proxy trust configuration.
    const session = store.activate(parsed.data.code, digest("activation"));
    const response = NextResponse.json({ active: true }, { headers: privateHeaders });
    response.cookies.set(SESSION_COOKIE, session.token, { httpOnly: true, sameSite: "strict", secure: siteOrigin(request).startsWith("https:"), path: "/", expires: new Date(session.expires) });
    return response;
  } catch (error) { return errorResponse(error); }
}
export async function DELETE(request: NextRequest) {
  try {
    sameOrigin(request); const store = getStore();
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    if (token) { try { store.logout(store.identity(token)); } catch (error) { if (!(error instanceof XiaobeiError && error.status === 401)) throw error; } }
    const response = NextResponse.json({ active: false }, { headers: privateHeaders });
    response.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 }); return response;
  } catch (error) { return errorResponse(error); }
}
