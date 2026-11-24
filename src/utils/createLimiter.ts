/**
 * 同時に実行する処理の数を制限する「順番待ちの列」
 *
 * OGP の取得は外部サイトへのアクセスになるため、一度に大量に投げないよう
 * ページ全体で同時実行数を制限する。追加読み込みで記事が増えても、
 * 上（先に表示された記事）から順番に取得される。
 *
 * clear() で、まだ始まっていない処理を取り消せる（検索条件を変えたときに使う）。
 * 取り消された処理は null を返す。
 */

type PendingTask = {
  start: () => void;
  cancel: () => void;
};

export type Limiter = {
  run: <T>(task: () => Promise<T>) => Promise<T | null>;
  clear: () => void;
};

export function createLimiter(concurrency: number): Limiter {
  let active = 0;
  let pending: PendingTask[] = [];

  // 空きがあれば、列の先頭から処理を始める
  const pump = () => {
    while (active < concurrency && pending.length > 0) {
      pending.shift()!.start();
    }
  };

  return {
    run<T>(task: () => Promise<T>) {
      return new Promise<T | null>((resolve, reject) => {
        pending.push({
          start: () => {
            active++;
            task()
              .then(resolve, reject)
              .finally(() => {
                active--;
                pump();
              });
          },
          cancel: () => resolve(null),
        });
        pump();
      });
    },

    clear() {
      const dropped = pending;
      pending = [];
      dropped.forEach((t) => t.cancel());
    },
  };
}
