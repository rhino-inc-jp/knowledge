/** @type {import('next').NextConfig} */

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// /opt/build/repo/node_modules/stretchで
// fsモジュールを参照しているが、クライアントサイドには存在しないためNetlify上でbuildが失敗する
// fsモジュールを空扱いする
const nextConfig = {
  images: {
    // microcmsから取得した画像の表示を許可
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.microcms-assets.io",
      },
    ],
  },
  sassOptions: {
    // mixin.scssグローバルで読み込めるように設定
    includePaths: [path.join(__dirname, "src/styles")],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: false,
      };
    }

    return config;
  },
};

export default nextConfig;
