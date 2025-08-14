import "server-only";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

type CheerioAPI = import("cheerio").CheerioAPI;

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
  try {
    if (imageRaw) image = new URL(imageRaw, base).toString(); // 相対→絶対に
  } catch {}

  return { title, description, image };
}

export async function GET(req: Request) {
  // urlの検証
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  try {
    if (!url)
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    const target = new URL(url);
    if (!/^https?:$/.test(target.protocol)) {
      return NextResponse.json(
        { error: "only http/https allowed" },
        { status: 400 }
      );
    }

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // 8s タイムアウト

    // htmlからmeta情報を抽出
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

    const html = await res.text();

    // サーバー側で確実に続行するため、このタイミングでインポート
    // またnext.config.jsonで"serverComponentsExternalPackages"に設定
    const { load } = await import("cheerio");
    const $ = load(html);

    const meta = pickMeta($, new URL(res.url));

    return Response.json({ ok: true, meta });
  } catch (e) {
    return NextResponse.json(
      { error: (e as Error).message ?? "unknown error" },
      { status: 500 }
    );
  }
}
