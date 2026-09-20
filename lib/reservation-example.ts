// ponytail: a validator for this fixed teaching schema, not a general JSON Schema engine.
export const reservationSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  properties: {
    status: { enum: ["pending", "success"] },
    count: { type: "integer", minimum: 0 },
  },
  required: ["status", "count"],
  additionalProperties: false,
} as const;

export function validateReservation(data: Record<string, unknown>) {
  const issues: { field: string; rule: string; message: string }[] = [];
  for (const field of reservationSchema.required) {
    if (!Object.hasOwn(data, field)) issues.push({ field, rule: "required", message: "缺少必填字段" });
  }
  if (Object.hasOwn(data, "status") && !reservationSchema.properties.status.enum.some(value => value === data.status)) {
    issues.push({ field: "status", rule: "enum", message: "只接受 pending 或 success" });
  }
  if (Object.hasOwn(data, "count")) {
    if (typeof data.count !== "number" || !Number.isInteger(data.count)) issues.push({ field: "count", rule: "type", message: "需要整数，不能是字符串或小数" });
    else if (data.count < reservationSchema.properties.count.minimum) issues.push({ field: "count", rule: "minimum", message: "数量不能小于 0" });
  }
  for (const field of Object.keys(data)) {
    if (!Object.hasOwn(reservationSchema.properties, field)) issues.push({ field, rule: "additionalProperties", message: "这份规则不接受额外字段" });
  }
  return issues;
}
