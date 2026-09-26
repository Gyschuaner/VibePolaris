import test from 'node:test';
import assert from 'node:assert/strict';
import { initialBatch, batchChunk, batchCounts, publishBatch, initialStream, receiveStream, advanceWatermark, windowEvents, initialEvent, deliverEvent } from '../lib/processing-teaching.ts';
test('bounded output, closed windows and independent subscriptions preserve completed work', () => {
  for (const size of [4, 6]) {
    let state = initialBatch(size); assert.deepEqual(batchChunk(state, false), state); assert.equal(publishBatch(state).published, false);
    state = { ...state, sealed: true }; state = batchChunk(state, false);
    const before = batchCounts(state); state = batchChunk(state, true); assert.deepEqual(batchCounts(state), before);
    assert.equal(publishBatch(state).published, false);
    while (state.done.length < size / 2) state = batchChunk(state, false);
    assert.deepEqual(batchCounts(state), size === 4 ? [3, 1] : [3, 3]);
    state = publishBatch(state); assert.equal(state.published, true); assert.deepEqual(batchChunk(state, false), state);
  }
  let stream = receiveStream(receiveStream(initialStream(), 'e1'), 'e2');
  stream = advanceWatermark(stream, 10); stream = receiveStream(stream, 'e3');
  assert.deepEqual(stream.late, ['e3']); assert.equal(windowEvents(stream, 0).length, 1); assert.equal(windowEvents(stream, 10).length, 1);
  assert.deepEqual(receiveStream(stream, 'e3'), stream); assert.equal(advanceWatermark(stream, 0).watermark, 10);
  let early = receiveStream(receiveStream(receiveStream(initialStream(), 'e1'), 'e2'), 'e3');
  early = advanceWatermark(early, 20); assert.equal(windowEvents(early, 0).length, 2); assert.deepEqual(early.late, []);
  assert.deepEqual(receiveStream(advanceWatermark(initialStream(), 20), 'e1').late, ['e1']);
  let event = initialEvent(); assert.deepEqual(deliverEvent(event, 'stats'), event);
  event = { ...event, recorded: true, published: true }; event = deliverEvent(event, 'shelf'); event = deliverEvent(event, 'stats', true);
  assert.deepEqual(event.processed, ['shelf']); assert.equal(event.deliveries.stats, 'failed');
  event = deliverEvent(event, 'stats'); event = deliverEvent(event, 'stats');
  assert.deepEqual(event.processed, ['shelf', 'stats']); assert.equal(event.deliveries.stats, 'duplicate'); assert.equal(event.recorded, true);
  assert.deepEqual(initialBatch().done, []); assert.deepEqual(initialStream().accepted, []); assert.deepEqual(initialEvent().processed, []);
});
