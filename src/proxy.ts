import { NextRequest, NextResponse } from "next/server";

export const PRODUCTION_HOST = "nowledge.rhino-inc.jp";
export const PRODUCTION_ORIGIN = `https://${PRODUCTION_HOST}`;

export function isAllowedGet(host: string, referer: string) {
  if (!referer) return false;
  return host === PRODUCTION_HOST && referer.startsWith(PRODUCTION_ORIGIN);
}

export const IFRAME_ORIGIN = "https://nowledgeiframe.netlify.app";
export function isAllowedPost(referer: string) {
  return referer.startsWith(IFRAME_ORIGIN);
}

export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const referer = request.headers.get("referer") ?? "";

  // GETは本番ドメインのみ許可
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
