import assert from 'node:assert/strict';
import test from 'node:test';
import { readBookQuery, matchReader, encodeBooking, receiveBooking } from '../lib/request-input-teaching.ts';

test('query multiplicity, route guards and body stages preserve distinct evidence', () => {
  assert.deepEqual(readBookQuery('tag=science&tag=art').ids, [1, 2, 3, 4]);
  assert.equal(readBookQuery('tag=science&tag=art').firstTag, 'science');
  assert.deepEqual(readBookQuery('tag=science,art').ids, []);
  assert.equal(readBookQuery('').firstTag, null);
  assert.equal(readBookQuery('tag=').firstTag, '');
  const phrase = '星空 + 艺术 & 自然';
  assert.equal(readBookQuery(new URLSearchParams({ q: phrase }).toString()).q, phrase);
  assert.equal(matchReader('/readers/me', true, false).reader.id, 42);
  assert.equal(matchReader('/readers/me', false, false).status, 422);
  assert.equal(matchReader('/readers/43', true, false).reader, undefined);
  assert.equal(matchReader('/readers/43', true, false).status, 403);
  assert.equal(matchReader('/readers/99', true, true).status, 404);
  assert.equal(matchReader('/readers/a%2Fb', true, true).status, 422);
  assert.equal(matchReader('/readers/%', true, true).status, 400);
  for (const format of ['json', 'form']) {
    const { text, type } = encodeBooking(phrase, '2', format);
    assert.deepEqual(receiveBooking(text, type).booking, { title: phrase, seats: 2 });
    assert.equal(receiveBooking(text, 'text/plain').status, 415);
  }
  assert.equal(receiveBooking('{', 'application/json').status, 400);
  assert.equal(receiveBooking('{"title":"书","seats":0}', 'application/json').status, 422);
  assert.equal(receiveBooking('{"title":"书","seats":"2"}', 'application/json').status, 422);
  assert.equal(receiveBooking('title=书&seats=2&seats=3', 'application/x-www-form-urlencoded').status, 422);
});
