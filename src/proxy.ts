import { NextRequest, NextResponse } from "next/server";

/**
 * APIの使用をnowledgeのみに制限
 */
export function proxy(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const referer = request.headers.get("refere") ?? "";

  // GETはローカルor本番ドメインのみ許可
  if (request.method === "GET") {
    const isAllowedGet =
      host.startsWith("localhost") || host === "nowledge.rhino-inc.jp";

    if (!isAllowedGet) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  // POSTは microCMS iframeからのみ許可
  if (request.method === "POST") {
    const isAllowedPost = referer.startsWith(
      "https://nowledgeiframe.netlify.app"
    );

    if (!isAllowedPost) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
