import { NextResponse } from "next/server";

type CheerioAPI = import("cheerio").CheerioAPI;

/**
 * URLからtitle,desc,image
 */
function pickMeta($: CheerioAPI, base: URL) {
  const get = (sel: string) => $(sel).attr("content") || "";
  const txt = (sel: string) => $(sel).text().trim();
  const firstNonEmpty = (...vals: string[]) => vals.find(Boolean) || "";

  const title = firstNonEmpty(
    get('meta[property="og:title"]'),
    get('meta[name="twitter:title"]'),
    txt("title")
  );

  const description = firstNonEmpty(
    get('meta[property="og:description"]'),
    get('meta[name="twitter:description"]'),
    get('meta[name="description"]')
  );

  const imageRaw = firstNonEmpty(
    get('meta[property="og:image"]'),
    get('meta[name="twitter:image"]')
  );

  let image = "";

  // 相対パスを絶対パスに
  if (imageRaw) image = new URL(imageRaw, base).toString();

  return { title, description, image };
}

export async function extractMetaFromUrl(url: string) {
  const target = new URL(url);

  // httpsのみ許可
  if (!/^https?:$/.test(target.protocol)) {
    return NextResponse.json(
      { error: "only http/https allowed" },
      { status: 400 }
    );
  }

  // タイムアウト付き fetch 8sタイムアウト
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), 8000);

  // HTMLからmeta情報を抽出
  const res = await fetch(target.toString(), {
    signal: controller.signal,
    headers: {
      "user-agent":
        "Mozilla/5.0 (compatible; MetaFetcher/1.0; +https://example.com)",
      accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
  });

  clearTimeout(id);

  if (!res.ok) {
    return NextResponse.json(
      { error: `fetch failed: ${res.status}` },
      { status: 502 }
    );
  }

  // HTMLパース
  const html = await res.text();
  const { load } = await import("cheerio");
  const $ = load(html);

  const meta = pickMeta($, new URL(res.url));
  return { ok: true, meta };
}
