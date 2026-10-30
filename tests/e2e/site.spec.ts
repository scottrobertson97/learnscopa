import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const routes = [
  "/",
  "/learn",
  "/rules",
  "/scoring",
  "/cards",
  "/about",
  "/privacy",
  "/articles",
  "/articles/how-to-play-scopa-for-beginners",
  "/articles/what-is-the-settebello",
  "/articles/scopa-strategy-for-beginners",
  "/articles/traditional-italian-playing-cards-explained",
  "/articles/playing-scopa-with-a-regular-deck",
];
test("all pages render, internal links resolve, metadata is unique and monetization is disabled", async ({
  page,
  request,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const links = new Set<string>();
  for (const route of routes) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    titles.add(await page.title());
    descriptions.add(
      (await page.locator('meta[name="description"]').getAttribute("content"))!,
    );
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((elements) => elements.map((e) => e.getAttribute("href")!)))
      links.add(href.split("#")[0]!);
    expect(
      await page
        .locator(
          'script[src*="googlesyndication"], .adsbygoogle, a[rel~="sponsored"]',
        )
        .count(),
    ).toBe(0);
    if (route.startsWith("/articles/"))
      expect(
        JSON.parse(
          (await page
            .locator('script[type="application/ld+json"]')
            .textContent())!,
        )["@type"],
      ).toBe("Article");
  }
  for (const href of links)
    expect((await request.get(href)).status(), href).toBe(200);
  expect(titles.size).toBe(routes.length);
  expect(descriptions.size).toBe(routes.length);
  expect(errors).toEqual([]);
  expect((await request.get("/sitemap.xml")).status()).toBe(200);
  expect((await request.get("/robots.txt")).status()).toBe(200);
  expect((await request.get("/images/social-card.png")).status()).toBe(200);
});

test("homepage demo explains correct and incorrect captures", async ({
  page,
}) => {
  await page.goto("/");
  const demo = page.locator("[data-capture-demo]");
  await demo
    .getByRole("button", { name: "3 of clubs, value 3", exact: true })
    .click();
  await expect(demo.getByRole("status")).toContainText("Try the 5");
  await demo
    .getByRole("button", { name: "5 of cups, value 5", exact: true })
    .click();
  await expect(demo.getByRole("status")).toContainText("Perfetto");
});

