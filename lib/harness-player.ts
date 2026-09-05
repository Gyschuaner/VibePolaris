export async function copyHarnessText(text: string, clipboard?: Pick<Clipboard, "writeText">): Promise<"copied" | "failed"> {
  try { if (!clipboard) return "failed"; await clipboard.writeText(text); return "copied"; }
  catch { return "failed"; }
}
