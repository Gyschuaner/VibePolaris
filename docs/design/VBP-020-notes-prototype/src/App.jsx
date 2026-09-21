import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowSquareOut, Brain, Check, DownloadSimple, FileCode, FileText, Highlighter, MagnifyingGlass, NotePencil, Palette, Plus, Trash, UploadSimple, X } from '@phosphor-icons/react';
import { placeMarginNotes } from './margin';
import { captureSelection, rangeForAnchor } from './anchors';
import { deleteNote, importNotes, loadNotes, parseBackup, putNote } from './storage';

const paragraphs = {
  roles: '模型根据当前输入生成回复，或提出要使用哪个工具。Harness 接收这些请求，按配置检查权限、调用工具并保存结果，再决定是否发起下一轮模型调用。工具则负责实际操作，例如读取文件或执行一条命令。',
  tools: 'Harness 通常还要把工具的名称、用途和参数要求告诉模型。以读日志为例，模型需要知道有一个读取文件的工具，以及调用时必须提供文件路径，才能提出可执行的请求。',
  division: '在实际的开发场景中，三者形成一个清晰的分工：模型负责理解意图和生成步骤，Harness 负责落地执行与权限控制，工具负责与外部系统交互。理解它们的边界，有助于在设计复杂任务时做出更合理的拆分。',
  cycle: '三者相互配合，形成从意图到结果的完整过程。根据任务的复杂性，可能会进行多轮调用，由 Harness 在中间协调工具的使用，并把结果反馈给模型，直至问题完成。',
  context: '工具在外部读到日志后，需要把结果加入后续调用，模型才能依据它继续判断。第一次调用时，模型只知道“服务启动失败”，所以先请求日志；下一次调用带上了报错，模型才有依据去检查代码。',
  boundary: '文件写入成功，只能说明修改已经保存。要判断服务是否修好，还需要事先明确检查条件。循环也需要停止条件：检查通过后返回结果，缺少信息或授权时等待用户，达到设定的轮数或时间上限时结束。',
};
const firstQuote = '按配置检查权限、调用工具并保存结果';
function anchorFor(block, exact) {
  const text = paragraphs[block], start = text.indexOf(exact);
  return { block, exact, start, prefix: text.slice(Math.max(0, start - 32), start), suffix: text.slice(start + exact.length, start + exact.length + 32) };
}
function newNote(body = '', anchor = null) {
  return { id: crypto.randomUUID(), source: 'agent-harness', body, anchor, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), example: false };
}
const examples = [
  { ...newNote('模型负责判断，Harness 把请求接成真正的行动。', anchorFor('roles', firstQuote)), id: 'example-main', example: true },
  { ...newNote('工具返回结果后，模型才能继续判断。', anchorFor('context', '需要把结果加入后续调用，模型才能依据它继续判断。')), id: 'example-result', example: true },
];
const date = value => new Date(value).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' });
const smooth = () => matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';

