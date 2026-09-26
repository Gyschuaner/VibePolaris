// Bounded book fixtures, not a SQL parser, migration runner or ORM implementation.
export type BookRow = { id: number; title: string; available: boolean };
export const initialBooks = (): BookRow[] => [{ id: 42, title: "山间来信", available: true }, { id: 78, title: "夜空地图", available: false }];
export type SqlCommand = "select" | "insert" | "update" | "delete";
export function statement(command: SqlCommand, filtered: boolean) {
  if (command === "select") return "SELECT book_id, title\nFROM books\nWHERE available = true\nORDER BY book_id;";
  if (command === "insert") return "INSERT INTO books\n  (book_id, title, available)\nVALUES (65, '河岸笔记', true);";
  return `${command === "update" ? "UPDATE books\nSET available = false" : "DELETE FROM books"}${filtered ? "\nWHERE book_id = 42" : ""};`;
}
export function runStatement(rows: BookRow[], command: SqlCommand, filtered: boolean) {
  if (command === "select") return { rows, result: rows.filter(row => row.available).sort((a,b) => a.id-b.id), message: "SELECT · 原表没有改动" };
  if (command === "insert") return rows.some(row => row.id === 65)
    ? { rows, result: [], message: "主键冲突 · #65 已存在，未新增" }
    : { rows: [...rows, { id: 65, title: "河岸笔记", available: true }], result: [], message: "INSERT 0 1 · 新增一行" };
  const matches = rows.filter(row => !filtered || row.id === 42);
  return { rows: command === "delete" ? rows.filter(row => !matches.includes(row)) : rows.map(row => matches.includes(row) ? { ...row, available: false } : row), result: [], message: `${command.toUpperCase()} ${matches.length} · ${command === "delete" ? "删除" : "更新"} ${matches.length} 行` };
}
export type MigrationState = { revision: 1 | 2 | 3 | 4; oldApp: boolean };
export function applyMigration(state: MigrationState, revision: 2 | 3 | 4) {
  if (revision <= state.revision) return { state, message: `${String(revision).padStart(3,"0")} 已执行，跳过` };
  if (revision !== state.revision+1) return { state, message: "缺少前置迁移，结构与执行历史均未改变" };
  if (revision === 4 && state.oldApp) return { state, message: "发布检查未通过：旧程序还在读取 title，暂不执行 004" };
  return { state: { ...state, revision }, message: `${String(revision).padStart(3,"0")} 执行成功，更新数据库与迁移记录` };
}
export type OrmState = { object: string | null; flushed: string; committed: string; trace: string[] };
export const initialOrm = (): OrmState => ({ object: "山间来信", flushed: "山间来信", committed: "山间来信", trace: ["SELECT book_id, title FROM books WHERE book_id = :id", "参数 id = 42"] });
export function changeObject(state: OrmState, action: "edit" | "flush" | "commit" | "rollback" | "reload"): OrmState {
  if (action === "edit") return state.object === null ? state : { ...state, object: "山间来信 · 修订版" };
  if (action === "reload") return state.object !== null ? state : { ...state, object: state.committed, flushed: state.committed, trace: [...state.trace, "SELECT book_id, title FROM books WHERE book_id = :id", "参数 id = 42"] };
  if (action === "rollback") return { ...state, object: null, flushed: state.committed, trace: [...state.trace, "ROLLBACK"] };
  if (state.object === null) return state;
  const needsFlush = state.object !== state.flushed;
  const flushed = { ...state, flushed: state.object, trace: needsFlush ? [...state.trace, "UPDATE books SET title = :title WHERE book_id = :id", `参数 title = '${state.object}', id = 42`] : state.trace };
  return action === "commit" ? { ...flushed, object: null, committed: state.object, trace: [...flushed.trace, "COMMIT"] } : flushed;
}
