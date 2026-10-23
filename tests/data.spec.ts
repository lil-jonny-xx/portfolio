import { expect, test } from "@playwright/test";
import { projects } from "../src/data/projects";
import { adjacentProjects, filterProjects, validateProjects } from "../src/lib/projects";

test.describe("project registry", () => {
  test.skip(({ isMobile }) => isMobile, "pure data tests run once");

  test("current registry is valid", () => {
    expect(() => validateProjects(projects)).not.toThrow();
  });

  test("rejects duplicate slugs and dangling references", () => {
    expect(() => validateProjects([projects[0], projects[0]])).toThrow(/Duplicate slug/);
    expect(() => validateProjects([{ ...projects[0], related: ["nope"] }])).toThrow(/not found/);
    const badEdge = { ...projects[0], diagram: { ...projects[0].diagram, edges: [{ from: "x", to: "y" }] } };
    expect(() => validateProjects([badEdge])).toThrow(/unknown node/);
  });

  test("filter and adjacency", () => {
    expect(filterProjects(projects, "all")).toHaveLength(projects.length);
    for (const p of filterProjects(projects, "quant")) expect(p.categories).toContain("quant");
    const { prev, next } = adjacentProjects(projects[0].slug);
    expect(prev.slug).toBe(projects[projects.length - 1].slug);
    expect(next.slug).toBe(projects[1].slug);
  });
});
