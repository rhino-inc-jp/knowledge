import { describe, expect, it } from "vitest";
import { LOGO_DECK_KEY, pickPatternId, type DeckStorage } from "./pickPattern";

const IDS = ["p01", "p02", "p03"];

// localStorage の代わり（読み書きだけ）
const memoryStorage = (initial?: string): DeckStorage & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  if (initial !== undefined) data.set(LOGO_DECK_KEY, initial);
  return {
    data,
    getItem: (k) => data.get(k) ?? null,
    setItem: (k, v) => void data.set(k, v),
  };
};

// 決まった順に値を返す乱数（テスト用）
const seq = (...values: number[]) => {
  let i = 0;
  return () => values[i++ % values.length];
};

describe("pickPatternId（ロゴの案を決める）", () => {
  it("?logo=p02 があれば、その案に固定する（大文字でもよい）", () => {
    expect(pickPatternId("?logo=p02", IDS)).toBe("p02");
    expect(pickPatternId("?logo=P03", IDS)).toBe("p03");
  });

  it("存在しない案の指定は無視して、ランダムに選ぶ", () => {
    expect(pickPatternId("?logo=p99", IDS, () => 0)).toBe("p01");
  });

  it("保存先がなければ、毎回ただのランダム（乱数の値に応じて全案から選ぶ）", () => {
    expect(pickPatternId("", IDS, () => 0)).toBe("p01");
    expect(pickPatternId("", IDS, () => 0.5)).toBe("p02");
    expect(pickPatternId("", IDS, () => 0.9999)).toBe("p03");
  });

  it("検索条件など、ほかのパラメータがあっても動く", () => {
    expect(pickPatternId("?category=Portfolio&logo=p01", IDS)).toBe("p01");
    expect(pickPatternId("?category=Portfolio", IDS, () => 0.5)).toBe("p02");
  });
});

describe("pickPatternId の山札方式（保存先あり）", () => {
  it("案の数だけ開くと、全案が1回ずつ出る（何周しても同じ）", () => {
    const storage = memoryStorage();
    const ids = Array.from({ length: 16 }, (_, i) => `p${String(i + 1).padStart(2, "0")}`);
    for (let round = 0; round < 5; round++) {
      const shown = Array.from({ length: 16 }, () => pickPatternId("", ids, Math.random, storage));
      expect([...shown].sort()).toEqual(ids);
    }
  });

  it("山札を作り直した直後に、前回と同じ案が続かない", () => {
    // 前回 p01 を出して山札が空 → 作り直しで先頭が p01 になる乱数でも、p01 は続かない
    const storage = memoryStorage(JSON.stringify({ deck: [], last: "p01" }));
    expect(pickPatternId("", IDS, seq(0.9999, 0.9999), storage)).not.toBe("p01");
  });

  it("?logo= で固定したときは、山札を進めない", () => {
    const storage = memoryStorage(JSON.stringify({ deck: ["p03", "p01"], last: "p02" }));
    expect(pickPatternId("?logo=p02", IDS, Math.random, storage)).toBe("p02");
    expect(pickPatternId("", IDS, Math.random, storage)).toBe("p03");
  });

  it("保存されている山札に、今はない案や重複があっても無視する", () => {
    const storage = memoryStorage(JSON.stringify({ deck: ["p06", "p02", "p02", "p03"], last: "p01" }));
    expect(pickPatternId("", IDS, Math.random, storage)).toBe("p02");
    expect(pickPatternId("", IDS, Math.random, storage)).toBe("p03");
  });

  it("保存が壊れていても、ランダムに選んで動き続ける", () => {
    const storage = memoryStorage("{壊れたデータ");
    expect(IDS).toContain(pickPatternId("", IDS, () => 0.5, storage));
  });

  it("書き込めない環境（容量オーバーなど）でも、ランダムに選んで動き続ける", () => {
    const storage: DeckStorage = {
      getItem: () => null,
      setItem: () => {
        throw new Error("QuotaExceededError");
      },
    };
    expect(pickPatternId("", IDS, () => 0.5, storage)).toBe("p02");
  });
});
