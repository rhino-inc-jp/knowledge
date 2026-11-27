import { describe, expect, it } from "vitest";
import {
  IFRAME_ORIGIN,
  isAllowedGet,
  isAllowedPost,
  PRODUCTION_HOST,
  PRODUCTION_ORIGIN,
} from "./proxy";

describe("proxyのアクセス制御", () => {
  const PRODUCTION_ORIGIN_REFERER = `${PRODUCTION_ORIGIN}/custom-field/slug`;

  it("API:GETは本番サイトを許可", () => {
    expect(isAllowedGet(PRODUCTION_HOST, PRODUCTION_ORIGIN_REFERER)).toBe(true);
  });
  it("API:GETのホストはPRODUCTION_HOSTのみ許可", () => {
    const request = "hogefuga.jp";
    expect(isAllowedGet(request, PRODUCTION_ORIGIN_REFERER)).toBe(false);
  });
  it("API:GETのリファラーはPRODUCTION_ORIGINのみ許可", () => {
    const origin = "https://hogefuga.jp/custom-field/slug";
    expect(isAllowedGet(PRODUCTION_HOST, origin)).toBe(false);
  });

  it("API:GETはテスト環境（develop）からの呼び出しを許可", () => {
    const host = "develop--knowledge-rhino.netlify.app";
    expect(isAllowedGet(host, `https://${host}/?category=Portfolio`)).toBe(true);
  });
  it("API:GETはPRごとのDeploy Previewからの呼び出しを許可", () => {
    const host = "deploy-preview-55--knowledge-rhino.netlify.app";
    expect(isAllowedGet(host, `https://${host}/`)).toBe(true);
  });
  it("API:GETは確認用環境でも、ほかのサイトからの呼び出しは不許可", () => {
    const host = "develop--knowledge-rhino.netlify.app";
    expect(isAllowedGet(host, "https://hogefuga.jp/")).toBe(false);
    expect(isAllowedGet(host, `https://${host}.hogefuga.jp/`)).toBe(false);
    expect(isAllowedGet(host, "")).toBe(false);
  });
  it("API:GETは似ているがちがうドメインは不許可", () => {
    expect(isAllowedGet("feature-x--knowledge-rhino.netlify.app", "https://feature-x--knowledge-rhino.netlify.app/")).toBe(false);
    expect(isAllowedGet("develop--other-site.netlify.app", "https://develop--other-site.netlify.app/")).toBe(false);
  });

  it("API:POSTはmicroCMS環境を許可", () => {
    const request = `${IFRAME_ORIGIN}/custom-field/slug`;
    expect(isAllowedPost(request)).toBe(true);
  });
  it("API:POSTは上記以外は不許可", () => {
    const request = "https://piyopiyo.com/custom-field/slug";
    expect(isAllowedPost(request)).toBe(false);
  });
  it("API:POSTはrefererが空の場合は不許可", () => {
    const request = "";
    expect(isAllowedPost(request)).toBe(false);
  });
});
