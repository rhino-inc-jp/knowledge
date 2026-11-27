"use client";

/**
 * 左上のロゴを、ブラウザだけで読み込む入口
 * （ページを開くたびにランダムで案を選ぶので、サーバーでは描かない）
 */
import dynamic from "next/dynamic";

const NowledgeLogo = dynamic(() => import("./NowledgeLogo"), { ssr: false });

export default function NowledgeLogoLoader() {
  return <NowledgeLogo />;
}
