export const SEARCH_TYPES = {
  LIMIT: 30, // １回で取得する記事数
  YEAR: 2025, // 検索の日付いつから始めるか
  MONTH: 1,
} as const;

export type SearchType = (typeof SEARCH_TYPES)[keyof typeof SEARCH_TYPES];
