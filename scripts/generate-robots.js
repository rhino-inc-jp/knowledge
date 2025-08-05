/**
 * Netlify ビルド時にpackage.jsonの "prebuild": "node scripts/generate-robots.js"が自動的に実行される。
 * mainブランチならクロールを許可、それ以外のブランチではクロールさせないようにrobots.txtを生成します。
 * */

const fs = require("fs");

const branch = process.env.DEPLOY_PRIME_BRANCH || process.env.HEAD || "unknown";

const content =
  branch === "main" ? `User-agent: *\nAllow: /` : `User-agent: *\nDisallow: /`;

fs.writeFileSync("public/robots.txt", content);

console.log(`[robots.txt] Generated for branch: ${branch}`);
