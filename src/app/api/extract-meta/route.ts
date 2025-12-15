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
