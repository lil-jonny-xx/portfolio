import { DIAGRAM_KIND_LABEL, type Diagram as DiagramData, type DiagramNode } from "@/data/projects";

const CW = 244; // cell width (leaves room for edge labels between columns)
const CH = 96; // cell height
const NW = 180; // node width
const NH = 56; // node height
const PAD = 28;

const center = (n: DiagramNode) => ({ x: PAD + n.col * CW + NW / 2, y: PAD + n.row * CH + NH / 2 });

/** Point where the segment from a box's centre towards (dx, dy) leaves the box. */
function exit(c: { x: number; y: number }, dx: number, dy: number, gap = 4) {
  const hw = NW / 2 + gap;
  const hh = NH / 2 + gap;
  const t = Math.min(dx ? hw / Math.abs(dx) : Infinity, dy ? hh / Math.abs(dy) : Infinity);
  return { x: c.x + dx * t, y: c.y + dy * t };
}

interface Props {
  diagram: DiagramData;
  /** mini = labels hidden, used as a project cover. */
  variant?: "full" | "mini";
  id: string;
}

export function Diagram({ diagram, variant = "full", id }: Props) {
  const mini = variant === "mini";
  const width = PAD * 2 + (diagram.cols - 1) * CW + NW;
  const height = PAD * 2 + (diagram.rows - 1) * CH + NH;
  const byId = new Map(diagram.nodes.map((n) => [n.id, n]));
  const desc = diagram.edges
    .map((e) => `${byId.get(e.from)?.label} to ${byId.get(e.to)?.label}${e.planned ? " (planned)" : ""}`)
    .join("; ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block h-auto w-full"
      role={mini ? undefined : "img"}
      aria-hidden={mini ? true : undefined}
      aria-labelledby={mini ? undefined : `${id}-title ${id}-desc`}
      style={mini ? undefined : { minWidth: Math.min(width, 680) }}
    >
      {!mini && (
        <>
          <title id={`${id}-title`}>{diagram.title}</title>
          <desc id={`${id}-desc`}>{`${DIAGRAM_KIND_LABEL[diagram.kind]}. Connections: ${desc}.`}</desc>
        </>
      )}
      <defs>
        <marker id={`${id}-arrow`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 z" fill="var(--fg-muted)" />
        </marker>
      </defs>

      {diagram.groups?.map((g) => (
        <g key={g.label}>
          <rect
            x={PAD + g.col * CW - 12}
            y={PAD + g.row * CH - 14}
            width={(g.cols - 1) * CW + NW + 24}
            height={(g.rows - 1) * CH + NH + 28}
            fill="none"
            stroke="var(--line-strong)"
            strokeDasharray="1 5"
          />
          {!mini && (
            <text
              x={PAD + g.col * CW - 6}
              y={PAD + g.row * CH - 20}
              fill="var(--fg-subtle)"
              style={{ fontFamily: "var(--font-mono)" }}
              fontSize="10"
              letterSpacing="1"
            >
              {g.label.toUpperCase()}
            </text>
          )}
        </g>
      ))}

      {diagram.edges.map((e) => {
        const a = byId.get(e.from)!;
        const b = byId.get(e.to)!;
        const ca = center(a);
        const cb = center(b);
        const dx = cb.x - ca.x;
        const dy = cb.y - ca.y;
        const p1 = exit(ca, dx, dy);
        const p2 = exit(cb, -dx, -dy);
        return (
          <g key={`${e.from}-${e.to}`}>
            <line
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              className={`diagram-edge ${e.planned ? "planned" : ""}`}
              stroke={e.planned ? "var(--fg-subtle)" : "var(--fg-muted)"}
              strokeWidth={mini ? 2 : 1.25}
              strokeDasharray={e.planned ? "4 4" : undefined}
              markerEnd={mini ? undefined : `url(#${id}-arrow)`}
            />
            {!mini && e.label && (
              <text
                x={(p1.x + p2.x) / 2}
                y={(p1.y + p2.y) / 2 - 6}
                textAnchor="middle"
                fill="var(--accent)"
                style={{ fontFamily: "var(--font-mono)" }}
                fontSize="9.5"
                paintOrder="stroke"
                stroke="var(--surface-1)"
                strokeWidth="4"
              >
                {e.label}
              </text>
            )}
          </g>
        );
      })}

      {diagram.nodes.map((n) => {
        const x = PAD + n.col * CW;
        const y = PAD + n.row * CH;
        const planned = n.tone === "planned";
        const core = n.tone === "core";
        const external = n.tone === "external";
        return (
          <g key={n.id}>
            <rect
              x={x}
              y={y}
              width={NW}
              height={NH}
              fill={core ? "var(--surface-3)" : "var(--surface-1)"}
              stroke={core ? "var(--fg)" : planned ? "var(--fg-subtle)" : external ? "var(--line-strong)" : "var(--fg-muted)"}
              strokeDasharray={planned ? "5 4" : external ? "2 3" : undefined}
              strokeWidth={mini ? 2 : 1}
            />
            {core && <rect x={x} y={y} width="4" height={NH} fill="var(--accent)" />}
            {!mini && (
              <>
                <text
                  x={x + 12}
                  y={y + (n.sub ? 23 : NH / 2 + 4)}
                  fill={planned ? "var(--fg-muted)" : "var(--fg)"}
                  style={{ fontFamily: "var(--font-sans)" }}
                  fontSize="13"
                  fontWeight="600"
                >
                  {n.label}
                </text>
                {n.sub && (
                  <text x={x + 12} y={y + 41} fill="var(--fg-subtle)" style={{ fontFamily: "var(--font-mono)" }} fontSize="9.5">
                    {n.sub}
                  </text>
                )}
              </>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** Legend explaining the line and box styles used above. */
export function DiagramLegend() {
  const item = "flex items-center gap-2";
  return (
    <ul className="meta flex flex-wrap gap-x-6 gap-y-2">
      <li className={item}>
        <span className="inline-block h-3 w-5 border border-fg bg-surface-3 shadow-[inset_3px_0_0_var(--accent)]" /> Core
      </li>
      <li className={item}>
        <span className="inline-block h-3 w-5 border border-muted" /> Built
      </li>
      <li className={item}>
        <span className="inline-block h-3 w-5 border border-dashed border-subtle" /> Planned
      </li>
      <li className={item}>
        <span className="inline-block h-3 w-5 border border-dotted border-line-strong" /> External
      </li>
    </ul>
  );
}
