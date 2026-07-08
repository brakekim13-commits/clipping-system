import { chromium } from "playwright";
import { PORTALS, CLUB_FEEDS } from "./sources.js";

async function collectFromPortal(browser, portal) {
  const page = await browser.newPage({
    userAgent: "Mozilla/5.0 (compatible; SEFC-BP-Clipper/0.1; +internal use)",
  });
  const items = [];
  try {
    await page.goto(portal.url, { waitUntil: "networkidle", timeout: 30000 });
    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(1500);

    const links = await page.$$eval(portal.listSelector, (els) =>
      els
        .map((el) => ({ url: el.href, title: el.textContent?.trim() || "" }))
        .filter((x) => x.title.length > 3)
    );

    const seen = new Set();
    for (const l of links) {
      if (seen.has(l.url)) continue;
      seen.add(l.url);
      items.push({ league: portal.league, source: portal.name, ...l });
    }
  } catch (err) {
    console.error(`[collect] ${portal.name} 수집 실패:`, err.message);
  } finally {
    await page.close();
  }
  return items;
}

async function collectFromRss(feed) {
  try {
    const res = await fetch(feed.rss);
    const xml = await res.text();
    const matches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
    return matches.slice(0, 10).map((m) => {
      const block = m[1];
      const title = (block.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
      const link = (block.match(/<link>([\s\S]*?)<\/link>/) || [])[1] || "";
      return {
        league: feed.league,
        source: feed.club,
        title: title.replace(/<!\[CDATA\[|\]\]>/g, "").trim(),
        url: link.trim(),
      };
    });
  } catch (err) {
    console.error(`[collect] ${feed.club} RSS 수집 실패:`, err.message);
    return [];
  }
}

export async function collectAll() {
  const browser = await chromium.launch({ headless: true });
  let results = [];
  try {
    for (const portal of PORTALS) {
      const items = await collectFromPortal(browser, portal);
      results = results.concat(items);
    }
  } finally {
    await browser.close();
  }

  for (const feed of CLUB_FEEDS) {
    const items = await collectFromRss(feed);
    results = results.concat(items);
  }

  return results;
}
