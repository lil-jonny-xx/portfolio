"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Milestone } from "@/data/timeline";

/**
 * Wide screens with motion allowed: the section pins and vertical scroll moves the track sideways.
 * Everywhere else: a vertical list on phones, a native horizontal scroller on tablets.
 */
export function Timeline({ items }: { items: Milestone[] }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const [pinned, setPinned] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    const update = () => setPinned(mq.matches);
    mq.addEventListener("change", update);
    // matchMedia has no initial event; read it once in a microtask to keep effects free of sync setState.
    queueMicrotask(update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Horizontal distance the track must travel.
  useEffect(() => {
    const track = trackRef.current;
    if (!pinned || !track) return;
    const ro = new ResizeObserver(() => setDistance(Math.max(0, track.scrollWidth - window.innerWidth)));
    ro.observe(track);
    return () => ro.disconnect();
  }, [pinned]);

  // Map vertical progress through the section to translateX, only while the section is on screen.
  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!pinned || !outer || !track) return;
    let frame = 0;
    let inView = false;
    const apply = () => {
      frame = 0;
      const rect = outer.getBoundingClientRect();
      const span = rect.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -rect.top / span)) : 0;
      track.style.transform = `translate3d(${-p * distance}px,0,0)`;
    };
    const onScroll = () => {
      if (inView && !frame) frame = requestAnimationFrame(apply);
    };
    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      if (inView) onScroll();
    });
    io.observe(outer);
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      track.style.transform = "";
    };
  }, [pinned, distance]);

  // Keyboard focus on an off-screen milestone: scroll the page to the point where it is in view.
  const onFocus = (e: React.FocusEvent) => {
    const outer = outerRef.current;
    const item = (e.target as HTMLElement).closest("li");
    if (!pinned || !outer || !item || !distance) return;
    (e.currentTarget as HTMLElement).scrollLeft = 0;
    const p = Math.min(1, Math.max(0, (item.offsetLeft - window.innerWidth * 0.2) / distance));
    const top = outer.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + p * (outer.offsetHeight - window.innerHeight), behavior: "instant" });
  };

  return (
    <div ref={outerRef} style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}>
      <div
        className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : ""}
        onFocus={onFocus}
      >
        <ol
          ref={trackRef}
          className={
            pinned
              ? "ml-[var(--gutter)] flex w-max gap-0 border-t border-line pr-[30vw] will-change-transform"
              : "timeline-track flex flex-col md:flex-row md:overflow-x-auto md:border-t md:border-line md:pb-6"
          }
          aria-label="Milestones"
          tabIndex={pinned ? undefined : 0}
        >
          {items.map((m, i) => (
            <li
              key={`${m.date}-${m.title}`}
              className="relative flex shrink-0 flex-col border-l border-line py-6 pl-6 pr-8 md:w-[22rem] md:py-0 md:pt-10 lg:w-[26rem]"
            >
              <span className="absolute -left-[5px] top-8 h-2.5 w-2.5 bg-fg md:-top-[5px]" aria-hidden="true" />
              <p className="meta">
                {String(i + 1).padStart(2, "0")} — {m.date}
              </p>
              <h3 className="display mt-4 text-4xl md:text-5xl">{m.title}</h3>
              <p className="mt-4 max-w-[34ch] text-muted">{m.body}</p>
              {m.project && (
                <Link href={`/work/${m.project}`} className="meta link-u mt-6 inline-flex w-fit items-center gap-1 !text-fg">
                  Case study <ArrowUpRight size={12} aria-hidden="true" />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
