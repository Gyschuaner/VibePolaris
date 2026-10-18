import type { CSSProperties, ReactNode } from "react";
import { Brain, Browser, Check, Cloud, Code, Cursor, Database, FileText, Key, LockKey, MagnifyingGlass, Monitor, ShieldCheck, User, Wrench, X } from "@phosphor-icons/react/dist/ssr";
import { conceptMotions, type ConceptMotionKind, type ConceptMotionSlug } from "@/lib/concept-motions";
import { ConceptMotionPlayer } from "./ConceptMotionPlayer";
import s from "./ConceptMotion.module.css";

type Study = typeof conceptMotions[ConceptMotionSlug];
const icons = { model: Brain, browser: Browser, cloud: Cloud, code: Code, pointer: Cursor, store: Database, file: FileText, key: Key, lock: LockKey, search: MagnifyingGlass, screen: Monitor, shield: ShieldCheck, user: User, tool: Wrench, check: Check, cross: X };
type MarkKind = keyof typeof icons;
const css = (values: Record<string, string | number>) => values as CSSProperties;
const caption = (a: string, b: string, c: string) => <>{text(a, 43, 111)}{text(b, 140, 111)}{text(c, 237, 111)}</>;
const text = (value: string, x: number, y: number, large = false) => <text key={`${value}-${x}-${y}`} x={x} y={y} className={large ? s.word : undefined}>{value}</text>;
const line = (d: string, accent = false, dash = false) => <path key={d} d={d} className={`${accent ? s.accent : s.faint} ${dash ? s.dash : ""}`} />;
const draw = (d: string, delay = 0) => <path key={d} d={d} pathLength={1} className={`${s.draw} ${s.accent}`} style={css({ "--delay": `${delay}s` })} />;
const dot = (x: number, y: number, r = 4, accent = true) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} className={`${accent ? s.accent : s.alt} ${s.solid}`} />;
function Mark({ kind, x, y, size = 28, tone = "accent" }: { kind: MarkKind; x: number; y: number; size?: number; tone?: "accent" | "alt" | "risk" | "faint" }) {
  const Icon = icons[kind];
  return <Icon x={x - size / 2} y={y - size / 2} width={size} height={size} weight="light" className={s[tone]} />;
}
function Move({ x = 0, y = 0, delay = 0, children, arrive = false }: { x?: number; y?: number; delay?: number; children: ReactNode; arrive?: boolean }) {
  return <g className={arrive ? s.arrive : s.shift} style={css({ "--x": `${x}px`, "--y": `${y}px`, "--delay": `${delay}s` })}>{children}</g>;
}
function Appear({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <g className={s.appear} style={css({ "--delay": `${delay}s` })}>{children}</g>;
}
function Packet({ path, delay = 0, kind, risk = false, leave = false }: { path: string; delay?: number; kind?: MarkKind; risk?: boolean; leave?: boolean }) {
  return <g className={leave ? `${s.travel} ${s.leave}` : s.travel} style={css({ offsetPath: `path("${path}")`, "--delay": `${delay}s` })}>{kind ? <Mark kind={kind} x={0} y={0} size={22} tone={risk ? "risk" : "accent"} /> : <circle r={4} className={`${s.solid} ${risk ? s.risk : s.accent}`} />}</g>;
}
function Turn({ children, angle = 90, origin, delay = 0 }: { children: ReactNode; angle?: number; origin?: string; delay?: number }) {
  return <g className={s.turn} style={css({ "--angle": `${angle}deg`, "--origin": origin ?? "center", "--delay": `${delay}s` })}>{children}</g>;
}
const rows = (x: number, y: number, n = 4, width = 40) => Array.from({ length: n }, (_, i) => line(`M${x} ${y + i * 9}h${width - (i % 2) * 9}`));
const ticks = (x: number, y: number, n = 7, step = 18) => Array.from({ length: n }, (_, i) => line(`M${x + i * step} ${y}v5`));
const ring = (x: number, y: number, r: number, dash = false) => <circle key={`ring-${x}-${y}-${r}`} cx={x} cy={y} r={r} className={`${s.faint} ${dash ? s.dash : ""}`} />;

function Scene({ study }: { study: Study }): ReactNode {
  const [kind, a, b, c] = study;
  const labels = caption(a, b, c);
  switch (kind) {
    case "guard": case "firewall": return <>
      {line("M30 43H253", false, true)}{line("M30 80H140", false, true)}
      <path d="M141 24v68m-6-68h12m-12 68h12" className={s.accent} />
      <Packet path="M32 43H241" kind="file" /><Packet path="M32 80H122" kind="file" delay={.7} risk />
      <Appear delay={1}><Mark kind="check" x={258} y={43} size={17} /><Mark kind="cross" x={143} y={80} size={16} tone="risk" /></Appear>
      {text(a, 50, 19)}{text(b, 145, 112)}{text(c, 50, 102)}
    </>;
    case "smoke": return <>
      {line("M25 77H251", false, true)}
      {[82, 112, 142, 172].map((x, i) => <g key={x}>{ring(x, 37, 9)}<Appear delay={i * .45}><Mark kind="check" x={x} y={37} size={16} /></Appear></g>)}
      <path d="M201 82v-7" className={s.accent} /><Turn angle={-80} origin="bottom center" delay={2.5}><path d="M201 75V49" className={s.accent} /></Turn>
      <Packet path="M30 77H177" kind="file" leave /><Packet path="M177 77H246" kind="file" delay={4.1} />
      {text(a, 82, 18)}{text(b, 112, 18)}{text("下单", 142, 18)}{text(c, 172, 18)}{text("少量检查 → 放行", 137, 111)}
    </>;
    case "harness": return <>
      <Mark kind="model" x={35} y={62} /><Mark kind="tool" x={245} y={62} />
      <circle cx={140} cy={62} r={17} className={`${s.accent} ${s.wash}`} />{dot(140, 62)}
      {draw("M55 53C89 18 107 18 126 47")}{draw("M155 48C179 19 207 19 229 51", .2)}
      {draw("M230 74C200 98 172 98 153 76", 1)}{draw("M126 77C101 100 72 98 51 75", 1.2)}
      <Packet path="M55 53Q93 6 126 47" leave /><Packet path="M155 48Q193 7 229 51" delay={1.7} leave /><Packet path="M230 74Q191 119 153 76" delay={3.4} />{labels}
    </>;
    case "roundtrip": case "duplex": case "serve": case "session": case "handshake": return <>
      <Mark kind={kind === "session" ? "user" : "browser"} x={33} y={62} /><Mark kind={kind === "roundtrip" ? "file" : "cloud"} x={247} y={62} />
      {line("M56 43H224", false, true)}{line("M224 81H56", false, true)}
      <Packet path="M58 43H220" kind={kind === "handshake" ? "key" : undefined} />
      <Packet path="M220 81H58" delay={1.8} kind={kind === "session" ? "key" : undefined} />
      {kind === "handshake" && <Appear delay={1.7}><Mark kind="lock" x={140} y={62} size={20} /></Appear>}
      {text(a, 35, 111)}{text(b, 140, 30)}{text(c, 246, 111)}
    </>;
    case "send": case "push": case "notify": case "launch": case "receive": case "fetch": case "return": return <>
      <Mark kind={kind === "notify" ? "cloud" : kind === "receive" ? "cloud" : "code"} x={35} y={62} />
      <Mark kind={kind === "receive" || kind === "return" ? "browser" : kind === "launch" ? "screen" : "cloud"} x={245} y={62} />
      {line("M57 62H221", false, true)}{draw("M62 62H213m-7-6 7 6-7 6", .4)}
      <Packet path="M61 62H218" kind={kind === "notify" ? undefined : "file"} />
      <Appear delay={1.1}><Mark kind="check" x={245} y={84} size={14} /></Appear>{labels}
    </>;
    case "curate": return <>
      {[30, 54, 78].map((y, i) => <g key={y}><Mark kind="file" x={52} y={y} size={19} tone={i === 1 ? "faint" : "accent"} />{i !== 1 && <Packet path={`M68 ${y}Q130 ${y} 184 60`} delay={i * .25} leave />}</g>)}
      <path d="M184 31h47v59h-47m9-43h29m-29 10h22m-22 10h29" className={s.alt} />
      <Appear delay={1.4}><path d="M193 47h29m-29 10h22" className={s.accent} strokeWidth={3} /></Appear>{labels}
    </>;
    case "gather": case "collect": case "consolidate": case "multimodal": return <>
      {[[-68, -27], [-84, 0], [-68, 27]].map(([dx, dy], i) => <g key={i}>
        {line(`M${140 + dx} ${60 + dy}Q140 ${60 + dy} 173 60`, false, true)}
        <Move x={dx} y={dy} arrive delay={i * .25}><Mark kind={kind === "multimodal" ? (["code", "screen", "cloud"] as const)[i] : "file"} x={166} y={60 + (i - 1) * 5} size={23} /></Move>
      </g>)}
      <path d="M196 31h10v59h-10" className={s.accent} />
      {text(a, 58, 111)}{text(b, 141, 111)}{text(c, 219, 111)}
    </>;
    case "capacity": case "overflow": case "budget": case "cost": return <>
      <path d="M42 38v44h193V38" className={s.alt} />{ticks(43, 86, 11, 19)}
      {Array.from({ length: 9 }, (_, i) => <Appear key={i} delay={i * .12}><rect x={50 + i * 19} y={49} width={13} height={26} rx={2} className={`${s.accent} ${s.wash}`} /></Appear>)}
      <Move x={-11} delay={1.3}><path d="M262 51v24" className={s.risk} /></Move>
      <path d="M237 26V93" className={`${s.risk} ${s.dash}`} />{text(a, 52, 111)}{text(b, 145, 111)}{text(c, 239, 111)}
    </>;
    case "memory": case "snapshot": case "local-store": return <>
      <Mark kind="store" x={141} y={62} size={40} />{line("M43 38Q88 19 128 44", false, true)}{line("M154 79Q205 99 239 73", false, true)}
      <Packet path="M43 38Q88 19 128 44" kind="file" /><Packet path="M154 79Q205 99 239 73" kind="file" delay={1.3} />
      <Mark kind="file" x={40} y={38} size={20} tone="faint" /><Mark kind="file" x={240} y={73} size={20} tone="faint" />{labels}
    </>;
    case "cycle": case "repeat": case "retry": case "optimize": case "spiral": return <>
      {line("M63 69C30 12 177 3 211 43C249 92 135 114 87 83", false, true)}
      {draw("M63 69C30 12 177 3 211 43C249 92 135 114 87 83")}
      <Packet path="M63 69C30 12 177 3 211 43C249 92 135 114 87 83" kind={kind === "retry" ? "file" : undefined} />
      <Mark kind={kind === "cycle" ? "tool" : kind === "retry" ? "cross" : "code"} x={135} y={56} tone={kind === "retry" ? "risk" : "accent"} />
      <Appear delay={1.4}><Mark kind="check" x={89} y={82} size={16} /></Appear>{labels}
    </>;
    case "write": case "typing": case "rewrite": case "interpret": return <>
      {rows(38, 33, 3, 87)}
      <g className={s.typing}>{text(kind === "write" ? `${a}，${b}` : kind === "rewrite" ? `${a} → ${b}` : "const result = …", 143, 77, true)}<path d="M232 65v17" className={s.accent} /></g>
      {kind === "interpret" && <Move y={18}><path d="m27 28 5 5-5 5" className={s.accent} /></Move>}{text(c, 140, 111)}
    </>;
    case "socket": case "couple": case "contract": case "hook": return <>
      <Move x={-36} arrive><path d="M102 44h16v12h13v12h-13v12h-16" className={s.accent} /></Move>
      <Move x={36} arrive><path d="M177 44h-16v12h-13v12h13v12h16" className={s.alt} /></Move>
      {line("M40 62h45", false, true)}{line("M196 62h45", false, true)}
      <Appear delay={1.2}>{dot(140, 62, 3)}<Mark kind="check" x={140} y={29} size={14} /></Appear>{labels}
    </>;
    case "boundary": case "scope": case "threat": case "trim": return <>
      <ellipse cx={137} cy={60} rx={62} ry={37} className={`${s.alt} ${s.dash}`} />
      <Mark kind={kind === "scope" ? "file" : "code"} x={136} y={59} />
      <Packet path="M109 42L164 74" />
      <Packet path="M167 45L194 32" risk delay={.5} />
      <Appear delay={1}><Mark kind="cross" x={201} y={30} size={17} tone="risk" /></Appear>
      {text(a, 136, 15)}{text(b, 140, 111)}{text(c, 242, 61)}
    </>;
    case "pieces": case "cut": case "split-code": case "packet": return <>
      {line("M34 58H245")}
      {[0, 1, 2, 3].map((i) => <Move key={i} x={(i - 1.5) * 8} y={i % 2 ? 12 : -12}><path d={`M${62 + i * 40} 51h30m-30 7h23m-23 7h30`} className={s.accent} /></Move>)}
      {[91, 131, 171].map(x => <Appear key={x}><path d={`M${x} 26v58`} className={`${s.alt} ${s.dash}`} /></Appear>)}
      {text(a, 48, 111)}{text(b, 140, 111)}{text(c, 236, 111)}
    </>;
    case "predict": case "generate": case "sequence": case "direct": return <>
      {text(a, 53, 61, true)}{line("M88 58H118", false, true)}<Mark kind="model" x={144} y={58} size={35} />
      <g className={s.typing}>{text(c === "下一词" ? b : c, 221, 62, true)}</g>
      {line("M170 58h22", false, true)}<Appear delay={1.2}><path d="M205 78h34" className={s.accent} /></Appear>{text(b, 140, 111)}
    </>;
    case "agent": case "journey": case "trajectory": case "computer": case "observe": return <>
      {line("M32 76C64 76 69 36 106 36S150 81 180 69S213 29 248 40", false, true)}
      <Packet path="M32 76C64 76 69 36 106 36S150 81 180 69S213 29 248 40" kind={kind === "agent" ? "model" : kind === "observe" ? "user" : undefined} />
      {ring(248, 40, 12)}{ring(248, 40, 5)}
      {kind === "observe" && <Mark kind="search" x={147} y={30} size={18} />}
      {kind === "computer" && <Mark kind="screen" x={141} y={62} size={52} tone="faint" />}{labels}
    </>;
    case "assemble": case "monolith": case "scaffold": case "build": case "minimal": return <>
      {[[113, 36, -58, -14], [143, 36, 58, -14], [113, 66, -58, 14], [143, 66, 58, 14]].map(([x, y, dx, dy], i) => <Move key={i} x={dx} y={dy} arrive delay={i * .12}><rect x={x} y={y} width={25} height={25} rx={3} className={i === 0 ? `${s.accent} ${s.wash}` : s.alt} /><path d={`M${x + 8} ${y + 12}h9`} className={s.accent} /></Move>)}
      {kind === "minimal" && <g className={s.vanish}>{ring(72, 61, 6)}{ring(210, 51, 7)}{ring(206, 82, 5)}</g>}{labels}
    </>;
    case "inlet": case "bind": case "call": case "function": case "runtime": return <>
      <path d="M117 29h-9v62h9m46-62h9v62h-9" className={s.alt} />
      <Mark kind={kind === "runtime" ? "code" : "tool"} x={140} y={61} size={25} />
      <Packet path="M31 61H98" leave /><Packet path="M182 61H248" delay={1.8} />
      {text(a, 49, 111)}{text(b, 140, 111)}{text(c, 237, 111)}
    </>;
    case "toggle": case "toggle-route": case "feedback": case "spring": case "optimistic": return <>
      <path d="M112 43h56a18 18 0 0 1 0 36h-56a18 18 0 0 1 0-36Z" className={`${s.alt} ${s.wash}`} />
      <Move x={52}><circle cx={114} cy={61} r={12} className={`${s.accent} ${s.solid}`} /></Move>
      <Appear delay={1}>{text(kind === "toggle" ? b : "✓", 224, 68, true)}</Appear>
      <g className={kind === "toggle" ? s.vanish : undefined}>{text(a, 53, 66, true)}</g>{text(c, 140, 111)}
    </>;
    case "ripple": case "touch": case "gesture": case "prototype": return <>
      {[12, 24, 36].map((r, i) => <g key={r} className={s.pulse} style={css({ "--delay": `${i * .2}s` })}>{ring(140, 60, r)}</g>)}
      {dot(140, 60, 5)}<Packet path={kind === "gesture" ? "M86 68Q135 35 191 58" : "M180 89L146 65"} kind="pointer" />
      {kind === "touch" && <path d="M103 25h74v71h-74Z" className={`${s.alt} ${s.dash}`} />}{labels}
    </>;
    case "bubble": return <>
      <path d="M64 31h153v54H64m26-41h101v30H90m26-18h49v6h-49" className={s.alt} />
      <Packet path="M140 60L140 74L191 74L217 85L244 97" />
      {text(a, 140, 19)}{text(b, 178, 101)}{text(c, 53, 101)}
    </>;
    case "sync": case "reconcile": case "replace": case "hydrate": return <>
      {rows(40, 39, 5, 37)}{rows(204, 39, 5, 37)}
      <g className={s.vanish}>{line("M83 49H196", true, true)}</g>
      <Appear delay={.6}>{draw("M83 66H196")}<Mark kind="check" x={140} y={66} size={17} /></Appear>
      {kind === "replace" && <Move y={-37} arrive><rect x={205} y={57} width={34} height={9} rx={2} className={`${s.accent} ${s.wash}`} /></Move>}
      {labels}
    </>;
    case "promise": case "clock": case "latency": case "lifecycle": return <>
      {ring(140, 59, 30)}{ticks(84, 101, 7)}
      <Turn angle={kind === "clock" ? 270 : 200}><path d="M140 59V36m0 23 17 7" className={s.accent} /></Turn>
      <Appear delay={1.2}><Mark kind={kind === "clock" ? "cross" : "check"} x={198} y={61} size={20} tone={kind === "clock" ? "risk" : "accent"} /></Appear>
      {text(a, 48, 60)}{text(c, 225, 91)}{text(b, 140, 123)}
    </>;
    case "wait": return <>
      {line("M39 41H244", false, true)}{line("M39 79H244", false, true)}
      <Packet path="M39 41H127" /><Packet path="M39 79H244" delay={.2} />
      <g className={s.vanish} style={css({ "--delay": "1.8s" })}><Mark kind="lock" x={140} y={41} size={17} /></g><Packet path="M153 41H244" delay={3.6} />
      {text(a, 140, 24)}{text(b, 140, 103)}{text(c, 243, 24)}
    </>;
    case "braces": case "schema": case "structure": case "stencil": case "form": case "typecheck": return <>
      <path d="M111 28c-10 0-10 0-10 14v10c0 8-5 10-10 10 5 0 10 2 10 10v9c0 14 0 14 10 14m58-67c10 0 10 0 10 14v10c0 8 5 10 10 10-5 0-10 2-10 10v9c0 14 0 14-10 14" className={s.alt} />
      {[40, 60, 80].map((y, i) => <Move key={y} x={-65} arrive delay={i * .2}><path d={`M121 ${y}h13m9 0h15`} className={s.accent} /></Move>)}
      {kind === "stencil" && <Move x={18} y={-18}><Mark kind="cross" x={215} y={69} size={17} tone="risk" /></Move>}
      <Appear delay={1.2}><Mark kind="check" x={221} y={61} size={18} /></Appear>{labels}
    </>;
    case "envelope": case "tag": case "cookie": case "manifest": case "seal": return <>
      <path d="M105 40h72v44h-72Z" className={s.alt} />
      <path d="m105 40 36 24 36-24" className={s.alt} />
      <Move x={-55} y={-14} arrive><Mark kind={kind === "seal" || kind === "cookie" ? "key" : "file"} x={141} y={52} size={22} /></Move>
      <Appear delay={1}><Mark kind={kind === "seal" ? "shield" : "check"} x={181} y={81} size={22} /></Appear>{labels}
    </>;
    case "verbs": case "resource": return <>
      <Mark kind="file" x={141} y={59} size={37} />
      {line("M44 36Q95 15 122 43", false, true)}{line("M159 77Q193 100 242 78", false, true)}
      <Packet path="M44 36Q95 15 122 43" /><Packet path="M159 77Q193 100 242 78" delay={.8} />
      <Appear delay={.8}><path d="M133 61h16m-16 7h11" className={s.accent} /></Appear>{labels}
    </>;
    case "signal": case "binary": case "stamp": case "equal": case "case": return <>
      {[65, 140, 215].map((x, i) => <g key={x}>{ring(x, 58, 17)}<Appear delay={i * .25}><Mark kind={i === 1 || kind === "equal" ? "check" : "cross"} x={x} y={58} size={18} tone={i === 1 || kind === "equal" ? "accent" : "risk"} /></Appear></g>)}
      {kind === "equal" && <path d="M101 55h11m-11 6h11M175 55h11m-11 6h11" className={s.alt} />}{labels}
    </>;
    case "address": case "hostname": case "url": case "dns": case "deep-link": case "discovery": return <>
      {text(a, 79, 34, true)}{draw("M83 43Q83 80 155 62")}
      <Mark kind={kind === "deep-link" ? "screen" : "cloud"} x={190} y={61} size={38} />
      <Packet path="M83 43Q83 80 155 62" />
      <Appear delay={.8}>{dot(192, 62, 4)}</Appear>{text(b, 83, 104)}{text(c, 202, 104)}
    </>;
    case "query": case "select": case "sieve": case "text-search": case "secret": case "scan": return <>
      {rows(63, 31, 7, 147)}
      <Move y={39}><Mark kind="search" x={215} y={35} size={26} /><path d="M60 36h132" className={s.accent} /></Move>
      <Appear delay={1}><path d="M86 73h67" className={kind === "secret" ? s.risk : s.accent} strokeWidth={4} /></Appear>{labels}
    </>;
    case "pages": return <>
      {rows(50, 31, 7, 37)}{rows(121, 31, 7, 37)}{rows(192, 31, 7, 37)}
      <Move x={71}><path d="M46 25h47v69H46Z" className={s.accent} /></Move>{labels}
    </>;
    case "queue": return <>
      {line("M25 61H252", false, true)}
      {[61, 99, 137].map((x, i) => <Move key={x} x={38} delay={1.7 + i * .12}>{dot(x, 61, 6, i !== 1)}</Move>)}
      <Packet path="M175 61H248" leave />
      <Move x={-35} arrive delay={2.2}>{dot(61, 61, 6)}</Move>
      {text(a, 38, 111)}{text(b, 140, 31)}{text(c, 239, 111)}
    </>;
    case "throttle": case "backpressure": case "deadletter": return <>
      {line("M23 61H250", false, true)}
      {[43, 74, 105, 136].map((x, i) => <Move key={x} x={kind === "backpressure" ? 20 : 39} delay={i * .15}>{dot(x, 61, 6, i !== 1)}</Move>)}
      {kind === "deadletter" ? <><Packet path="M173 61Q203 61 211 88" risk delay={.7} />{line("M189 88h48")}</> : <Packet path="M178 61H248" delay={.8} />}
      {kind === "throttle" && <path d="M166 33v57m-6-57h12" className={s.accent} />}
      {kind === "backpressure" && draw("M235 29Q196 8 161 29m7-1-7 1 2-7", 1)}{labels}
    </>;
    case "unique": return <>
      {rows(165, 31, 6, 62)}{text("42", 145, 62, true)}
      <Packet path="M35 36Q106 12 169 36" kind="file" leave /><Appear delay={1.2}><Mark kind="check" x={242} y={37} size={17} /></Appear>
      <Packet path="M35 79Q90 105 129 67" kind="file" risk /><Appear delay={1.8}><Mark kind="cross" x={132} y={79} size={17} tone="risk" /></Appear>{labels}
    </>;
    case "dedupe": return <>
      {[35, 58, 81].map((x, i) => <g key={x}><Mark kind="file" x={x} y={50 + i * 12} size={21} /><Packet path={`M${x} ${50 + i * 12}Q140 62 181 62`} delay={i * .25} /></g>)}
      <path d="M160 29v61" className={`${s.alt} ${s.dash}`} /><Appear delay={1}><Mark kind="file" x={217} y={62} size={27} /><Mark kind="check" x={238} y={62} size={16} /></Appear>{labels}
    </>;
    case "pool": return <>
      {[90, 124, 158].map((x, i) => <g key={x}>{ring(x, 60, 11)}{i !== 1 && <Mark kind="key" x={x} y={60} size={16} tone="alt" />}</g>)}
      <Mark kind="code" x={237} y={60} size={29} />
      {line("M124 46Q173 5 224 46", false, true)}{line("M223 75Q166 110 124 74", false, true)}
      <Packet path="M124 46Q173 5 224 46" kind="key" leave /><Packet path="M223 75Q166 110 124 74" delay={1.8} kind="key" />{labels}
    </>;
    case "store": case "locked-store": return <>
      <Mark kind="store" x={140} y={59} size={50} />
      <Packet path="M41 40Q73 7 118 43" kind={kind === "locked-store" ? "lock" : "file"} />
      <Packet path="M163 78Q209 109 240 69" delay={1.8} />
      {kind === "locked-store" && <Mark kind="lock" x={144} y={61} size={20} />}{labels}
    </>;
    case "index": return <>
      {rows(166, 27, 7, 63)}
      {line("M62 29V87", false, true)}{ticks(59, 29, 5, 0)}
      <Mark kind="search" x={49} y={61} size={24} />{draw("M68 61H153m-7-5 7 5-7 5")}
      <Appear delay={.6}><path d="M166 63h57" className={s.accent} strokeWidth={3} /></Appear>{labels}
    </>;
    case "atomic": return <>
      {ring(140, 60, 36)}{line("M112 60H168", true)}
      {[117, 163].map((x, i) => <g key={x}>{text(i ? "+10" : "−10", x, 64, true)}<Appear delay={1}><Mark kind="check" x={x} y={87} size={15} /></Appear></g>)}
      <path d="M97 29h-6v61h6m86-61h6v61h-6" className={s.alt} />{labels}
    </>;
    case "grid": case "row": case "column": case "tables": case "dataset": return <>
      <path d="M62 27h156v65H62Zm0 16h156m-156 16h156m-156 16h156M101 27v65m39-65v65m39-65v65" className={s.faint} />
      <Move x={kind === "column" ? -39 : 0} y={kind === "row" ? -16 : 0} arrive><rect x={kind === "column" ? 101 : 62} y={kind === "column" ? 27 : 59} width={kind === "column" ? 39 : 156} height={kind === "column" ? 65 : 16} className={`${s.accent} ${s.wash}`} /></Move>
      {kind === "grid" && <Appear delay={.9}><circle cx={120} cy={67} r={4} className={`${s.solid} ${s.accent}`} /></Appear>}{labels}
    </>;
    case "join": case "identity": return <>
      {rows(46, 31, 6, 53)}{rows(184, 31, 6, 53)}
      <path d="M49 57h39m100-9h42" className={s.accent} strokeWidth={3} />
      {draw("M99 57C138 57 142 48 177 48")}
      <Packet path="M99 57C138 57 142 48 177 48" delay={.3} />{text(a, 65, 111)}{text(b, 140, 25)}{text(c, 212, 111)}
    </>;
    case "migrate": case "diff": case "align": case "translate": case "transform": case "compile": return <>
      {rows(36, 38, 5, 65)}{line("M115 61h46", false, true)}
      {[38, 47, 56, 65, 74].map((y, i) => <Move key={y} x={kind === "align" ? (i % 2) * -11 : -20} arrive delay={i * .1}><path d={`M181 ${y}h${kind === "translate" ? 60 - (i % 2) * 18 : 59}`} className={i === 2 ? s.accent : s.alt} /></Move>)}
      {kind === "migrate" && <Appear><path d="M229 31v51m-10-51v51" className={s.accent} /></Appear>}{labels}
    </>;
    case "replicate": return <>
      <Mark kind="store" x={69} y={60} size={43} /><Mark kind="store" x={213} y={60} size={43} tone="alt" />
      {dot(68, 61, 3)}<g className={s.vanish}>{text("旧", 213, 67)}</g>
      {line("M101 60H180", false, true)}<Packet path="M101 60H180" delay={.7} leave />
      <Appear delay={2.4}>{dot(212, 61, 3)}</Appear>{labels}
    </>;
    case "clone": return <>
      <Mark kind="store" x={72} y={59} size={43} /><Mark kind="store" x={208} y={59} size={43} tone="alt" />
      {line("M102 60H179", false, true)}<Packet path="M102 60H179" kind="file" />
      <Appear delay={1}>{dot(69, 57, 3)}{dot(205, 57, 3)}</Appear>{labels}
    </>;
    case "shard": case "distribute": case "route": case "gateway": case "ports": case "experts": case "tool-select": return <>
      <Mark kind={kind === "tool-select" ? "model" : "file"} x={36} y={61} size={25} />
      {[[226, 29], [243, 61], [226, 91]].map(([x, y], i) => <g key={y}>{line(`M59 61H119Q157 61 ${x - 19} ${y}`, false, true)}<Mark kind={kind === "tool-select" ? (["search", "tool", "code"] as const)[i] : "cloud"} x={x} y={y} size={21} tone={i === 1 ? "accent" : "faint"} /></g>)}
      {dot(130, 61, 7)}<Packet path="M59 61H217" />
      {kind === "distribute" && <Packet path="M59 61H119Q157 61 207 29" delay={.7} />}
      {text(a, 41, 111)}{text(b, 137, 24)}{text(c, 236, 119)}
    </>;
    case "consent": return <>
      {line("M31 69H248", false, true)}
      <Packet path="M31 69H120" kind="file" leave />
      <Mark kind="user" x={141} y={42} size={28} /><path d="M141 63v21" className={s.alt} />
      <Appear delay={1.5}><Mark kind="check" x={160} y={43} size={16} /></Appear>
      <Packet path="M166 69H247" delay={3.4} />{labels}
    </>;
    case "cors": return <>
      <Mark kind="cloud" x={39} y={60} size={29} /><Mark kind="browser" x={155} y={60} size={44} tone="alt" /><Mark kind="code" x={242} y={60} size={24} />
      <Packet path="M61 60H130" kind="file" leave />
      <path d="M190 31v59" className={s.alt} /><Appear delay={1.7}><Mark kind="check" x={190} y={28} size={16} /></Appear>
      <Packet path="M172 60H222" delay={3.1} />{labels}
    </>;
    case "circuit": return <>
      {line("M34 63H118")}{line("M158 63H247")}
      <Turn angle={-45} origin="left center"><path d="M118 63h40" className={s.accent} /></Turn>
      {[0, 1, 2].map(i => <Appear key={i} delay={i * .3}><Mark kind="cross" x={55 + i * 22} y={34} size={13} tone="risk" /></Appear>)}
      <Packet path="M35 63H108" leave />{draw("M116 86Q141 108 162 83", 3.2)}<Packet path="M116 86Q141 108 162 83" delay={4} />{labels}
    </>;
    case "fallback": case "fork": case "permission": return <>
      {line("M30 63H128Q171 63 213 34", false, true)}{line("M128 63Q171 63 230 87", false, true)}
      <Packet path="M30 63H128Q171 63 201 42" />
      <Mark kind={kind === "permission" ? "key" : "lock"} x={139} y={61} size={27} />
      <Appear delay={.7}><Mark kind="cross" x={224} y={29} size={17} tone="risk" /></Appear>
      <Packet path="M143 66Q179 66 232 87" delay={1.2} />{text(a, 51, 111)}{text(b, 139, 25)}{text(c, 231, 111)}
    </>;
    case "batch": case "bundle": case "compress": case "hash": case "distill": return <>
      {[-22, -7, 8, 23].map((dy, i) => <g key={dy}>{line(`M42 ${61 + dy}L119 ${61 + dy / 3}`, false, true)}<Packet path={`M42 ${61 + dy}L130 ${61 + dy / 3}`} delay={i * .15} /></g>)}
      <path d="M126 32v59m12-55v51" className={s.alt} />
      <Appear delay={.8}><rect x={165} y={46} width={52} height={29} rx={3} className={`${s.accent} ${s.wash}`} />{kind === "hash" ? text("a8f2", 191, 65, true) : <path d="M176 54h30m-30 7h30m-30 7h20" className={s.accent} />}</Appear>{labels}
    </>;
    case "stream": case "pipeline": case "chain": case "process": case "outcome": return <>
      {line("M25 61H254", false, true)}
      {[87, 175].map((x) => <path key={x} d={`M${x} 38v46m-5-46h10m-10 46h10`} className={s.alt} />)}
      <Packet path="M30 61H79" /><Packet path="M95 61H166" delay={.65} kind="file" /><Packet path="M184 61H246" delay={1.3} />
      {kind === "process" && <Appear><Mark kind="check" x={92} y={27} size={15} /><Mark kind="check" x={178} y={27} size={15} /></Appear>}
      {kind === "outcome" && <Appear delay={1.4}><Mark kind="check" x={251} y={42} size={15} /></Appear>}{labels}
    </>;
    case "broadcast": case "orchestrate": case "delegate": case "network": case "dependencies": case "dependencies-scan": case "roles": return <>
      {[[51, 36], [57, 85], [224, 29], [230, 83]].map(([x, y], i) => <g key={x}>{line(`M140 60L${x} ${y}`, false, true)}{ring(x, y, 10)}<Packet path={`M140 60L${x} ${y}`} delay={i * .15} risk={kind === "dependencies-scan" && i === 3} /></g>)}
      <Mark kind={kind === "roles" ? "user" : kind === "delegate" ? "model" : "cloud"} x={140} y={60} size={31} />
      {kind === "delegate" && <Packet path="M230 83L149 64" delay={1.2} />}{labels}
    </>;
    case "lineage": case "trace": case "resolver": case "telemetry": return <>
      {line("M34 77Q79 77 100 41T178 41Q205 82 246 74", false, true)}
      {[34, 105, 177, 246].map((x, i) => <g key={x}>{ring(x, i === 0 || i === 3 ? 76 : 39, 7)}</g>)}
      <Packet path="M246 74Q205 82 178 41T100 41Q79 77 34 77" />{labels}
    </>;
    case "overlap": return <>
      <Move x={-29} arrive><circle cx={112} cy={61} r={38} className={s.alt} /></Move>
      <Move x={29} arrive><circle cx={168} cy={61} r={38} className={s.alt} /></Move>
      {[[95, 45], [89, 71], [184, 44], [194, 71]].map(([x, y]) => dot(x, y, 3, false))}
      <Appear delay={1.4}>{dot(140, 51, 4)}{dot(140, 72, 4)}<path d="M135 42h10m-10 39h10" className={s.risk} /></Appear>{labels}
    </>;
    case "embedding": case "neighbors": case "outlier": return <>
      <path d="M64 24v67h160" className={s.faint} />
      {[[96, 58], [114, 44], [126, 68], [143, 51], [157, 39], [183, 75], [201, 43]].map(([x, y], i) => <g key={x}>{dot(x, y, 3, i < 4)}</g>)}
      <Move x={-45} y={-12} arrive><circle cx={132} cy={58} r={5} className={`${s.accent} ${s.solid}`} /></Move>
      {kind === "outlier" ? <Appear><circle cx={237} cy={29} r={5} className={s.risk} /></Appear> : <Appear><ellipse cx={126} cy={55} rx={43} ry={25} className={`${s.accent} ${s.dash}`} /></Appear>}{labels}
    </>;
    case "rag": case "graph-rag": case "retrieve": return <>
      <Mark kind="search" x={43} y={60} size={27} />
      {kind === "graph-rag" ? <>{line("M99 35L129 53L105 80L152 77L129 53L153 30", false)}{dot(99, 35, 3)}{dot(129, 53, 3)}{dot(105, 80, 3)}{dot(152, 77, 3)}</> : <>{rows(98, 31, 6, 52)}<path d="M98 58h39" className={s.accent} strokeWidth={3} /></>}
      <Packet path="M149 58Q181 37 209 58" kind="file" delay={.5} />
      <Mark kind={kind === "retrieve" ? "file" : "model"} x={236} y={61} size={31} />{labels}
    </>;
    case "rank": return <>
      {[76, 53, 111, 35].map((width, i) => <Move key={i} y={i === 0 ? 36 : i === 2 ? -36 : 0} delay={i * .1}><path d={`M80 ${31 + i * 18}h${width}`} className={i === 2 ? s.accent : s.alt} strokeWidth={5} />{dot(63, 31 + i * 18, i === 2 ? 5 : 3, i === 2)}</Move>)}{labels}
    </>;
    case "spread": return <>
      {line("M48 89H235")}
      {[49, 37, 27, 21, 16].map((h, i) => <path key={i} d={`M${64 + i * 37} 83v-${h}`} className={`${s.accent} ${s.reshape}`} strokeWidth={9} style={css({ "--scale": [1.5, .6, .4, .2, .15][i] })} />)}{labels}
    </>;
    case "logits": return <>
      {line("M48 62H236")}
      {[31, -19, 12, 42, -27].map((h, i) => <path key={i} d={`M${64 + i * 37} 62v${-h}`} className={`${h > 0 ? s.accent : s.alt} ${s.draw}`} pathLength={1} strokeWidth={8} />)}{labels}
    </>;
    case "normalize": case "normalize-layer": return <>
      {rows(45, 36, 4, 52)}{line("M116 61h38", false, true)}
      {[12, 29, 72].map((w, i) => <path key={i} d={`M172 ${39 + i * 22}h${w}`} className={`${s.accent} ${s.grow}`} strokeWidth={5} />)}
      {kind === "normalize" && text("Σ = 1", 216, 21)}{labels}
    </>;
    case "quantize": return <>
      {line("M50 75H235")}{ticks(52, 76, 10, 20)}
      {[0, 1, 2, 3, 4].map((i) => <Move key={i} x={[-6, 8, -9, 4, -5][i]} y={21} delay={i * .1}>{dot(78 + i * 34, 51, 4)}</Move>)}{labels}
    </>;
    case "calibrate": return <>
      <path d="M74 24v67h141m-140-1 114-62" className={`${s.alt} ${s.dash}`} />
      {[[92, 38, 40], [126, 49, 9], [168, 68, -32], [199, 51, -31]].map(([x, y, dy], i) => <Move key={x} y={dy} delay={i * .1}>{dot(x, y, 4)}</Move>)}{labels}
    </>;
    case "bars": case "rubric": return <>
      {line("M48 88H234")}
      {[44, 26, 59, 37, 48].map((h, i) => <g key={i}>
        <path d={`M${65 + i * 36} 83v-${h}`} className={`${i === 2 ? s.accent : s.alt} ${s.rise}`} strokeWidth={8} style={css({ "--delay": `${i * .16}s` })} />
      </g>)}{labels}
    </>;
    case "citation": case "anchor": case "unsupported": return <>
      {rows(42, 34, 3, 79)}{rows(184, 55, 4, 53)}
      <path d="M42 60h72" className={s.accent} strokeWidth={2.5} />
      {kind === "unsupported" ? <><path d="M112 65Q145 87 172 73" className={`${s.risk} ${s.dash}`} /><Mark kind="cross" x={148} y={78} size={17} tone="risk" /></> : <>{draw("M112 60Q151 97 184 64")}<Packet path="M112 60Q151 97 184 64" /></>}{labels}
    </>;
    case "measure": case "gap": case "ratio": return <>
      {line("M44 75H236")}{ticks(44, 76, 11, 19)}
      <Move x={-67} arrive><path d="M177 32v47m-5-47h10" className={s.accent} /></Move>
      {text(kind === "ratio" ? "30%" : kind === "gap" ? "↔" : "✓", 141, 55, true)}{labels}
    </>;
    case "cache-prefix": return <>
      {[0, 1, 2, 3, 4].map(i => <g key={i}><path d={`M${44 + i * 27} 43h18m-18 32h18`} className={s.alt} strokeWidth={5} /></g>)}
      <path d="M41 26h139m-139 65h139" className={s.accent} />
      <Move x={36} arrive><path d="M195 75h42" className={s.accent} strokeWidth={5} /></Move>{labels}
    </>;
    case "cache": case "cdn": case "freshness": return <>
      <Mark kind="browser" x={34} y={65} size={25} /><Mark kind="store" x={140} y={34} size={26} /><Mark kind="cloud" x={246} y={66} size={27} />
      {line("M55 72Q140 111 226 72", false, true)}{draw("M55 57Q97 11 126 30", .5)}{draw("M126 38Q86 46 54 62", 1.1)}
      <Packet path="M55 72Q140 111 226 72" /><Packet path="M126 38Q86 46 54 62" delay={1.2} />{text(a, 42, 112)}{text(b, 142, 13)}{text(c, 236, 112)}
    </>;
    case "key": case "pin": return <>
      <Move x={-51} arrive><Mark kind="key" x={126} y={61} size={35} /></Move><Mark kind="lock" x={170} y={61} size={37} tone="alt" />
      <Appear delay={1}><Mark kind="check" x={221} y={61} size={22} /></Appear>{labels}
    </>;
    case "injection": case "escape": case "shortcut": return <>
      {line("M33 44H242", false, true)}<path d="M161 25v68" className={s.alt} />
      <Packet path="M37 44H145" kind="file" />
      {draw("M71 78C105 109 186 107 211 58", .5)}<Packet path="M71 78C105 109 186 107 211 58" risk delay={.5} />
      <Mark kind={kind === "shortcut" ? "check" : "cross"} x={225} y={54} tone="risk" size={19} />{labels}
    </>;
    case "preference": case "preference-direct": return <>
      {rows(43, 31, 3, 40)}{rows(43, 72, 3, 40)}
      <Mark kind={kind === "preference" ? "user" : "model"} x={142} y={61} size={30} />
      {draw("M85 42Q115 42 128 53")}{line("M85 83Q115 83 128 70", false, true)}
      <Appear delay={1}><Mark kind="check" x={95} y={31} size={14} /></Appear>
      <Packet path="M159 61H223" delay={1.7} /><Mark kind="model" x={240} y={61} size={28} />
      {draw("M236 81Q170 112 146 84", 2.3)}{labels}
    </>;
    case "tune": case "training": case "adapter": return <>
      {[[120, 32], [155, 35], [104, 61], [139, 62], [174, 62], [121, 88], [157, 85]].map(([x, y], i) => <g key={x + y}><path d={`M140 61L${x} ${y}`} className={(kind === "adapter" ? i === 6 : i % 3 === 0) ? `${s.accent} ${s.weight}` : s.faint} /><circle cx={x} cy={y} r={5} className={(kind === "adapter" ? i === 6 : i % 3 === 0) ? s.accent : s.alt} /></g>)}
      <Packet path="M30 60H94" kind="file" />
      <Appear delay={1}><path d="M187 61h37m-7-5 7 5-7 5" className={s.accent} /></Appear>{labels}
    </>;
    case "working": return <>
      <path d="M111 32h-9v58h9m58-58h9v58h-9" className={s.alt} />
      <g className={s.vanish} style={css({ "--delay": "3.8s" })}>{[44, 62, 80].map((y, i) => <Move key={y} x={i % 2 ? 70 : -70} arrive delay={i * .2}><path d={`M120 ${y}h40`} className={s.accent} strokeWidth={3} /></Move>)}</g>{labels}
    </>;
    case "unfold": case "model-card": case "toolbox": return <>
      <Mark kind="file" x={140} y={61} size={35} />
      {[[79, 33], [71, 87], [212, 56]].map(([x, y], i) => <Move key={x} x={(140 - x) * .7} y={(61 - y) * .7} arrive delay={i * .15}><path d={`M${x - 15} ${y}h30m-30 7h22`} className={s.alt} /></Move>)}
      {labels}
    </>;
    case "reason": case "beam": case "tree": case "sitemap": case "plan": case "vote": case "heads": return <>
      {[[93, 31], [96, 81], [181, 28], [184, 83]].map(([x, y], i) => <g key={x}>{line(i < 2 ? `M36 60L${x} ${y}` : `M${i === 2 ? 93 : 96} ${i === 2 ? 31 : 81}L${x} ${y}`, false, true)}{ring(x, y, 5)}</g>)}
      {draw("M36 60L93 31L181 28L244 61")}
      <Packet path="M36 60L93 31L181 28L244 61" />
      {kind === "vote" || kind === "heads" ? <Packet path="M36 60L96 81L184 83L244 61" delay={.4} /> : null}
      {dot(36, 60, 5)}{ring(244, 61, 9)}{labels}
    </>;
    case "guide": case "landmarks": case "story": case "hierarchy": return <>
      {text(a, 141, 30, true)}{line("M80 39H201", true)}
      <Move x={-42} arrive>{rows(107, 57, 4, 81)}</Move>
      <Appear delay={.6}><path d="M96 57h-8v31h8" className={s.accent} /></Appear>{text(b, 59, 111)}{text(c, 215, 111)}
    </>;
    case "attention": return <>
      {[54, 97, 140, 183, 226].map((x, i) => <g key={x}>{dot(x, 79, 5, i === 2)}<path d={`M140 31Q${x} 31 ${x} 72`} className={`${i === 1 || i === 4 ? s.accent : s.faint} ${s.draw}`} pathLength={1} strokeWidth={i === 1 ? 3 : 1} style={css({ "--delay": `${i * .12}s` })} /></g>)}
      {dot(140, 27, 6)}{labels}
    </>;
    default: return <AdditionalScene kind={kind} a={a} b={b} c={c} />;
  }
}

function AdditionalScene({ kind, a, b, c }: { kind: ConceptMotionKind; a: string; b: string; c: string }): ReactNode {
  const labels = caption(a, b, c);
  switch (kind) {
    case "branch": case "merge": case "commit": case "undo": case "rebase": return <>
      {line("M34 75H245")}{dot(39, 75, 5, false)}{dot(83, 75, 5, false)}{dot(144, 75, 5, false)}
      {kind === "branch" || kind === "merge" ? <>{draw(kind === "merge" ? "M83 75C102 75 104 33 135 33H170C204 33 205 75 231 75" : "M83 75C102 75 104 33 135 33H220")}{dot(139, 33, 5)}<Packet path={kind === "merge" ? "M139 33H170C204 33 205 75 231 75" : "M139 33H220"} /></> : kind === "rebase" ? <><path d="M83 75Q98 30 126 32H174" className={`${s.faint} ${s.dash}`} /><Move x={71} y={42}>{dot(126, 32, 5)}{dot(165, 32, 5)}{line("M126 32H165", true)}</Move></> : <Appear delay={.8}>{dot(211, 75, 6)}{kind === "undo" ? <path d="m205 58 6-6 6 6m-6-6v15" className={s.accent} /> : <Mark kind="file" x={211} y={42} size={19} />}</Appear>}
      {labels}
    </>;
    case "working-tree": case "stage": case "stash": case "review": return <>
      {rows(48, 34, 6, 51)}{rows(186, 34, 6, 51)}
      <path d="M48 60h45" className={s.accent} strokeWidth={3} />
      <Move x={kind === "stash" ? 49 : 135} y={kind === "stash" ? -23 : 0}><path d="M48 60h45" className={s.accent} strokeWidth={3} /></Move>
      {kind === "review" ? <Move y={23}><Mark kind="search" x={219} y={43} size={25} /></Move> : <path d="M130 36h21v50h-21" className={`${s.alt} ${s.dash}`} />}{labels}
    </>;
    case "remote": return <>
      <Mark kind="store" x={47} y={60} size={35} /><Mark kind="cloud" x={233} y={60} size={35} />
      {draw("M71 61H209")}{text("origin", 141, 52, true)}{labels}
    </>;
    case "pull": return <>
      {line("M42 34H238")}{line("M42 82H238")}
      {[63, 105, 147].map(x => <g key={x}>{dot(x, 34, 4, false)}{dot(x, 82, 4, false)}</g>)}
      {dot(201, 34, 5)}<Move y={48} delay={.7}>{dot(201, 34, 5)}</Move>
      {draw("M151 82H201", 1.8)}<Appear delay={2.6}><path d="m195 96 6-6 6 6" className={s.accent} /></Appear>{labels}
    </>;
    case "rollback": return <>
      <Mark kind="cloud" x={48} y={60} size={30} />{line("M72 60H128Q174 60 212 32", false, true)}{line("M128 60Q174 60 212 88", false, true)}
      {text("v2", 238, 36, true)}{text("v1", 238, 92, true)}
      <g className={s.vanish}>{draw("M73 60H128Q174 60 212 32")}</g><Appear delay={1.5}>{draw("M73 60H128Q174 60 212 88")}</Appear>
      <Packet path="M73 60H128Q174 60 212 88" delay={2.3} />{labels}
    </>;
    case "preview": return <>
      {line("M42 79H121")}{draw("M72 79Q91 33 127 33H171")}
      {dot(72, 79, 5)}<Packet path="M127 33H199" kind="file" />
      <Appear delay={1.6}><Mark kind="browser" x={228} y={34} size={33} />{text("preview", 223, 73)}</Appear>{labels}
    </>;
    case "switch": return <>
      {line("M38 37H242")}{line("M38 80H242")}
      {[63, 116, 169, 222].map(x => <g key={x}>{dot(x, 37, 4, false)}{dot(x, 80, 4, false)}</g>)}
      <Move y={43}><path d="m114 17 8 7h-16Z" className={`${s.accent} ${s.solid}`} /></Move>{labels}
    </>;
    case "conflict": case "converge": case "compare": return <>
      {line("M38 33Q90 33 140 61Q190 88 241 88", false, true)}{line("M38 88Q90 88 140 61Q190 33 241 33", false, true)}
      <Packet path="M38 33Q90 33 132 57" /><Packet path="M38 88Q90 88 132 65" delay={.2} risk={kind === "conflict"} />
      <Appear delay={1}><Mark kind={kind === "conflict" ? "cross" : "check"} x={147} y={61} size={20} tone={kind === "conflict" ? "risk" : "accent"} /></Appear>
      {kind === "converge" && <Packet path="M151 61H242" delay={1.8} />}{labels}
    </>;
    case "handoff": return <>
      <Mark kind="user" x={55} y={59} size={31} /><Mark kind="user" x={226} y={59} size={31} tone="alt" />
      {line("M80 61H201", false, true)}<Packet path="M82 61H199" kind="file" />
      <Appear delay={.8}><path d="M211 83h29" className={s.accent} /></Appear>{labels}
    </>;
    case "flex": return <>
      <path d="M41 40v41h198V40" className={s.alt} />
      {[0, 1, 2].map(i => <g key={i} transform={`translate(${50 + i * 63} 48)`}><rect width={53} height={25} rx={3} className={`${s.accent} ${s.stretch}`} /><path d="M8 13h20" className={s.alt} /></g>)}
      {text(a, 53, 111)}{text(b, 140, 27)}{text(c, 236, 111)}
    </>;
    case "resize": case "breakpoint": case "media": return <>
      <Move x={-16} arrive><path d="M48 24v69h182V24" className={s.alt} /></Move>
      {[0, 1, 2].map(i => <Move key={i} x={i * -40 + 24} y={i * 18 - 17} delay={i * .1}><rect x={74 + i * 45} y={52} width={32} height={13} rx={2} className={`${s.accent} ${s.wash}`} /></Move>)}
      <Move x={-61}><path d="M231 24v69" className={s.accent} /></Move>
      {kind === "breakpoint" && <path d="M171 16V101" className={`${s.alt} ${s.dash}`} />}{labels}
    </>;
    case "grid-layout": return <>
      <path d="M64 27h153v64H64Zm0 32h153m-102-32v64m51-64v64" className={s.faint} />
      <Move x={-29} y={-13} arrive><rect x={68} y={31} width={94} height={24} rx={2} className={`${s.accent} ${s.wash}`} /></Move>
      <Move x={30} y={20} arrive delay={.3}><rect x={170} y={63} width={43} height={24} rx={2} className={s.alt} /></Move>{labels}
    </>;
    case "box-model": return <>
      <rect x={113} y={45} width={54} height={29} className={`${s.accent} ${s.wash}`} />
      <g className={s.appear}><rect x={96} y={32} width={88} height={55} className={s.alt} /></g>
      <Appear delay={.4}><rect x={80} y={20} width={120} height={79} className={`${s.alt} ${s.dash}`} /></Appear>
      {text(a, 141, 63)}{text(b, 56, 63)}{text(c, 229, 63)}
    </>;
    case "position": case "focus": case "lazy": return <>
      {rows(60, 31, 7, 158)}
      <Move x={kind === "focus" ? 84 : 26} y={kind === "focus" ? 27 : -20}><rect x={76} y={52} width={43} height={15} rx={3} className={s.accent} /></Move>
      {kind === "lazy" && <><path d="M52 26h176v58H52" className={`${s.alt} ${s.dash}`} /><Appear delay={1}><Mark kind="file" x={178} y={61} size={25} /></Appear></>}{labels}
    </>;
    case "tokens": case "style": case "cascade": return <>
      {dot(140, 31, 8)}
      {[65, 140, 215].map((x, i) => <g key={x}>{line(`M140 39L${x} 64`, false, true)}<rect x={x - 15} y={65} width={30} height={17} rx={4} className={`${s.alt} ${s.swap}`} style={css({ "--delay": `${i * .12}s` })} /></g>)}{labels}
    </>;
    case "specificity": case "version": return <>
      {[73, 141, 209].map((x, i) => <g key={x}>{text(kind === "version" ? ["2", "4", "1"][i] : ["1", "0", "0"][i], x, 65, true)}<Move y={-15} delay={i * .15}><path d={`m${x - 6} 86 6-6 6 6`} className={s.accent} /></Move></g>)}
      {kind === "specificity" && <path d="M48 36h48m-48 40h48" className={s.accent} />}{labels}
    </>;
    case "array": case "object": case "documents": return <>
      {kind === "array" ? <><path d="M58 36h-8v49h8m165-49h8v49h-8" className={s.alt} />{[87, 140, 193].map((x, i) => <Move key={x} x={0} y={-20} arrive delay={i * .15}>{dot(x, 60, 9)}{text(String(i), x, 94)}</Move>)}</> : <>{ring(140, 61, 14)}{[[76, 32], [72, 86], [211, 45]].map(([x, y], i) => <g key={x}>{draw(`M140 61L${x} ${y}`, i * .15)}<Mark kind="file" x={x} y={y} size={21} /></g>)}</>}{labels}
    </>;
    case "calculate": return <>
      <g className={s.vanish}>{text(a, 116, 65, true)}</g>
      <Move x={62} arrive><Appear delay={.7}>{text(c, 160, 65, true)}</Appear></Move>
      <path d="M69 38v45m142-45v45" className={`${s.alt} ${s.dash}`} />{text(b, 141, 111)}
    </>;
    case "modules": case "monorepo": case "platforms": case "proxy": case "webview": return <>
      <Mark kind={kind === "platforms" ? "code" : "browser"} x={46} y={59} size={29} />
      <path d="M120 32h40v54h-40" className={`${s.alt} ${s.dash}`} />
      <Mark kind={kind === "monorepo" ? "file" : "code"} x={140} y={61} size={24} />
      <Mark kind={kind === "platforms" ? "screen" : "cloud"} x={235} y={59} size={29} />
      <Packet path="M66 60H115" /><Packet path="M165 60H214" delay={1.5} />{labels}
    </>;
    case "device": case "safe-area": return <>
      <rect x={115} y={16} width={50} height={83} rx={9} className={s.alt} />
      <path d="M132 19h16m-18 75h20" className={s.alt} strokeWidth={3} />
      <Move y={-12} arrive>{rows(124, 40, 4, 31)}</Move>
      {kind === "safe-area" && <><path d="M117 32h46m-46 52h46" className={`${s.accent} ${s.dash}`} /><path d="m95 27 9 9m-9 53 9-9" className={s.accent} /></>}
      {kind === "device" && <Turn angle={90}><path d="M186 35q20 21 0 43m0-43h11m-11 0v11" className={s.accent} /></Turn>}{labels}
    </>;
    case "wave": case "position-wave": case "activation": case "rotate": return <>
      <path d="M49 89H235M63 96V20" className={s.faint} />
      {kind === "rotate" ? <><path d="M140 69h56" className={s.alt} /><g transform="translate(140 69)"><Turn angle={-60} origin="left center"><path d="M0 0h56m-6-5 6 5-6 5" className={s.accent} /></Turn></g>{ring(140, 69, 35)}</> : draw(kind === "activation" ? "M66 88H121Q138 88 145 68L197 25" : kind === "wave" ? "M70 61h25l5-12 8 25 8-43 9 61 9-61 9 43 8-25 5 12h27" : "M68 60Q83 15 99 60T130 60T161 60T192 60T223 60")}{labels}
    </>;
    case "reduced": return <>
      {line("M35 43H237", false, true)}{line("M35 82H237", false, true)}
      <Packet path="M39 43H235" kind="file" />
      <g className={s.vanish}><Mark kind="file" x={39} y={82} size={22} tone="alt" /></g>
      <Appear delay={1}><Mark kind="file" x={235} y={82} size={22} /></Appear>
      {text(a, 89, 25)}{text(b, 91, 105)}{text(c, 233, 111)}
    </>;
    case "offline": case "reload": case "regression": case "overlay": return <>
      {rows(48, 35, 6, 65)}{rows(177, 35, 6, 65)}
      {kind === "offline" ? <><Mark kind="cloud" x={141} y={31} size={25} tone="faint" /><path d="m129 20 23 22" className={s.alt} /><Packet path="M112 71H171" delay={1.2} /></> : kind === "overlay" ? <Move x={-128} arrive><path d="M177 57h45" className={s.risk} strokeWidth={4} /></Move> : <><Move x={128}><path d="M48 62h49" className={s.accent} /></Move><Appear delay={1}><Mark kind="check" x={240} y={83} size={17} /></Appear></>}{labels}
    </>;
    case "loading": case "wireframe": return <>
      {[36, 53, 70].map((y, i) => <g key={y}><path d={`M69 ${y}h${143 - (i % 2) * 34}`} className={s.faint} strokeWidth={8} /><Appear delay={i * .3}><path d={`M69 ${y}h${143 - (i % 2) * 34}`} className={s.accent} strokeWidth={2} /></Appear></g>)}{labels}
    </>;
    case "funnel": case "audience": return <>
      <path d="M67 23 114 87h52l47-64" className={s.alt} />
      {[0, 1, 2, 3, 4, 5, 6].map(i => <Packet key={i} path={`M${82 + i * 19} 30Q${94 + i * 13} 49 ${i < 3 ? 125 + i * 13 : 192 + i * 4} ${i < 3 ? 82 : 54}`} delay={i * .12} />)}{labels}
    </>;
    case "timeline": case "run": case "checks": case "checklist": case "coverage": case "unit": case "human-grade": case "model-grade": return <>
      {kind === "unit" ? <Mark kind="code" x={72} y={61} size={31} /> : kind === "human-grade" ? <Mark kind="user" x={72} y={61} size={31} /> : kind === "model-grade" ? <Mark kind="model" x={72} y={61} size={31} /> : <>{rows(55, 34, 6, 31)}</>}
      {[112, 154, 196, 238].map((x, i) => <g key={x}>{line(`M${x - 25} 61H${x - 8}`, false, true)}{ring(x, 61, 7)}{(kind !== "coverage" || i < 3) && <Appear delay={i * .3}><Mark kind="check" x={x} y={61} size={13} /></Appear>}</g>)}{labels}
    </>;
    case "client-render": case "server-render": case "static-render": case "render-compare": return <>
      <Mark kind={kind === "static-render" ? "code" : "cloud"} x={46} y={60} size={30} />
      <Mark kind="browser" x={232} y={60} size={43} tone="alt" />
      <Packet path="M71 60H200" kind={kind === "client-render" ? "code" : "file"} />
      <Appear delay={1.6}>{rows(kind === "client-render" ? 218 : 34, kind === "client-render" ? 57 : 53, 3, 25)}</Appear>{labels}
    </>;
    case "tcp": case "udp": return <>
      {line("M33 43H245", false, true)}{line("M33 82H245", false, true)}
      {[0, 2].map(i => <Packet key={i} path={`M${40 + i * 24} 58H${205 + i * 15}`} delay={i * .3} />)}
      <Packet path="M64 58H139" delay={.3} risk leave />
      <Appear delay={1}><Mark kind="cross" x={139} y={58} size={13} tone="risk" /></Appear>
      {kind === "tcp" && <><Packet path="M230 82H49" delay={1.7} leave /><Packet path="M64 58H220" delay={4} /></>}{labels}
    </>;
    case "tunnel": return <>
      {line("M34 41H246", false, true)}{line("M34 81H246", false, true)}
      {[0, 1, 2].map(i => <Packet key={i} path={`M${43 + i * 23} 61H${210 + i * 15}`} kind="lock" delay={i * .3} />)}{labels}
    </>;
    case "examples": case "mock": case "probe": return <>
      <Mark kind={kind === "mock" ? "cloud" : "file"} x={59} y={37} size={23} tone={kind === "mock" ? "faint" : "accent"} />
      <Mark kind={kind === "mock" ? "code" : "file"} x={59} y={83} size={23} />
      {line("M79 37Q119 37 140 60", false, true)}{line("M79 83Q119 83 140 60", false, true)}
      <Mark kind={kind === "probe" ? "shield" : "model"} x={156} y={61} size={30} />
      <Packet path="M79 83Q119 83 140 60" /><Appear delay={1}><Mark kind={kind === "probe" ? "cross" : "check"} x={226} y={61} size={21} tone={kind === "probe" ? "risk" : "accent"} /></Appear>{labels}
    </>;
    case "layers": case "layers-build": return <>
      {[0, 1, 2].map((i) => <Move key={i} y={i * 16 - 16} arrive delay={i * .2}><path d={`M82 ${68 - i * 16} 140 ${43 - i * 16} 198 ${68 - i * 16} 140 ${93 - i * 16}Z`} className={i === 2 ? `${s.accent} ${s.wash}` : s.alt} /></Move>)}{labels}
    </>;
    case "debounce": return <>
      {line("M34 77H246")}{ticks(40, 78, 12, 18)}
      {[44, 65, 82, 110].map((x, i) => <g key={x}><path d={`M${x} 77V56`} className={s.alt} /><Appear delay={i * .2}>{dot(x, 50, 3)}</Appear></g>)}
      <Move x={65}><path d="M113 35v53" className={`${s.accent} ${s.dash}`} /></Move>
      <Appear delay={1.6}>{dot(219, 50, 6)}<path d="M219 58v19" className={s.accent} /></Appear>{labels}
    </>;
    case "ephemeral": return <>
      <Packet path="M37 61H116" />
      <g className={s.pulse}><Mark kind="code" x={145} y={61} size={35} /></g>
      <Packet path="M173 61H242" delay={1.6} />{labels}
    </>;
    case "middle": return <>
      {Array.from({ length: 11 }, (_, i) => <g key={i} className={i > 2 && i < 8 ? s.vanish : undefined}><path d={`M${36 + i * 19} 34v53`} className={i > 2 && i < 8 ? s.alt : s.accent} strokeWidth={5} /></g>)}{labels}
    </>;
    case "residual": return <>
      {line("M32 69H246", false, true)}<Mark kind="code" x={140} y={69} size={25} />
      {draw("M70 68V29H209V68")}
      <Packet path="M37 69H112" /><Packet path="M70 68V29H209V68" delay={.3} />
      <Appear delay={1.1}>{text("+", 211, 75, true)}</Appear>{labels}
    </>;
    case "expand": return <>
      {[42, 61, 80].map(y => <g key={y}>{dot(45, y, 4)}{dot(238, y, 4)}</g>)}
      {[22, 38, 54, 70, 86, 102].map((y, i) => <g key={y}>{draw(`M50 61L137 ${y}L232 61`, i * .07)}{dot(137, y, 3)}</g>)}{labels}
    </>;
    case "speculate": return <>
      {[0, 1, 2, 3, 4, 5].map((i) => <g key={i}><Appear delay={i * .1}><path d={`M${44 + i * 35} 55h23`} className={i > 3 ? s.risk : s.alt} strokeWidth={6} /></Appear>{i < 4 && <Appear delay={1.1 + i * .1}><Mark kind="check" x={55 + i * 35} y={79} size={14} /></Appear>}</g>)}
      <Move x={143}><path d="M42 34v57" className={s.accent} /></Move>{labels}
    </>;
    default: throw new Error(`缺少概念运动构图：${kind}`);
  }
}

export function ConceptMotion({ slug }: { slug: string }) {
  const study = conceptMotions[slug as ConceptMotionSlug];
  if (!study) throw new Error(`缺少概念首图：${slug}`);
  return <ConceptMotionPlayer label={study[4]} kind={study[0]}><svg viewBox="0 0 280 140" aria-hidden="true"><Scene study={study} /></svg></ConceptMotionPlayer>;
}
