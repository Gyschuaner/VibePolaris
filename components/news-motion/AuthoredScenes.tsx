import type { NewsMotionSceneProps } from "@/lib/news-motion-types";

const clamp = (n: number) => Math.max(0, Math.min(1, n));
const phase = (p: number, a = 0, b = 1) => { const t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); };
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ink = "var(--motion-ink)", muted = "var(--motion-muted)", line = "var(--motion-line)", accent = "var(--motion-accent)", paper = "var(--motion-paper)", soft = "var(--motion-soft)";

function Label({ x, y, children, color = ink, anchor = "start", width }: { x: number; y: number; children: React.ReactNode; color?: string; anchor?: "start" | "middle" | "end"; width?: number }) {
  if(typeof children !== "string" || !width) return <text x={x} y={y} fill={color} fontSize={16} textAnchor={anchor}>{children}</text>;
  const rows:string[]=[];let row="",used=0;
  for(const char of children){const advance=/[\u0000-\u00ff]/.test(char)?8:16;if(used+advance>width&&row){rows.push(row);row="";used=0;}row+=char;used+=advance;}
  if(row)rows.push(row);
  return <text x={x} y={y} fill={color} fontSize={16} textAnchor={anchor}>{rows.map((text,i)=><tspan key={i} x={x} dy={i?19:0}>{text}</tspan>)}</text>;
}

/** C: the same sentence lifts off the source and settles into the working context. */
function Ribbon({ design: d, progress: p, width: w, height: h, id }: NewsMotionSceneProps) {
  const small = w < 640, a = phase(p, .22, .78), opened = phase(p, .03, .19);
  const sx = 24, sy = small ? 120 : 130, sw = small ? w - 48 : w * .34;
  const tx = small ? 24 : w * .56, ty = small ? 355 : 220, tw = small ? w - 48 : w * .4;
  const x = mix(sx + 16, tx + 16, a), y = mix(sy + 69, ty + 62, a);
  const length = Math.min(sw, tw) - 32, bend = Math.sin(a * Math.PI) * (small ? 65 : 90);
  const curve = `M ${x} ${y} C ${x + length * .28} ${y - bend * 1.4}, ${x + length * .7} ${y + bend * .7}, ${x + length} ${y}`;
  return <>
    <Label x={24} y={34} color={muted}>{d.subject}</Label>
    <g opacity={opened}>
      <Label x={sx} y={sy - 20}>{d.source}</Label>
      <path d={`M${sx} ${sy}h${sw}v145H${sx}z`} fill={paper} stroke={line} />
      <path d={`M${sx} ${sy + 25}h${sw}`} stroke={line} />
      {[0, 1, 2].map(i => <circle key={i} cx={sx + 13 + i * 11} cy={sy + 12} r={2} fill={muted} />)}
      <g opacity={small ? 1 - phase(p, .22, .3) : 1}>{d.items.slice(1).map((item, i) => <Label key={item} x={sx + 16} y={sy + 98 + i * 22} color={muted}>{item}</Label>)}</g>
      <path d={`M${tx} ${ty}h${tw}v${small ? 148 : 154}H${tx}`} fill={paper} stroke={line} />
      <Label x={small ? tx + 16 : tx} y={small ? ty + 132 : ty - 20}>{d.target}</Label>
      <path d={`M${tx + 16} ${ty + 74}h${tw - 32}`} stroke={line} />
    </g>
    <g opacity={opened}>
      <defs><path id={`${id}-ribbon`} d={curve} /></defs>
      <path d={curve} fill="none" stroke={soft} strokeWidth={30} strokeLinecap="round" />
      <text fill={accent} fontSize={16} fontWeight={650}><textPath href={`#${id}-ribbon`}>{d.items[0]}</textPath></text>
    </g>
    <g opacity={phase(p, .24, .4) * (1 - phase(p, .75, .85))}>
      <Label x={small ? w / 2 : w * .54} y={small ? h - 35 : 110} color={accent} anchor="middle">{d.action}</Label>
      <Label x={small ? w / 2 : w * .54} y={small ? h - 12 : 137} color={muted} anchor="middle">{d.actor}</Label>
    </g>
    <path d={`M${tx + 16} ${ty + 106}h${(tw - 36) * phase(p, .8, .96)}`} stroke={accent} strokeWidth={3} />
    <circle cx={tx + 16 + (tw - 36) * phase(p, .8, .96)} cy={ty + 106} r={3} fill={accent} opacity={phase(p, .79, .83)} />
  </>;
}

