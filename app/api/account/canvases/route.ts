import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { accountIdentity } from "@/lib/account/http";
import { getAccountStore } from "@/lib/account/store";
import { CloudCanvasStore, type CloudCanvas } from "@/lib/account/canvas-store";
import { errorResponse, privateHeaders, readBody, sameOrigin } from "@/lib/xiaobei/http";
import { XiaobeiError } from "@/lib/xiaobei/store";
import { parseCanvas } from "@/lib/canvas";
import { canvasTexts, canvasTransferHeader, decodeCanvas, encodeCanvas, knownCanvasTexts } from "@/lib/canvas-transfer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
async function canvasResponse(request: NextRequest, value: CloudCanvas, known = knownCanvasTexts(request.headers.get(canvasTransferHeader))) {
  const compact = request.headers.has(canvasTransferHeader);
  return NextResponse.json(compact ? { ...value, data: await encodeCanvas(value.data, known) } : value, {
    headers: { ...privateHeaders, ETag: `"${value.data.revision}"`, ...(compact ? { [canvasTransferHeader]: "1" } : {}) },
  });
}
export async function GET(request: NextRequest) {
  try {
    const identity = accountIdentity(request, true), store = new CloudCanvasStore(getAccountStore());
    const id = request.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ items: store.list(identity) }, { headers: privateHeaders });
    if (!z.uuid().safeParse(id).success) throw new XiaobeiError("画布地址无效。");
    const value = store.read(identity, id), etag = `"${value.data.revision}"`;
    if (request.headers.get("if-none-match") === etag) return new NextResponse(null, { status: 304, headers: { ...privateHeaders, ETag: etag } });
    return await canvasResponse(request, value);
  } catch (error) { return errorResponse(error); }
}
export async function POST(request: NextRequest) {
  try {
    sameOrigin(request);
    const identity = accountIdentity(request, true);
    const parsed = z.object({ source: z.string().min(1).max(200), name: z.string().trim().min(1).max(80), data: z.unknown() }).strict().safeParse(await readBody(request, 26 * 1024 * 1024));
    if (!parsed.success) throw new XiaobeiError("画布信息不完整。");
    let data; try { data = parseCanvas(parsed.data.data); } catch { throw new XiaobeiError("画布格式无法识别，原数据未改动。"); }
    const value = new CloudCanvasStore(getAccountStore()).create(identity, parsed.data.source, parsed.data.name, data);
    // An idempotent create can return an older canvas, so only reference text in the submitted draft.
    return await canvasResponse(request, value, new Set((await canvasTexts(data)).keys()));
  } catch (error) { return errorResponse(error); }
}
export async function PUT(request: NextRequest) {
  try {
    sameOrigin(request);
    const identity = accountIdentity(request, true);
    const parsed = z.object({ id: z.uuid(), expected: z.number().int().positive(), data: z.unknown() }).strict().safeParse(await readBody(request, 26 * 1024 * 1024));
    if (!parsed.success) throw new XiaobeiError("同步信息不完整。");
    if ((parsed.data.data as { version?: number } | null)?.version !== 5) throw new XiaobeiError("画布已升级，请刷新页面后再同步。当前本地内容已保留。", 428);
    const store = new CloudCanvasStore(getAccountStore());
    let data;
    if (request.headers.has(canvasTransferHeader)) {
      const before = store.read(identity, parsed.data.id);
      if (before.data.revision !== parsed.data.expected) throw new XiaobeiError("云端画布已更新，请重新同步。", 409);
      const texts = await canvasTexts(before.data);
      try { data = decodeCanvas(parsed.data.data, texts); } catch { throw new XiaobeiError("同步正文引用无效，当前本地内容已保留。请重试同步。"); }
    } else {
      try { data = parseCanvas(parsed.data.data); } catch { throw new XiaobeiError("画布格式无法识别，原数据未改动。"); }
    }
    const value = store.write(identity, parsed.data.id, parsed.data.expected, data);
    return await canvasResponse(request, value, new Set((await canvasTexts(data)).keys()));
  } catch (error) { return errorResponse(error); }
}
