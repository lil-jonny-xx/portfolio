import { expect, test } from "@playwright/test";
import { projects } from "../src/data/projects";

test.describe("home", () => {
  test("renders every section without console errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("I build");
    for (const id of ["work", "systems", "skills", "journey", "about", "contact"]) {
      await expect(page.locator(`section#${id}`)).toBeAttached();
    }
    await page.waitForLoadState("networkidle");
    expect(errors).toEqual([]);
  });

  for (const width of [320, 375, 768, 1024, 1280, 1440, 1920]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("category filter changes the rendered projects", async ({ page }) => {
    await page.goto("/");
    const cards = page.locator("#work a[href^='/work/']");
    await expect(cards).toHaveCount(projects.length);

    const blockchain = page.getByRole("button", { name: /^Blockchain/ });
    await blockchain.click();
    await expect(blockchain).toHaveAttribute("aria-pressed", "true");
    const expected = projects.filter((p) => p.categories.includes("blockchain")).length;
    await expect(cards).toHaveCount(expected);
    await expect(cards.first()).toHaveAttribute("href", "/work/permissioned-blockchain");

    await page.getByRole("button", { name: /^All/ }).click();
    await expect(cards).toHaveCount(projects.length);
  });

  test("filter buttons are keyboard operable", async ({ page }) => {
    await page.goto("/");
    const ml = page.getByRole("button", { name: /^Machine Learning/ });
    await ml.focus();
    await page.keyboard.press("Enter");
    await expect(ml).toHaveAttribute("aria-pressed", "true");
    await expect(page.locator("#work a[href^='/work/']")).toHaveCount(1);
  });

  test("no link points at a bare #", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("a[href='#'], a[href='']")).toHaveCount(0);
  });

  test("unconfigured social links are hidden", async ({ page }) => {
    await page.goto("/");
    // LinkedIn and résumé have no default URL in src/data/site.ts.
    await expect(page.getByRole("link", { name: /LinkedIn/ })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /Résumé/ })).toHaveCount(0);
    await expect(page.locator("#contact a[href^='mailto:']")).toHaveCount(1);
  });

  test("internal links resolve", async ({ page, request }) => {
    await page.goto("/");
    const hrefs = await page.$$eval("a[href^='/']", (as) => [
      ...new Set(as.map((a) => a.getAttribute("href")!.split("#")[0] || "/")),
    ]);
    for (const href of hrefs) {
      const res = await request.get(href);
      expect(res.status(), href).toBe(200);
    }
  });

  test("reduced motion: content is visible without animation", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/");
    await expect(page.locator(".intro")).toBeHidden();
    const hidden = await page.$$eval(
      "[data-reveal]",
      (els) => els.filter((e) => getComputedStyle(e).opacity !== "1").length,
    );
    expect(hidden).toBe(0);
    await ctx.close();
  });
});

test.describe("desktop interactions", () => {
  test.skip(({ isMobile }) => isMobile, "desktop-only controls");

  test("reel buttons and arrow keys move the active project", async ({ page }) => {
    await page.goto("/");
    const counter = page.locator("#work p[aria-live='polite']").last();
    await expect(counter).toContainText("01 /");
    await page.getByRole("button", { name: "Next project" }).click();
    await expect(counter).toContainText("02 /");
    await page.getByRole("button", { name: "Previous project" }).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(counter).toContainText("01 /");
  });

  test("index view lists every project", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Index" }).click();
    await expect(page.locator("#work ol > li")).toHaveCount(projects.length);
  });

  test("systems tabs follow the ARIA tabs pattern", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab").first().focus();
    await page.keyboard.press("ArrowDown");
    const second = page.getByRole("tab").nth(1);
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("DevOps");
  });

  test("nav link scrolls to its section", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: /Contact/ }).click();
    await expect(page).toHaveURL(/#contact$/);
    await expect(page.locator("#contact-title")).toBeInViewport();
  });
});

test.describe("mobile menu", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile-only control");

  test("opens, moves focus in, closes on Escape and returns focus", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link").first()).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  });

  test("menu link navigates and closes the menu", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: /Work/ }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(page).toHaveURL(/#work$/);
  });
});

test.describe("case studies", () => {
  for (const p of projects) {
    test(`/work/${p.slug} renders`, async ({ page }) => {
      const res = await page.goto(`/work/${p.slug}`);
      expect(res?.status()).toBe(200);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.title);
      await expect(page.getByRole("img", { name: p.diagram.title })).toBeAttached();
      await expect(page.getByRole("navigation", { name: "More projects" }).getByRole("link")).toHaveCount(2);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test("unknown slug returns 404", async ({ page }) => {
    const res = await page.goto("/work/does-not-exist");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Nothing");
  });

  test("metadata routes respond", async ({ request }) => {
    for (const path of ["/sitemap.xml", "/robots.txt", "/opengraph-image", "/icon.svg"]) {
      expect((await request.get(path)).status(), path).toBe(200);
    }
    const sitemap = await (await request.get("/sitemap.xml")).text();
    for (const p of projects) expect(sitemap).toContain(`/work/${p.slug}`);
  });
});