export function App() {
  const [notes, setNotes] = useState([]);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [selected, setSelected] = useState('example-main');
  const [tab, setTab] = useState('notes');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selection, setSelection] = useState(null);
  const [statuses, setStatuses] = useState({});
  const [unmatched, setUnmatched] = useState(new Set());
  const [toast, setToast] = useState(null);
  const [query, setQuery] = useState('');
  const [backupStatus, setBackupStatus] = useState('');
  const [importing, setImporting] = useState(false);
  const [looseEditing, setLooseEditing] = useState(null);
  const margin = useRef(null), looseEditor = useRef(null);
  const article = useRef(null), dialog = useRef(null), fileInput = useRef(null), editor = useRef(null);
  const pending = useRef(new Map()), timers = useRef(new Map()), latest = useRef(new Map()), toastTimer = useRef(null);
  const highlightSupported = typeof CSS !== 'undefined' && 'highlights' in CSS && typeof Highlight !== 'undefined';

  function notify(message, action) {
    clearTimeout(toastTimer.current); setToast({ message, action });
    if (!action) toastTimer.current = setTimeout(() => setToast(null), 4500);
  }
  async function initialize() {
    setStorageError(false);
    try { const loaded = await loadNotes(examples); setNotes(loaded); loaded.forEach(note => latest.current.set(note.id, note)); setReady(true); }
    catch { setStorageError(true); }
  }
  useEffect(() => { initialize(); }, []);

  async function save(note) {
    clearTimeout(timers.current.get(note.id));
    try {
      await putNote(note);
      if (latest.current.get(note.id) === note) {
        pending.current.delete(note.id);
        setStatuses(old => ({ ...old, [note.id]: 'saved' }));
      }
    } catch {
      if (latest.current.get(note.id) === note) setStatuses(old => ({ ...old, [note.id]: 'error' }));
    }
  }
  function update(note, body) {
    const updated = { ...note, body, example: false, updatedAt: new Date().toISOString() };
    latest.current.set(note.id, updated); pending.current.set(note.id, updated);
    setNotes(old => old.map(item => item.id === note.id ? updated : item));
    setStatuses(old => ({ ...old, [note.id]: 'saving' }));
    clearTimeout(timers.current.get(note.id));
    timers.current.set(note.id, setTimeout(() => save(updated), 450));
  }
  useEffect(() => {
    const beforeUnload = event => { if (pending.current.size) { event.preventDefault(); event.returnValue = ''; } };
    const flush = () => { for (const note of pending.current.values()) save(note); };
    window.addEventListener('beforeunload', beforeUnload); window.addEventListener('pagehide', flush);
    return () => { window.removeEventListener('beforeunload', beforeUnload); window.removeEventListener('pagehide', flush); };
  }, []);

  useLayoutEffect(() => {
    if (editor.current) { editor.current.style.height = '0px'; editor.current.style.height = `${Math.max(68, editor.current.scrollHeight)}px`; }
  }, [notes, selected, tab, mobileOpen]);

  useLayoutEffect(() => {
    if (!article.current) return;
    const ranges = [], active = [], missing = new Set();
    notes.forEach(note => {
      if (!note.anchor) return;
      const range = rangeForAnchor(article.current, note.anchor);
      if (!range) { missing.add(note.id); return; }
      ranges.push(range); if (note.id === selected) active.push(range);
    });
    setUnmatched(missing);
    if (!highlightSupported) return;
    CSS.highlights.set('vp-notes', new Highlight(...ranges));
    CSS.highlights.set('vp-active', new Highlight(...active));
    return () => { CSS.highlights.delete('vp-notes'); CSS.highlights.delete('vp-active'); };
  }, [notes, selected, highlightSupported]);

  useLayoutEffect(() => {
    let frame;
    const position = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => placeMarginNotes(article.current, margin.current, notes)); };
    placeMarginNotes(article.current, margin.current, notes);
    const observer = new ResizeObserver(position);
    if (article.current) observer.observe(article.current);
    margin.current?.querySelectorAll('[data-note-id]').forEach(card => observer.observe(card));
    window.addEventListener('resize', position);
    document.fonts.ready.then(position);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); window.removeEventListener('resize', position); };
  }, [notes, selected, tab, mobileOpen, unmatched]);

  useLayoutEffect(() => {
    if (looseEditing && dialog.current.open) looseEditor.current?.focus({ preventScroll: true });
  }, [looseEditing]);

  useEffect(() => {
    let scheduled;
    const read = () => {
      clearTimeout(scheduled);
      scheduled = setTimeout(() => {
        const captured = captureSelection(article.current);
        if (captured?.error) { notify(captured.error); setSelection(null); return; }
        if (captured) setSelection(captured);
        else if (!document.activeElement?.closest('.selection-toolbar')) setSelection(null);
      }, 80);
    };
    const hide = () => setSelection(null);
    const escape = event => { if (event.key === 'Escape') { setSelection(null); setMobileOpen(false); } };
    document.addEventListener('selectionchange', read); window.addEventListener('scroll', hide, { passive: true }); window.addEventListener('resize', hide); document.addEventListener('keydown', escape);
    return () => { clearTimeout(scheduled); document.removeEventListener('selectionchange', read); window.removeEventListener('scroll', hide); window.removeEventListener('resize', hide); document.removeEventListener('keydown', escape); };
  }, []);

  function activate(note, focus = false) {
    if (!note.anchor) { setLooseEditing(note.id); if (!dialog.current.open) dialog.current.showModal(); return; }
    setSelected(note.id); setTab('notes'); setMobileOpen(true);
    if (focus) requestAnimationFrame(() => { editor.current?.focus({ preventScroll: true }); });
  }
  function add(anchor = null, write = true) {
    if (!ready) return;
    const existing = anchor && notes.find(note => note.anchor?.block === anchor.block && note.anchor.exact === anchor.exact && note.anchor.start === anchor.start);
    if (existing) { activate(existing, write); setSelection(null); window.getSelection()?.removeAllRanges(); return; }
    const note = newNote('', anchor);
    latest.current.set(note.id, note); pending.current.set(note.id, note);
    setNotes(old => [note, ...old]); setStatuses(old => ({ ...old, [note.id]: 'saving' }));
    activate(note, write); setSelection(null); window.getSelection()?.removeAllRanges(); save(note);
    if (!write) notify('已添加划线');
  }
  function goTo(note) {
    activate(note);
    if (!note.anchor) { requestAnimationFrame(() => editor.current?.focus()); return; }
    const range = rangeForAnchor(article.current, note.anchor);
    if (!range) { notify('原文位置已变化，摘录和笔记仍保留'); return; }
    const element = range.startContainer.parentElement;
    element.closest('[data-anchor]').scrollIntoView({ behavior: smooth(), block: 'center' });
  }
  function paragraphAction(block) {
    const found = notes.find(note => note.anchor?.block === block);
    if (found) { activate(found, true); return; }
    add(anchorFor(block, paragraphs[block]));
  }
  function clickHighlight(event) {
    if (window.getSelection()?.toString()) return;
    const found = notes.find(note => {
      if (!note.anchor) return false;
      const range = rangeForAnchor(article.current, note.anchor);
      return range && [...range.getClientRects()].some(r => event.clientX >= r.left && event.clientX <= r.right && event.clientY >= r.top && event.clientY <= r.bottom);
    });
    if (found) activate(found, true);
  }
  async function remove(note) {
    clearTimeout(timers.current.get(note.id));
    try {
      await deleteNote(note.id);
      latest.current.delete(note.id); pending.current.delete(note.id);
      setNotes(old => old.filter(item => item.id !== note.id));
      if (selected === note.id) setSelected(null);
      notify('笔记已删除', async () => {
        try { await putNote(note); latest.current.set(note.id, note); setNotes(old => old.some(item => item.id === note.id) ? old : [note, ...old]); activate(note); setToast(null); }
        catch { notify('恢复失败，请保持页面打开后重试'); }
      });
    } catch { const draft = pending.current.get(note.id); if (draft) save(draft); notify('未能删除，原笔记已保留'); }
  }
  function openLibrary() { setLooseEditing(null); setSelection(null); setQuery(''); setBackupStatus(''); dialog.current.showModal(); }
  function exportBackup() {
    const url = URL.createObjectURL(new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), notes }, null, 2)], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = `VibePolaris-笔记-${new Date().toISOString().slice(0, 10)}.json`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); setBackupStatus('已导出当前笔记，包含尚未保存的编辑。');
  }
  async function importBackup(event) {
    const file = event.target.files?.[0]; event.target.value = '';
    if (!file) return;
    setImporting(true);
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('备份文件不能超过 5 MB');
      if (pending.current.size) throw new Error('请先等待笔记保存成功，再导入备份');
      const incoming = parseBackup(await file.text());
      const loaded = await importNotes(incoming);
      setNotes(loaded); loaded.forEach(note => latest.current.set(note.id, note)); setBackupStatus('导入完成，已有笔记已保留，重复内容已跳过。');
    } catch (error) { setBackupStatus(error instanceof SyntaxError ? '文件不是有效的笔记备份，已有笔记未改动。' : error.message); }
    finally { setImporting(false); }
  }
  function togglePalette() { document.documentElement.dataset.paper = document.documentElement.dataset.paper !== 'true'; }
  const looseNote = notes.find(note => note.id === looseEditing);
  const ordered = notes.filter(note => note.anchor && !unmatched.has(note.id)).sort((a,b) => Object.keys(paragraphs).indexOf(a.anchor.block) - Object.keys(paragraphs).indexOf(b.anchor.block) || a.anchor.start - b.anchor.start);
  const filtered = notes.filter(note => `${note.body} ${note.anchor?.exact ?? ''}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  function paragraph(block) {
    const marked = notes.some(note => note.anchor?.block === block);
    return <div className="paragraph" key={block}><p data-anchor={block} id={block}>{paragraphs[block]}</p><button className={`paragraph-action ${marked ? 'marked' : ''}`} aria-label={marked ? `查看此段批注：${block}` : `为此段写笔记：${block}`} title={marked ? '查看此段批注' : '为此段写笔记'} onClick={() => paragraphAction(block)} disabled={!ready}><NotePencil size={21} /></button></div>;
  }
  return <>
    <header className="topbar"><button className="brand" aria-label="回到文章开头" onClick={() => window.scrollTo({ top: 0, behavior: smooth() })}><span className="brand-mark" aria-hidden="true"><span className="brand-trail" /><span className="brand-star" /></span><b>VibePolaris</b><span className="slash">/</span><span className="chinese">Vibe指北</span></button><nav className="nav" aria-label="主导航"><span className="desktop-only">星图</span><span className="desktop-only">选型指南</span><span className="desktop-only">工具</span><button className="selected" onClick={openLibrary}>我的笔记</button><span className="desktop-only">关于</span><button className="palette" aria-label="切换纸面颜色" onClick={togglePalette}><Palette size={22}/></button></nav></header>
    <main className="page"><article className="article" ref={article} onClick={clickHighlight}>
      <div className="breadcrumb">Harness <span>/</span> 阅读笔记</div>
      <section id="roles-section"><h1>模型、 Harness 和工具</h1>{paragraph('roles')}{paragraph('tools')}{paragraph('division')}
        <div className="diagram" aria-label="模型提出下一步，Harness 检查与调度，工具执行操作"><div className="role"><Brain size={53} weight="light"/><b>模型</b><small>理解意图<br/>生成步骤</small></div><ArrowRight className="flow-arrow" size={40} weight="thin"/><div className="role"><FileText size={53} weight="light"/><b>Harness</b><small>按配置检查权限<br/>调用工具并保存结果</small></div><ArrowRight className="flow-arrow" size={40} weight="thin"/><div className="role"><FileCode size={53} weight="light"/><b>工具</b><small>实际操作<br/>例如读取文件或执行命令</small></div></div>
        <div className="article-end">{paragraph('cycle')}</div>
      </section>
      <section id="context-section"><h2>工具结果与下一轮输入</h2>{paragraph('context')}</section>
      <section id="boundary-section"><h2>测试与权限检查</h2>{paragraph('boundary')}</section>
    </article>
    <aside className={`rail ${mobileOpen ? 'mobile-open' : ''}`} aria-label="阅读笔记"><div className="rail-inner">
      <div className="rail-head" role="tablist" aria-label="阅读侧栏"><button role="tab" aria-selected={tab === 'toc'} aria-controls="toc-panel" id="toc-tab" onClick={() => setTab('toc')}>目录</button><button role="tab" aria-selected={tab === 'notes'} aria-controls="notes-panel" id="notes-tab" onClick={() => setTab('notes')}>批注</button><button className="add-note" onClick={() => add()} disabled={!ready}><Plus size={18}/>记一条</button><button className="close-mobile" aria-label="收起笔记" onClick={() => setMobileOpen(false)}><X size={21}/></button></div>
      {storageError && <div className="storage-alert" role="alert">浏览器暂时无法保存笔记。<button onClick={initialize}>重试</button></div>}
      {!highlightSupported && <div className="storage-alert">此浏览器暂不支持正文高亮，仍可通过段落笔记阅读摘录。</div>}
      {tab === 'toc' ? <nav className="toc" id="toc-panel" role="tabpanel" aria-labelledby="toc-tab">{[['roles-section','模型、Harness 和工具'],['context-section','工具结果与下一轮输入'],['boundary-section','测试与权限检查']].map(([id,label]) => <a key={id} href={`#${id}`} onClick={() => setMobileOpen(false)}>{label}</a>)}</nav> : <div className="notes" ref={margin} id="notes-panel" role="tabpanel" aria-labelledby="notes-tab">
        {!ready && !storageError && <div className="empty">正在读取本地笔记…</div>}
        {ready && !ordered.length && <div className="empty">选中一句话，留下你的想法。<button onClick={() => add()}>也可以直接记一条</button></div>}
        {ordered.map(note => <section className={`note ${selected === note.id ? 'active' : ''}`} key={note.id} data-note-id={note.id}><i className="margin-link" aria-hidden="true"/>
          {selected === note.id ? <><div className="note-header"><span>{note.anchor ? '我的想法' : '随手记'}</span><div className="note-actions">{note.anchor && <button className="icon-button" aria-label="回到这条笔记的原文" title="回到原文" onClick={() => goTo(note)}><ArrowSquareOut size={17}/></button>}<button className="icon-button" aria-label="删除这条笔记" title="删除笔记" onClick={() => remove(note)}><Trash size={17}/></button></div></div>
            {unmatched.has(note.id) && <button className="excerpt" onClick={() => goTo(note)}>{note.anchor.exact}</button>}
            <textarea className="note-body" ref={editor} aria-label="我的想法" placeholder={note.anchor ? '写下你的理解…' : '此刻想记住什么？'} value={note.body} maxLength={20000} rows={2} onChange={event => update(note,event.target.value)} onBlur={() => { const current = pending.current.get(note.id); if(current) save(current); }} />
            {unmatched.has(note.id) && <div className="unmatched">原文位置已变化，摘录仍保留。</div>}
            <div className="note-footer"><span className={`saved ${statuses[note.id] === 'error' ? 'save-error' : ''}`} aria-live="polite">{statuses[note.id] === 'error' ? <><span>未保存</span><button className="retry" onClick={() => save(latest.current.get(note.id))}>重试</button></> : statuses[note.id] === 'saving' ? '保存中…' : note.example ? <><FileText size={14}/>示例笔记</> : <><Check size={15}/>已保存在此浏览器</>}</span><time dateTime={note.updatedAt}>{date(note.updatedAt)}</time></div>
          </> : <><button className="note-text" onClick={() => { activate(note); if (note.anchor) goTo(note); }}><FileText size={21}/><span className="note-body">{note.body || note.anchor?.exact || '空白随手记'}</span></button><div className="note-footer"><span>{note.example ? '示例笔记' : note.anchor ? 'Harness' : '随手记'}</span><time dateTime={note.updatedAt}>{date(note.updatedAt)}</time></div></>}
        </section>)}
      </div>}
      <div className="rail-foot"><span>仅保存在此浏览器</span><button onClick={openLibrary}>全部笔记 <ArrowRight size={12}/></button></div>
    </div></aside></main>
    <button className="mobile-notes" onClick={() => {setMobileOpen(true);setTab('notes');}}><NotePencil size={20}/>笔记 {notes.length || ''}</button>
    {selection && !selection.error && <div className="selection-toolbar" role="toolbar" aria-label="选中文字操作" style={{left: Math.max(12, Math.min(window.innerWidth-245, selection.rect.right-233)), top: Math.max(82, selection.rect.top-64)}} onPointerDown={event => event.preventDefault()}><button disabled={!ready} onClick={() => add(selection.anchor,false)}><Highlighter size={19}/>划线</button><button disabled={!ready} onClick={() => add(selection.anchor,true)}><NotePencil size={19}/>写笔记</button></div>}
    {toast && <div className="toast" role="status"><span>{toast.message}</span>{toast.action ? <button onClick={toast.action}>撤销</button> : <button aria-label="关闭提示" onClick={() => setToast(null)}><X size={15}/></button>}</div>}
    <dialog ref={dialog} className="library" aria-labelledby="library-title"><header><h2 id="library-title">我的笔记</h2><button className="icon-button" aria-label="关闭我的笔记" onClick={() => dialog.current.close()}><X size={24}/></button></header><p className="privacy">仅保存在此浏览器，不上传服务器。</p><div className="library-tools"><label className="search"><MagnifyingGlass size={20}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="搜索笔记和原文" aria-label="搜索笔记和原文"/></label><button onClick={() => {dialog.current.close();add();}} disabled={!ready}><Plus size={18}/>新建</button><button onClick={exportBackup} disabled={!ready}><DownloadSimple size={18}/>导出备份</button><button onClick={() => fileInput.current.click()} disabled={!ready || importing}><UploadSimple size={18}/>{importing ? '导入中…' : '导入'}</button><input ref={fileInput} type="file" accept=".json,application/json" hidden onChange={importBackup}/></div>
      {looseNote ? <div className="loose-editor"><button className="back-notes" onClick={() => setLooseEditing(null)}>返回全部笔记</button><h3>随手记</h3><textarea ref={looseEditor} aria-label="随手记内容" placeholder="此刻想记住什么？" maxLength={20000} value={looseNote.body} onChange={event => update(looseNote,event.target.value)} onBlur={() => {const current = pending.current.get(looseNote.id); if(current) save(current);}}/><p role="status">{statuses[looseNote.id] === 'saving' ? '保存中…' : statuses[looseNote.id] === 'error' ? <button onClick={() => save(latest.current.get(looseNote.id))}>未保存，点击重试</button> : '已保存在此浏览器'}</p></div> : <div className="library-list">{filtered.length ? filtered.map(note => <div className="library-note" key={note.id}><button onClick={() => {dialog.current.close();goTo(note);}}><p>{note.body || (note.anchor ? '划线摘录' : '空白随手记')}</p>{note.anchor && <blockquote>{note.anchor.exact}</blockquote>}<small>{unmatched.has(note.id) ? '原文位置已变化' : note.example ? '示例笔记' : note.anchor ? 'Harness · 原文批注' : '随手记'} · {date(note.updatedAt)}</small></button><button className="icon-button" aria-label={`删除笔记：${note.body.slice(0,18) || '划线摘录'}`} onClick={() => remove(note)}><Trash size={18}/></button></div>) : <div className="empty">{query ? '没有找到匹配的笔记。' : '还没有笔记，先记下一个想法。'}</div>}</div>}
      <div className="library-undo" role="status">{toast?.action && <><span>{toast.message}</span><button onClick={toast.action}>撤销</button></>}</div><p className="backup-hint">清除浏览器的网站数据会删除笔记。导出一份备份，可以在换浏览器时导入。</p><div className="library-status" role="status">{backupStatus}</div>
    </dialog>
  </>;
}
