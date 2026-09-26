import test from 'node:test';
import assert from 'node:assert/strict';
import { books, saveBook, queryBooks, searchBooks, initialLoan, advanceLoan } from '../lib/storage-teaching.ts';

test('stored records, lookup paths and atomic loan changes preserve their boundaries', () => {
  const snapshot = queryBooks(books, true);
  const saved = saveBook(books, 42, false);
  assert.ok(snapshot.some(book => book.id === 42));
  assert.ok(!queryBooks(saved, true).some(book => book.id === 42));
  assert.equal(books[0].available, true);
  for (const target of [...books.map(book => book.id), 65, 0, 100]) {
    for (const indexed of [false, true]) {
      const trace = searchBooks(target, indexed);
      assert.equal(trace.steps.at(-1).found, books.some(book => book.id === target));
      assert.ok(trace.steps.length <= books.length);
      for (const step of trace.steps) {
        assert.equal(trace.entries[step.position].id, step.id);
        assert.ok(step.position >= step.low && step.position <= step.high);
      }
    }
  }
  assert.deepEqual(searchBooks(64, true).steps.map(step => step.id), [42, 64]);
  assert.equal(searchBooks(64, false).steps.length, 5);
  for (const grouped of [false, true]) for (const fail of [false, true]) {
    let state = initialLoan();
    state = advanceLoan(state, 'next', grouped, fail);
    state = advanceLoan(state, 'next', grouped, fail);
    assert.deepEqual(state.committed, { available: grouped ? 2 : 1, loans: 0 });
    state = advanceLoan(state, 'next', grouped, fail);
    if (fail) {
      assert.equal(state.phase, 'failed');
      assert.equal(advanceLoan(state, 'next', grouped, fail), state);
      state = advanceLoan(state, 'rollback', grouped, fail);
      assert.deepEqual(state.committed, { available: grouped ? 2 : 1, loans: 0 });
      assert.equal(state.phase, grouped ? 'rolledback' : 'failed');
    } else {
      state = advanceLoan(state, 'next', grouped, fail);
      assert.deepEqual(state.committed, { available: 1, loans: 1 });
      assert.equal(state.phase, 'committed');
      assert.equal(advanceLoan(state, 'rollback', grouped, fail), state);
    }
  }
});
