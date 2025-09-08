import { useEffect, useRef } from "react";

export default function useInfiniteScroll(
  isEnd: boolean,
  hasInitialized: boolean,
  isEnriching: boolean, // ロード中フラグ
  calcOffset: () => void,
  LIMIT: number
) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const lockedRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 記事読み込みを監視
  const startObserving = () => {
    if (observerRef.current || !loaderRef.current) return;
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        // 既にロック中 or ロード中なら無視
        if (!entry.isIntersecting || lockedRef.current || isEnriching) return;

        // ロック & 監視解除（連打防止）
        lockedRef.current = true;
        observerRef.current?.unobserve(loaderRef.current!);

        // 次のページを要求
        calcOffset();
      },
      {
        root: null,
        rootMargin: "0px 0px 300px 0px",
        threshold: 0,
      }
    );
    observerRef.current.observe(loaderRef.current);
  };

  // 記事読み込みを監視のクリーンアップ
  const stopObserving = () => {
    observerRef.current?.disconnect();
    observerRef.current = null;
  };

  // 条件が揃ったら監視開始／外れたら停止
  useEffect(() => {
    if (!loaderRef.current || isEnd || !hasInitialized) {
      stopObserving();
      return;
    }
    // ロード中でなければ監視開始
    if (!isEnriching) startObserving();

    return () => stopObserving();
  }, [isEnd, hasInitialized, isEnriching]);

  // ロード完了でロック解除 → 再監視
  useEffect(() => {
    if (!isEnriching) {
      // 次フレームで解除（同フレーム連打防止）
      const id = setTimeout(() => {
        lockedRef.current = false;
        // 再アタッチ（loader がまだ見えている可能性が高い）
        if (!isEnd && hasInitialized) {
          stopObserving();
          startObserving();
        }
      }, 0);
      return () => clearTimeout(id);
    }
  }, [isEnriching, isEnd, hasInitialized]);

  return { loaderRef };
}
