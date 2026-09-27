import test from 'node:test';
import assert from 'node:assert/strict';
import { tableBooks, readTable, keyBooks, insertKeyBook, renameKeyBook, initialRelation, addLoan, deleteReferencedBook } from '../lib/relational-teaching.ts';
test('row views and keys preserve records and referential integrity', () => {
  assert.deepEqual(readTable('available',true).map(b => b.id),[42,78]);
  assert.deepEqual(readTable('missing',true),[]);
  assert.deepEqual(readTable('all',true).map(b => b.id),[12,42,78]);
  assert.deepEqual(tableBooks.map(b => b.id),[42,12,78]);
  assert.equal(insertKeyBook(keyBooks,42).result,'duplicate');
  assert.equal(insertKeyBook(keyBooks,null).result,'empty');
  const inserted = insertKeyBook(keyBooks,65);
  assert.equal(inserted.rows.length,3);
  assert.equal(insertKeyBook(inserted.rows,65).result,'duplicate');
  assert.equal(renameKeyBook(inserted.rows)[0].id,42);
  assert.equal(keyBooks[0].title,'山间来信');
  for (const cascade of [false,true]) {
    const initial = initialRelation();
    assert.equal(addLoan(initial,65).state,initial);
    const added = addLoan(initial,42);
    assert.equal(added.state.loans.length,2);
    assert.equal(addLoan(added.state,42).result,'already');
    const deleted = deleteReferencedBook(added.state,cascade);
    assert.equal(deleted.result,cascade ? 'deleted' : 'restricted');
    assert.equal(deleted.state.loans.length,cascade ? 0 : 2);
    assert.ok(deleted.state.loans.every(loan => deleted.state.books.includes(loan.bookId)));
    assert.ok(deleted.state.books.includes(78));
    if (cascade) assert.equal(addLoan(deleted.state,42).result,'missing');
    assert.deepEqual(initial.books,[42,78]);
  }
});