function Balance({ design: d, progress: p, width: w, height: h }: NewsMotionSceneProps) {
  const small = w < 640, cx = w / 2, cy = small ? 310 : 210, span = Math.min((w - 160) / 2, 210), tilt = -8 * Math.sin(phase(p, .15, .8) * Math.PI);
  return <>
    <Label x={24} y={34}>{d.subject}</Label>
    <Label x={cx} y={79} anchor="middle" color={muted}>{d.actor}</Label>
    <path d={`M${cx} ${cy - 55}l-24 118h48z`} fill={soft} stroke={line} />
    <g transform={`rotate(${tilt} ${cx} ${cy - 55})`}>
      <path d={`M${cx - span} ${cy - 55}h${span * 2}`} stroke={ink} strokeWidth={3} />
      {[-1, 1].map((side, i) => <g key={side}>
        <path d={`M${cx + side * span} ${cy - 55}v93m-63 0q63 34 126 0`} fill="none" stroke={accent} strokeWidth={2} />
        <Label x={cx + side * span} y={cy + 79} anchor="middle" width={128}>{i ? d.target : d.source}</Label>
        {d.items.filter((_,index)=>index%2===i).map((item,j)=><g key={item} opacity={phase(p, .05+i*.2+j*.12, .4+i*.2+j*.12)}><rect x={cx + side * span - 54} y={cy - 3-j*45} width={108} height={40} rx={3} fill={paper} stroke={line} /><Label x={cx + side * span} y={cy + 13-j*45} anchor="middle" width={100}>{item}</Label></g>)}
      </g>)}
    </g>
    <Label x={cx} y={h - 25} anchor="middle" color={accent}>{d.action}</Label>
  </>;
}

function Lanes({ design: d, progress: p, width: w, height: h }: NewsMotionSceneProps) {
  const small = w < 640, start = 30, end = w - 42;
  const top = small ? 165 : 139;
  const spacing = Math.min(small ? 96 : 65, (h - top - 73) / Math.max(1, d.items.length - 1));
  return <>
    <Label x={24} y={34} width={w - 48}>{d.subject}</Label>
    <Label x={24} y={small ? 86 : 69} color={muted} width={w - 48}>{`${d.actor} · ${d.action}`}</Label>
    {d.items.map((item, i) => {
      const t = phase(p, .08 + i * .08, .72 + i * .07), pos = mix(start, end, t), lane = top + i * spacing;
      return <g key={item}>
        <Label x={start} y={lane - (small ? 38 : 21)} width={w - 64}>{item}</Label>
        <path d={`M${start} ${lane}H${end}`} fill="none" stroke={line} strokeWidth={15} strokeLinecap="round" />
        <path d={`M${start} ${lane}H${pos}`} fill="none" stroke={soft} strokeWidth={15} strokeLinecap="round" />
        <circle cx={pos} cy={lane} r={9} fill={accent} />
      </g>;
    })}
    <Label x={24} y={h - (small ? 43 : 24)} color={muted} width={w - 48}>{`${d.source} → ${d.target}`}</Label>
  </>;
}

function Docking({ design: d, progress: p, width: w, height: h }: NewsMotionSceneProps) {
  const small = w < 640, cx = w / 2, cy = small ? 300 : 235, radius = small ? 65 : 85, t = phase(p, .12, .8);
  return <>
    <Label x={24} y={34}>{d.subject}</Label><Label x={24} y={66} color={muted}>{d.source}</Label>
    <path d={`M${cx - radius} ${cy - 36}h${radius * .8}l20 36-20 36h-${radius * .8}z`} fill={paper} stroke={accent} strokeWidth={2} />
    <Label x={cx - radius * .5} y={cy - 3} anchor="middle" width={radius * .85}>{d.target}</Label>
    <g transform={`translate(${mix(small ? w - 30 : w - 90, cx + 25, t)},${mix(small ? 135 : cy - 80, cy, t)}) rotate(${mix(-25,0,t)})`}>
      <path d="M0-32h65v64H0l-18-32z" fill={soft} stroke={accent} strokeWidth={2} />
      <Label x={32} y={-3} anchor="middle" width={60}>{d.items[0]}</Label>
    </g>
    <path d={`M${cx} ${cy - 52}v104`} stroke={line} strokeDasharray="4 6" />
    <Label x={cx} y={cy + 125} anchor="middle" color={accent}>{d.action}</Label>
    <Label x={cx} y={h - (small ? 43 : 24)} anchor="middle" color={muted} width={w - 48}>{`${d.actor} · ${d.items.slice(1).join(" / ")}`}</Label>
  </>;
}

