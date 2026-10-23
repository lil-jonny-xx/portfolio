// Single source for personal details. Leave a URL empty ("") to hide every link that uses it.
// Environment variables override the defaults so a deployment can set them without a code change.

export const site = {
  name: "Jonathan V Paul",
  shortName: "Jonathan Paul",
  monogram: "JVP",
  role: "Computer Science & Engineering student",
  institute: "National Institute of Technology Goa",
  instituteShort: "NIT Goa",
  degree: "B.Tech, Computer Science and Engineering",
  location: "Goa, India",

  email: process.env.NEXT_PUBLIC_EMAIL ?? "jonathan.paul9090@gmail.com",
  github: process.env.NEXT_PUBLIC_GITHUB_URL ?? "https://github.com/lil-jonny-xx",
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "",
  // Path under /public (e.g. "/resume.pdf") or a full URL.
  resume: process.env.NEXT_PUBLIC_RESUME_URL ?? "",

  // Production origin, no trailing slash. Used for canonical URLs, sitemap and OG tags.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  // Shown in the nav and contact section only when set. Keep it true.
  availability: process.env.NEXT_PUBLIC_AVAILABILITY ?? "",

  description:
    "Jonathan V Paul — Computer Science and Engineering student at NIT Goa working on cloud infrastructure, distributed systems, backend engineering, machine learning and quantitative research.",
} as const;

export type Site = typeof site;
