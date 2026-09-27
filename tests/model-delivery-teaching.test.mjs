import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeRequest, fallbackPolicy, callBackup, reusePrefix } from '../lib/model-delivery-teaching.ts';
test('选择、失败切换和输入计算复用遵守各自的边界', () => {
  assert.equal(routeRequest('extract', 90, true).chosen, 'A');
  assert.equal(routeRequest('analysis', 90, true).chosen, 'B');
  assert.equal(routeRequest('image', 90, true).chosen, 'B');
  assert.equal(routeRequest('extract', 98, true).chosen, null);
  assert.equal(routeRequest('image', 90, false).chosen, null);
  const allowed = fallbackPolicy('rate', 'valid', 2);
  assert.deepEqual([callBackup(allowed).attempts, callBackup(allowed).pass], [2, true]);
  for (const policy of [fallbackPolicy('success', 'valid', 2), fallbackPolicy('auth', 'valid', 2), fallbackPolicy('rate', 'valid', 1), fallbackPolicy('rate', 'unsupported', 2), fallbackPolicy('timeout', 'none', 2)]) assert.equal(callBackup(policy).attempted, false);
  assert.equal(callBackup(fallbackPolicy('timeout', 'invalid', 2)).pass, false);
  assert.equal(reusePrefix('question', true, true, true).reused, 3);
  assert.equal(reusePrefix('material', true, true, true).reused, 1);
  assert.equal(reusePrefix('instruction', true, true, true).reused, 0);
  for (const [same, available, saved] of [[false,true,true],[true,false,true],[true,true,false]]) assert.equal(reusePrefix('question', same, available, saved).reused, 0);
  assert.notEqual(reusePrefix('question', true, true, true).answer, reusePrefix('material', true, true, true).answer);
});