function Robot({ design: d, progress: p, width: w, height: h }: NewsMotionSceneProps) {
  const small = w < 640, bx = small ? w * .32 : w * .3, by = h - 85, reach = phase(p, .12, .75), ex = mix(bx + 30, w * .68, reach), ey = mix(by - 185, by - 62, reach);
  return <>
    <Label x={24} y={34}>{d.subject}</Label><Label x={24} y={67} color={muted}>{d.source}</Label>
    <path d={`M24 ${by + 28}H${w - 24}`} stroke={line} />
    <path d={`M${bx - 30} ${by + 27}h60l-12-32h-36z`} fill={soft} stroke={ink} />
    <path d={`M${bx} ${by}L${bx - 35} ${by - 115}L${ex} ${ey}`} fill="none" stroke={accent} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" />
    <circle cx={bx - 35} cy={by - 115} r={13} fill={paper} stroke={accent} strokeWidth={3} />
    <path d={`M${ex - 11} ${ey + 9}v19m22-19v19`} stroke={ink} strokeWidth={3} fill="none" />
    <rect x={w * .68 - 24} y={by - 29} width={48} height={48} rx={3} fill={paper} stroke={ink} strokeWidth={2} />
    <Label x={w * .68} y={by + 60} anchor="middle">{d.items[0]}</Label>
    <g opacity={phase(p, .72, .9)}><path d={`M${w * .68 - 46} ${by - 43}v-18h18m56 0h18v18`} stroke={accent} fill="none" /><Label x={w * .68} y={by - 83} anchor="middle" color={accent}>{d.action}</Label></g>
    <Label x={24} y={115}>{d.actor}</Label><Label x={w - 24} y={142} anchor="end" color={muted}>{d.target}</Label>
    {d.items.slice(1).map((item,i) => <Label key={item} x={w - 24} y={170 + i * 25} anchor="end" color={muted}>{item}</Label>)}
  </>;
}

function SignalTriage({ design: d, progress: p, width: w, height: h }: NewsMotionSceneProps) {
  const small = w < 640, cy = small ? 260 : 206, x = w / 2, shown = phase(p, .15, .6);
  const wave = Array.from({ length: 61 }, (_,i) => { const a = i / 60; const peak = Math.exp(-Math.pow((a - .52) * 35,2)) * 62 - Math.exp(-Math.pow((a-.57)*45,2))*28; return `${i ? "L" : "M"}${24 + a * (w - 48)} ${cy + Math.sin(a*29)*5 - peak}`; }).join(" ");
  return <>
    <Label x={24} y={34}>{d.subject}</Label><Label x={24} y={69} color={muted}>{d.source}</Label>
    <path d={`M24 ${cy}H${w-24}`} stroke={line}/><path d={wave} stroke={accent} strokeWidth={2} fill="none" strokeDasharray={w*2} strokeDashoffset={w*2*(1-shown)}/>
    <circle cx={24+(w-48)*.52} cy={cy-60} r={17 + 6 * (1-shown)} stroke={accent} fill="none" opacity={shown}/>
    <Label x={24} y={cy+62}>{d.items[0]}</Label>
    <path d={`M${x} ${cy+90}v45`} stroke={line} strokeWidth={2}/>
    <g opacity={phase(p,.6,.85)}><path d={`M${x-50} ${cy+139}h100v47h-100z`} fill={paper} stroke={accent}/><Label x={x} y={cy+168} anchor="middle">{d.actor}</Label></g>
    <Label x={w-24} y={h-28} anchor="end" color={muted}>{d.target}</Label>
    <Label x={24} y={small ? 113 : 102} color={muted}>{d.items.slice(1).join(" / ")}</Label>
  </>;
}

