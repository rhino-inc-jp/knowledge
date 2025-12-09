import { Metadata } from "next";

/**
 * microCMSの管理画面に出す要素の実装
 *
 * 実装要素の一覧:
 * ボタン 「URLからmetaをスクレイピング」
 *
 * 備考:
 * metaにnoindexを追加しているのでクロールはされない
 *
 */

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function Layout({
  children,
}: Readonly<{ children: React.ReactDOM }>) {
  return children;
}
