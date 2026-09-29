import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { getStore } from "../lib/xiaobei/store.ts";

const { values, positionals } = parseArgs({ allowPositionals: true, options: { label: { type: "string" }, expires: { type: "string" }, output: { type: "string" } } });
const [command, id] = positionals;
try {
  if (!["create", "list", "disable"].includes(command)) throw new Error("用法：npm run xiaobei:invites -- create --label 姓名 --output /私有目录/invite.txt [--expires ISO日期] | list | disable ID");
  if (command === "create") {
    if (!values.label?.trim() || !values.output) throw new Error("创建时必须指定 --label 和 --output；邀请码只写入权限为 600 的文件。");
    const expires = values.expires ? Date.parse(values.expires) : null;
    if (expires !== null && (!Number.isFinite(expires) || expires <= Date.now())) throw new Error("过期时间须是未来的 ISO 日期。");
    // Reserve the private output file before issuing a code; never overwrite an existing secret.
    const output = resolve(values.output);
    writeFileSync(output, "", { flag: "wx", mode: 0o600 });
    const invite = getStore().createInvite(values.label.trim(), expires);
    writeFileSync(output, `${invite.code}\n`, { mode: 0o600 });
    console.log(JSON.stringify({ id: invite.id, expires: invite.expires, output }));
  } else if (command === "list") console.log(JSON.stringify(getStore().listInvites(), null, 2));
  else if (!id || !getStore().disableInvite(id)) throw new Error("找不到该邀请码 ID。");
  else console.log(JSON.stringify({ id, disabled: true }));
} catch (error) { console.error(error instanceof Error ? error.message : "操作失败。"); process.exitCode = 1; }
