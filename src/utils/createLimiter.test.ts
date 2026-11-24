import { describe, expect, it } from "vitest";
import { createLimiter } from "./createLimiter";

// 外から完了させられる Promise（テスト用）
function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

const flush = () => new Promise((r) => setTimeout(r, 0));

describe("createLimiter（同時実行数の制限）", () => {
  it("同時に動くのは上限の数まで", async () => {
    const limiter = createLimiter(2);
    let running = 0;
    let maxRunning = 0;
    const gates = Array.from({ length: 5 }, () => deferred<void>());

    const results = gates.map((g, i) =>
      limiter.run(async () => {
        running++;
        maxRunning = Math.max(maxRunning, running);
        await g.promise;
        running--;
        return i;
      })
    );

    await flush();
    expect(running).toBe(2);

    gates.forEach((g) => g.resolve());
    expect(await Promise.all(results)).toEqual([0, 1, 2, 3, 4]);
    expect(maxRunning).toBe(2);
  });

  it("先に入れたものから順に始まる", async () => {
    const limiter = createLimiter(1);
    const order: number[] = [];
    await Promise.all(
      [1, 2, 3].map((n) =>
        limiter.run(async () => {
          order.push(n);
        })
      )
    );
    expect(order).toEqual([1, 2, 3]);
  });

  it("clear() で、まだ始まっていない処理は取り消され null になる", async () => {
    const limiter = createLimiter(1);
    const gate = deferred<string>();
    const first = limiter.run(() => gate.promise);
    const second = limiter.run(async () => "second");

    limiter.clear();
    gate.resolve("first");

    expect(await first).toBe("first"); // すでに始まっていた処理は最後まで動く
    expect(await second).toBeNull();
  });

  it("失敗した処理があっても、後続の処理は止まらない", async () => {
    const limiter = createLimiter(1);
    const failed = limiter.run(async () => {
      throw new Error("NG");
    });
    const next = limiter.run(async () => "OK");

    await expect(failed).rejects.toThrow("NG");
    expect(await next).toBe("OK");
  });
});
