import test from 'node:test';
import assert from 'node:assert/strict';
import { bookContract, matchOperation, reservationRepresentation, applyReservation, readPages, initialEntries, spendTokens, refillTokens } from '../lib/api-teaching.ts';

test('teaching results follow contract, resource state, pagination boundaries and available quota', () => {
  assert.deepEqual(bookContract('A', true).output, bookContract('B', true).output);
  assert.equal(bookContract('B', false).valid, false);
  assert.equal(matchOperation('POST', '/books').name, 'createBook');
  assert.equal(matchOperation('DELETE', '/books').kind, 'method');
  assert.equal(matchOperation('GET', '/authors').kind, 'path');
  const action = reservationRepresentation('pending').actions[0];
  assert.equal(applyReservation('pending', action).resource, 'confirmed');
  const rejected = applyReservation('expired', action);
  assert.equal(rejected.code, 409);
  assert.deepEqual(rejected.representation, { id: 42, status: 'expired', actions: [] });
  const first = readPages(initialEntries, 0, null);
  const next = readPages([10, ...initialEntries], first.offset, first.after);
  assert.deepEqual(next.offsetPage, [7, 6, 5]);
  assert.deepEqual(next.cursorPage, [6, 5, 4]);
  assert.equal(readPages(initialEntries, 9, 1).cursorMore, false);
  assert.deepEqual(spendTokens(5, 7), { tokens: 0, allowed: 5, rejected: 2 });
  assert.equal(spendTokens(0, 1).allowed, 0);
  assert.equal(refillTokens(4, 2), 5);
});
