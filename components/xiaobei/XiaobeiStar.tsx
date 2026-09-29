export function XiaobeiStar() {
  return <svg className="xb-star" viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <circle className="xb-star-halo" cx="32" cy="32" r="22" stroke="currentColor" strokeWidth=".8" />
    <g className="xb-star-orbit">
      <ellipse cx="32" cy="32" rx="27" ry="16" stroke="currentColor" strokeWidth="1" />
      <circle cx="59" cy="32" r="2.3" fill="currentColor" />
      <circle cx="5" cy="32" r="1.3" fill="currentColor" />
    </g>
    <g className="xb-star-core">
      <path d="M32 8C35.5 24 40 28.5 54 32C40 35.5 35.5 40 32 56C28.5 40 24 35.5 10 32C24 28.5 28.5 24 32 8Z" fill="currentColor" />
      <path d="M32 8V32H10C24 28.5 28.5 24 32 8ZM32 56V32H54C40 35.5 35.5 40 32 56Z" fill="var(--surface)" opacity=".28" />
      <path d="m32 27 1.5 3.5L37 32l-3.5 1.5L32 37l-1.5-3.5L27 32l3.5-1.5Z" fill="var(--surface)" />
    </g>
    <g transform="translate(51 12)"><path className="xb-star-spark xb-star-spark-a" d="M0-4.5 1.2-1.2 4.5 0 1.2 1.2 0 4.5-1.2 1.2-4.5 0-1.2-1.2Z" fill="currentColor" /></g>
    <g transform="translate(12 51)"><path className="xb-star-spark xb-star-spark-b" d="M0-3 1-1 3 0 1 1 0 3-1 1-3 0-1-1Z" fill="currentColor" /></g>
  </svg>;
}
