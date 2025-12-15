/**
 * next.jsでAPIを定義
 * microCMSから取得した記事URLごとのOGPを取得
 * 取得したタイトル、ディスクリプション、画像は記事一覧にて使用
 */

import { NextResponse } from "next/server";
import { extractMetaFromUrl } from "@/components/libs/extractMeta";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url)
    return NextResponse.json({ error: "url is required" }, { status: 400 });

  const result = await extractMetaFromUrl(url);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const { url } = await req.json();

  if (!url)
    return NextResponse.json({ error: "url is required" }, { status: 400 });

  const result = await extractMetaFromUrl(url);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  return NextResponse.json(result);
}
