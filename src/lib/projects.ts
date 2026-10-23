import { disciplines } from "@/data/disciplines";
import { CATEGORIES, projects, type CategoryId, type Project } from "@/data/projects";
import { skillGroups } from "@/data/skills";
import { timeline } from "@/data/timeline";

/** Throws on registry mistakes so they fail the build instead of rendering a broken page. */
export function validateProjects(list: Project[]): void {
  const slugs = new Set<string>();
  const categoryIds = new Set<string>(CATEGORIES.map((c) => c.id));
  for (const p of list) {
    if (!/^[a-z0-9-]+$/.test(p.slug)) throw new Error(`Invalid slug "${p.slug}"`);
    if (slugs.has(p.slug)) throw new Error(`Duplicate slug "${p.slug}"`);
    slugs.add(p.slug);
    if (p.categories.length === 0) throw new Error(`${p.slug}: needs a category`);
    for (const c of p.categories) if (!categoryIds.has(c)) throw new Error(`${p.slug}: unknown category ${c}`);
    const nodes = new Set(p.diagram.nodes.map((n) => n.id));
    for (const n of p.diagram.nodes) {
      if (n.col < 0 || n.col >= p.diagram.cols || n.row < 0 || n.row >= p.diagram.rows)
        throw new Error(`${p.slug}: diagram node ${n.id} outside grid`);
    }
    for (const e of p.diagram.edges) {
      if (!nodes.has(e.from) || !nodes.has(e.to)) throw new Error(`${p.slug}: edge ${e.from}->${e.to} has unknown node`);
    }
  }
  for (const p of list) {
    for (const r of p.related) if (!slugs.has(r)) throw new Error(`${p.slug}: related project "${r}" not found`);
  }
}

validateProjects(projects);

// Other data files link to projects by slug; catch typos at build time.
{
  const known = new Set(projects.map((p) => p.slug));
  const refs = [
    ...skillGroups.flatMap((g) => g.skills.flatMap((s) => s.projects ?? [])),
    ...timeline.flatMap((m) => (m.project ? [m.project] : [])),
    ...disciplines.flatMap((d) => d.projects),
  ];
  for (const r of refs) if (!known.has(r)) throw new Error(`Unknown project slug "${r}" referenced in data`);
}

export const allProjects = projects;

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function filterProjects(list: Project[], category: CategoryId | "all"): Project[] {
  return category === "all" ? list : list.filter((p) => p.categories.includes(category));
}

/** Previous and next project, wrapping around, in registry order. */
export function adjacentProjects(slug: string): { prev: Project; next: Project } {
  const i = projects.findIndex((p) => p.slug === slug);
  const n = projects.length;
  return { prev: projects[(i - 1 + n) % n], next: projects[(i + 1) % n] };
}

export function projectIndex(slug: string): string {
  return String(projects.findIndex((p) => p.slug === slug) + 1).padStart(2, "0");
}

export function categoryLabel(id: CategoryId): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
