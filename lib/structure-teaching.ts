// Bounded teaching fixtures; these functions do not execute SQL.
export type SchemaState = { added: boolean; values: [boolean | null, boolean | null]; required: boolean };
export function initialSchema(): SchemaState { return { added: false, values: [null, null], required: false }; }
export function changeSchema(state: SchemaState, action: "add" | "fill42" | "fill78" | "require") {
  if (action === "add") return { state: state.added ? state : { ...state, added: true }, result: "added" as const };
  if (!state.added) return { state, result: "no-column" as const };
  if (action === "require") return state.values.some(value => value === null)
    ? { state, result: "null-remains" as const }
    : { state: { ...state, required: true }, result: "required" as const };
  const values: SchemaState["values"] = [...state.values];
  values[action === "fill42" ? 0 : 1] = action === "fill42";
  return { state: { ...state, values }, result: "filled" as const };
}

export const joinBooks = [{ id: 42, title: "山间来信" }, { id: 78, title: "夜空地图" }];
export const joinLoans = [{ id: 1, bookId: 42, reader: "林舟" }, { id: 2, bookId: 42, reader: "陈禾" }, { id: 3, bookId: 65, reader: "唐宁" }];
export type JoinMode = "inner" | "books-left" | "loans-left" | "cross";
export type JoinedRow = { book: (typeof joinBooks)[number] | null; loan: (typeof joinLoans)[number] | null };
export function pairRows(mode: JoinMode): JoinedRow[] {
  if (mode === "loans-left") return joinLoans.flatMap<JoinedRow>(loan => {
    const matches = joinBooks.filter(book => book.id === loan.bookId);
    return matches.length ? matches.map(book => ({ book, loan })) : [{ book: null, loan }];
  });
  return joinBooks.flatMap<JoinedRow>(book => {
    const matches = joinLoans.filter(loan => mode === "cross" || book.id === loan.bookId);
    return matches.length ? matches.map(loan => ({ book, loan })) : mode === "books-left" ? [{ book, loan: null }] : [];
  });
}
export function joinSql(mode: JoinMode) {
  const from = mode === "loans-left" ? "loans l LEFT JOIN books b" : `books b ${mode === "books-left" ? "LEFT" : mode === "cross" ? "CROSS" : "INNER"} JOIN loans l`;
  return `SELECT b.book_id, b.title,\n       l.loan_id, l.book_id AS loan_book_id, l.reader\nFROM ${from}${mode === "cross" ? "" : "\n  ON b.book_id = l.book_id"};`;
}

export type Registration = { request: "A" | "B"; id: 101 | 102; email: string | null };
export function writeRegistration(rows: Registration[], request: "A" | "B", email: string | null, unique: boolean, nullsEqual: boolean) {
  if (rows.some(row => row.request === request)) return { rows, result: "already" as const };
  const conflict = unique && rows.some(row => email === null ? nullsEqual && row.email === null : row.email === email);
  return conflict ? { rows, result: "rejected" as const } : { rows: [...rows, { request, id: request === "A" ? 101 as const : 102 as const, email }], result: "saved" as const };
}
