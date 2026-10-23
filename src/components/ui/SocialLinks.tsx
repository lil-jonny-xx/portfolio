import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";

/** Only links with a configured destination are rendered. */
export function socialLinks() {
  return [
    { label: "GitHub", href: site.github, external: true },
    { label: "LinkedIn", href: site.linkedin, external: true },
    { label: "Résumé", href: site.resume, external: true },
    { label: "Email", href: site.email ? `mailto:${site.email}` : "", external: false },
  ].filter((l) => l.href);
}

export function SocialLinks({ className = "" }: { className?: string }) {
  const links = socialLinks();
  if (links.length === 0) return null;
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 ${className}`}>
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="meta link-u inline-flex items-center gap-1 py-2 hover:!text-fg"
          >
            {l.label}
            <ArrowUpRight size={12} aria-hidden="true" />
            {l.external && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
