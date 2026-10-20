import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { accountIdentity } from "@/lib/account/http";
import { getAccountStore } from "@/lib/account/store";
import { errorResponse, privateHeaders, readBody, sameOrigin } from "@/lib/xiaobei/http";
import { XiaobeiError } from "@/lib/xiaobei/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function PATCH(request: NextRequest) {
  try {
    sameOrigin(request);
    const identity = accountIdentity(request, true);
    const body = z.object({ avatar: z.string().max(132_000).nullable() }).strict().safeParse(await readBody(request, 140_000));
    if (!body.success) throw new XiaobeiError("请上传有效的头像图片。");
    const account = getAccountStore().setAvatar(identity, body.data.avatar);
    return NextResponse.json({ account }, { headers: privateHeaders });
  } catch (error) { return errorResponse(error); }
}
