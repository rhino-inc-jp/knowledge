import { useCallback, useEffect, useRef, useState } from "react";
import { SearchParams } from "@/types/search";
import { Article, ListResponse } from "@/types/article";
import { client } from "@/components/libs/microcms";
import formatSearchParams from "@/utils/formatSearchParams";
import { createLimiter } from "@/utils/createLimiter";
import { getCachedMeta, setCachedMeta, Meta } from "@/utils/metaCache";

// OGP を同時に取得する数（ページ全体での上限）
const OGP_CONCURRENCY = 4;

const EMPTY_META: Meta = { metaTitle: "", metaDescription: "", metaImage: "" };

// APIでmetaをスクレイピング
async function fetchMeta(url: string): Promise<Meta> {
  const res = await fetch(`/api/extract-meta?url=${encodeURIComponent(url)}`);
  if (!res.ok) throw new Error("meta fetch failed");
  const { meta } = await res.json();

  return {
    metaTitle: meta?.title || "",
    metaDescription: meta?.description || "",
    metaImage: meta?.image || "",
  };
}

/**
 * microCMS の記事を、OGP なしですぐ表示できる形に整える
 * - タイトルとサムネイルが登録済み → そのまま（スクレイピング不要）
 * - ブラウザに保存済みの OGP がある → それを使う
 * - どちらもない → isMetaLoading を立てて、後から OGP を取得する
 */
function prepareArticle(article: Article): Article {
  if (article.title && article.thumb) return article;

  const cached = getCachedMeta(article.article_url);
  if (cached) return { ...article, ...cached };

  return { ...article, isMetaLoading: true };
}

/**
 * @param enabled false の間は記事を取得しない
 *   （URL の検索条件を読み終える前に、絞り込みなしの記事を取りに行かないため）
 */
export default function useArticles(
  searchParams: SearchParams,
  limit: number,
  enabled = true
) {
  const [articles, setArticles] = useState<Article[]>([]);

  const [isEnd, setIsEnd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasInitialized, setHasInitialized] = useState(false);

  // microCMS から記事一覧を取得している最中かどうか（追加読み込みの制御に使う）
  const [isLoading, setIsLoading] = useState(false);

  // 検索条件が変わったら、記事一覧を空にして最初から読み込み直す
  // （React 推奨の「描画中に前回の値と比べて state を調整する」書き方）
  const [prevSearchParams, setPrevSearchParams] = useState(searchParams);
  if (prevSearchParams !== searchParams) {
    setPrevSearchParams(searchParams);
    setArticles([]);
    setOffset(0);
    setIsEnd(false);
    setHasInitialized(false);
  }

  // OGP 取得の順番待ちの列（ページ全体で1つ）
  const queueRef = useRef(createLimiter(OGP_CONCURRENCY));

  // 1件の記事だけを差し替える
  const updateArticle = useCallback((id: string, patch: Partial<Article>) => {
    setArticles((cur) => cur.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }, []);

  // 検索条件が変わったら、前の検索結果の OGP 取得待ちを取り消す
  useEffect(() => {
    const queue = queueRef.current;
    return () => queue.clear();
  }, [searchParams]);

  useEffect(() => {
    if (!enabled) return;

    // 検索条件が変わった後に、前の検索の結果が届いても使わないためのフラグ
    let cancelled = false;

    const fetchData = async ({
      keyword = "",
      category = [],
      date = [],
      staff = [],
      ids,
    }: SearchParams) => {
      // 記事ID指定（マイページ）でお気に入りが0件なら、問い合わせずに終了
      // ※ids を空で問い合わせると、全記事が返ってきてしまうため
      if (ids && ids.length === 0) {
        setIsEnd(true);
        setHasInitialized(true);
        return;
      }

      setIsLoading(true);
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
            // マイページ：お気に入りの記事だけを取得
            ...(ids ? { ids: ids.join(",") } : {}),
          },
        });
        if (cancelled) return;

        if (res.contents.length <= 0) {
          // 記事取得数が0の場合はこれ以上記事を読み込めないようにフラグを変更
          setIsEnd(true);
          return;
        }

        // 最後のページまで読んだら、次の空読み込みをしない
        if (offset + res.contents.length >= res.totalCount) setIsEnd(true);

        // まず microCMS のデータだけで記事を表示する（OGP は後から1件ずつ差し込む）
        const prepared = res.contents.map(prepareArticle);
        setArticles((prev) => {
          const seen = new Set(prev.map((p) => p.id));
          const unique = prepared.filter((a) => {
            if (seen.has(a.id)) return false;
            seen.add(a.id);
            return true;
          });
          return [...prev, ...unique];
        });

        // OGP が必要な記事だけ、順番待ちの列に入れて取得する
        prepared
          .filter((a) => a.isMetaLoading)
          .forEach((a) => {
            queueRef.current
              .run(() => fetchMeta(a.article_url))
              .then((meta) => {
                if (meta === null) return; // 検索条件の変更で取り消された
                setCachedMeta(a.article_url, meta);
                updateArticle(a.id, { ...meta, isMetaLoading: false });
              })
              .catch(() => {
                // 取得できなかった記事は No Image で表示する
                updateArticle(a.id, { ...EMPTY_META, isMetaLoading: false });
              });
          });
      } catch (error) {
        if (cancelled) return;
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("不明なエラーが発生しました");
        }
        setIsEnd(true);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setHasInitialized(true);
        }
      }
    };

    fetchData(searchParams);

    return () => {
      cancelled = true;
    };
  }, [offset, searchParams, limit, updateArticle, enabled]);

  return {
    articles,
    setArticles,
    isEnd,
    setIsEnd,
    hasInitialized,
    setHasInitialized,
    setOffset,
    error,
    isLoading,
  };
}
