import Link from "next/link";
import { EVIDENCE_LABEL, skillGroups, type Evidence } from "@/data/skills";
import { getProject } from "@/lib/projects";

const MARK: Record<Evidence, string> = {
  project: "bg-fg",
  practice: "border border-fg",
  learning: "border border-dashed border-subtle",
};

export function Skills() {
  return (
    <div>
      <ul className="meta mb-10 flex flex-wrap gap-x-8 gap-y-2" aria-label="Legend">
        {(Object.keys(EVIDENCE_LABEL) as Evidence[]).map((e) => (
          <li key={e} className="flex items-center gap-2">
            <span className={`inline-block h-2.5 w-2.5 ${MARK[e]}`} aria-hidden="true" />
            {EVIDENCE_LABEL[e]}
          </li>
        ))}
      </ul>

      <div className="grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((g, gi) => (
          <section key={g.id} aria-labelledby={`skills-${g.id}`} className="bg-bg p-6" data-reveal style={{ ["--reveal-i" as string]: gi % 3 }}>
            <h3 id={`skills-${g.id}`} className="meta !text-fg">
              {g.label}
            </h3>
            <ul className="mt-5 space-y-3">
              {g.skills.map((s) => (
                <li key={s.name} className="flex items-start gap-3">
                  <span className={`mt-[0.45em] inline-block h-2.5 w-2.5 shrink-0 ${MARK[s.evidence]}`} aria-hidden="true" />
                  <div className="min-w-0">
                    <span className={s.evidence === "project" ? "" : "text-muted"}>{s.name}</span>
                    <span className="sr-only"> — {EVIDENCE_LABEL[s.evidence]}</span>
                    {s.projects && s.projects.length > 0 && (
                      <span className="mt-0.5 block font-mono text-[0.6875rem] text-subtle">
                        {s.projects.map((slug, i) => (
                          <span key={slug}>
                            {i > 0 && " · "}
                            <Link href={`/work/${slug}`} className="link-u hover:text-fg">
                              {getProject(slug)?.shortTitle}
                            </Link>
                          </span>
                        ))}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
