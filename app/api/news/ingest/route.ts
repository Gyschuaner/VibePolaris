import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";

import { ingestNewsBatch } from "@/lib/news-ingest";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 1_000_000;

function jsonError(message: string, status: number, details?: unknown) {
  return NextResponse.json({ ok: false, error: message, ...(details ? { details } : {}) }, { status });
}

function bearerMatches(header: string | null, expected: string) {
  if (!header?.startsWith("Bearer ")) return false;
  const received = Buffer.from(header.slice("Bearer ".length), "utf8");
  const target = Buffer.from(expected, "utf8");
  return received.length === target.length && timingSafeEqual(received, target);
}

export async function POST(request: Request) {
  const configuredToken = process.env.NEWS_DOTS_TOKEN;
  if (!configuredToken) return jsonError("NEWS_DOTS_TOKEN is not configured", 503);

  const forwardedProto = request.headers.get("x-forwarded-proto");
  if (forwardedProto && forwardedProto.split(",")[0].trim() !== "https") {
    return jsonError("HTTPS is required", 400);
  }

  if (!bearerMatches(request.headers.get("authorization"), configuredToken)) {
    return jsonError("Unauthorized", 401);
  }

  const contentType = request.headers.get("content-type")?.split(";")[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return jsonError("Content-Type must be application/json", 415);
  }

  const body = await request.text();
  if (Buffer.byteLength(body, "utf8") > MAX_BODY_BYTES) {
    return jsonError("Request body is too large", 413);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return jsonError("Request body must be valid JSON", 400);
  }

  try {
    const result = ingestNewsBatch(payload, {
      rootDir: process.env.NEWS_REPOSITORY || process.cwd(),
    });
    return NextResponse.json(
      { ok: true, ...result },
      { status: result.written.length ? 202 : 200 },
    );
  } catch (error) {
    if (error && typeof error === "object" && "name" in error && error.name === "ZodError" && "issues" in error) {
      const issues = Array.isArray(error.issues)
        ? error.issues.slice(0, 20).map((issue: { path?: unknown[]; message?: string }) => ({
            path: issue.path ?? [],
            message: issue.message ?? "invalid value",
          }))
        : [];
      return jsonError("Payload does not match the News schema", 400, issues);
    }
    const message = error instanceof Error ? error.message : "News ingest failed";
    if (/EACCES|EROFS|ENOSPC|read-only/i.test(message)) {
      return jsonError("News draft storage is unavailable", 503);
    }
    return jsonError("News ingest failed", 500);
  }
}

export function GET() {
  return jsonError("Use POST for News ingest", 405);
}
