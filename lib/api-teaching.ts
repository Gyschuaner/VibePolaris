// Small, local teaching models. These functions never contact a service.
export function bookContract(storage: "A" | "B", map: boolean) {
  const internal = storage === "A" ? { id: 42, title: "星空手记" } : { book_id: 42, display_name: "星空手记" };
  const output: Record<string, unknown> = map
    ? { id: storage === "A" ? internal.id : internal.book_id, title: storage === "A" ? internal.title : internal.display_name }
    : internal;
  return { internal, output, valid: Number.isInteger(output.id) && typeof output.title === "string" && output.title.trim().length > 0 };
}

export const operations = [
  { method: "GET", path: "/books", name: "listBooks" },
  { method: "POST", path: "/books", name: "createBook" },
  { method: "GET", path: "/books/42", name: "getBook" },
];
export function matchOperation(method: string, path: string) {
  const atPath = operations.filter(operation => operation.path === path);
  const operation = atPath.find(operation => operation.method === method);
  return { name: operation?.name, kind: operation ? "matched" : atPath.length ? "method" : "path", allowed: atPath.map(operation => operation.method) };
}

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "expired";
export type ReservationAction = { rel: "confirm" | "cancel"; method: "PATCH"; href: string; body: { status: "confirmed" | "cancelled" } };
export function reservationRepresentation(status: ReservationStatus) {
  const actions: ReservationAction[] = status === "pending" ? [
    { rel: "confirm", method: "PATCH", href: "/reservations/42", body: { status: "confirmed" } },
    { rel: "cancel", method: "PATCH", href: "/reservations/42", body: { status: "cancelled" } },
  ] : [];
  return { id: 42, status, actions };
}
export function applyReservation(status: ReservationStatus, action: ReservationAction) {
  const offered = reservationRepresentation(status).actions.find(candidate => candidate.rel === action.rel);
  const accepted = offered && offered.href === action.href && offered.method === action.method && offered.body.status === action.body.status;
  const next = accepted ? action.body.status : status;
  return { code: accepted ? 200 : 409, resource: next, representation: reservationRepresentation(next) };
}

export const initialEntries = [9, 8, 7, 6, 5, 4, 3, 2, 1];
export function readPages(entries: number[], offset: number, after: number | null) {
  const remaining = after === null ? entries : entries.filter(id => id < after);
  const offsetPage = entries.slice(offset, offset + 3);
  const cursorPage = remaining.slice(0, 3);
  return { offsetPage, cursorPage, offset: offset + offsetPage.length, after: cursorPage.at(-1) ?? after,
    offsetMore: offset + offsetPage.length < entries.length, cursorMore: remaining.length > 3 };
}

export function spendTokens(tokens: number, requests: number) {
  const allowed = Math.min(tokens, requests);
  return { tokens: tokens - allowed, allowed, rejected: requests - allowed };
}
export function refillTokens(tokens: number, seconds: number) { return Math.min(5, tokens + seconds); }
