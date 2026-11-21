const { chromium, devices } = require("playwright");
const BASE = process.env.BASE_URL || "http://localhost:3000";
const enc = (p) => BASE + encodeURI(p);
const CALCS = [
  { path: "/حاسبة-التأمينات-الاجتماعية", expect: "1,100", bad: { id: "f-wage", val: "abc" } },
  { path: "/حاسبة-عائد-الشهادات", expect: "1,562.5", arabic: { id: "f-amount", val: "١٠٠٬٠٠٠" } },
  { path: "/حاسبة-استهلاك-الكهرباء-للاجهزة", expect: "جنيه", bad: { id: "f-hours", val: "30" } },
  { path: "/حاسبة-ضريبة-الفريلانسر", expect: "3,000" },
  { path: "/حاسبة-جمارك-اللابتوب", bad: { id: "f-fx", val: "" }, fill: { id: "f-fx", val: "50" }, expect: "4,900" },
];
let failures = 0;
const check = (ok, msg) => { console.log((ok ? "PASS " : "FAIL ") + msg); if (!ok) failures++; };
(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ ...devices["iPhone 13"] });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));

  for (const path of ["/", "/حاسبات-البنوك", "/المصادر-ومنهجية-الحساب", "/اتصل-بنا"]) {
    await page.goto(enc(path));
    check((await page.locator("h1").count()) === 1, `one h1 on ${path}`);
    check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `no horizontal scroll on ${path}`);
  }
  // homepage search
  await page.goto(enc("/"));
  await page.fill('input[type="search"]', "شهادات");
  check(await page.getByRole("link", { name: /شهادات/ }).first().isVisible(), "search finds certificates");
  await page.fill('input[type="search"]', "اللاب توب");
  check(await page.getByRole("link", { name: /اللابتوب/ }).first().isVisible(), "search normalises 'اللاب توب'");

  for (const c of CALCS) {
    await page.goto(enc(c.path));
    check((await page.locator("h1").count()) === 1, `one h1 on ${c.path}`);
    check(await page.evaluate(() => [...document.querySelectorAll("input,select")].every((el) => document.querySelector(`label[for="${el.id}"]`) || el.getAttribute("aria-label") || el.closest("label"))), `all inputs labelled on ${c.path}`);
    check(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `no horizontal scroll on ${c.path}`);
    check((await page.locator('script[type="application/ld+json"]').count()) >= 1, `breadcrumb JSON-LD on ${c.path}`);
    if (c.bad) {
      await page.fill("#" + c.bad.id, c.bad.val);
      await page.getByRole("button", { name: "احسب" }).click();
      check(await page.locator(`#${c.bad.id}-err`).isVisible(), `validation error shown for ${c.bad.id}`);
      check(await page.evaluate((id) => document.activeElement?.id === id, c.bad.id), `focus moved to invalid ${c.bad.id}`);
      await page.getByRole("button", { name: "إعادة ضبط" }).click();
    }
    if (c.fill) await page.fill("#" + c.fill.id, c.fill.val);
    if (c.arabic) await page.fill("#" + c.arabic.id, c.arabic.val);
    await page.getByRole("button", { name: "احسب" }).click();
    const headline = await page.locator("p.text-3xl").first().textContent().catch(() => "");
    check(!!headline && headline.includes(c.expect), `result on ${c.path}: "${headline}" contains "${c.expect}"`);
    await page.getByRole("button", { name: "إعادة ضبط" }).click();
    check((await page.locator("p.text-3xl").count()) === 0, `reset clears result on ${c.path}`);
  }
  // shared link prefill
  await page.goto(enc("/حاسبة-التأمينات-الاجتماعية") + "?type=employee&year=2027&wage=10000");
  await page.waitForSelector("p.text-3xl");
  check((await page.locator("p.text-3xl").textContent()).includes("1,150"), "share link prefills and computes (2027 → 1,150)");
  // live recalculation after first calculate
  await page.fill("#f-wage", "20000");
  check((await page.locator("p.text-3xl").textContent()).includes("2,220"), "live update after input change (capped 19,300 × 11.5% = 2,219.5)");

  // FAQ works without JS-specific code
  await page.locator("details summary").first().click();
  check(await page.locator("details[open]").count() === 1, "FAQ accordion opens");

  const before404 = errors.length;
  const res = await page.goto(enc("/صفحة-مش-موجودة"));
  errors.splice(before404); // the intentional 404 logs a resource error
  check(res.status() === 404, "unknown slug returns 404");

  check(errors.length === 0, `no console errors (${errors.join(" | ")})`);
  // screenshots for review
  await page.goto(enc("/"));
  await page.screenshot({ path: "e2e-home-mobile.png", fullPage: false });
  await page.goto(enc("/حاسبة-استهلاك-الكهرباء-للاجهزة"));
  await page.fill("#f-base", "400");
  await page.getByRole("button", { name: "احسب" }).click();
  await page.locator("p.text-3xl").scrollIntoViewIfNeeded();
  await page.screenshot({ path: "e2e-calc-mobile.png" });
  const desk = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  await desk.goto(enc("/"));
  await desk.screenshot({ path: "e2e-home-desktop.png" });
  await desk.goto(enc("/حاسبة-ضريبة-الفريلانسر"));
  await desk.getByRole("button", { name: "احسب" }).click();
  await desk.screenshot({ path: "e2e-calc-desktop.png", fullPage: false });
  await browser.close();
  console.log(failures ? `\n${failures} FAILED` : "\nALL PASSED");
  process.exit(failures ? 1 : 0);
})();
