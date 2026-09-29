import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse, historyIdentity, privateHeaders } from "@/lib/xiaobei/http";
import { getStore, XiaobeiError } from "@/lib/xiaobei/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const identity = historyIdentity(request), store = getStore();
    const id = request.nextUrl.searchParams.get("id");
    if (id !== null) {
      if (!z.uuid().safeParse(id).success) throw new XiaobeiError("对话地址无效。", 400);
      return NextResponse.json(store.getConversation(identity, id), { headers: privateHeaders });
    }
    const offset = Number(request.nextUrl.searchParams.get("offset") || 0);
    if (!Number.isSafeInteger(offset) || offset < 0) throw new XiaobeiError("列表位置无效。", 400);
    return NextResponse.json(store.listConversations(identity, offset), { headers: privateHeaders });
  } catch (error) { return errorResponse(error); }
}
