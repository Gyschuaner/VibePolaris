import assert from 'node:assert/strict';
import test from 'node:test';
import { applyNoteMethod, exportStatus, negotiateBook } from '../lib/http-teaching.ts';

test('teaching HTTP operations preserve repeat semantics and never promote rejection to success', () => {
  const initial = [{id:42,title:'草稿'}];
  const once = applyNoteMethod(initial,43,'PUT');
  assert.deepEqual(applyNoteMethod(once.notes,once.nextId,'PUT').notes,once.notes);
  const post = applyNoteMethod(initial,43,'POST');
  assert.deepEqual(applyNoteMethod(post.notes,post.nextId,'POST').notes.map(n=>n.id),[42,43,44]);
  const deleted = applyNoteMethod(initial,43,'DELETE');
  assert.equal(deleted.status,204);
  assert.equal(applyNoteMethod(deleted.notes,43,'DELETE').status,404);
  assert.deepEqual(applyNoteMethod(initial,43,'GET').notes,initial);
  assert.deepEqual(initial,[{id:42,title:'草稿'}]);
  assert.deepEqual([exportStatus(2,true),exportStatus(0,true),exportStatus(2,false),exportStatus(NaN,true)],[202,422,503,422]);
  assert.equal(negotiateBook('application/xml').status,406);
  assert.equal(JSON.parse(negotiateBook('application/json').body).title,negotiateBook('text/plain').body);
});
