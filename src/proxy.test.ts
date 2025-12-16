import { describe, expect, it } from "vitest";
import {
  IFRAME_ORIGIN,
  isAllowedGet,
  isAllowedPost,
  PRODUCTION_HOST,
} from "./proxy";

describe("proxyのアクセス制御", () => {
  it("API:GETはローカル環境（localhost）を許可", () => {
    const request = "localhost:3000";
    expect(isAllowedGet(request)).toBe(true);
  });
  it("API:GETは本番サイトを許可", () => {
    expect(isAllowedGet(PRODUCTION_HOST)).toBe(true);
  });
  it("API:GETは上記以外は不許可", () => {
    const request = "hogefuga.jp";
    expect(isAllowedGet(request)).toBe(false);
  });

  it("API:POSTはmicroCMS環境を許可", () => {
    const request = `${IFRAME_ORIGIN}/custom-field`;
    expect(isAllowedPost(request)).toBe(true);
  });
  it("API:POSTは上記以外は不許可", () => {
    const request = "https://piyopiyo.com";
    expect(isAllowedPost(request)).toBe(false);
  });
  it("API:POSTはrefererが空の場合は不許可", () => {
    const request = "";
    expect(isAllowedPost(request)).toBe(false);
  });
});
