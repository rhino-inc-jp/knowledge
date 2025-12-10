import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const referer = request.headers.get("referer") || "";
  const { hostname, pathname } = request.nextUrl;

  const isMicroCMS =
    referer.includes("microcms.io") || referer.includes("microcms.app");

  const isLocal = hostname.includes("localhost");

  const topPage = pathname === "/";

  /**
   * microCMSの管理画面とローカル環境、トップはページを表示
   * それ以外では403を表示
   */
  if (!(isMicroCMS || isLocal || topPage)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  /**
   * custom-fieldページの場合は
   * layout.tsxでヘッダー、フッター、bodyのクラスは不要なのでトリガーをクッキーで管理
   */
  const response = NextResponse.next();
  const isCustomField = pathname.startsWith("/custom-field");

  response.cookies.set("cf_mode", isCustomField ? "1" : "0");
  return response;
}

/**
 * /custom-field/以下のパスが含まれている時のみmiddleware（）を実行
 */
export const config = {
  matcher: ["/", "/custom-field/:path*"],
};
