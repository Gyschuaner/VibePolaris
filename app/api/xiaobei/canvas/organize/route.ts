import type { NextRequest } from "next/server";
import { generateCanvas } from "@/lib/xiaobei/canvas-generation";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const POST = (request: NextRequest) => generateCanvas(request, "organize");
