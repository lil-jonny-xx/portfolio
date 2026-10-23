import { Contact } from "@/components/contact/Contact";
import { Hero } from "@/components/hero/Hero";
import { Intro } from "@/components/hero/Intro";
import { WorkShowcase, type ShowcaseItem } from "@/components/projects/WorkShowcase";
import { Skills } from "@/components/skills/Skills";
import { SystemsExplorer } from "@/components/systems/SystemsExplorer";
import { Timeline } from "@/components/timeline/Timeline";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { disciplines } from "@/data/disciplines";
import { site } from "@/data/site";
import { timeline } from "@/data/timeline";
import { allProjects, projectIndex } from "@/lib/projects";

export default function Home() {
  // Only card fields go to the client component.
  const items: ShowcaseItem[] = [...allProjects]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .map(({ slug, title, summary, categories, stack, status, diagram, cover, year }) => ({
      slug,
      title,
      summary,
      categories,
      stack,
      status,
      diagram,
      cover,
      year,
      index: projectIndex(slug),
    }));
  const titles = Object.fromEntries(allProjects.map((p) => [p.slug, p.title]));

  return (
    <>
      <Intro />
      <Hero />

      <section id="work" aria-labelledby="work-title" className="py-24 md:py-36">
        <div className="container-x">
          <SectionHeader
            id="work-title"
            index="01"
            label="Selected work"
            title={
              <>
                Engineering
                <br />
                archive
              </>
            }
            intro="Infrastructure, data platforms, research tooling and experiments. Each case study says what was built, what was only planned, and how I know."
          />
          <div data-reveal>
            <WorkShowcase items={items} />
          </div>
        </div>
      </section>

      <section id="systems" aria-labelledby="systems-title" className="border-t border-line py-24 md:py-36">
        <div className="container-x">
          <SectionHeader
            id="systems-title"
            index="02"
            label="Systems"
            title={
              <>
                What I work
                <br />
                beneath
              </>
            }
            intro="Six kinds of systems I keep coming back to, and the projects where each one shows up."
          />
          <div data-reveal>
            <SystemsExplorer items={disciplines} titles={titles} />
          </div>
        </div>
      </section>

      <section id="skills" data-nav="systems" aria-labelledby="skills-title" className="border-t border-line py-24 md:py-36">
        <div className="container-x">
          <SectionHeader
            id="skills-title"
            index="03"
            label="Technical skills"
            title="Toolbox"
            intro="Graded by evidence rather than self-rating: filled marks link to the project where the tool was used."
          />
          <Skills />
        </div>
      </section>

      <section id="journey" data-nav="about" aria-labelledby="journey-title" className="border-t border-line pt-24 md:pt-36">
        <div className="container-x">
          <SectionHeader
            id="journey-title"
            index="04"
            label="Journey"
            title="Build log"
            intro="Projects and study in order. No roles or employment are implied."
          />
        </div>
        <div className="container-x lg:max-w-none lg:px-0">
          <Timeline items={timeline} />
        </div>
      </section>

      <section id="about" aria-labelledby="about-title" className="border-t border-line py-24 md:py-36">
        <div className="container-x grid gap-12 md:grid-cols-12">
          <p className="meta md:col-span-3" data-reveal>
            <span className="!text-fg">05</span> / About
          </p>
          <div className="md:col-span-9 lg:col-span-7">
            <h2 id="about-title" className="sr-only">
              About
            </h2>
            <p className="text-[clamp(1.5rem,1.1rem+1.8vw,2.75rem)] font-medium leading-[1.15] tracking-tight" data-reveal>
              I&apos;m {site.name}, a Computer Science and Engineering student at the National Institute of Technology
              Goa. I&apos;m interested in the systems behind modern software: cloud infrastructure, distributed
              architectures, backend engineering, intelligent data platforms, and quantitative research.
            </p>
            <p className="mt-8 max-w-[60ch] text-[length:var(--text-lead)] leading-snug text-muted" data-reveal>
              I enjoy moving between architecture and implementation, investigating failures, understanding trade-offs,
              and turning a technical idea into a working system — and writing down honestly where it still falls short.
            </p>
            <dl className="mt-14 grid gap-px border border-line bg-line sm:grid-cols-3" data-reveal>
              {[
                ["Study", `${site.degree}`],
                ["Institute", site.institute],
                ["Based in", site.location],
              ].map(([k, v]) => (
                <div key={k} className="bg-bg p-5">
                  <dt className="meta">{k}</dt>
                  <dd className="mt-2">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}