function Triage(props:NewsMotionSceneProps) {
  const {design:d, progress:p, width:w, height:h}=props;
  if(d.triageMode === "signal") return <SignalTriage {...props}/>;
  const small=w<640, sx=24, sy=107, pw=small?w-48:w*.45, ph=80+d.items.length*30;
  const tx=small?40:w*.59, ty=small?h-112:h*.61, tw=small?w-80:w*.35, take=phase(p,.35,.82);
  const x=mix(sx+14,tx+12,take), y=mix(sy+66,ty+34,take);
  return <>
    <Label x={24} y={34}>{d.subject}</Label>
    <Label x={24} y={70} color={muted}>{d.source}</Label>
    <path d={`M${sx} ${sy}h${pw}v${ph}H${sx}z`} fill={paper} stroke={line}/>
    <path d={`M${sx+14} ${sy+30}h${pw-28}`} stroke={line}/>
    {d.items.slice(1).map((item,i)=><Label key={item} x={sx+14} y={sy+98+i*30} color={muted}>{item}</Label>)}
    <path d={`M${tx} ${ty-10}v65h${tw}v-65`} fill={soft} stroke={line}/>
    <g transform={`translate(${x} ${y}) rotate(${-Math.sin(take*Math.PI)*5})`}>
      <rect x={-4} y={-23} width={Math.min(pw-20,tw-16)} height={33} rx={2} fill={paper} stroke={accent} strokeWidth={phase(p,.1,.3)*2}/>
      <Label x={4} y={0} color={accent}>{d.items[0]}</Label>
    </g>
    <Label x={tx} y={ty+88}>{d.target}</Label>
    <Label x={small?w-24:w*.62} y={small?sy+ph+48:sy+45} anchor={small?"end":"start"} color={muted}>{d.actor}</Label>
    <Label x={small?24:w*.62} y={small?sy+ph+82:sy+78} color={accent}>{d.action}</Label>
  </>;
}

