import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Diagram, DiagramLegend } from "@/components/projects/Diagram";
import { ProjectCover, StatusPill } from "@/components/projects/ProjectCover";
import { DIAGRAM_KIND_LABEL, type Section } from "@/data/projects";
import { adjacentProjects, allProjects, categoryLabel, getProject, projectIndex } from "@/lib/projects";

// Only slugs from the registry exist; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return { title: "Project not found" };
  return {
    title: p.title,
    description: p.summary,
    alternates: { canonical: `/work/${p.slug}` },
    openGraph: { title: p.title, description: p.summary, url: `/work/${p.slug}`, type: "article" },
    twitter: { card: "summary_large_image", title: p.title, description: p.summary },
  };
}

export default async function ProjectPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const index = projectIndex(p.slug);
  const { prev, next } = adjacentProjects(p.slug);
  const links = [
    { label: "Source on GitHub", href: p.links.github },
    { label: "Live site", href: p.links.demo },
    { label: "Documentation", href: p.links.docs },
  ].filter((l): l is { label: string; href: string } => !!l.href);

  return (
    <article className="pt-[var(--nav-h)]">
      {/* Header */}
      <header className="container-x pb-12 pt-10 md:pb-16 md:pt-16">
        <nav aria-label="Breadcrumb" className="meta flex items-center gap-2">
          <Link href="/#work" className="link-u inline-flex items-center gap-1 hover:!text-fg">
            <ArrowLeft size={12} aria-hidden="true" /> All work
          </Link>
          <span aria-hidden="true">/</span>
          <span className="!text-fg">{index}</span>
        </nav>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <StatusPill status={p.status} />
          <span className="meta">{p.categories.map(categoryLabel).join(" · ")}</span>
          <span className="meta">· {p.period}</span>
        </div>
        <h1 className="display mt-6 max-w-[16ch] text-[clamp(2.75rem,1rem+7vw,8rem)]">{p.title}</h1>
        <p className="mt-8 max-w-[56ch] text-[length:var(--text-lead)] leading-snug text-muted">{p.summary}</p>
        {links.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-3">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="btn">
                  {l.label} <ArrowUpRight size={14} aria-hidden="true" />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </header>

      <div className="container-x" data-reveal>
        <ProjectCover project={p} index={index} large />
      </div>

      {/* Facts + overview */}
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <aside className="md:col-span-4 lg:col-span-3">
          <dl className="space-y-6 md:sticky md:top-[calc(var(--nav-h)+2rem)]">
            <Fact label="Role">{p.role}</Fact>
            <Fact label="Period">{p.period}</Fact>
            <Fact label="Stack">
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {p.stack.map((s) => (
                  <li key={s} className="tag">
                    {s}
                  </li>
                ))}
              </ul>
            </Fact>
            <Fact label="Evidence">
              <span className="text-sm text-muted">{p.verification}</span>
            </Fact>
          </dl>
        </aside>

        <div className="min-w-0 space-y-20 md:col-span-8 lg:col-span-8 lg:col-start-5">
          <Block n="01" title="Overview">
            <p className="text-[length:var(--text-lead)] leading-snug">{p.overview}</p>
          </Block>

          <Block n="02" title="Context & problem">
            <p>{p.problem}</p>
            <div className="mt-10 grid gap-10 sm:grid-cols-2">
              <List title="Goals" items={p.goals} />
              <List title="Constraints" items={p.constraints} />
            </div>
          </Block>

          <Block n="03" title="Architecture">
            <p>{p.architecture}</p>
          </Block>
        </div>
      </div>

      {/* Diagram, full width */}
      <figure className="container-x" data-reveal>
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-t border-line pt-4">
          <figcaption className="meta !text-fg">Fig. {index} — {p.diagram.title}</figcaption>
          <span className="meta">{DIAGRAM_KIND_LABEL[p.diagram.kind]}</span>
        </div>
        <div className="mt-6 overflow-x-auto border border-line bg-surface-1 p-4 md:p-8" tabIndex={0} aria-label="Diagram, scrollable">
          <Diagram diagram={p.diagram} id={`fig-${p.slug}`} />
        </div>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <p className="max-w-[70ch] text-sm text-muted">{p.diagram.caption}</p>
          <DiagramLegend />
        </div>
      </figure>

      <div className="container-x grid gap-12 py-16 md:grid-cols-12 md:py-24">
        <div className="min-w-0 space-y-20 md:col-span-8 md:col-start-5">
          <Block n="04" title="Implementation">
            <Sections items={p.implementation} />
          </Block>

          {p.table && (
            <Block n="—" title="Data">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <caption className="meta mb-4 text-left">{p.table.caption}</caption>
                  <thead>
                    <tr>
                      {p.table.columns.map((c) => (
                        <th key={c} scope="col" className="meta border-b border-line-strong py-3 pr-4 font-normal">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {p.table.rows.map((r) => (
                      <tr key={r.join()} className="border-b border-line">
                        {r.map((cell, ci) => (
                          <td key={ci} className={`py-3 pr-4 ${ci > 0 && cell.startsWith("Fail") ? "text-muted" : ""}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {p.table.note && <p className="meta mt-4">{p.table.note}</p>}
            </Block>
          )}

          <Block n="05" title="Engineering decisions">
            <Sections items={p.decisions} />
          </Block>

          {p.challenges.length > 0 && (
            <Block n="06" title="Challenges & troubleshooting">
              <Sections items={p.challenges} />
            </Block>
          )}

          <Block n="07" title="Trade-offs">
            <List items={p.tradeoffs} />
          </Block>

          <Block n="08" title="Results & limitations">
            <div className="grid gap-10 sm:grid-cols-2">
              <List title="Verified outcomes" items={p.outcomes} />
              <List title="Limitations" items={p.limitations} muted />
            </div>
          </Block>

          <Block n="09" title="What I learned">
            <List items={p.learned} />
          </Block>

          {p.gallery && p.gallery.length > 0 && (
            <Block n="—" title="Gallery">
              <div className="grid gap-6">
                {p.gallery.map((g) => (
                  <figure key={g.src}>
                    <Image src={g.src} alt={g.alt} width={g.width} height={g.height} className="border border-line" sizes="(min-width: 768px) 66vw, 100vw" />
                    <figcaption className="meta mt-2">{g.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </Block>
          )}

          {p.related.length > 0 && (
            <Block n="—" title="Related">
              <ul className="divide-y divide-line border-y border-line">
                {p.related.map((slug) => {
                  const r = getProject(slug)!;
                  return (
                    <li key={slug}>
                      <Link href={`/work/${slug}`} className="group flex items-center justify-between gap-4 py-4 hover:text-accent">
                        <span>{r.title}</span>
                        <ArrowUpRight size={16} aria-hidden="true" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Block>
          )}
        </div>
      </div>

      {/* Prev / next */}
      <nav aria-label="More projects" className="border-t border-line">
        <div className="container-x grid md:grid-cols-2">
          <Link href={`/work/${prev.slug}`} className="group border-line py-10 md:border-r md:pr-8">
            <span className="meta inline-flex items-center gap-2">
              <ArrowLeft size={12} aria-hidden="true" /> Previous
            </span>
            <span className="display mt-3 block text-3xl transition-colors group-hover:text-accent md:text-5xl">{prev.title}</span>
          </Link>
          <Link href={`/work/${next.slug}`} className="group border-t border-line py-10 text-right md:border-t-0 md:pl-8">
            <span className="meta inline-flex items-center gap-2">
              Next <ArrowRight size={12} aria-hidden="true" />
            </span>
            <span className="display mt-3 block text-3xl transition-colors group-hover:text-accent md:text-5xl">{next.title}</span>
          </Link>
        </div>
      </nav>
    </article>
  );
}

function Fact({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-3">
      <dt className="meta">{label}</dt>
      <dd className="mt-2 text-sm leading-relaxed">{children}</dd>
    </div>
  );
}

function Block({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section data-reveal>
      <h2 className="mb-6 flex items-baseline gap-4 border-t border-line pt-4">
        <span className="meta">{n}</span>
        <span className="font-display text-2xl font-bold uppercase [font-variation-settings:'wdth'_85] md:text-3xl">{title}</span>
      </h2>
      <div className="max-w-[var(--measure)] leading-relaxed text-fg/90">{children}</div>
    </section>
  );
}

function Sections({ items }: { items: Section[] }) {
  return (
    <div className="space-y-8">
      {items.map((s) => (
        <div key={s.title}>
          <h3 className="font-semibold">{s.title}</h3>
          <p className="mt-2 text-muted">{s.body}</p>
        </div>
      ))}
    </div>
  );
}

function List({ title, items, muted = false }: { title?: string; items: string[]; muted?: boolean }) {
  if (items.length === 0) return null;
  return (
    <div>
      {title && <h3 className="meta mb-4 !text-fg">{title}</h3>}
      <ul className="space-y-3">
        {items.map((i) => (
          <li key={i} className={`flex gap-3 ${muted ? "text-muted" : ""}`}>
            <span className="mt-[0.7em] h-px w-3 shrink-0 bg-subtle" aria-hidden="true" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
