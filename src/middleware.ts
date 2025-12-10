import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { hostname, pathname } = request.nextUrl;

  const isMicroCMS =
    pathname.includes("microcms.io") || pathname.includes("microcms.app");

  const isLocal = hostname.includes("localhost");

  /**
   * microCMSの管理画面とローカル環境ではページを表示
   * それ以外では403を表示
   */
  if (!(isMicroCMS || isLocal)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return NextResponse.next();
}

/**
 * /custom-field/以下のパスが含まれている時のみmiddleware（）を実行
 */
export const config = {
  matcher: "/custom-field/:path*",
};
