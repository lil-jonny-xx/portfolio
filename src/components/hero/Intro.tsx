/** Sub-second orbital intro. Pure CSS: never blocks input, skipped under reduced motion. */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true">
      <svg viewBox="-60 -60 120 120" className="h-24 w-24">
        <circle r="40" fill="none" stroke="var(--line-strong)" />
        <g className="orbit-spin" style={{ ["--orbit-dur" as string]: "1.2s" }}>
          <circle cx="40" r="3" fill="var(--accent)" />
        </g>
        <g className="orbit-spin orbit-rev" style={{ ["--orbit-dur" as string]: "1.8s" }}>
          <circle r="24" fill="none" stroke="var(--fg-subtle)" strokeDasharray="2 5" />
          <circle cx="-24" r="2" fill="var(--fg)" />
        </g>
        <text y="4" textAnchor="middle" fill="var(--fg)" style={{ fontFamily: "var(--font-mono)" }} fontSize="9" letterSpacing="2">
          JVP
        </text>
      </svg>
    </div>
  );
}
