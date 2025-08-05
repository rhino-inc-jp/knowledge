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

import Articlelist from "@/components/organisms/ArticleList";
import SearchFilterModal from "@/components/organisms/SearchModal";
import StickyResult from "@/components/atoms/StickyResult";

const Home = () => {
  const [viewType, setViewType] = useState<ViewType>("list");
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態を管理

  const handleOpenModal = () => setIsModalOpen(true); // モーダルを開く
  const handleCloseModal = () => setIsModalOpen(false); // モーダルを閉じる

  /* 検索 */
  const [searchParams, setSearchParams] = useState<SearchParams>({
    keyword: "",
    category: [],
    date: [],
    staff: [],
  });

  /* MicroCMSから記事取得 */
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

  /*
   * 検索アイテム（Category, Staff）をmicroCMSのAPIで取得
   * 検索時に使用するIDもMicroCMSから渡されたものを使用
   * 実行はサイト読み込み時のみ
   */
  const { categories, calendar, staff } = useSearchOptions(
    SEARCH_TYPES.YEAR,
    SEARCH_TYPES.MONTH
  );

  /*
   * ページ下部までスクロールしたら、追加の記事を取得
   */
  const calcOffset = () => {
    setOffset((prev) => prev + SEARCH_TYPES.LIMIT);
  };
  const { loaderRef } = useInfiniteScroll(
    isEnd,
    hasInitialized,
    calcOffset,
    SEARCH_TYPES.LIMIT
  );

  /*
   * 🔍検索結果で絞り込み
   * 小要素へ渡し、インプット要素で使用する
   */
  const handleSearch = ({ keyword, category, date, staff }: SearchParams) => {
    // 表示済みの記事一覧の状態をリセット
    setArticles([]);
    setOffset(0);
    setIsEnd(false);
    setHasInitialized(false);

    // 検索条件を保存
    setSearchParams({ keyword, category, date, staff });

    // モーダルを閉じる
    setIsModalOpen(false);
  };

  return (
    <main>
      <div className="content-[''] fixed top-0 left-0 w-full h-[182px] z-[200] bg-white md:h-[260px]"></div>

      {/* 表示形式の切り替えボタン */}
      <SwitchBtns viewType={viewType} setViewType={setViewType} />

      {/* 取得した記事リスト */}
      <Articlelist viewType={viewType} articles={articles} />

      {/* 記事取得エラー時の表示 */}
      {error && <div className="text-sm text-center mt-4">{error}</div>}

      {/* 検索アイコン */}
      <SearchIcon
        onClick={isModalOpen ? handleCloseModal : handleOpenModal} // モーダルが開いている場合は閉じる処理、それ以外は開く処理
        isOpen={isModalOpen} // モーダルが開いている状態を渡す
      />

      {/* 検索フィルターモーダル */}
      <SearchFilterModal
        categories={categories}
        calendar={calendar}
        staff={staff}
        isOpen={isModalOpen}
        onSearch={handleSearch} // 検索処理
      />

      {/* 初期ロード中 */}
      {!hasInitialized && <Loading ref={loaderRef} />}

      {/* 追加読み込みの記事がある場合はLoadingを表示 */}
      {hasInitialized && !isEnd && <Loading ref={loaderRef} />}

      <div className={styles.headLine}></div>

      {/* 検索条件の表示 */}
      {searchParams && <StickyResult searchParams={searchParams} />}
    </main>
  );
};

export default Home;
