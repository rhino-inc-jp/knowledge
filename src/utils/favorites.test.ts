import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getFavoriteIds,
  resetFavoritesForTest,
  subscribeFavorites,
  toggleFavorite,
} from "./favorites";

// テスト用の window（localStorage とイベントだけ用意）
function stubWindow() {
  const store = new Map<string, string>();
  const target = new EventTarget();
  vi.stubGlobal("window", {
    localStorage: {
      getItem: (k: string) => store.get(k) ?? null,
      setItem: (k: string, v: string) => store.set(k, v),
    },
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
  });
  return store;
}

describe("favorites（お気に入りのブラウザ保存）", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    resetFavoritesForTest();
  });

  it("追加すると先頭に入り、もう一度押すと外れる", () => {
    stubWindow();
    toggleFavorite("a");
    toggleFavorite("b");
    expect(getFavoriteIds()).toEqual(["b", "a"]);

    toggleFavorite("a");
    expect(getFavoriteIds()).toEqual(["b"]);
  });

  it("ページを開き直しても残っている", () => {
    stubWindow();
    toggleFavorite("a");
    resetFavoritesForTest(); // ページを開き直した状態
    expect(getFavoriteIds()).toEqual(["a"]);
  });

  it("中身が変わっていなければ、同じ配列を返す（無駄な再描画を防ぐ）", () => {
    stubWindow();
    toggleFavorite("a");
    expect(getFavoriteIds()).toBe(getFavoriteIds());
  });

  it("切り替えると、購読している画面に通知される", () => {
    stubWindow();
    const onChange = vi.fn();
    const unsubscribe = subscribeFavorites(onChange);
    toggleFavorite("a");
    expect(onChange).toHaveBeenCalledTimes(1);
    unsubscribe();
    toggleFavorite("a");
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("保存内容が壊れていても、エラーにならず空として扱う", () => {
    const store = stubWindow();
    store.set("nowledge:favorites:v1", "{broken");
    expect(getFavoriteIds()).toEqual([]);
  });
});
