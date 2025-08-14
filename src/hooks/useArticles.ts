import { useEffect, useState } from "react";
import { SearchParams } from "@/types/search";
import { Article, ListResponse } from "@/types/article";
import { client } from "@/components/libs/microcms";
import formatSearchParams from "@/utils/formatSearchParams";

async function fetchMeta(url: string) {
  const res = await fetch(`/api/extract-meta?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("meta fetch failed");
  const { meta } = await res.json();

  const formatedData = {
    metaTitle: meta.title || "",
    metaDescription: meta.description || "",
    metaImage: meta.image || "",
  };

  return formatedData;
}

// 超簡易の並列制御（同時5件）
async function mapWithLimit<T, R>(
  arr: T[],
  limit: number,
  fn: (v: T) => Promise<R>
) {
  const ret: R[] = [];
  let i = 0;
  const workers = Array.from(
    { length: Math.min(limit, arr.length) },
    async () => {
      while (i < arr.length) {
        const idx = i++;
        ret[idx] = await fn(arr[idx]);
      }
    }
  );
  await Promise.all(workers);
  return ret;
}

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
          // 既存記事リストに新しい記事をマージ
          setArticles((prev) => {
            // idを使って重複チェック
            const ids = new Set(prev.map((p) => p.id));
            const newArticles = res.contents.filter((a) => !ids.has(a.id));

            (async () => {
              const metas = await mapWithLimit(
                newArticles,
                limit,
                async (a) => {
                  try {
                    return await fetchMeta(a.article_url);
                  } catch {
                    return {
                      metaTitle: "",
                      metaDescription: "",
                      metaImage: "",
                    };
                  }
                }
              );

              const metaMap = new Map(
                newArticles.map((a, i) => [a.id, metas[i]])
              );
              setArticles((cur) =>
                cur.map((a) =>
                  metaMap.has(a.id) ? { ...a, ...metaMap.get(a.id)! } : a
                )
              );
            })();

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
  }, [offset, searchParams, limit]);

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
