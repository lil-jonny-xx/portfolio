# Jonathan V Paul — Engineering Portfolio

Personal portfolio and project archive. A monochrome, editorial site with a CSS 3D project reel,
data-driven architecture diagrams and a case-study page for every project.

- **Stack:** Next.js 16 (App Router, static generation), React 19, TypeScript (strict), Tailwind CSS 4,
  Lucide icons, Playwright.
- **No backend, database, CMS or secrets.** All content is typed local data.
- **Motion:** CSS transitions plus small IntersectionObserver / requestAnimationFrame hooks. No animation
  library and no WebGL. Everything respects `prefers-reduced-motion`.

## Requirements

- Node.js 20.9 or newer (developed on Node 24)
- npm

## Local development

```bash
npm install
npm run dev            # http://localhost:3000
```

## Production build

```bash
npm run build
npm run start          # serves the production build on http://localhost:3000
```

## Quality checks

```bash
npm run lint           # ESLint (next/core-web-vitals + TypeScript rules)
npm run typecheck      # generates route types, then tsc --noEmit
npx playwright install chromium   # once
npm run test:e2e       # production build + Playwright (desktop and Pixel 7 projects)
npm run check          # all of the above
```

The Playwright suite covers: every section rendering without console errors, no horizontal overflow from
320 px to 1920 px, category filters (mouse and keyboard), reel buttons and arrow keys, the index view,
systems tabs, nav scrolling, the mobile menu (focus in, Escape, focus return), every case-study route,
404 for an unknown slug, hidden unconfigured links, internal link resolution, reduced-motion visibility,
sitemap/robots/OG routes, and registry validation.

## Project structure

```
src/
  app/
    layout.tsx               fonts, metadata, nav, footer, reveal observer
    page.tsx                 home: hero, work, systems, skills, journey, about, contact
    work/[slug]/page.tsx     case study, generated from the registry
    work/[slug]/opengraph-image.tsx
    opengraph-image.tsx, sitemap.ts, robots.ts, icon.svg, not-found.tsx
    globals.css              design tokens and the few hand-written CSS components
  components/
    hero/        Hero, Orbit (SVG), Intro (sub-second CSS intro)
    projects/    WorkShowcase (filters + reel + index), ProjectCard, ProjectCover, Diagram
    systems/     SystemsExplorer (ARIA tabs)
    skills/      Skills (evidence-graded)
    timeline/    Timeline (pinned horizontal on wide screens, native scroll elsewhere)
    navigation/  SiteNav (active section, progress bar, mobile menu)
    contact/, ui/, motion/, Footer.tsx
  data/
    site.ts          name, links, production URL, availability
    projects.ts      the project registry and its types
    skills.ts        skills with evidence level
    timeline.ts      milestones
    disciplines.ts   the six "systems" disciplines
  lib/
    projects.ts      lookup helpers + build-time validation of all cross-references
    og.tsx           shared Open Graph image
tests/               Playwright specs
```

## Updating content

### Personal links and résumé

Edit `src/data/site.ts`, or set the environment variables listed in `.env.example`. A link with an
empty value is not rendered anywhere.

- **Résumé:** copy the PDF to `public/resume.pdf` and set `resume: "/resume.pdf"` (or
  `NEXT_PUBLIC_RESUME_URL=/resume.pdf`). Check what the PDF exposes (phone number, address) before
  publishing it.
- **LinkedIn:** set `linkedin` / `NEXT_PUBLIC_LINKEDIN_URL`.
- **Availability:** leave empty unless it is currently true.

### Adding or editing a project

Add an object to the `projects` array in `src/data/projects.ts`. Nothing else needs editing: the reel,
filters, index view, case-study route, Open Graph image and sitemap are all generated from it.

- `status`: `completed`, `in-progress`, `research` or `prototype`.
- `role` and `verification` are required on purpose: say who did what and what the evidence is.
- `diagram`: nodes sit on a small grid (`col`, `row`). Use `tone: "planned"` for components that do not
  exist yet and `planned: true` on their edges; they render dashed. `kind` labels the whole figure
  (`applied`, `implemented`, `partly-built`, `proposed`).
- `featured: true` places a project at the front of the reel.
- `table` (optional) renders a data table on the case study.

The build fails with a clear message if a slug is duplicated, a diagram edge names a missing node, or a
skill, timeline entry, discipline or related project references a slug that does not exist.

### Screenshots and images

Put files in `public/images/projects/` and reference them from the project:

```ts
cover: { src: "/images/projects/ecodata-screener.png", alt: "EcoData screener", width: 1600, height: 1000 },
gallery: [{ src: "/images/projects/ecodata-macro.png", alt: "...", caption: "...", width: 1600, height: 1000 }],
```

Without a `cover`, the project's own architecture diagram is drawn as its cover. Only use real
screenshots, and sanitise terminals and dashboards first. Keep images under ~300 KB; `next/image`
handles responsive sizes.

### Skills, timeline, disciplines

`src/data/skills.ts`, `src/data/timeline.ts` and `src/data/disciplines.ts`. Skills use evidence levels
(`project`, `practice`, `learning`) instead of ratings; link `project` skills to the slugs where they
were used.

### Metadata

Site title and description come from `src/data/site.ts` and `src/app/layout.tsx`. Set
`NEXT_PUBLIC_SITE_URL` to the production origin so canonical URLs, the sitemap and Open Graph tags are
absolute and correct.

## Deploying to Vercel

1. Create an empty GitHub repository, then push this folder:
   ```bash
   git add -A
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-user>/<repo>.git
   git push -u origin main
   ```
2. In Vercel: **Add New → Project → Import** the repository. The framework is detected as Next.js; keep
   the default build command (`next build`) and output settings.
3. Under **Settings → Environment Variables**, set at least `NEXT_PUBLIC_SITE_URL` (for example
   `https://<project>.vercel.app`), plus any of the optional values from `.env.example`. Redeploy after
   changing them; they are read at build time.
4. Deploy. Every case study is pre-rendered, so deep links such as `/work/ecodata` work immediately.
5. **Custom domain later:** Settings → Domains → add the domain, follow the DNS instructions, then
   update `NEXT_PUBLIC_SITE_URL` to the new origin and redeploy.

No secrets are required. Never put tokens in `NEXT_PUBLIC_*` variables — they are embedded in the
client bundle.

## Measured results

Lighthouse 12, mobile emulation, against `next start` on the development machine (local network, so
real-world numbers will differ): Performance 93, Accessibility 97, Best Practices 100, SEO 100;
CLS 0, TBT 70 ms, LCP 3.2 s. The two accessibility findings from that run (footer monogram contrast,
logo accessible name) were fixed afterwards and have not been re-measured.

## Credits

Interaction ideas (orbital intro, cylindrical reel, horizontal timeline) were inspired by
[ECHO-WEBSITE](https://github.com/Jishnu09-siuu/ECHO-WEBSITE). No code, copy, images or branding from it
are used.
