"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";

const LINKS = [
  { id: "work", label: "Work" },
  { id: "systems", label: "Systems" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export function SiteNav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [observed, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState<string | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const active = onHome ? observed : null;
  const href = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  // Active section: the one crossing the middle band of the viewport.
  useEffect(() => {
    if (!onHome) return;
    // Sections without their own link (skills, journey) name the link they belong to via data-nav.
    const sections = document.querySelectorAll<HTMLElement>("main section[id]");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) setActive(el.dataset.nav ?? el.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [onHome]);

  // Scroll progress, written straight to the DOM once per frame.
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  // Local time in Goa, rendered after mount to avoid a hydration mismatch.
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  // Mobile menu: lock scroll, move focus in, trap Tab, close on Escape.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    document.body.style.overflow = "hidden";
    panel?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key !== "Tab" || !panel) return;
      const focusables = [buttonRef.current, ...panel.querySelectorAll<HTMLElement>("a")].filter(
        (el): el is HTMLElement => !!el,
      );
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-nav)] border-b border-line bg-bg/85 backdrop-blur-sm">
      <div className="container-x flex h-[var(--nav-h)] items-center justify-between gap-6">
        <Link
          href={onHome ? "#top" : "/"}
          className="group flex items-baseline gap-3"
          aria-label={`${site.monogram} — ${site.name}, back to top`}
          onClick={() => setOpen(false)}
        >
          <span className="display text-2xl tracking-normal transition-colors group-hover:text-accent">{site.monogram}</span>
          <span className="meta hidden sm:inline">Portfolio / 2026</span>
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {LINKS.map((l, i) => (
              <li key={l.id}>
                <a
                  href={href(l.id)}
                  aria-current={active === l.id ? "true" : undefined}
                  className={`group meta flex items-center gap-2 py-2 transition-colors hover:!text-fg ${
                    active === l.id ? "!text-fg" : ""
                  }`}
                >
                  <span className={active === l.id ? "text-accent" : ""}>0{i + 1}</span>
                  <span className="link-u">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex" aria-label="Location">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="pulse absolute inset-0 rounded-full bg-accent" />
          </span>
          <span className="meta">
            {site.location}
            {time && <> · {time} IST</>}
          </span>
        </div>

        <button
          ref={buttonRef}
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </div>

      <div className="h-px w-full bg-transparent">
        <div ref={progressRef} className="h-px origin-left scale-x-0 bg-accent" aria-hidden="true" />
      </div>

      {open && (
        <div
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="fixed inset-x-0 bottom-0 top-[calc(var(--nav-h)+1px)] z-[var(--z-menu)] flex flex-col justify-between bg-bg px-[var(--gutter)] pb-10 pt-8 md:hidden"
        >
          <nav aria-label="Mobile">
            <ul className="flex flex-col">
              {LINKS.map((l, i) => (
                <li key={l.id} className="border-b border-line">
                  <a href={href(l.id)} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-5">
                    <span className="meta">0{i + 1}</span>
                    <span className="display text-5xl">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <p className="meta">
            {site.location}
            {time && <> · {time} IST</>}
          </p>
        </div>
      )}
    </header>
  );
}
