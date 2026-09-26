import type { Book } from './storage-teaching';
export const tableBooks: Book[] = [
  { id: 42, title: "山间来信", available: true },
  { id: 12, title: "河流手记", available: false },
  { id: 78, title: "夜空地图", available: true },
];
export type TableFilter = 'all' | 'available' | 'missing';
export function readTable(filter: TableFilter, ordered: boolean) {
  const rows = tableBooks.filter(book => filter === 'all' || (filter === 'available' ? book.available : book.id === 65));
  return ordered ? rows.sort((a, b) => a.id - b.id) : rows;
}
export type KeyBook = { id: number; title: string };
export const keyBooks: KeyBook[] = [{ id: 42, title: "山间来信" }, { id: 78, title: "山间来信" }];
export function insertKeyBook(rows: KeyBook[], id: number | null) {
  if (id === null) return { rows, result: 'empty' as const };
  if (rows.some(book => book.id === id)) return { rows, result: 'duplicate' as const };
  return { rows: [...rows, { id, title: "山间来信" }], result: 'accepted' as const };
}
export const renameKeyBook = (rows: KeyBook[]) => rows.map(book => book.id === 42 ? { ...book, title: "山间来信 · 修订版" } : book);
export type RelationState = { books: number[]; loans: { id: number; bookId: number; reader: string }[] };
export const initialRelation = (): RelationState => ({ books: [42, 78], loans: [{ id: 1, bookId: 42, reader: "林舟" }] });
// ponytail: two loan slots suffice for this bounded existence/deletion example; use a real DB for arbitrary queries.
export function addLoan(state: RelationState, bookId: number) {
  if (!state.books.includes(bookId)) return { state, result: 'missing' as const };
  if (state.loans.some(loan => loan.id === 2)) return { state, result: 'already' as const };
  return { state: { ...state, loans: [...state.loans, { id: 2, bookId, reader: "陈禾" }] }, result: 'added' as const };
}
export function deleteReferencedBook(state: RelationState, cascade: boolean) {
  if (!state.books.includes(42)) return { state, result: 'gone' as const };
  if (!cascade && state.loans.some(loan => loan.bookId === 42)) return { state, result: 'restricted' as const };
  return { state: { books: state.books.filter(id => id !== 42), loans: state.loans.filter(loan => loan.bookId !== 42) }, result: 'deleted' as const };
}
