import { useEffect, useRef } from "react";

export default function useInfiniteScroll(
  isEnd: boolean,
  hasInitialized: boolean,
  calcOffset: () => void,
  LIMIT: number
) {
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current || isEnd || !hasInitialized) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // LIMITを増やすことで記事取得のuseEffectが動く
          calcOffset();
        }
      },
      {
        rootMargin: "0px 0px 0px 0px",
        threshold: 0.2,
      }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [isEnd, hasInitialized]);

  return {
    loaderRef,
  };
}
