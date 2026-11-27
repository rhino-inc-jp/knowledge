/**
 * OGP（タイトル・説明・サムネイル）をブラウザに一時保存する仕組み
 *
 * 一度取得した記事の OGP を localStorage に 30 日間保存し、
 * 次に開いたときは外部サイトに取りに行かずにすぐ表示する。
 * localStorage が使えない環境（プライベートブラウズ等）では何もしない。
 */

export type Meta = {
  metaTitle: string;
  metaDescription: string;
  metaImage: string;
};

type Entry = Meta & { savedAt: number };

// v1 は、CDN の保存の不具合（別の記事の OGP が返る）があった時期の値が残っている可能性があるので使わない
const STORAGE_KEY = "nowledge:ogp:v2";
const TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30日
const MAX_ENTRIES = 3000; // 保存しすぎないための上限（古いものから消す）

let memory: Record<string, Entry> | null = null;

// 保存済みのデータを読み込む（初回だけ localStorage から読む）
function load(): Record<string, Entry> {
  if (memory) return memory;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    memory = raw ? (JSON.parse(raw) as Record<string, Entry>) : {};
  } catch {
    memory = {};
  }
  return memory;
}

function save(data: Record<string, Entry>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 容量オーバーや保存禁止の環境では保存しない（表示には影響しない）
  }
}

// 保存済みの OGP を取り出す（期限切れなら null）
export function getCachedMeta(url: string, now = Date.now()): Meta | null {
  const entry = load()[url];
  if (!entry || now - entry.savedAt > TTL_MS) return null;
  const { metaTitle, metaDescription, metaImage } = entry;
  return { metaTitle, metaDescription, metaImage };
}

// 取得できた OGP を保存する（タイトルも画像も空＝取得失敗なら保存しない）
export function setCachedMeta(url: string, meta: Meta, now = Date.now()) {
  if (!meta.metaTitle && !meta.metaImage) return;

  const data = load();
  data[url] = { ...meta, savedAt: now };

  // 上限を超えたら古い順に削除
  const keys = Object.keys(data);
  if (keys.length > MAX_ENTRIES) {
    keys
      .sort((a, b) => data[a].savedAt - data[b].savedAt)
      .slice(0, keys.length - MAX_ENTRIES)
      .forEach((k) => delete data[k]);
  }

  save(data);
}

// テスト用：読み込み済みのデータを捨てる
export function resetMetaCacheForTest() {
  memory = null;
}
