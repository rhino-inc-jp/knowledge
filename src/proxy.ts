import { NextRequest, NextResponse } from "next/server";

export const PRODUCTION_HOST = "nowledge.rhino-inc.jp";
export const PRODUCTION_ORIGIN = `https://${PRODUCTION_HOST}`;

/**
 * Netlify の確認用環境のドメイン
 * - テスト環境（develop ブランチ）：develop--knowledge-rhino.netlify.app
 * - PR ごとの Deploy Preview：deploy-preview-番号--knowledge-rhino.netlify.app
 * ここでも OGP 取得 API を使えるようにして、本番と同じ見え方で確認できるようにする
 */
export const PREVIEW_HOST_PATTERN = /^(develop|deploy-preview-\d+)--knowledge-rhino\.netlify\.app$/;

export function isAllowedGet(host: string, referer: string) {
  if (!referer) return false;
  // 本番：今までどおり
  if (host === PRODUCTION_HOST) return referer.startsWith(PRODUCTION_ORIGIN);
  // 確認用環境：そのページ自身からの呼び出しだけ許可（ほかのサイトからは不可）
  if (PREVIEW_HOST_PATTERN.test(host)) return referer.startsWith(`https://${host}/`);
  return false;
}

export const IFRAME_ORIGIN = "https://nowledgeiframe.netlify.app";
export function isAllowedPost(referer: string) {
  return referer.startsWith(IFRAME_ORIGIN);
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const referer = request.headers.get("referer") ?? "";

  // GETは本番ドメインと、Netlify の確認用環境（テスト環境・Deploy Preview）のみ許可
  if (request.method === "GET" && !isAllowedGet(host, referer)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  // POSTは microCMS iframeからのみ許可
  if (request.method === "POST" && !isAllowedPost(referer)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
