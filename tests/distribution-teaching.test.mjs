import test from 'node:test';
import assert from 'node:assert/strict';
import { initialBackup, saveBackup, restoreBackup, snapshot, queryShards, initialQueue, queueAction } from '../lib/distribution-teaching.ts';
test('restore points, range ownership and unacknowledged messages keep independent lifetimes', () => {
  const empty = initialBackup(); assert.deepEqual(restoreBackup(empty), empty);
  let backup = saveBackup(empty); backup = saveBackup({ ...backup, current: 1 });
  backup = restoreBackup({ ...backup, current: 2, selected: 0 });
  assert.equal(backup.current, 2); assert.equal(snapshot(backup.restored)[0].title, '山间来信');
  assert.equal(snapshot(restoreBackup({ ...backup, selected: 1 }).restored)[0].title, '山间来信·修订版');
  assert.deepEqual(backup.saved, [0, 1]); assert.deepEqual(saveBackup({ ...backup, current: 1 }).saved, [0, 1]);
  assert.equal(snapshot(restoreBackup(saveBackup({ ...backup, selected: null })).restored).length, 0);
  for (let stage = 0; stage <= 3; stage++) {
    assert.deepEqual(queryShards(stage, 78).targets, [stage < 2 ? 'B' : 'A']);
    assert.equal(queryShards(stage, 78).rows.length, 1);
    assert.deepEqual(queryShards(stage, null).rows.map(row => row.id), [42, 78]);
    assert.deepEqual(queryShards(stage, null).targets, ['A', 'B']);
  }
  assert.equal(queryShards(0, 99).rows.length, 0);
  let queue = queueAction(initialQueue(), 'publish');
  queue = queueAction(queue, 'receive'); assert.equal(queue.ready.length, 1);
  assert.deepEqual(queueAction(queue, 'ack'), queue);
  queue = queueAction(queue, 'disconnect'); assert.deepEqual(queue.ready, [42, 78]);
  queue = queueAction(queue, 'receive'); queue = queueAction(queue, 'process');
  queue = queueAction(queue, 'disconnect'); assert.deepEqual(queue.covers, [42]);
  queue = queueAction(queueAction(queue, 'receive'), 'process');
  assert.equal(queue.flight.reused, true); assert.deepEqual(queue.covers, [42]);
  queue = queueAction(queue, 'ack'); assert.deepEqual(queue.acked, [42]); assert.equal(queue.flight, null);
  queue = queueAction(queueAction(queueAction(queue, 'receive'), 'process'), 'ack');
  assert.deepEqual(queue.covers, [42, 78]); assert.deepEqual(queue.ready, []); assert.deepEqual(initialQueue().covers, []);
});
