import { describe, expect, it } from "vitest";
import { distanceTo, inflateField } from "./inflateText";

describe("distanceTo（一番近い点までの距離）", () => {
  it("横1列：左端の点からの距離が 0,1,2,3,4", () => {
    const mask = new Uint8Array([1, 0, 0, 0, 0]);
    expect(Array.from(distanceTo(mask, 5, 1, 1))).toEqual([0, 1, 2, 3, 4]);
  });

  it("斜めの距離も正しく測る（3-4-5 の直角三角形）", () => {
    const w = 5, h = 5;
    const mask = new Uint8Array(w * h);
    mask[0] = 1; // 左上の点
    const d = distanceTo(mask, w, h, 1);
    expect(d[4 * w + 3]).toBeCloseTo(5); // (3,4) まで
  });
});

describe("inflateField（風船のふくらみ）", () => {
  // 横長の長方形（文字の代わり）
  const w = 40, h = 20;
  const mask = new Uint8Array(w * h);
  for (let y = 5; y < 15; y++) for (let x = 5; x < 35; x++) mask[y * w + x] = 1;
  const field = inflateField(mask, w, h, { wrinkle: 0 });

  it("真ん中がいちばん高く、縁に向かって低くなる", () => {
    const center = field.z[10 * w + 20];
    const nearEdge = field.z[5 * w + 20];
    expect(center).toBeGreaterThan(nearEdge);
    expect(center).toBeGreaterThan(0.7);
  });

  it("文字のまわりに継ぎ目が付き、そのさらに外側は形に含まれない", () => {
    expect(field.include[4 * w + 20]).toBe(1); // 文字のすぐ外側（継ぎ目）
    expect(field.include[0]).toBe(0); // 遠い外側
  });
});
