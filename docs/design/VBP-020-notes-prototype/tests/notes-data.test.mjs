import { test } from 'node:test';
import assert from 'node:assert/strict';
import { locateQuote } from '../src/anchors.js';
import { parseBackup } from '../src/storage.js';

test('changed paragraphs use context; ambiguous or missing quotes never attach to the wrong text', () => {
  const anchor = { exact: '工具', prefix: '调用', suffix: '并保存', start: 0 };
  assert.equal(locateQuote('新增文字。调用工具并保存结果。另一个工具。', anchor), 7);
  assert.equal(locateQuote('调用工具并保存，调用工具并保存。', anchor), -1);
  assert.equal(locateQuote('这句话已经重写。', anchor), -1);
});
test('backup import validates every record before writing and keeps user text as data', () => {
  const note = { id: 'example', body: '<script>unsafe()</script>', source: 'agent-harness', createdAt: '2026-09-21', updatedAt: '2026-09-21', anchor: null };
  assert.equal(parseBackup(JSON.stringify({ version: 1, notes: [note] }))[0].body, note.body);
  assert.throws(() => parseBackup(JSON.stringify({ version: 1, notes: [note, { ...note, anchor: { exact: '' } }] })));
  assert.throws(() => parseBackup(JSON.stringify({ version: 2, notes: [note] })));
});
