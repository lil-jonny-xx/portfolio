@AGENTS.md

# Portfolio — working notes for agents

Personal portfolio of Jonathan V Paul. Next.js 16 App Router, fully static, deployed on Vercel.
Read `README.md` for structure and content-editing instructions.

## Commands

- `npm run dev` — dev server
- `npm run lint` · `npm run typecheck` · `npm run test:e2e` (builds, then Playwright) · `npm run check` (all)
- Run `npm run check` before saying a change works.

## Architecture rules

- Content lives only in `src/data/*`. Components never hard-code project facts.
- Server components by default. Client components (`"use client"`) only for interaction: nav, work
  showcase, systems tabs, timeline, reveal observer. Pass client components only the fields they need
  (see `ShowcaseItem`) so case-study text stays out of the client bundle; client code must not import
  `src/lib/projects.ts` (it runs validation and pulls the whole registry).
- No animation library, WebGL, CMS, database or backend. Prefer CSS; any JS animation must use
  requestAnimationFrame, run only while visible, clean up on unmount and honour reduced motion.
- `cacheComponents` / `partialPrefetching` are deliberately off so `dynamicParams = false` returns a real
  404 for unknown `/work/*` slugs.
- Design tokens are CSS variables in `src/app/globals.css`, exposed to Tailwind via `@theme inline`.
  In SVG, set fonts with `style={{ fontFamily: "var(--font-…)" }}`; presentation attributes cannot read
  CSS variables.

## Truthfulness — non-negotiable

- Never invent employment, internships, awards, rankings, metrics, users, deployments or results.
- Every project states `status`, `role` (including team context) and `verification` (what the evidence
  is and where it stops). Planned components are drawn dashed and labelled planned.
- Backtest or research numbers carry a disclaimer and are never presented as financial performance.
- Personal URLs: only real, configured destinations. Empty values hide links; never link to `#`.
- Facts on the site were verified against these local sources (Oct 2026): `D:\CloudScale\BNP-BLR-Team-01`,
  `D:\ecodatas`, `D:\trading`, `D:\RoadSafetyAI\CivTech`, `D:\chain-platform`, `D:\Rooftop-Delivery`.
  Re-check the source before changing a claim.
