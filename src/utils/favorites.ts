/**
 * お気に入り（記事IDの一覧）をブラウザに保存する仕組み
 *
 * - 保存先は localStorage（ログイン不要。端末・ブラウザごとに別々）
 * - 新しくお気に入りにしたものが先頭
 * - React からは useSyncExternalStore で読む（全カードのハートが同時に切り替わる）
 * - 別タブで変更した場合も反映する（storage イベント）
 */

const STORAGE_KEY = "nowledge:favorites:v1";
const CHANGE_EVENT = "nowledge:favoriteschange";

let cachedRaw: string | null = null;
let cachedIds: string[] = [];

// localStorage から読み出す（中身が変わっていなければ前回と同じ配列を返す）
export function getFavoriteIds(): string[] {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    // 保存が使えない環境では、このページを開いている間だけ覚えておく
    return cachedIds;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      cachedIds = Array.isArray(parsed)
        ? parsed.filter((v): v is string => typeof v === "string")
        : [];
    } catch {
      cachedIds = [];
    }
  }
  return cachedIds;
}

// サーバーで描画するときは、お気に入りがわからないので null（＝まだ読めていない）
export const getServerFavoriteIds = (): string[] | null => null;

export function subscribeFavorites(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange); // 別タブでの変更
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

// お気に入りの追加・解除を切り替える
export function toggleFavorite(id: string) {
  const current = getFavoriteIds();
  const next = current.includes(id)
    ? current.filter((v) => v !== id)
    : [id, ...current];

  cachedIds = next;
  try {
    cachedRaw = JSON.stringify(next);
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } catch {
    // 保存できなくても、このページを開いている間は反映する
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

// テスト用：読み込み済みのデータを捨てる
export function resetFavoritesForTest() {
  cachedRaw = null;
  cachedIds = [];
}
