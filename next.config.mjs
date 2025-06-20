/** @type {import('next').NextConfig} */

import path from "path"
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const nextConfig = {
  images: { // microcmsから取得した画像の表示を許可
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.microcms-assets.io'
      }
    ]
  },
  sassOptions: { // mixin.scssグローバルで読み込めるように設定
    includePaths: [path.join(__dirname, 'src/styles')],
  }

};

export default nextConfig;
