import { NextResponse } from "next/server";

type CheerioAPI = import("cheerio").CheerioAPI;

// Youtube URLに対応
async function tryYoutubeEmbed(url: URL) {
  if (
    !url.hostname.includes("youtube.com") &&
    !url.hostname.includes("youtu.be")
  ) {
    return null;
  }

  const embedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(
    url.toString()
  )}&format=json`;

  const response = await fetch(embedUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    console.error("YouTube oEmbed failed", response.status);
    const text = await response.text();
    console.error(text);
    return null;
  }

  const data = await response.json();

  return {
    title: data.title,
    description: "",
    image: data.thumbnail_url,
  };
}

// Instagram URLに対応
async function tryInstagramEmbed(url: URL) {
  if (
    !url.hostname.includes("instagram.com") ||
    !url.hostname.includes("www.instagram.com")
  ) {
    return null;
  }

  const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID!;
  const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET!;
  const oembedUrl = `https://graph.facebook.com/v17.0/instagram_oembed?url=${encodeURIComponent(
    url.toString()
  )}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`;

  const oembedRes = await fetch(oembedUrl);
  if (!oembedRes.ok) return;

  const oembed = await oembedRes.json();

  return Response.json({
    ok: true,
    meta: {
      title: oembed.title ?? "",
      description: "",
      image: oembed.thumbnail_url ?? "",
    },
  });
}

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

  // YoutubeのURLからmeta取得
  // const yt = await tryYoutubeEmbed(target);
  // if (yt) return NextResponse.json({ ok: true, meta: yt });

  // // Instagram URLに対応
  // const insta = await tryInstagramEmbed(target);
  // if (insta) return NextResponse.json({ ok: true, meta: insta });

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
