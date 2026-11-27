"use client";

import { useMemo, useState, useSyncExternalStore } from "react";

import styles from "@/styles/components/atoms/Headline.module.css";

import { ViewType } from "@/constants/viewTypes";
import { SEARCH_TYPES } from "@/constants/searchTypes";
import type { SearchParams } from "@/types/search";
import {
  EMPTY_SEARCH,
  buildSearchQuery,
  getLocationSearch,
  getServerLocationSearch,
  MYPAGE_QUERY,
  parseSearchQuery,
  pushSearchUrl,
  resolveSearchQuery,
  subscribeLocation,
} from "@/utils/searchUrl";

import useArticles from "@/hooks/useArticles";
import useSearchOptions from "@/hooks/useSearchOptions";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useFavoriteIds } from "@/hooks/useFavorites";

import SwitchBtns from "@/components/atoms/SwitchBtns";
import Loading from "@/components/atoms/Loader";
import SearchIcon from "@/components/atoms/SearchIcon";
import QuickLinks from "@/components/atoms/QuickLinks";

import ArticleList from "@/components/organisms/ArticleList";
import SearchFilterModal from "@/components/organisms/SearchModal";
import SearchSummaryBar from "@/components/organisms/SearchSummaryBar";

const Home = () => {
  const [viewType, setViewType] = useState<ViewType>("image");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  /* 検索オプション（カテゴリ、スタッフ、カレンダー） */
  const { categories, calendar, staff, isCategoriesLoaded } = useSearchOptions(
    SEARCH_TYPES.YEAR,
    SEARCH_TYPES.MONTH
  );

  /* 🔗 検索条件は URL（?category=Portfolio など）が正。共有URL・戻る/進む にも対応 */
  // URL の「?」以降（サーバーで描画するときは null）
  const locationSearch = useSyncExternalStore(
    subscribeLocation,
    getLocationSearch,
    getServerLocationSearch
  );
  const urlQuery = useMemo(
    () => (locationSearch === null ? null : parseSearchQuery(locationSearch)),
    [locationSearch]
  );

  /* ♡ マイページ（?view=mypage）：お気に入りの記事だけを表示 */
  const isMypage = urlQuery?.view === "mypage";
  const favoriteIds = useFavoriteIds(); // ブラウザの保存内容を読めるまでは null

  // マイページを開いた時点のお気に入りで一覧を作る
  // （その場でハートを外しても記事は消えず、押し直して戻せるようにするため）
  // ※React 推奨の「描画中に前回の値と比べて state を調整する」書き方
  const [mypageIds, setMypageIds] = useState<string[] | null>(null);
  if (isMypage && mypageIds === null && favoriteIds !== null) {
    setMypageIds(favoriteIds);
  }
  if (!isMypage && mypageIds !== null) {
    setMypageIds(null);
  }

  // URL を読み終えたか。カテゴリ名 → ID の変換にはカテゴリ一覧が必要なので、それまで待つ
  // （読み終える前に、絞り込みなしの記事を取りに行かないため）
  const isUrlResolved =
    urlQuery !== null &&
    (isMypage
      ? mypageIds !== null
      : urlQuery.categoryNames.length === 0 || isCategoriesLoaded);

  // 中身が同じ検索条件なら同じものとして扱う（不要な取り直しを防ぐ）
  const searchKey = !isUrlResolved || !urlQuery
    ? ""
    : isMypage
      ? JSON.stringify({ ...EMPTY_SEARCH, ids: mypageIds })
      : JSON.stringify(resolveSearchQuery(urlQuery, categories));
  const searchParams = useMemo<SearchParams>(
    () => (searchKey ? JSON.parse(searchKey) : EMPTY_SEARCH),
    [searchKey]
  );

  /* 🔍 検索モードかどうかの判定 */
  const isSearchMode =
    !!searchParams.keyword ||
    searchParams.category.length > 0 ||
    searchParams.date.length > 0 ||
    searchParams.staff.length > 0;

  /* 記事の取得（検索条件が変わると、最初から取り直す） */
  const { articles, isEnd, hasInitialized, setOffset, error, isLoading } =
    useArticles(searchParams, SEARCH_TYPES.LIMIT, isUrlResolved);

  /* ID → 表示名 のマップを作成 */
  const categoryMap = Object.fromEntries(
    categories.map((c) => [c.id, c.value])
  );
  const staffMap = Object.fromEntries(staff.map((s) => [s.id, s.value]));

  /* スクロールで追加読み込み */
  const calcOffset = () => {
    setOffset((prev) => prev + SEARCH_TYPES.LIMIT);
  };

  // 記事一覧の取得中だけ追加読み込みを止める（OGP の取得完了は待たない）
  const { loaderRef } = useInfiniteScroll(
    isEnd,
    hasInitialized,
    isLoading,
    calcOffset,
    SEARCH_TYPES.LIMIT
  );

  /* 🔍 検索を実行 */
  const handleSearch = ({ keyword, category, date, staff }: SearchParams) => {
    setIsModalOpen(false);

    // 検索条件を URL に反映する → URL の変化を受けて記事を取り直す
    // （この URL を共有すると、同じ絞り込み結果が開く）
    pushSearchUrl(
      `${window.location.pathname}${buildSearchQuery(
        { keyword, category, date, staff },
        categories
      )}`
    );
  };

  /* ♡ マイページを開く */
  const handleOpenMypage = () => {
    setIsModalOpen(false);
    pushSearchUrl(`${window.location.pathname}${MYPAGE_QUERY}`);
  };

  // マイページでお気に入りが0件のとき
  const isMypageEmpty =
    isMypage && hasInitialized && isEnd && articles.length === 0;

  const showLoader = isLoading || !(hasInitialized && isEnd);

  return (
    <main>
      <div className="content-[''] fixed top-0 left-0 w-full h-[108px] z-[10] bg-white md:h-[146px]"></div>

      <div className={styles.headLine}></div>

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

      {/* 記事一覧（マイページでは年月で分けず「My Page」の見出しでまとめる） */}
      <ArticleList
        viewType={viewType}
        articles={articles}
        title={isMypage ? "My Page" : undefined}
      />

      {/* マイページでお気に入りが0件のときの案内 */}
      {isMypageEmpty && (
        <div className="text-sm text-center leading-[1.8] mt-[40px] md:mt-[60px] px-[15px]">
          <p>お気に入りはまだありません。</p>
          <p>記事のハートを押すと、ここに保存されます。</p>
          <p className="text-[12px] text-[#666] mt-[8px]">
            ※お気に入りは、このブラウザに保存されます
          </p>
        </div>
      )}

      {/* エラーメッセージ */}
      {error && <div className="text-sm text-center mt-4">{error}</div>}

      {/* ✉ お問い合わせ・♡ マイページ（検索アイコンの左に、いつも表示） */}
      <QuickLinks onOpenMypage={handleOpenMypage} />

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
        activeParams={searchParams}
        onSearch={handleSearch}
      />

      {/* 初回ロード or 追加読み込み時にローディングを表示*/}
      {showLoader && <Loading ref={loaderRef} />}
    </main>
  );
};

export default Home;
