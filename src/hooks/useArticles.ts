import { useEffect, useState } from "react";
import { SearchParams } from "@/types/search";
import { Article, ListResponse } from "@/types/article";
import { client } from "@/components/libs/microcms";
import formatSearchParams from "@/utils/formatSearchParams";

// microCMSのフィルター機能でand検索できるフォーマットに変換
export default function useArticles(searchParams: SearchParams, limit: number) {
  const [articles, setArticles] = useState<Article[]>([]);

  const [isEnd, setIsEnd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const fetchData = async ({
      keyword = "",
      category = [],
      date = [],
      staff = [],
    }: SearchParams) => {
      try {
        const filters = formatSearchParams(category, date, staff);
        const res: ListResponse<Article> = await client.getList<Article>({
          endpoint: "blogs",
          queries: {
            limit: limit,
            offset: offset,
            orders: "-date",
            q: keyword,
            filters: filters,
          },
        });

        if (res.contents.length <= 0) {
          // 記事取得数が0の場合はこれ以上記事を読み込めないようにフラグを変更
          setIsEnd(true);
        } else {
          setArticles((prev) => {
            // idを使って重複チェック
            const ids = new Set(prev.map((p) => p.id));
            const newArticles = res.contents.filter((a) => !ids.has(a.id));

            // 既存記事リストに新しい記事をマージ
            return [...prev, ...newArticles];
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("不明なエラーが発生しました");
        }
        setIsEnd(true);
      } finally {
        setHasInitialized(true);
      }
    };

    fetchData(searchParams);
  }, [offset, searchParams]);

  return {
    articles,
    setArticles,
    isEnd,
    setIsEnd,
    hasInitialized,
    setHasInitialized,
    setOffset,
    error,
  };
}
