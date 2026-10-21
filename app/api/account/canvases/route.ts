import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { accountIdentity } from "@/lib/account/http";
import { getAccountStore } from "@/lib/account/store";
import { CloudCanvasStore } from "@/lib/account/canvas-store";
import { errorResponse, privateHeaders, readBody, sameOrigin } from "@/lib/xiaobei/http";
import { XiaobeiError } from "@/lib/xiaobei/store";
import { parseCanvas } from "@/lib/canvas";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: NextRequest) {
  try {
    const identity = accountIdentity(request, true), store = new CloudCanvasStore(getAccountStore());
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ items: store.list(identity) }, { headers: privateHeaders });
    if (!z.uuid().safeParse(id).success) throw new XiaobeiError("画布地址无效。");
    const value = store.read(identity, id), etag = `"${value.data.revision}"`;
    if (request.headers.get("if-none-match") === etag) return new NextResponse(null, { status: 304, headers: { ...privateHeaders, ETag: etag } });
    return NextResponse.json(value, { headers: { ...privateHeaders, ETag: etag } });
  } catch (error) { return errorResponse(error); }
}
export async function POST(request: NextRequest) {
  try {
    sameOrigin(request);
    const identity = accountIdentity(request, true);
    const parsed = z.object({ source: z.string().min(1).max(200), name: z.string().trim().min(1).max(80), data: z.unknown() }).strict().safeParse(await readBody(request, 26 * 1024 * 1024));
    if (!parsed.success) throw new XiaobeiError("画布信息不完整。");
    let data; try { data = parseCanvas(parsed.data.data); } catch { throw new XiaobeiError("画布格式无法识别，原数据未改动。"); }
    return NextResponse.json(new CloudCanvasStore(getAccountStore()).create(identity, parsed.data.source, parsed.data.name, data), { headers: privateHeaders });
  } catch (error) { return errorResponse(error); }
}
export async function PUT(request: NextRequest) {
  try {
    sameOrigin(request);
    const identity = accountIdentity(request, true);
    const parsed = z.object({ id: z.uuid(), expected: z.number().int().positive(), data: z.unknown() }).strict().safeParse(await readBody(request, 26 * 1024 * 1024));
    if (!parsed.success) throw new XiaobeiError("同步信息不完整。");
    if ((parsed.data.data as { version?: number } | null)?.version !== 4) throw new XiaobeiError("画布已升级，请刷新页面后再同步。当前本地内容已保留。", 428);
    let data; try { data = parseCanvas(parsed.data.data); } catch { throw new XiaobeiError("画布格式无法识别，原数据未改动。"); }
    return NextResponse.json(new CloudCanvasStore(getAccountStore()).write(identity, parsed.data.id, parsed.data.expected, data), { headers: privateHeaders });
  } catch (error) { return errorResponse(error); }
}
