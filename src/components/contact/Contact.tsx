import { ArrowUpRight } from "lucide-react";
import { socialLinks } from "@/components/ui/SocialLinks";
import { site } from "@/data/site";

export function Contact() {
  const links = socialLinks();
  return (
    <section id="contact" aria-labelledby="contact-title" className="border-t border-line py-24 md:py-36">
      <div className="container-x">
        <p className="meta" data-reveal>
          <span className="!text-fg">06</span> / Contact
        </p>
        <h2 id="contact-title" className="display mt-8 text-[length:var(--text-h2)]" data-reveal>
          Have a system
          <br />
          worth building?
        </h2>
        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-12 md:grid-cols-12" data-reveal>
          <div className="md:col-span-5">
            <p className="text-[length:var(--text-lead)] leading-snug text-muted">
              I&apos;m interested in thoughtful engineering, reliable infrastructure, and technically challenging
              problems.
            </p>
            {site.availability && <p className="meta mt-6 !text-accent">{site.availability}</p>}
          </div>
          <ul className="divide-y divide-line border-y border-line md:col-span-6 md:col-start-7">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center justify-between gap-4 py-5 transition-colors hover:text-accent"
                >
                  <span className="meta w-24 shrink-0">{l.label}</span>
                  <span className="min-w-0 flex-1 truncate text-right text-lg md:text-xl">
                    {l.label === "Email" ? site.email : l.href.replace(/^https?:\/\//, "")}
                  </span>
                  <ArrowUpRight size={20} aria-hidden="true" className="shrink-0 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                  {l.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
