import { describe, expect, it } from "vitest";
import {
  buildSearchQuery,
  hasSearchQuery,
  parseSearchQuery,
  resolveSearchQuery,
} from "./searchUrl";
import type { Category } from "@/types/search";

const cat = (id: string, value: string): Category => ({
  id,
  value,
  createdAt: "",
  updatedAt: "",
  publishedAt: "",
  revisedAt: "",
});
const CATEGORIES = [cat("pf123", "Portfolio"), cat("web456", "Web")];

describe("検索条件 ↔ URL の変換", () => {
  it("?category=Portfolio を Portfolio の ID に変換できる", () => {
    const q = parseSearchQuery("?category=Portfolio");
    expect(resolveSearchQuery(q, CATEGORIES).category).toEqual(["pf123"]);
  });

  it("大文字・小文字は区別しない（?category=portfolio でもよい）", () => {
    const q = parseSearchQuery("?category=portfolio");
    expect(resolveSearchQuery(q, CATEGORIES).category).toEqual(["pf123"]);
  });

  it("複数カテゴリ・年月・キーワード・スタッフを読み取れる", () => {
    const q = parseSearchQuery(
      "?q=%E3%83%86%E3%82%B9%E3%83%88&category=Portfolio,Web&date=2025-09,2025-10&staff=s1"
    );
    expect(resolveSearchQuery(q, CATEGORIES)).toEqual({
      keyword: "テスト",
      category: ["pf123", "web456"],
      date: ["2025-09", "2025-10"],
      staff: ["s1"],
    });
  });

  it("存在しないカテゴリ名や、形式の違う年月は無視する", () => {
    const q = parseSearchQuery("?category=Unknown&date=2025-9,abc");
    expect(resolveSearchQuery(q, CATEGORIES)).toEqual({
      keyword: "",
      category: [],
      date: [],
      staff: [],
    });
  });

  it("条件がなければ hasSearchQuery は false", () => {
    expect(hasSearchQuery(parseSearchQuery(""))).toBe(false);
    expect(hasSearchQuery(parseSearchQuery("?utm_source=slack"))).toBe(false);
    expect(hasSearchQuery(parseSearchQuery("?category=Web"))).toBe(true);
  });

  it("検索条件から、読みやすい URL を作る", () => {
    expect(
      buildSearchQuery(
        { keyword: "", category: ["pf123", "web456"], date: [], staff: [] },
        CATEGORIES
      )
    ).toBe("?category=Portfolio,Web");
    expect(
      buildSearchQuery(
        { keyword: "", category: [], date: [], staff: [] },
        CATEGORIES
      )
    ).toBe("");
  });

  it("作った URL を読み直すと、同じ検索条件に戻る", () => {
    const params = {
      keyword: "GSAP 事例",
      category: ["pf123"],
      date: ["2025-12"],
      staff: ["s1", "s2"],
    };
    const url = buildSearchQuery(params, CATEGORIES);
    expect(resolveSearchQuery(parseSearchQuery(url), CATEGORIES)).toEqual(
      params
    );
  });
});
