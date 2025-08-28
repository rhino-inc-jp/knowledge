import { useEffect, useRef } from "react";

export default function useInfiniteScroll(
  isEnd: boolean,
  hasInitialized: boolean,
  isEnriching: boolean,
  calcOffset: () => void,
  LIMIT: number
) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // metaを取得中はisEnriching=true
  // trueの間はスクロールトリガーを発火させないようにする
  const lockedRef = useRef(false);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node || isEnd || !hasInitialized || isEnriching) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // LIMITを増やすことで記事取得のuseEffectが動く
          lockedRef.current = true;
          calcOffset();
        }
      },
      {
        rootMargin: "0px 0px 0px 0px",
        threshold: 0.2,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isEnd, hasInitialized, calcOffset, isEnriching]);

  // enrichが終わったらロック解除
  useEffect(() => {
    if (!isEnriching) {
      const id = setTimeout(() => {
        lockedRef.current = false;
      }, 0);
      return () => clearTimeout(id);
    }
  }, [isEnriching]);

  return { loaderRef };
}
