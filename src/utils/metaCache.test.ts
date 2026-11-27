import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getCachedMeta,
  resetMetaCacheForTest,
  setCachedMeta,
} from "./metaCache";

// テスト用の localStorage（中身はメモリに置く）
function stubLocalStorage() {
  const store = new Map<string, string>();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
    },
  });
  return store;
}

const META = {
  metaTitle: "タイトル",
  metaDescription: "説明",
  metaImage: "https://example.com/a.png",
};
const DAY = 24 * 60 * 60 * 1000;

describe("metaCache（OGP のブラウザ保存）", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetMetaCacheForTest();
  });

  it("保存した OGP を取り出せる（ページを開き直しても残る）", () => {
    stubLocalStorage();
    setCachedMeta("https://example.com/a", META, 0);

    resetMetaCacheForTest(); // ページを開き直した状態
    expect(getCachedMeta("https://example.com/a", 1 * DAY)).toEqual(META);
  });

  it("30日を過ぎたら使わない", () => {
    stubLocalStorage();
    setCachedMeta("https://example.com/a", META, 0);
    expect(getCachedMeta("https://example.com/a", 31 * DAY)).toBeNull();
  });

  it("タイトルも画像も空（取得失敗）は保存しない", () => {
    const store = stubLocalStorage();
    setCachedMeta(
      "https://example.com/a",
      { metaTitle: "", metaDescription: "", metaImage: "" },
      0
    );
    expect(getCachedMeta("https://example.com/a", 0)).toBeNull();
    expect(store.size).toBe(0);
  });

  it("localStorage が使えない環境でもエラーにならない", () => {
    vi.stubGlobal("window", {
      localStorage: {
        getItem: () => {
          throw new Error("blocked");
        },
        setItem: () => {
          throw new Error("blocked");
        },
      },
    });
    expect(() => setCachedMeta("https://example.com/a", META, 0)).not.toThrow();
    expect(getCachedMeta("https://example.com/b", 0)).toBeNull();
  });
});