function Wave({ design:d, progress:p, width:w, height:h }:NewsMotionSceneProps) {
  const small=w<640, left=24, right=w-24, inputY=small?133:140, wordsY=small?290:257, voiceY=h-61;
  const listen=phase(p,.03,.3), revise=phase(p,.36,.56), speak=phase(p,.7,.94), audible=d.voiceMode === "pipeline";
  const waveform=(y:number, amount:number) => Array.from({length:81},(_,i)=>{
    const t=i/80, envelope=Math.sin(t*Math.PI)**2;
    return `${i?"L":"M"}${left+(right-left)*t} ${y+Math.sin(t*86)*Math.cos(t*23)*envelope*22*amount}`;
  }).join(" ");
  if(d.voiceMode === "synthesize") {
    const paperY=103, paperH=48+d.items.length*29, trace=phase(p,.3,.94);
    return <>
      <Label x={left} y={34} width={w-48}>{d.subject}</Label>
      <Label x={left} y={80} color={muted} width={w-48}>{d.source}</Label>
      <Label x={right} y={56} anchor="end" color={muted} width={w-48}>{d.actor}</Label>
      <rect x={left} y={paperY} width={right-left} height={paperH} fill={paper} stroke={line}/>
      {d.items.map((item,i)=><Label key={item} x={left+16} y={paperY+32+i*29} width={w-80}>{item}</Label>)}
      <path d={`M${left+18} ${paperY+paperH+12}V${voiceY-43}H${right}`} fill="none" stroke={line}/>
      <Label x={left+35} y={voiceY-64} color={accent} width={w-88}>{d.action}</Label>
      <path d={waveform(voiceY,1)} stroke={line} fill="none"/>
      <path d={waveform(voiceY,1)} stroke={accent} fill="none" strokeWidth={2} strokeDasharray={w*3} strokeDashoffset={w*3*(1-trace)}/>
      <Label x={right} y={h-18} anchor="end" width={w-48}>{d.target}</Label>
    </>;
  }
  if(d.voiceMode === "duplex") {
    const cut=phase(p,.49,.54), reply=phase(p,.26,.5), again=phase(p,.7,.95);
    return <>
      <Label x={left} y={34}>{d.subject}</Label>
      <Label x={left} y={inputY-43} color={muted}>{d.source}</Label>
      <path d={waveform(inputY,1)} stroke={line} fill="none"/>
      <path d={waveform(inputY,1)} stroke={accent} fill="none" strokeWidth={2} strokeDasharray={w*3} strokeDashoffset={w*3*(1-phase(p,.03,.26))}/>
      <Label x={left} y={wordsY-41}>{d.target}</Label>
      <path d={waveform(wordsY,1)} stroke={line} fill="none"/>
      <path d={waveform(wordsY,1)} stroke={accent} fill="none" strokeWidth={2} strokeDasharray={`${w*.62*reply} ${w*3}`} opacity={1-cut*.65}/>
      <path d={`M${w*.57} ${inputY+25}V${wordsY+23}`} stroke={accent} strokeWidth={2} opacity={cut}/>
      <Label x={w*.57+12} y={(inputY+wordsY)/2} color={accent}>{d.items[2] ?? d.action}</Label>
      <path d={waveform(voiceY,1)} stroke={accent} fill="none" strokeWidth={2} strokeDasharray={w*3} strokeDashoffset={w*3*(1-again)} opacity={again}/>
      <Label x={left} y={h-18} color={muted}>{d.actor}</Label>
      <Label x={right} y={h-18} anchor="end">{d.action}</Label>
    </>;
  }
  return <>
    <Label x={left} y={34}>{d.subject}</Label>
    <Label x={left} y={84} color={muted}>{d.source}</Label>
    <path d={waveform(inputY,1)} stroke={line} fill="none"/>
    <path d={waveform(inputY,1)} stroke={accent} fill="none" strokeWidth={2} strokeDasharray={w*3} strokeDashoffset={w*3*(1-listen)}/>
    <path d={`M${left} ${inputY+42}V${wordsY-38}H${right}`} fill="none" stroke={line}/>
    <Label x={right} y={wordsY-76} anchor="end" color={muted}>{d.actor}</Label>
    <g opacity={phase(p,.18,.35)}>
      <Label x={left+16} y={wordsY-6} color={revise>.5?muted:ink}>{d.items[0]}</Label>
      <path d={`M${left+14} ${wordsY-12}h${Math.min(w-78,d.items[0].length*14)*revise}`} stroke={accent} strokeWidth={2}/>
    </g>
    {!audible && <rect x={left} y={voiceY-27} width={right-left} height={48} rx={3} fill={paper} stroke={line} opacity={speak}/>}
    <g opacity={revise}>
      <Label x={left+16} y={audible?wordsY+27:mix(wordsY+27,voiceY,phase(p,.62,.94))} color={accent} width={w-82}>{d.items[1]}</Label>
    </g>
    <path d={`M${right} ${wordsY+80}V${voiceY-30}H${left}`} stroke={line} fill="none"/>
    {audible ? <path d={waveform(voiceY,speak)} stroke={accent} strokeWidth={2} fill="none" opacity={speak}/> : <path d={`M${left+23+Math.min(w-98,d.items[1].length*16)} ${voiceY-16}v22`} stroke={accent} strokeWidth={2} opacity={speak}/>}
    <Label x={left} y={h-18} color={muted}>{d.items[2] ?? d.target}</Label>
    <Label x={right} y={h-18} anchor="end">{d.target}</Label>
  </>;
}

