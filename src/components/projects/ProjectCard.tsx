import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { CATEGORIES, type Project } from "@/data/projects";
import { ProjectCover } from "./ProjectCover";

/** The fields a card needs; keeps long case-study text out of the client bundle. */
export type CardProject = Pick<Project, "slug" | "title" | "summary" | "categories" | "stack" | "status" | "diagram" | "cover" | "year">;

interface Props {
  project: CardProject;
  index: string;
  onFocus?: () => void;
  onClick?: (e: React.MouseEvent) => void;
}

export function ProjectCard({ project, index, onFocus, onClick }: Props) {
  return (
    <Link
      href={`/work/${project.slug}`}
      onFocus={onFocus}
      onClick={onClick}
      draggable={false}
      className="group flex h-full flex-col border border-line bg-bg transition-colors duration-300 hover:border-fg focus-visible:border-fg"
    >
      <ProjectCover project={project} index={index} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <p className="meta">{project.categories.map((c) => CATEGORIES.find((x) => x.id === c)?.label).join(" · ")}</p>
        <h3 className="font-display text-2xl font-bold uppercase leading-none [font-variation-settings:'wdth'_80]">
          {project.title}
        </h3>
        <p className="line-clamp-3 text-sm text-muted">{project.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Technologies">
          {project.stack.slice(0, 4).map((s) => (
            <li key={s} className="tag">
              {s}
            </li>
          ))}
        </ul>
        <span className="meta mt-2 inline-flex items-center gap-1 !text-fg">
          Read case study
          <ArrowUpRight size={14} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
