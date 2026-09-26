import test from 'node:test';
import assert from 'node:assert/strict';
import { initialSchema, changeSchema, pairRows, joinBooks, joinLoans, writeRegistration } from '../lib/structure-teaching.ts';
test('existing NULL validation, join multiplicity and write-time uniqueness', () => {
  const start = initialSchema();
  assert.equal(changeSchema(start,'require').result,'no-column');
  const added = changeSchema(start,'add').state;
  assert.deepEqual(added.values,[null,null]);
  const one = changeSchema(added,'fill42').state;
  assert.equal(changeSchema(one,'require').state,one);
  assert.equal(changeSchema(one,'require').result,'null-remains');
  const complete = changeSchema(one,'fill78').state;
  assert.equal(changeSchema(complete,'require').state.required,true);
  assert.equal(start.added,false);
  assert.equal(pairRows('inner').length,2);
  assert.deepEqual(pairRows('inner').map(row => row.loan.id),[1,2]);
  assert.equal(pairRows('books-left')[2].loan,null);
  assert.equal(pairRows('loans-left')[2].book,null);
  assert.equal(pairRows('loans-left')[2].loan.bookId,65);
  assert.equal(pairRows('cross').length,6);
  assert.equal(joinBooks.length,2); assert.equal(joinLoans.length,3);
  for (const first of ['A','B']) {
    const second = first === 'A' ? 'B' : 'A';
    const saved = writeRegistration([],first,'lin@example.com',true,false);
    const conflict = writeRegistration(saved.rows,second,'lin@example.com',true,false);
    assert.equal(conflict.result,'rejected'); assert.equal(conflict.rows,saved.rows);
    assert.equal(writeRegistration(saved.rows,first,'lin@example.com',false,false).result,'already');
    assert.equal(writeRegistration(saved.rows,second,'lin@example.com',false,false).rows.length,2);
    const noEmail = writeRegistration([],first,null,true,false);
    assert.equal(writeRegistration(noEmail.rows,second,null,true,false).rows.length,2);
    assert.equal(writeRegistration(noEmail.rows,second,null,true,true).result,'rejected');
  }
});
