export type Book = { id: number; title: string; available: boolean };
export const books: Book[] = [
  { id: 42, title: "山间来信", available: true },
  { id: 12, title: "河流手记", available: false },
  { id: 78, title: "夜空地图", available: true },
  { id: 29, title: "城市漫步", available: false },
  { id: 64, title: "设计札记", available: true },
  { id: 8, title: "植物观察", available: true },
  { id: 51, title: "海边日记", available: false },
  { id: 90, title: "山野笔记", available: true },
  { id: 37, title: "四季书信", available: false },
];
export const saveBook = (records: Book[], id: number, available: boolean) => records.map(book => book.id === id ? { ...book, available } : book);
export const queryBooks = (records: Book[], availableOnly: boolean) => records.filter(book => !availableOnly || book.available).map(book => ({ ...book }));

export type SearchStep = { low: number; high: number; position: number; id: number; found: boolean };
export function searchBooks(target: number, indexed: boolean) {
  const entries = indexed ? [...books].sort((a, b) => a.id - b.id) : books;
  const steps: SearchStep[] = [];
  let low = 0, high = entries.length - 1;
  while (low <= high) {
    const position = indexed ? Math.floor((low + high) / 2) : low;
    const id = entries[position].id;
    steps.push({ low, high, position, id, found: id === target });
    if (id === target) break;
    if (indexed && id > target) high = position - 1;
    else low = position + 1;
  }
  return { entries, steps };
}

type LoanValues = { available: number; loans: number };
export type LoanState = {
  phase: "idle" | "started" | "reserved" | "ready" | "failed" | "committed" | "rolledback";
  working: LoanValues; committed: LoanValues;
};
export function initialLoan(): LoanState {
  return { phase: "idle", working: { available: 2, loans: 0 }, committed: { available: 2, loans: 0 } };
}
export function advanceLoan(state: LoanState, action: "next" | "rollback", grouped: boolean, fail: boolean): LoanState {
  if (action === "rollback") {
    if (!grouped || !["started", "reserved", "ready", "failed"].includes(state.phase)) return state;
    return { ...state, working: { ...state.committed }, phase: "rolledback" };
  }
  if (state.phase === "idle") return { ...state, phase: "started" };
  if (state.phase === "started") {
    const working = { ...state.working, available: state.working.available - 1 };
    return { ...state, working, committed: grouped ? state.committed : { ...working }, phase: "reserved" };
  }
  if (state.phase === "reserved") {
    if (fail) return { ...state, phase: "failed" };
    const working = { ...state.working, loans: state.working.loans + 1 };
    return { ...state, working, committed: grouped ? state.committed : { ...working }, phase: grouped ? "ready" : "committed" };
  }
  if (state.phase === "ready") return { ...state, committed: { ...state.working }, phase: "committed" };
  return state;
}
