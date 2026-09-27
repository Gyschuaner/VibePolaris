import test from 'node:test';
import assert from 'node:assert/strict';
import { timeoutState, retryAttempt, reserveOnce } from '../lib/reliability-teaching.ts';

test('timeout preserves remote effects, retries stop, and duplicate keys preserve reservations', () => {
  assert.deepEqual(timeoutState(2, 2), { committed: false, client: 'timeout', clientTime: 2, serverTime: 2 });
  assert.equal(timeoutState(4, 2).committed, true);
  assert.equal(timeoutState(4, 2).client, 'timeout');
  assert.equal(timeoutState(4, 5).client, 'received');
  assert.deepEqual([1, 2, 3].map(n => retryAttempt('temporary', n).wait), [1, 2, 0]);
  assert.equal(retryAttempt('temporary', 3).stop, 'success');
  assert.equal(retryAttempt('persistent', 3).stop, 'exhausted');
  assert.equal(retryAttempt('invalid', 1).stop, 'invalid');
  const first = reserveOnce([], 'A', '14:00');
  const replay = reserveOnce(first.entries, 'A', '14:00');
  assert.equal(replay.kind, 'replayed');
  assert.equal(replay.entry.id, first.entry.id);
  assert.equal(replay.entries.length, 1);
  const conflict = reserveOnce(replay.entries, 'A', '16:00');
  assert.equal(conflict.kind, 'conflict');
  assert.deepEqual(conflict.entries, first.entries);
  assert.equal(reserveOnce(first.entries, 'B', '14:00').entries.length, 2);
});
