import puppeteer from "puppeteer";

export async function scrapeLinkedIn() {
  const browser = await puppeteer.launch({
    headless: true,
  });

  const page = await browser.newPage();

  // 🔐 OPTIONAL: login (recommended later)
  // await page.goto("https://linkedin.com/login");

  await page.goto(
    "https://www.linkedin.com/search/results/people/?keywords=founder",
    { waitUntil: "domcontentloaded" }
  );

  // ✅ FIX: replace waitForTimeout
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const people = await page.evaluate(() => {
    const results: any[] = [];

    document.querySelectorAll(".entity-result").forEach((el: any) => {
      const name =
        el.querySelector(".entity-result__title-text")?.innerText || "";

      const title =
        el.querySelector(".entity-result__primary-subtitle")?.innerText || "";

      const profileUrl =
        el.querySelector("a.app-aware-link")?.href || "";

      results.push({ name, title, profileUrl });
    });

    return results;
  });

  await browser.close();

  return people;
}