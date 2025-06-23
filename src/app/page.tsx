'use client'

import React, { useEffect, useState, useRef } from "react"

import type { Article, ListResponse } from "@/types/article";

import { client } from "@/components/libs/microcms";

import Header from "@/components/layouts/Header"
import SwitchBtns from '@/components/atoms/SwitchBtns'
import Articlelist from "@/components/organisms/ArticleList";
import Loading from '@/components/atoms/Loader'

const LIMIT = 6;

const Home: React.FC = () => {
  // 記事一覧の表示タイプ
  const [viewType, setViewType] = useState<"list" | "image">("list");

  // 記事取得
  const [articles, setArticles] = useState<Article[]>([]);
  const [offset, setOffset] = useState(0)
  const [isEnd, setIsEnd] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchData = async ()=> {
      const res: ListResponse<Article> = await client.getList<Article>({
        endpoint: "blogs",
        queries: {
          limit: LIMIT,
          offset: offset,
          orders: "-date"
        }
      });

      if (res.contents.length === 0) {
        // 取得数が0の場合はこれ以上記事を読み込めないようにする
        setIsEnd(true);
      } else {
        setArticles((prev) => {
          // idを使って重複チェック
          const ids = new Set(prev.map(p => p.id));
          const newArticles = res.contents.filter(a => !ids.has(a.id));
          return [...prev, ...newArticles];
        });
      }

      setHasInitialized(true); // 初回読み込み後にフラグをセット、これ以降はスクロールで記事読み込みが可能になる
    }

    fetchData();
  }, [offset]);

  // ページ下部までスクロールしたら、追加の記事を取得&表示
  useEffect(() => {
    if (!loaderRef.current || isEnd || !hasInitialized) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // offsetをLIMIT分増やすと、
          // 依存配列にoffsetを設定している１つ目のuseEffectが動いて記事を取得します
          setOffset((prev) => prev + LIMIT)
        }
      },
      {
        rootMargin: "100px",
        threshold: 0,
      }
    );

    observer.observe(loaderRef.current)

    return () => observer.disconnect()
  }, [loaderRef.current, isEnd, hasInitialized]);

  return (
    <>
      <Header />
      <main>
        <SwitchBtns viewType={viewType} setViewType={setViewType} />
        <Articlelist viewType={viewType} articles={articles} />

        {
          !hasInitialized && (
            <p className="text-center">Loading...</p>
          )
        }

        {
          // 初回ロード前と読み込める記事がない場合は非表示
          hasInitialized && !isEnd && (
            <Loading ref={loaderRef} />
          )
        }
      </main>
    </>
  );
}

export default Home;
