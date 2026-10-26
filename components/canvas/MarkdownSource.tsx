import { useImperativeHandle, useLayoutEffect, useRef, type Ref } from "react";
import { Compartment, EditorState, StateField, Transaction } from "@codemirror/state";
import { Decoration, EditorView, keymap, placeholder, WidgetType, type DecorationSet } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap, isolateHistory } from "@codemirror/commands";
import { markdownImageRanges } from "@/lib/markdown-images";
import type { MarkdownEdit } from "@/lib/markdown-editing";
import styles from "./CompletingTextarea.module.css";

export type MarkdownField = {
  readonly value: string; readonly selectionStart: number; readonly selectionEnd: number;
  readonly element: HTMLElement; readonly scrollDOM: HTMLElement;
  focus: () => void; setSelectionRange: (start: number, end: number) => void;
  replace: (edit: MarkdownEdit) => void; caretRect: () => { top: number; bottom: number; left: number; right: number } | null;
};
type Ghost = { text: string; label: string; onClick: () => void };
type Props = {
  ref: Ref<MarkdownField>; markdown: string; readOnly: boolean; helpId: string; ghost?: Ghost;
  onChange: (value: string) => void; onSelect: () => void; onFocus: () => void; onBlur: () => void; onScroll: () => void;
  onComposition: (active: boolean) => void; onReplaceImage: () => void;
};

class GhostWidget extends WidgetType {
  constructor(readonly ghost: Ghost) { super(); }
  toDOM() {
    const span = document.createElement("span"); span.className = styles.ghost; span.setAttribute("aria-hidden", "true");
    span.textContent = this.ghost.text;
    const button = span.appendChild(document.createElement("button")); button.type = "button"; button.tabIndex = -1; button.className = styles.hint;
    button.textContent = this.ghost.label; button.onpointerdown = event => event.preventDefault(); button.onclick = this.ghost.onClick;
    return span;
  }
}

