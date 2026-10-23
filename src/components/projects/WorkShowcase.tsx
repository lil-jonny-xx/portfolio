"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CATEGORIES, STATUS_LABEL, type CategoryId } from "@/data/projects";
import { ProjectCard, type CardProject } from "./ProjectCard";

type Filter = CategoryId | "all";
type View = "reel" | "index";

export interface ShowcaseItem extends CardProject {
  index: string;
}

export function WorkShowcase({ items }: { items: ShowcaseItem[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [view, setView] = useState<View>("reel");
  const visible = filter === "all" ? items : items.filter((p) => p.categories.includes(filter));

  const counts = new Map<Filter, number>([["all", items.length]]);
  for (const c of CATEGORIES) counts.set(c.id, items.filter((p) => p.categories.includes(c.id)).length);

  return (
    <div>
      <div className="flex flex-col gap-6 border-y border-line py-5 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter projects by category" className="flex flex-wrap gap-2">
          {([{ id: "all", label: "All" }, ...CATEGORIES] as { id: Filter; label: string }[]).map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={filter === c.id}
              onClick={() => setFilter(c.id)}
              className={`meta min-h-10 border px-3 transition-colors ${
                filter === c.id
                  ? "border-fg bg-fg !text-bg"
                  : "border-line-strong hover:border-fg hover:!text-fg"
              }`}
            >
              {c.label} <span className="opacity-60">({counts.get(c.id)})</span>
            </button>
          ))}
        </div>
        <div role="group" aria-label="Layout" className="hidden gap-2 md:flex">
          {(["reel", "index"] as View[]).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={view === v}
              onClick={() => setView(v)}
              className={`meta min-h-10 px-3 transition-colors ${view === v ? "!text-fg underline underline-offset-4" : "hover:!text-fg"}`}
            >
              {v === "reel" ? "Reel" : "Index"}
            </button>
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      {visible.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-muted">No projects in this category yet.</p>
          <button type="button" className="btn mt-6" onClick={() => setFilter("all")}>
            Show all projects
          </button>
        </div>
      ) : view === "reel" ? (
        // key resets the reel position whenever the filter changes
        <Reel key={filter} items={visible} />
      ) : (
        <IndexList items={visible} />
      )}
    </div>
  );
}

const STEP_MIN_ITEMS = 8; // fewer items sit on an arc instead of a sparse full circle

// Below md the reel is laid out as a plain list by CSS, so 3D-only behaviour is skipped.
const is3d = () => window.matchMedia("(min-width: 768px)").matches;

function Reel({ items }: { items: ShowcaseItem[] }) {
  const [active, setActive] = useState(0);
  const [drag, setDrag] = useState(0);
  const [width, setWidth] = useState(0);
  const stageRef = useRef<HTMLUListElement>(null);
  const dragState = useRef<{ x: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  const n = items.length;
  const step = 360 / Math.max(n, STEP_MIN_ITEMS);

  // Card width drives the radius; ResizeObserver reports it on observe and on every resize.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const ro = new ResizeObserver(() => setWidth(stage.offsetWidth));
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  // Radius so neighbouring cards just clear each other.
  const radius = width ? Math.round(width / 2 / Math.tan((step * Math.PI) / 360) + 24) : 0;

  const go = (i: number) => setActive(((i % n) + n) % n);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.pointerType === "mouse" && e.button !== 0) || !is3d()) return;
    dragState.current = { x: e.clientX, moved: false };
    suppressClick.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragState.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (d.moved) setDrag(dx);
  };
  const onPointerUp = () => {
    const d = dragState.current;
    dragState.current = null;
    if (!d?.moved) return;
    suppressClick.current = true;
    const delta = Math.round((-drag / (width || 300)) * 1.4);
    setDrag(0);
    go(active + (delta === 0 ? (drag < -40 ? 1 : drag > 40 ? -1 : 0) : delta));
  };

  const dragDeg = width ? (drag / width) * step * 1.4 : 0;
  const rot = -active * step + dragDeg;

  // Keep the shortest angular distance so far-side cards fade out.
  const distance = (i: number) => {
    const raw = (((i - active) % n) + n) % n;
    return Math.min(raw, n - raw);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(active - 1);
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected projects"
      className="relative"
      onKeyDown={onKeyDown}
    >
      <div
        className="reel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <ul
          ref={stageRef}
          className={`reel-stage ${drag ? "is-dragging" : ""}`}
          style={{ ["--rot" as string]: `${rot}deg`, ["--radius" as string]: `${radius}px` }}
        >
          {items.map((p, i) => {
            const dist = distance(i);
            return (
              <li
                key={p.slug}
                className="reel-item"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${n}: ${p.title}`}
                data-active={i === active}
                data-hidden={dist > 2}
                style={{ ["--angle" as string]: `${i * step}deg` }}
              >
                <ProjectCard
                  project={p}
                  index={p.index}
                  onFocus={() => setActive(i)}
                  onClick={(e) => {
                    if (suppressClick.current) {
                      e.preventDefault();
                      suppressClick.current = false;
                    } else if (i !== active && is3d()) {
                      // first click on a side card brings it to the front
                      e.preventDefault();
                      go(i);
                    }
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-6 hidden items-center justify-between gap-4 md:flex">
        <p className="meta" aria-live="polite">
          <span className="!text-fg">{String(active + 1).padStart(2, "0")}</span> / {String(n).padStart(2, "0")} —{" "}
          {items[active]?.title}
        </p>
        <p className="meta hidden lg:block">Drag, use ← → keys, or the buttons</p>
        <div className="flex gap-2">
          <button type="button" className="btn !px-3" onClick={() => go(active - 1)} aria-label="Previous project">
            <ArrowLeft size={16} aria-hidden="true" />
          </button>
          <button type="button" className="btn !px-3" onClick={() => go(active + 1)} aria-label="Next project">
            <ArrowRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function IndexList({ items }: { items: ShowcaseItem[] }) {
  return (
    <ol className="mt-4">
      {items.map((p) => (
        <li key={p.slug} className="border-b border-line">
          <Link
            href={`/work/${p.slug}`}
            className="group grid grid-cols-[3rem_1fr_auto] items-baseline gap-4 py-6 transition-colors hover:bg-surface-1 md:grid-cols-[4rem_1fr_14rem_8rem_2rem] md:px-2"
          >
            <span className="meta">{p.index}</span>
            <span>
              <span className="font-display text-2xl font-bold uppercase leading-none [font-variation-settings:'wdth'_80] md:text-4xl">
                {p.title}
              </span>
              <span className="mt-2 block max-w-[60ch] text-sm text-muted">{p.summary}</span>
            </span>
            <span className="meta hidden md:block">{p.stack.slice(0, 3).join(" · ")}</span>
            <span className="meta hidden md:block">
              {STATUS_LABEL[p.status]} · {p.year}
            </span>
            <ArrowUpRight
              size={20}
              aria-hidden="true"
              className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </Link>
        </li>
      ))}
    </ol>
  );
}
