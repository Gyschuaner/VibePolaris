import assert from 'node:assert/strict';
import test from 'node:test';
import { validateReservation } from '../lib/reservation-example.ts';

test('fixed teaching schema distinguishes required, enum, integer, range and extra fields without coercion', () => {
  assert.deepEqual(validateReservation({status:'success',count:0}), []);
  for (const [data, field, rule] of [
    [{status:'done',count:0}, 'status', 'enum'],
    [{status:'pending'}, 'count', 'required'],
    [{status:'pending',count:'2'}, 'count', 'type'],
    [{status:'pending',count:1.5}, 'count', 'type'],
    [{status:'pending',count:-1}, 'count', 'minimum'],
    [{status:'pending',count:2,debug:true}, 'debug', 'additionalProperties'],
  ]) assert.deepEqual(validateReservation(data).map(({field,rule})=>[field,rule]), [[field,rule]]);
});
