"use client";

import { useState } from "react";

import styles from "@/styles/components/atoms/Headline.module.css";

import { ViewType } from "@/constants/viewTypes";
import { SEARCH_TYPES } from "@/constants/searchTypes";
import type { SearchParams } from "@/types/search";

import useArticles from "@/hooks/useArticles";
import useSearchOptions from "@/hooks/useSearchOptions";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

import SwitchBtns from "@/components/atoms/SwitchBtns";
import Loading from "@/components/atoms/Loader";
import SearchIcon from "@/components/atoms/SearchIcon";

import ArticleList from "@/components/organisms/ArticleList";
import SearchFilterModal from "@/components/organisms/SearchModal";
import SearchSummaryBar from "@/components/organisms/SearchSummaryBar"; // ✅

const Home = () => {
  const [viewType, setViewType] = useState<ViewType>("list");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  /* 検索条件の状態 */
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: "",
    category: [],
    date: [],
    staff: [],
  });

  /* 🔍 検索モードかどうかの判定 */
  const isSearchMode =
    !!searchParams.keyword ||
    searchParams.category.length > 0 ||
    searchParams.date.length > 0 ||
    searchParams.staff.length > 0;

  /* 記事の取得 */
  const {
    articles,
    setArticles,
    isEnd,
    setIsEnd,
    hasInitialized,
    setHasInitialized,
    setOffset,
    error,
  } = useArticles(searchParams, SEARCH_TYPES.LIMIT);

  /* 検索オプション（カテゴリ、スタッフ、カレンダー） */
  const { categories, calendar, staff } = useSearchOptions(
    SEARCH_TYPES.YEAR,
    SEARCH_TYPES.MONTH
  );

  /* ID → 表示名 のマップを作成 */
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c.value]));
  const staffMap = Object.fromEntries(staff.map((s) => [s.id, s.value]));

  /* スクロールで追加読み込み */
  const calcOffset = () => {
    setOffset((prev) => prev + SEARCH_TYPES.LIMIT);
  };

  const { loaderRef } = useInfiniteScroll(
    isEnd,
    hasInitialized,
    calcOffset,
    SEARCH_TYPES.LIMIT
  );

  /* 🔍 検索を実行 */
  const handleSearch = ({ keyword, category, date, staff }: SearchParams) => {
    setArticles([]);
    setOffset(0);
    setIsEnd(false);
    setHasInitialized(false);
    setSearchParams({ keyword, category, date, staff });
    setIsModalOpen(false);
  };

  return (
    <main>
      <div className="content-[''] fixed top-0 left-0 w-full h-[182px] z-[200] bg-white md:h-[260px]"></div>

      {/* 表示形式切り替え */}
      <SwitchBtns viewType={viewType} setViewType={setViewType} />

      {/* 🔍 検索条件の表示（検索時のみ） */}
      {isSearchMode && (
        <SearchSummaryBar
          keyword={searchParams.keyword}
          category={searchParams.category}
          staff={searchParams.staff}
          categoryMap={categoryMap}
          staffMap={staffMap}
        />
      )}

      {/* 記事一覧 */}
      <ArticleList
        viewType={viewType}
        articles={articles}
        isSearchMode={isSearchMode}
      />

      {/* エラーメッセージ */}
      {error && <div className="text-sm text-center mt-4">{error}</div>}

      {/* 検索アイコン */}
      <SearchIcon
        onClick={isModalOpen ? handleCloseModal : handleOpenModal}
        isOpen={isModalOpen}
      />

      {/* 検索モーダル */}
      <SearchFilterModal
        categories={categories}
        calendar={calendar}
        staff={staff}
        isOpen={isModalOpen}
        onSearch={handleSearch}
      />

      {/* 初回ロード or 追加読み込み */}
      {!hasInitialized && <Loading ref={loaderRef} />}
      {hasInitialized && !isEnd && <Loading ref={loaderRef} />}

      <div className={styles.headLine}></div>
    </main>
  );
};

export default Home;
