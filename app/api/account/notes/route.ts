import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { accountIdentity } from "@/lib/account/http";
import { getAccountStore } from "@/lib/account/store";
import { AccountNotesStore } from "@/lib/account/notes-store";
import { notesSnapshotSchema } from "@/lib/reading-notes-sync";
import { errorResponse, privateHeaders, readBody, sameOrigin } from "@/lib/xiaobei/http";
import { XiaobeiError } from "@/lib/xiaobei/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const identity = accountIdentity(request, true), value = new AccountNotesStore(getAccountStore()).read(identity), etag = `"${value.revision}"`;
    if (request.headers.get("if-none-match") === etag) return new NextResponse(null, { status: 304, headers: { ...privateHeaders, ETag: etag } });
    return NextResponse.json(value, { headers: { ...privateHeaders, ETag: etag } });
  } catch (error) { return errorResponse(error); }
}
export async function PUT(request: NextRequest) {
  try {
    sameOrigin(request);
    const identity = accountIdentity(request, true);
    const body = z.object({ expected: z.number().int().nonnegative(), notes: z.unknown() }).strict().safeParse(await readBody(request, 26 * 1024 * 1024));
    if (!body.success) throw new XiaobeiError("笔记同步信息不完整。");
    const value = notesSnapshotSchema.safeParse({ revision: body.data.expected, notes: body.data.notes });
    if (!value.success) throw new XiaobeiError("笔记格式无法识别，原数据未改动。");
    return NextResponse.json(new AccountNotesStore(getAccountStore()).write(identity, value.data.revision, value.data.notes), { headers: privateHeaders });
  } catch (error) { return errorResponse(error); }
}
