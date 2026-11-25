/**
 * 検索条件と URL（?category=Portfolio など）を相互に変換する
 *
 * 例）
 *   /?category=Portfolio                Portfolio で絞り込み
 *   /?category=Portfolio,Web            Portfolio または Web
 *   /?category=Portfolio&date=2025-09   2025年9月の Portfolio
 *   /?q=キーワード&staff=（スタッフID）
 *
 * カテゴリは見てわかるように「名前」で書く（大文字・小文字は区別しない）。
 * スタッフは名前が長く記号を含むため「ID」で書く。
 */
import type { Category, SearchParams } from "@/types/search";

export const EMPTY_SEARCH: SearchParams = {
  keyword: "",
  category: [],
  date: [],
  staff: [],
};

// マイページ（お気に入り一覧）の URL の「?」以降
export const MYPAGE_QUERY = "?view=mypage";

// URL から読み取った直後の検索条件（カテゴリはまだ名前のまま）
export type SearchQuery = {
  // "mypage" のときはお気に入り一覧を表示する
  view: "mypage" | null;
  keyword: string;
  categoryNames: string[];
  date: string[];
  staff: string[];
};

// カンマ区切りの値を配列にする（空や重複は除く）
const splitList = (value: string | null) =>
  Array.from(
    new Set(
      (value ?? "")
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean)
    )
  );

// 検索条件が1つでも指定されているか
export const hasSearchQuery = (q: SearchQuery) =>
  !!q.keyword ||
  q.categoryNames.length > 0 ||
  q.date.length > 0 ||
  q.staff.length > 0;

// URL の「?」以降を読み取る
export function parseSearchQuery(search: string): SearchQuery {
  const params = new URLSearchParams(search);
  return {
    view: params.get("view") === "mypage" ? "mypage" : null,
    keyword: (params.get("q") ?? "").trim(),
    categoryNames: splitList(params.get("category")),
    // 年月は 2025-09 の形式だけ受け付ける
    date: splitList(params.get("date")).filter((d) => /^\d{4}-\d{2}$/.test(d)),
    staff: splitList(params.get("staff")),
  };
}

// カテゴリ名を ID に変換して、検索に使える形にする（存在しない名前は無視）
export function resolveSearchQuery(
  q: SearchQuery,
  categories: Category[]
): SearchParams {
  const category = q.categoryNames
    .map((name) => {
      const lower = name.toLowerCase();
      // 名前で一致 → 見つからなければ ID としても探す
      return (
        categories.find((c) => c.value.toLowerCase() === lower)?.id ??
        categories.find((c) => c.id === name)?.id
      );
    })
    .filter((id): id is string => !!id);

  return { keyword: q.keyword, category, date: q.date, staff: q.staff };
}

// 検索条件から URL の「?」以降を作る（条件なしなら空文字）
export function buildSearchQuery(
  params: SearchParams,
  categories: Category[]
): string {
  const query = new URLSearchParams();
  const names = params.category.map(
    (id) => categories.find((c) => c.id === id)?.value ?? id
  );

  if (params.keyword) query.set("q", params.keyword);
  if (names.length) query.set("category", names.join(","));
  if (params.date.length) query.set("date", params.date.join(","));
  if (params.staff.length) query.set("staff", params.staff.join(","));

  // カンマはそのまま見えるようにする（%2C にしない）
  const str = query.toString().replace(/%2C/g, ",");
  return str ? `?${str}` : "";
}

/* ------------------------------------------------------------
 * ブラウザの URL を React から読むための仕組み（useSyncExternalStore 用）
 * 検索したとき・「戻る/進む」を押したときに、画面へ通知する
 * ------------------------------------------------------------ */

const LOCATION_CHANGE_EVENT = "nowledge:locationchange";

// URL が変わったら onChange を呼ぶ
export function subscribeLocation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(LOCATION_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(LOCATION_CHANGE_EVENT, onChange);
  };
}

// いまの URL の「?」以降
export const getLocationSearch = (): string | null => window.location.search;

// サーバーで描画するときは URL がわからないので null（＝まだ読めていない）
export const getServerLocationSearch = (): string | null => null;

// URL を書き換えて、画面に通知する（同じ URL なら何もしない）
export function pushSearchUrl(url: string) {
  if (url === `${window.location.pathname}${window.location.search}`) return;
  window.history.pushState(null, "", url);
  window.dispatchEvent(new Event(LOCATION_CHANGE_EVENT));
}
