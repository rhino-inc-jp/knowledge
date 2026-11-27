import { useSyncExternalStore } from "react";
import {
  getFavoriteIds,
  getServerFavoriteIds,
  subscribeFavorites,
  toggleFavorite,
} from "@/utils/favorites";

/**
 * お気に入りの記事IDの一覧を読む
 * サーバーで描画している間（＝ブラウザの保存内容をまだ読めていない間）は null
 */
export function useFavoriteIds(): string[] | null {
  return useSyncExternalStore(
    subscribeFavorites,
    getFavoriteIds,
    getServerFavoriteIds
  );
}

/**
 * 1件の記事がお気に入りかどうかと、切り替える関数
 */
export function useFavorite(id: string) {
  const ids = useFavoriteIds();
  return {
    isFavorite: !!ids?.includes(id),
    toggle: () => toggleFavorite(id),
  };
}
