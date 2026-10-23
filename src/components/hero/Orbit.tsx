import { disciplines } from "@/data/disciplines";

/** Original orbital system diagram: each ring carries discipline codes from the Systems section. */
export function Orbit({ className = "" }: { className?: string }) {
  const rings = [
    { r: 110, dur: "60s", rev: false, items: disciplines.slice(0, 2) },
    { r: 170, dur: "90s", rev: true, items: disciplines.slice(2, 4) },
    { r: 230, dur: "120s", rev: false, items: disciplines.slice(4, 6) },
  ];
  return (
    <svg viewBox="-260 -260 520 520" className={className} aria-hidden="true" focusable="false">
      {/* crosshair and ticks */}
      <g stroke="var(--line-strong)" strokeWidth="1">
        <line x1="-255" y1="0" x2="255" y2="0" />
        <line x1="0" y1="-255" x2="0" y2="255" />
        {Array.from({ length: 72 }, (_, i) => {
          const a = (i * 5 * Math.PI) / 180;
          const inner = i % 6 === 0 ? 244 : 250;
          return (
            <line
              key={i}
              x1={(Math.cos(a) * inner).toFixed(2)}
              y1={(Math.sin(a) * inner).toFixed(2)}
              x2={(Math.cos(a) * 255).toFixed(2)}
              y2={(Math.sin(a) * 255).toFixed(2)}
            />
          );
        })}
      </g>

      {rings.map((ring, ri) => (
        <g key={ri}>
          <circle r={ring.r} fill="none" stroke="var(--line-strong)" strokeDasharray={ri === 1 ? "2 6" : undefined} />
          <g
            className={`orbit-spin ${ring.rev ? "orbit-rev" : ""}`}
            style={{ ["--orbit-dur" as string]: ring.dur }}
          >
            {ring.items.map((d, i) => {
              const a = (i * Math.PI) + ri * 0.9;
              const x = Math.cos(a) * ring.r;
              const y = Math.sin(a) * ring.r;
              return (
                <g key={d.id} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
                  <rect x="-22" y="-11" width="44" height="22" fill="var(--bg)" stroke="var(--fg-muted)" />
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="var(--fg)"
                    style={{ fontFamily: "var(--font-mono)" }}
                    fontSize="10"
                    letterSpacing="1"
                  >
                    {d.code}
                  </text>
                </g>
              );
            })}
          </g>
        </g>
      ))}

      <circle r="34" fill="var(--bg)" stroke="var(--fg)" />
      <circle r="4" fill="var(--accent)" className="pulse" />
      <text y="54" textAnchor="middle" fill="var(--fg-subtle)" style={{ fontFamily: "var(--font-mono)" }} fontSize="9" letterSpacing="2">
        CORE
      </text>
    </svg>
  );
}