async function next(page: Page): Promise<void> {
  await page.locator("[data-next]").click();
}
async function answer(
  page: Page,
  ids: string[],
  choice = false,
): Promise<void> {
  for (const id of ids)
    await page
      .locator(`[${choice ? "data-choice" : "data-card-id"}="${id}"]`)
      .click();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.locator("[data-feedback]")).toHaveAttribute(
    "data-tone",
    "correct",
  );
  await next(page);
}
for (const width of [390, 1280]) {
  test(`a visitor completes all three lessons, gets useful error feedback, and restarts at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 950 });
    await page.goto("/learn");
    await page.getByLabel("Remember my progress").check();
    for (let i = 0; i < 3; i++) await next(page);
    await page.locator('[data-card-id="cups-4"]').click();
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await expect(page.locator("[data-feedback]")).toHaveAttribute(
      "data-tone",
      "incorrect",
    );
    await expect(page.locator("[data-next]")).toBeDisabled();
    await answer(page, ["coins-4"]);
    await answer(page, ["swords-9"]);
    await answer(page, ["coins-7"]);
    await expect(
      page.getByRole("heading", { name: "A five takes a five." }),
    ).toBeVisible();
    await answer(page, ["cups-5"]);
    await answer(page, ["cups-4", "clubs-3"]);
    // The sum is arithmetically right but illegal while the single five exists.
    await page.locator('[data-card-id="clubs-3"]').click();
    await page.locator('[data-card-id="swords-2"]').click();
    await page
      .getByRole("button", { name: "Check answer", exact: true })
      .click();
    await expect(page.locator("[data-feedback]")).toHaveAttribute(
      "data-tone",
      "incorrect",
    );
    await page.locator('[data-card-id="clubs-3"]').click();
    await page.locator('[data-card-id="swords-2"]').click();
    await answer(page, ["cups-5"]);
    await answer(page, ["clubs-6"]);
    await answer(page, ["cups-1", "clubs-2", "coins-4"]);
    await answer(page, ["0"], true);
    await answer(page, []);
    await answer(page, ["cups-4", "clubs-3"]);
    await answer(page, ["1"], true);
    await answer(page, ["0"], true);
    await answer(page, ["1"], true);
    await answer(page, ["coins-7"]);
    await answer(page, ["coins-7"]);
    await answer(page, ["1"], true);
    await answer(page, ["1"], true);
    await answer(page, ["2"], true);
    await expect(
      page.getByRole("heading", { name: "A seat at the table is yours." }),
    ).toBeVisible();
    const saved = await page.evaluate(() =>
      JSON.parse(localStorage.getItem("learn-scopa-progress-v1")!),
    );
    expect(saved.completed).toEqual(["cards", "captures", "scoring"]);
    expect(saved.passed).toHaveLength(22);
    await page.reload();
    await expect(
      page.getByRole("heading", { name: "A seat at the table is yours." }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Restart all lessons" }).click();
    await expect(
      page.getByRole("heading", { name: "Four families. Forty cards." }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () =>
          JSON.parse(localStorage.getItem("learn-scopa-progress-v1")!)
            .completed,
      ),
    ).toEqual([]);
  });
}

test("progress is opt-in, resumes, and can be removed", async ({ page }) => {
  await page.goto("/learn");
  await next(page);
  expect(
    await page.evaluate(() => localStorage.getItem("learn-scopa-progress-v1")),
  ).toBe(null);
  await page.getByLabel("Remember my progress").check();
  await next(page);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Meet the royal company." }),
  ).toBeVisible();
  await page.locator("[data-back]").click();
  await expect(
    page.getByRole("heading", { name: "The number is the value." }),
  ).toBeVisible();
  await next(page);
  await page.getByLabel("Remember my progress").uncheck();
  expect(
    await page.evaluate(() => localStorage.getItem("learn-scopa-progress-v1")),
  ).toBe(null);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Four families. Forty cards." }),
  ).toBeVisible();
});

test("blocked storage does not break lessons", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("Blocked");
      },
    });
  });
  await page.goto("/learn");
  await expect(
    page.getByRole("heading", { name: "Four families. Forty cards." }),
  ).toBeVisible();
  await page.getByLabel("Remember my progress").check();
  await next(page);
  await expect(
    page.getByRole("heading", { name: "The number is the value." }),
  ).toBeVisible();
});

test("malformed stored progress resets gracefully", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem("learn-scopa-progress-v1", "{invalid json");
  });
  await page.goto("/learn");
  await expect(
    page.getByRole("heading", { name: "Four families. Forty cards." }),
  ).toBeVisible();
  await next(page);
  await expect(
    page.getByRole("heading", { name: "The number is the value." }),
  ).toBeVisible();
});

test("card exercises work with the keyboard", async ({ page }) => {
  await page.goto("/learn");
  await page.locator('[data-lesson="1"]').click();
  const five = page.getByRole("button", {
    name: "5 of cups, value 5",
    exact: true,
  });
  await five.focus();
  await page.keyboard.press("Space");
  await expect(five).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Check answer", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-feedback]")).toHaveAttribute(
    "data-tone",
    "correct",
  );
});

for (const width of [320, 390, 768, 1440]) {
  test(`pages fit a ${width}px viewport`, async ({ page }) => {
    await page.setViewportSize({ width, height: 950 });
    for (const route of routes) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        route,
      ).toBe(true);
    }
    await page.goto("/");
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
    await page.goto("/learn");
    await page.locator('[data-lesson="1"]').click();
    await page.screenshot({
      path: `test-results/lesson-${width}.png`,
      fullPage: true,
    });
    if (width === 390) {
      await page.getByText("Menu", { exact: false }).first().click();
      await expect(
        page.getByRole("navigation", { name: "Mobile navigation" }),
      ).toBeVisible();
    }
  });
}
test("main pages and a live exercise pass automated WCAG AA checks", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/learn",
    "/rules",
    "/scoring",
    "/cards",
    "/articles/what-is-the-settebello",
  ]) {
    await page.goto(route);
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(result.violations, route).toEqual([]);
  }
  await page.goto("/learn");
  await page.locator('[data-lesson="1"]').click();
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
});
