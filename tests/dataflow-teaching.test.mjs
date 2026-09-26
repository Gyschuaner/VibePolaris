import test from 'node:test';
import assert from 'node:assert/strict';
import { initialIngestion, runIngestion, toCents, transformRows, validateRecords } from '../lib/dataflow-teaching.ts';
test('confirmed ingestion position, explicit money units, and rule-scoped validation', () => {
  let state = initialIngestion();
  assert.equal(runIngestion(state, 'commit'), state);
  state = runIngestion(state, 'read');
  state = runIngestion(state, 'fail');
  assert.equal(state.cursor, 0); assert.deepEqual(state.saved, []);
  state = runIngestion(state, 'write');
  state = runIngestion(state, 'restart');
  assert.equal(state.cursor, 0); assert.deepEqual(state.saved, [1, 2]);
  state = runIngestion(runIngestion(state, 'read'), 'write');
  assert.deepEqual(state.saved, [1, 2]);
  state = runIngestion(state, 'commit');
  assert.equal(state.cursor, 2);
  state = runIngestion(runIngestion(runIngestion(state, 'read'), 'write'), 'commit');
  assert.equal(state.cursor, 3); assert.deepEqual(state.saved, [1, 2, 3]);
  assert.equal(toCents('1230', 'unknown').cents, null);
  assert.equal(toCents('1230', 'fen').cents, 1230);
  assert.equal(toCents('1230', 'yuan').cents, 123000);
  assert.equal(toCents('12.345', 'yuan').cents, null);
  assert.equal(toCents('0.29', 'yuan').cents, 29);
  assert.equal(toCents('9007199254740992', 'fen').cents, null);
  assert.equal(transformRows('unknown').filter(row => row.result.cents !== null).length, 3);
  for (const [range, city, count] of [[true,true,1],[false,true,2],[true,false,2],[false,false,3]]) {
    const report = validateRecords({ range, city });
    assert.equal(report.filter(row => row.valid).length, count);
    assert.equal(report[3].valid, false);
    assert.equal(report[1].age, -2);
    assert.equal(report[0].city, 'SH');
    assert.equal(report[2].city, '??');
  }
});
