import Image from "next/image";
import { STATUS_LABEL, type Project } from "@/data/projects";
import { Diagram } from "./Diagram";

/** Real screenshot when one is registered, otherwise the project's own diagram drawn as an abstract cover. */
export function ProjectCover({
  project,
  index,
  large = false,
}: {
  project: Pick<Project, "slug" | "status" | "diagram" | "cover">;
  index: string;
  large?: boolean;
}) {
  return (
    <div className="grid-lines relative overflow-hidden border border-line bg-surface-1 [background-size:32px_32px]">
      <div className="absolute left-3 top-3 z-10 flex items-center gap-2">
        <span className="meta !text-fg">{index}</span>
        <StatusPill status={project.status} />
      </div>
      {project.cover ? (
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          width={project.cover.width}
          height={project.cover.height}
          className="h-full w-full object-cover"
          sizes={large ? "100vw" : "(min-width: 768px) 360px, 100vw"}
        />
      ) : (
        <div className={`flex items-center justify-center ${large ? "aspect-[16/7] p-10 md:p-16" : "aspect-[4/3] p-6 pt-10"}`}>
          <div className="w-full opacity-80">
            <Diagram diagram={project.diagram} variant="mini" id={`cover-${project.slug}`} />
          </div>
        </div>
      )}
    </div>
  );
}

export function StatusPill({ status }: { status: Project["status"] }) {
  const tone =
    status === "completed" ? "bg-fg text-bg" : status === "in-progress" ? "bg-accent text-[var(--accent-ink)]" : "border border-line-strong text-fg";
  return (
    <span className={`inline-block px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-[0.08em] ${tone}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
