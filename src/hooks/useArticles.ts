import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SearchParams } from "@/types/search";
import { Article, ListResponse } from "@/types/article";
import { client } from "@/components/libs/microcms";
import formatSearchParams from "@/utils/formatSearchParams";

// APIでmetaをスクレイピング
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

// 並列制御
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

// 記事データにmetaデータをマージ
async function enrichArticles(
  newArticles: Article[],
  limit: number,
  setEnrichJobs: Dispatch<SetStateAction<number>>
) {
  // stateにmeta取得中カウントを保存
  setEnrichJobs((j) => j + 1);

  try {
    // metaを取得
    const metas = await mapWithLimit(newArticles, limit, async (a) => {
      // タイトルとサムネイルが取得できた場合はスクレイピングをスキップ
      if (a.title && a.thumb) {
        return {
          metaTitle: a.title,
          metaDescription: "",
          metaImage: a.thumb,
        };
      }

      try {
        return await fetchMeta(a.article_url);
      } catch {
        return {
          metaTitle: "",
          metaDescription: "",
          metaImage: "",
        };
      }
    });
    return newArticles.map((a, i) => ({ ...a, ...metas[i] }));
  } finally {
    // meta取得が終わったらカウントを減らす
    setEnrichJobs((j) => j - 1);
  }
}

// microCMSのフィルター機能でand検索できるフォーマットに変換
export default function useArticles(searchParams: SearchParams, limit: number) {
  const [articles, setArticles] = useState<Article[]>([]);

  const [isEnd, setIsEnd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  // meta取得中の数を保存
  const [enrichJobs, setEnrichJobs] = useState(0);
  const isEnriching = enrichJobs > 0;

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
            // prevと比較して新しい候補を作る
            const prevIds = new Set(prev.map((p) => p.id));
            const candidates = res.contents.filter((a) => !prevIds.has(a.id));
            // 重複を削除
            const uniqueCandidates = Array.from(
              new Map(candidates.map((a) => [a.id, a])).values()
            );
            // OGP取得 → 記事更新
            (async () => {
              // OGP取得
              const OGP_CONCURRENCY = 4; // 並列処理する数
              const enriched = await enrichArticles(
                uniqueCandidates,
                OGP_CONCURRENCY,
                setEnrichJobs
              );

              // 記事更新
              setArticles((cur) => {
                const seen = new Set(cur.map((p) => p.id));
                const deduped = enriched.filter((a) => !seen.has(a.id));
                return [...cur, ...deduped];
              });
            })();

            return prev;
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
    isEnriching,
  };
}
