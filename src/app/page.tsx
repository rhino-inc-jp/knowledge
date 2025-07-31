"use client"; // 追加

import React, { useEffect, useState } from "react";
import type { Viewport, Article, ListResponse } from "@/types/article";

import { client } from "@/components/libs/microcms";
import SwitchBtns from "@/components/atoms/SwitchBtns";
import Articlelist from "@/components/organisms/ArticleList";
import Loading from "@/components/atoms/Loader";
import SearchIcon from "@/components/atoms/SearchIcon";
import SearchFilterModal from "@/components/organisms/SearchFilterModal";
import styles from "@/styles/components/atoms/Headline.module.css";

// １回で取得する記事数
const LIMIT = 15;

const Home = () => {
  const [viewType, setViewType] = useState<Viewport>("list");
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態を管理

  const handleOpenModal = () => setIsModalOpen(true); // モーダルを開く
  const handleCloseModal = () => setIsModalOpen(false); // モーダルを閉じる

  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  // 検索条件ステート
  const [searchParams, setSearchParams] = useState<{
    keyword: string;
    category: string[];
    date: string[];
    staff: string[];
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const res: ListResponse<Article> = await client.getList<Article>({
        endpoint: "blogs",
        queries: {
          limit: LIMIT,
          orders: "-date",
        },
      });

      setArticles(res.contents);
      setFilteredArticles(res.contents); // 初期状態では全件表示
      setHasInitialized(true);
    };

    fetchData();
  }, []);

  // 🔍 検索結果で絞り込み
  const handleSearch = ({
    keyword,
    category,
    date,
    staff,
  }: {
    keyword: string;
    category: string[];
    date: string[];
    staff: string[];
  }) => {
    const results = articles.filter((article) => {
      const matchKeyword =
        !keyword ||
        article.title?.includes(keyword) ||
        article.description?.includes(keyword);

      const matchCategory =
        category.length === 0 ||
        category.includes(article.post_category?.category || "");

      const matchDate =
        date.length === 0 ||
        date.includes(
          new Date(article.date).toISOString().slice(0, 7).replace("-", ".")
        );

      const matchStaff =
        staff.length === 0 || staff.includes(article.post_staff?.staff || "");

      return matchKeyword && matchCategory && matchDate && matchStaff;
    });

    setFilteredArticles(results);
    setSearchParams({ keyword, category, date, staff }); // 検索条件を保存
    setIsModalOpen(false); // モーダルを閉じる
  };

  return (
    <>
      <main>
        <div className="content-[''] fixed top-0 left-0 w-full h-[182px] z-[200] bg-white md:h-[260px]"></div>
        {/* 表示形式の切り替えボタン */}
        <SwitchBtns viewType={viewType} setViewType={setViewType} />

        {/* 絞り込んだ記事リスト */}
        <Articlelist viewType={viewType} articles={filteredArticles} />

        {/* 検索アイコン */}
        <SearchIcon
          onClick={isModalOpen ? handleCloseModal : handleOpenModal} // モーダルが開いている場合は閉じる処理、それ以外は開く処理
          isOpen={isModalOpen} // モーダルが開いている状態を渡す
        />

        {/* 検索フィルターモーダル */}
        <SearchFilterModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          initialViewType={viewType}
          onSearch={handleSearch} // 検索処理
        />

        {/* 初期ロード中 */}
        {!hasInitialized && <p className="text-center">Loading...</p>}

        <div className={styles.headLine}></div>
        {/* 検索条件の表示 */}
        {searchParams && (
          <div className={`rounded text-sm ${styles.searchWord}`}>
            <p>{searchParams.category.join(" / ") || ""}</p>|
            <p>{searchParams.staff.join(" / ") || ""}</p>|
            <p>{searchParams.keyword || ""}</p>
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
