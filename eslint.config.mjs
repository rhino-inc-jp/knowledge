// ESLint の設定ファイル（ESLint 9 の新しい形式「flat config」）
// Next.js 16 で `next lint` が廃止されたため、旧 .eslintrc.json から移行。
// ルールの中身は従来と同じ「next/core-web-vitals」を使う。
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = defineConfig([
  ...nextVitals,
  // ビルド成果物や自動生成ファイルはチェック対象から外す
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
