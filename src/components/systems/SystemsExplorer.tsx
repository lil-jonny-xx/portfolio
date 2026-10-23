"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Discipline } from "@/data/disciplines";

/** Accessible tabs (WAI-ARIA tabs pattern, automatic activation). */
export function SystemsExplorer({
  items,
  titles,
}: {
  items: Discipline[];
  /** slug → project title, resolved on the server. */
  titles: Record<string, string>;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    const next = (keys[e.key] + items.length) % items.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const d = items[active];

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div role="tablist" aria-label="Engineering disciplines" aria-orientation="vertical" className="lg:col-span-5" onKeyDown={onKeyDown}>
        {items.map((item, i) => (
          <button
            key={item.id}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            id={`tab-${item.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`panel-${item.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`group flex w-full items-baseline gap-4 border-b border-line py-4 text-left transition-colors ${
              i === active ? "text-fg" : "text-subtle hover:text-fg"
            }`}
          >
            <span className={`meta w-10 shrink-0 ${i === active ? "!text-accent" : ""}`}>{item.code}</span>
            <span className="display text-3xl md:text-4xl">{item.title}</span>
          </button>
        ))}
      </div>

      <div
        id={`panel-${d.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${d.id}`}
        tabIndex={0}
        className="relative border border-line bg-surface-1 p-6 md:p-10 lg:col-span-7"
      >
        <p className="meta">
          {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")} — {d.code}
        </p>
        <h3 className="mt-6 font-display text-3xl font-bold uppercase leading-none [font-variation-settings:'wdth'_85] md:text-5xl">
          {d.title}
        </h3>
        <p className="mt-6 max-w-[56ch] text-[length:var(--text-lead)] leading-snug text-muted">{d.body}</p>

        <h4 className="meta mt-10">Tools</h4>
        <ul className="mt-3 flex flex-wrap gap-2">
          {d.tools.map((t) => (
            <li key={t} className="tag">
              {t}
            </li>
          ))}
        </ul>

        <h4 className="meta mt-10">Where it shows up</h4>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {d.projects.map((slug) => (
            <li key={slug}>
              <Link href={`/work/${slug}`} className="group flex items-center justify-between gap-4 py-3 hover:text-accent">
                <span>{titles[slug]}</span>
                <ArrowUpRight size={16} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
