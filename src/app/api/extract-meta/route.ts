/**
 * next.jsでAPIを定義
 * microCMSから取得した記事URLごとのOGPを取得
 * 取得したタイトル、ディスクリプション、画像は記事一覧にて使用
 */

import { NextResponse } from "next/server";
import { extractMetaFromUrl } from "@/components/libs/extractMeta";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * 取得に成功した OGP は Netlify の CDN に保存させる。
 * 2回目以降は（別の人が見た場合も）外部サイトに取りに行かず、CDN から即座に返る。
 * - CDN：30日間保存。期限切れ後7日間は古いものを返しつつ裏で取り直す
 * - ブラウザ：保存しない（ブラウザ側の保存は metaCache.ts で行う）
 * ※アクセス制限（proxy.ts）は CDN より手前で動くため、制限はそのまま効く
 *
 * 【重要】Netlify の CDN は、初期設定では URL の「?」以降を区別せずに保存する。
 * そのままだと、最初に保存した1記事の OGP がほかの全記事にも返ってしまう。
 * Netlify-Vary で「url の値ごとに別々に保存する」と指定している（消さないこと）。
 */
const CDN_CACHE_HEADERS = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "Netlify-CDN-Cache-Control":
    "public, durable, max-age=2592000, stale-while-revalidate=604800",
  "Netlify-Vary": "query=url",
};

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url)
    return NextResponse.json({ error: "url is required" }, { status: 400 });

  const result = await extractMetaFromUrl(url);

  // 取得失敗（400/502）はそのまま返す。CDN には保存しない
  if (result instanceof Response) return result;

  return NextResponse.json(result, { headers: CDN_CACHE_HEADERS });
}

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url)
    return NextResponse.json({ error: "url is required" }, { status: 400 });

  const result = await extractMetaFromUrl(url);

  if ("error" in result) {
    return NextResponse.json(
      { error: result.error },
      { status: 500, headers: corsHeaders }
    );
  }

  return NextResponse.json(result, { headers: corsHeaders });
}

// CORS プリフライト対応
export function OPTIONS() {
  return NextResponse.json({}, { status: 200, headers: corsHeaders });
}
