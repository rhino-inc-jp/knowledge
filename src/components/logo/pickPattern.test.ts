import { describe, expect, it } from "vitest";
import { pickPatternId } from "./pickPattern";

const IDS = ["p01", "p02", "p03"];

describe("pickPatternId（ロゴの案を決める）", () => {
  it("?logo=p02 があれば、その案に固定する（大文字でもよい）", () => {
    expect(pickPatternId("?logo=p02", IDS)).toBe("p02");
    expect(pickPatternId("?logo=P03", IDS)).toBe("p03");
  });

  it("存在しない案の指定は無視して、ランダムに選ぶ", () => {
    expect(pickPatternId("?logo=p99", IDS, () => 0)).toBe("p01");
  });

  it("指定がなければランダム（乱数の値に応じて全案から選ぶ）", () => {
    expect(pickPatternId("", IDS, () => 0)).toBe("p01");
    expect(pickPatternId("", IDS, () => 0.5)).toBe("p02");
    expect(pickPatternId("", IDS, () => 0.9999)).toBe("p03");
  });

  it("検索条件など、ほかのパラメータがあっても動く", () => {
    expect(pickPatternId("?category=Portfolio&logo=p01", IDS)).toBe("p01");
    expect(pickPatternId("?category=Portfolio", IDS, () => 0.5)).toBe("p02");
  });
});
