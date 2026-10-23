import { ArrowRight } from "lucide-react";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { site } from "@/data/site";
import { Orbit } from "./Orbit";

const LINES = ["I build", "systems", "that scale."];

export function Hero() {
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-[var(--nav-h)]">
      <div className="grid-lines pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_70%_40%,black,transparent_70%)]" />

      <div className="container-x relative flex min-h-[calc(100svh-var(--nav-h))] flex-col justify-between gap-12 py-10 md:py-14">
        <div className="flex items-start justify-between gap-6">
          <p className="meta hero-fade" style={{ ["--i" as string]: 0 }}>
            Engineering / Cloud / Systems
          </p>
          <p className="meta hero-fade hidden text-right sm:block" style={{ ["--i" as string]: 1 }}>
            {site.instituteShort} — CSE
            <br />
            15.3° N / 74.0° E
          </p>
        </div>

        <Orbit className="pointer-events-none absolute right-[-20%] top-1/2 -z-10 w-[min(110vw,760px)] -translate-y-1/2 opacity-25 sm:right-[-8%] md:opacity-100 lg:right-[2%]" />

        <h1 id="hero-title" className="display text-[length:var(--text-display)]">
          {LINES.map((line, i) => (
            <span key={line} className="hero-line">
              <span style={{ ["--i" as string]: i }} className={i === 1 ? "pl-[0.6em]" : undefined}>
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="hero-fade md:col-span-6 lg:col-span-5" style={{ ["--i" as string]: 2 }}>
            <p className="text-[length:var(--text-lead)] leading-snug">
              I&apos;m {site.shortName}, a Computer Science and Engineering student at NIT Goa, interested in cloud
              infrastructure, distributed systems, backend engineering, machine learning, and quantitative research.
            </p>
            <p className="mt-4 max-w-[52ch] text-muted">
              From infrastructure as code to intelligent research systems, I like understanding how things work
              beneath the interface.
            </p>
          </div>

          <div
            className="hero-fade flex flex-col gap-6 md:col-span-6 md:items-end lg:col-span-7"
            style={{ ["--i" as string]: 3 }}
          >
            <div className="flex flex-wrap gap-3">
              <a href="#work" className="btn btn-primary">
                Explore my work <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href="#contact" className="btn">
                Get in touch
              </a>
            </div>
            <SocialLinks />
          </div>
        </div>
      </div>
    </section>
  );
}
