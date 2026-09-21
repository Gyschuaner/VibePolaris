import assert from "node:assert/strict";
import test from "node:test";
import { locateQuote, mergeNotes, parseNotesBackup } from "../lib/reading-notes.ts";
const note = {id:"one",source:{path:"/terms/agent-harness",title:"Harness"},body:"自己的理解",anchor:{block:"need:0",exact:"调用工具",start:2,prefix:"检查后",suffix:"并返回"},createdAt:"2026-09-21T00:00:00.000Z",updatedAt:"2026-09-21T00:00:00.000Z"};
test("备份保留各文章数据，冲突不覆盖，重复导入不增加；无效来源拒绝",()=>{
  const json = value=>JSON.stringify({version:1,notes:value});
  const loaded=parseNotesBackup(json([note]));
  const other={...note,source:{path:"/terms/tools",title:"工具调用"}};
  const merged=mergeNotes(loaded,[note,other],()=>"two");
  assert.equal(merged.length,2);assert.equal(merged[1].id,"two");assert.equal(merged[0].source.path,"/terms/agent-harness");
  assert.equal(mergeNotes(merged,[note,other],()=>"unused").length,2);
  assert.throws(()=>parseNotesBackup(json([{...note,source:{path:"javascript:alert(1)",title:"错误"}}])));
  assert.throws(()=>parseNotesBackup(json([{...note,anchor:{...note.anchor,exact:""}}])));
  assert.equal(parseNotesBackup(json([{...note,source:"agent-harness"}]))[0].source.path,"/terms/agent-harness");
  assert.equal(parseNotesBackup(json([{...note,body:"<script>data</script>"}]))[0].body,"<script>data</script>");
});
test("段落改动后恢复唯一摘录，重复摘录按前后文定位，歧义不猜测",()=>{
  assert.equal(locateQuote("新增文字。检查后调用工具并返回",note.anchor),8);
  assert.equal(locateQuote("先调用工具，检查后调用工具并返回",note.anchor),9);
  assert.equal(locateQuote("调用工具，调用工具",{...note.anchor,prefix:"",suffix:""}),-1);
  assert.equal(locateQuote("正文已移除",note.anchor),-1);
});