function Cart({design:d,progress:p,width:w,height:h}:NewsMotionSceneProps){
  const small=w<640, cx=w/2, cy=small?365:260, t=phase(p,.12,.72);
  return <>
    <Label x={24} y={34}>{d.subject}</Label><Label x={24} y={70} color={muted}>{d.source}</Label>
    <path d={`M${cx-100} ${cy-65}h25l19 95h130l22-74H${cx-73}`} fill={paper} stroke={ink} strokeWidth={2.5}/>
    {[-40,57].map(n=><circle key={n} cx={cx+n} cy={cy+48} r={9} stroke={accent} strokeWidth={3} fill="none"/>)}
    {d.items.map((item,i)=>{
      const sx=small?w-51:50+(i+.5)*(w-100)/d.items.length, sy=small?117+i*44:139;
      const x=mix(sx,cx-48+i*39,t),y=mix(sy,cy-19-i%2*12,t);
      return <g key={item}>
        <Label x={small?28:sx} y={small?sy+5:sy-30} anchor={small?"start":"middle"} width={small?w-110:(w-100)/d.items.length-8}>{item}</Label>
        <path d={`M${sx} ${sy}Q${sx} ${cy-75} ${cx-48+i*39} ${cy-19-i%2*12}`} fill="none" stroke={line} strokeDasharray="3 6"/>
        <g transform={`translate(${x},${y}) rotate(${mix(i%2?10:-10,0,t)})`}><path d="M-13-17h26v34h-26z" fill={soft} stroke={accent}/><path d={`M-7 -5h14m-14 6h${7+i*2}`} stroke={accent}/></g>
      </g>;
    })}
    <Label x={cx} y={cy+100} anchor="middle">{d.actor} · {d.action}</Label><Label x={w-24} y={h-20} anchor="end" color={muted}>{d.target}</Label>
  </>;
}

function Brake({design:d,progress:p,width:w,height:h}:NewsMotionSceneProps){
  const small=w<640, stop=phase(p,.3,.55), mid=small?h*.61:w*.66, move=phase(p,.03,.7);
  return <>
    <Label x={24} y={34}>{d.subject}</Label>
    <Label x={24} y={70} color={muted}>{d.source}</Label>
    {small ? <>
      <path d={`M${w*.24} 104V${h-60}`} stroke={line} strokeWidth={3}/>
      <path d={`M32 ${mid}H${w*.72}`} stroke={accent} strokeWidth={8} transform={`translate(0 ${-45*(1-stop)})`} opacity={stop}/>
      {d.items.map((item,i)=><g key={item} transform={`translate(0 ${Math.max(0,mid-44-(110+(d.items.length-1)*44))*move})`}><circle cx={w*.24} cy={110+i*44} r={6} fill={accent}/><Label x={w*.24+17} y={116+i*44} width={w*.58-25}>{item}</Label></g>)}
      <Label x={24} y={mid+76} color={muted}>{d.target}</Label>
      <path d={`M${w*.82} ${mid-45}v-66l${-30*stop} -18`} stroke={ink} strokeWidth={3} fill="none"/>
      <Label x={w-24} y={94} anchor="end">{d.actor}</Label>
    </> : <>
      <path d={`M32 ${h*.5}H${w-32}`} stroke={line} strokeWidth={3}/>
      <path d={`M${mid} ${h*.5-52}v104`} stroke={accent} strokeWidth={8} transform={`translate(0 ${-110*(1-stop)})`} opacity={stop}/>
      {d.items.map((item,i)=>{const x=mix(48,mid-32-i*24,move);return <g key={item}><circle cx={x} cy={h*.5} r={6} fill={accent}/><Label x={48} y={h*.5+51+i*28}>{item}</Label></g>;})}
      <path d={`M${mid+34} ${h*.5-50}v-51l${-30*stop} -18`} stroke={ink} strokeWidth={3} fill="none"/>
      <Label x={mid+35} y={h*.5-136} anchor="middle">{d.actor}</Label>
      <Label x={w-24} y={h*.5+90} anchor="end" color={muted}>{d.target}</Label>
    </>}
    <Label x={w/2} y={h-23} anchor="middle" color={accent}>{d.action}</Label>
  </>;
}

export function AuthoredScene(props:NewsMotionSceneProps){
  switch(props.design.scene){
    case "ribbon":return <Ribbon {...props}/>;
    case "balance":return <Balance {...props}/>;
    case "lanes":return <Lanes {...props}/>;
    case "docking":return <Docking {...props}/>;
    case "robot":return <Robot {...props}/>;
    case "triage":return <Triage {...props}/>;
    case "wave":return <Wave {...props}/>;
    case "cart":return <Cart {...props}/>;
    case "brake":return <Brake {...props}/>;
    default:return null;
  }
}
