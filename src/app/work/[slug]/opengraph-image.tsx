import { site } from "@/data/site";
import { allProjects, getProject } from "@/lib/projects";
import { ogImage, ogSize } from "@/lib/og";

export const alt = "Project case study";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return allProjects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  return ogImage("Case study", p?.title ?? "Project", `${site.name} · ${p?.period ?? ""}`);
}