export function MarkdownSource(props: Props) {
  const host = useRef<HTMLDivElement>(null), editor = useRef<EditorView | null>(null), callbacks = useRef(props);
  const disabled = useRef(new Compartment()), ghost = useRef(new Compartment());
  useLayoutEffect(() => { callbacks.current = props; });
  useImperativeHandle(props.ref, () => ({
    get value() { return editor.current!.state.doc.toString(); },
    get selectionStart() { return editor.current!.state.selection.main.from; },
    get selectionEnd() { return editor.current!.state.selection.main.to; },
    get element() { return editor.current!.contentDOM; },
    get scrollDOM() { return editor.current!.scrollDOM; },
    focus() {
      const view = editor.current;
      if (view) { view.focus(); view.dispatch({ effects: EditorView.scrollIntoView(view.state.selection.main.head, { y: "nearest" }) }); }
    },
    setSelectionRange(start, end) { editor.current?.dispatch({ selection: { anchor: start, head: end } }); },
    replace(edit) { editor.current?.dispatch({ changes: { from: edit.from, to: edit.to, insert: edit.text }, selection: { anchor: edit.start, head: edit.end }, annotations: [Transaction.userEvent.of("input.paste"), isolateHistory.of("full")] }); },
    caretRect() { const view = editor.current; return view?.coordsAtPos(view.state.selection.main.head) ?? null; },
  }), []);
  useLayoutEffect(() => {
    class ImageWidget extends WidgetType {
      constructor(readonly raw: string, readonly source: string, readonly alt: string) { super(); }
      eq(other: ImageWidget) { return this.raw === other.raw; }
      toDOM(view: EditorView) {
        const span = document.createElement("span"); span.className = styles.sourceImage; span.contentEditable = "false";
        const img = span.appendChild(document.createElement("img")); img.loading = "lazy"; img.decoding = "async"; img.src = this.source; img.alt = this.alt; img.draggable = false;
        img.onload = () => view.requestMeasure();
        const range = () => { const from = view.posAtDOM(span); return { from, to: from + this.raw.length }; };
        span.onclick = () => { const {from, to} = range(); view.dispatch({ selection: { anchor: from, head: to } }); view.focus(); };
        const actions = span.appendChild(document.createElement("span")); actions.className = styles.imageActions;
        for (const label of ["替换", "删除"]) {
          const button = actions.appendChild(document.createElement("button")); button.type = "button"; button.textContent = label; button.setAttribute("aria-label", `${label}图片：${this.alt}`);
          button.onmousedown = event => event.preventDefault();
          button.onclick = event => {
            event.stopPropagation(); if (view.state.readOnly) return;
            const {from, to} = range();
            if (view.state.doc.sliceString(from, to) !== this.raw) return;
            view.dispatch(label === "替换" ? { selection: { anchor: from, head: to } } : { changes: { from, to, insert: "" }, selection: { anchor: from }, annotations: [Transaction.userEvent.of("delete"), isolateHistory.of("full")] });
            view.focus(); if (label === "替换") callbacks.current.onReplaceImage();
          };
        }
        return span;
      }
    }
    function images(state: EditorState) {
      return Decoration.set(markdownImageRanges(state.doc.toString()).map(image => Decoration.replace({ widget: new ImageWidget(state.doc.sliceString(image.from, image.to), image.source, image.alt) }).range(image.from, image.to)));
    }
    const imageField = StateField.define<DecorationSet>({ create: images, update: (value, transaction) => transaction.docChanged ? images(transaction.state) : value, provide: field => EditorView.decorations.from(field) });
    const view = new EditorView({ parent: host.current!, state: EditorState.create({ doc: callbacks.current.markdown, extensions: [
      history(), keymap.of([...historyKeymap, ...defaultKeymap]), EditorView.lineWrapping, placeholder("直接写下想法，支持 Markdown…"), imageField,
      EditorView.atomicRanges.of(view => view.state.field(imageField)),
      disabled.current.of(EditorState.readOnly.of(callbacks.current.readOnly)), ghost.current.of([]),
      EditorView.contentAttributes.of({ "aria-label": "Markdown 正文", "aria-describedby": callbacks.current.helpId, "aria-keyshortcuts": "Meta+B Control+B Meta+I Control+I Meta+K Control+K Meta+Enter Control+Enter", spellcheck: "false" }),
      EditorView.updateListener.of(update => {
        if (update.docChanged) callbacks.current.onChange(update.state.doc.toString());
        if (update.selectionSet || update.docChanged) callbacks.current.onSelect();
      }),
      EditorView.domEventHandlers({ focus: () => { callbacks.current.onFocus(); }, blur: () => { callbacks.current.onBlur(); }, compositionstart: () => { callbacks.current.onComposition(true); }, compositionend: () => { callbacks.current.onComposition(false); } }),
    ] }) });
    const onScroll = () => callbacks.current.onScroll();
    view.scrollDOM.addEventListener("scroll", onScroll);
    editor.current = view; view.focus();
    return () => { editor.current = null; view.scrollDOM.removeEventListener("scroll", onScroll); view.destroy(); };
  }, []);
  useLayoutEffect(() => {
    const view = editor.current; if (!view) return;
    if (view.state.doc.toString() !== props.markdown) view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: props.markdown }, annotations: Transaction.addToHistory.of(false) });
    view.dispatch({ effects: [disabled.current.reconfigure(EditorState.readOnly.of(props.readOnly)), ghost.current.reconfigure(props.ghost ? EditorView.decorations.of(Decoration.set([Decoration.widget({ widget: new GhostWidget(props.ghost), side: 1 }).range(view.state.selection.main.head)])) : [])] });
    if (props.ghost?.text) view.dispatch({ effects: EditorView.scrollIntoView(view.state.selection.main.head, { y: "nearest" }) });
  }, [props.markdown, props.readOnly, props.ghost]);
  return <div ref={host} className={styles.source} />;
}
