import { z } from "zod";

export const newsPositionKey = "vibepolaris:news-return";
const positionSchema = z.object({
  rangePreset: z.enum(["month", "quarter", "halfYear", "year", "custom"]),
  customStart: z.iso.date(), customEnd: z.iso.date(),
  mobileView: z.enum(["list", "graph"]), selectedSlug: z.string(),
  page: z.number().nonnegative().finite(), list: z.number().nonnegative().finite(),
});

export function readNewsPosition(raw: string | null) {
  try { return positionSchema.safeParse(JSON.parse(raw ?? "null")).data ?? null; }
  catch { return null; }
}
