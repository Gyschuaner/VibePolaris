import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { errorResponse, privateHeaders, readBody, sameOrigin } from "@/lib/xiaobei/http";
import { getStore, XiaobeiError, type XiaobeiStore } from "@/lib/xiaobei/store";
import { callModel, modelConfig, type Message } from "@/lib/xiaobei/model";
import { COMPLETION_PREFIX_LIMIT, COMPLETION_SYSTEM_PROMPT, completionFence, shortCompletion } from "@/lib/canvas-completion";
import { assistantIdentity } from "@/lib/account/http";
import { requireFeature } from "@/lib/xiaobei/preferences";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const chargeEnabled = () => process.env.XIAOBEI_COMPLETION_CHARGE_ENABLED === "true";
const bodySchema = z.object({ requestId: z.uuid(), title: z.string().max(160), outline: z.string().max(1500), prefix: z.string().min(1).max(COMPLETION_PREFIX_LIMIT), fence: z.string().max(80).optional(), acceptCharging: z.boolean() }).strict();

export async function GET(request: NextRequest) {
  try {
    assistantIdentity(request);
    requireFeature(request, "completion");
    return NextResponse.json({ active: true, charging: chargeEnabled() }, { headers: privateHeaders });
  } catch (error) {
    if (error instanceof XiaobeiError && error.status === 401) return NextResponse.json({ active: false }, { headers: privateHeaders });
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest) {
  let running: string | undefined;
  let store: XiaobeiStore | undefined;
  const deadline = AbortSignal.timeout(30_000);
  try {
    sameOrigin(request);
    store = getStore();
    const identity = assistantIdentity(request);
    requireFeature(request, "completion");
    const parsed = bodySchema.safeParse(await readBody(request));
    if (!parsed.success || !parsed.data.prefix.trim()) throw new XiaobeiError("请在正文中输入一些内容后再补全。");
    const charging = chargeEnabled();
    if (charging && !parsed.data.acceptCharging) throw new XiaobeiError("补全计费设置已调整，请重新确认后再试。", 409);
    modelConfig();
    const { requestId, title, outline, prefix, fence } = parsed.data;
    store.startRun(identity, requestId, Date.now(), 2000, "canvas_completion"); running = requestId;
    const messages: Message[] = [
      { role: "system", content: COMPLETION_SYSTEM_PROMPT },
      { role: "user", content: JSON.stringify({ title, outline, prefix, fence: fence ?? completionFence(prefix) }) },
    ];
    const result = await callModel({ store, identity, run: requestId, messages, signal: AbortSignal.any([request.signal, deadline]), completion: { charge: charging } });
    store.checkIdentity(identity);
    const text = shortCompletion(result.message.content || "", prefix);
    if (!text.trim()) throw new XiaobeiError("这次没有生成可用的补全，请再试一次。", 502);
    return NextResponse.json({ text, credits: store.balance(identity.invite) / 1e6, charging }, { headers: privateHeaders });
  } catch (error) {
    return errorResponse(deadline.aborted ? new XiaobeiError("小北这次响应较慢，请稍后再试。", 504) : error);
  } finally { if (running) store?.finishRun(running); }
}
