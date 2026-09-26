import test from 'node:test';
import assert from 'node:assert/strict';
import { initialPipeline, runPipeline, initialWebhook, deliverWebhook, verifyWebhook, acceptWebhook, processWebhook, initialDistributed, runDistributed } from '../lib/coordination-teaching.ts';
test('dependencies, verified acceptance and uncertain remote effects remain separate', () => {
  let pipeline = initialPipeline();
  for (const action of ['validate', 'archive', 'aggregate', 'publish']) assert.deepEqual(runPipeline(pipeline, action), pipeline);
  pipeline = runPipeline(runPipeline(pipeline, 'read'), 'validate');
  pipeline = runPipeline(pipeline, 'archive'); assert.equal(pipeline.quality, 'failed'); assert.equal(pipeline.archived, true);
  assert.equal(runPipeline(pipeline, 'aggregate').aggregated, false); assert.equal(runPipeline(pipeline, 'publish').published, false);
  pipeline = runPipeline(runPipeline(pipeline, 'isolate'), 'aggregate'); assert.equal(runPipeline(pipeline, 'publish').published, true);
  assert.equal(runPipeline({ ...pipeline, archived: false }, 'publish').published, false);
  let hook = verifyWebhook(deliverWebhook(initialWebhook(), 'tampered')); assert.equal(hook.receipt, 'rejected'); assert.equal(acceptWebhook(hook).stored, false);
  hook = acceptWebhook(verifyWebhook(deliverWebhook(hook, 'valid')), true); assert.equal(hook.processed, false); assert.equal(hook.response, 'lost');
  hook = acceptWebhook(verifyWebhook(deliverWebhook(hook, 'valid'))); assert.equal(hook.receipt, 'duplicate');
  hook = processWebhook(hook); assert.equal(hook.processed, true); assert.deepEqual(processWebhook(hook), hook);
  assert.equal(verifyWebhook(deliverWebhook(hook, 'tampered')).processed, true);
  for (const mode of ['request-lost', 'response-lost']) {
    let state = runDistributed(initialDistributed(mode), 'send');
    if (mode === 'response-lost') { assert.equal(runDistributed(state, 'timeout').caller, 'waiting'); state = runDistributed(state, 'process'); }
    state = runDistributed(state, 'timeout'); assert.equal(state.caller, 'unknown'); assert.equal(state.remoteDone, mode === 'response-lost');
    state = runDistributed(state, 'query'); assert.equal(state.caller, mode === 'response-lost' ? 'confirmed' : 'not-found');
    state = runDistributed(state, 'retry'); assert.equal(state.remoteDone, true); assert.equal(state.caller, 'confirmed'); assert.deepEqual(runDistributed(state, 'retry'), state);
    assert.equal(initialDistributed(mode).remoteDone, false);
  }
});
