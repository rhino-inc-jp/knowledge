"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Viewport } from "@/types/article";
import type {
  Category,
  CategoryResponse,
  Staff,
  StaffResponse,
  SearchParams,
  Date,
} from "@/types/search";

import { client } from "@/components/libs/microcms";
import SwitchBtns from "@/components/atoms/SwitchBtns";
import Articlelist from "@/components/organisms/ArticleList";
import Loading from "@/components/atoms/Loader";
import SearchIcon from "@/components/atoms/SearchIcon";
import SearchFilterModal from "@/components/organisms/SearchModal";
import styles from "@/styles/components/atoms/Headline.module.css";
import useArticles from "@/hooks/useArticles";

// １回で取得する記事数
const LIMIT = 5;

// 検索の日付いつから始めるか
const YEAR = 2025;
const MONTH = 6;

const Home = () => {
  const [viewType, setViewType] = useState<Viewport>("list");
  const [isModalOpen, setIsModalOpen] = useState(false); // モーダルの開閉状態を管理

  const handleOpenModal = () => setIsModalOpen(true); // モーダルを開く
  const handleCloseModal = () => setIsModalOpen(false); // モーダルを閉じる

  // コンポーネント
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 検索
  const [categories, setCategories] = useState<Category[]>([]);
  const [calendar, setCalendar] = useState<Date[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
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
  } = useArticles(searchParams, LIMIT);

  /*
   * 検索アイテム（Category, Staff）をmicroCMSのAPIで取得
   * 検索時に使用するIDもMicroCMSから渡されたものを使用
   * 実行はサイト読み込み時のみ
   */
  useEffect(() => {
    // カテゴリーの取得
    const fetchCategories = async () => {
      try {
        const resCategory: CategoryResponse<Category> =
          await client.getList<Category>({
            endpoint: "category",
            queries: {
              limit: 30,
            },
          });

        if (resCategory.contents.length > 0) {
          setCategories(resCategory.contents);
        }
      } catch {
        console.log("カテゴリーが取得できませんでした");
      }
    };

    /**
     * 日付の一覧
     */
    const generateCalendar = (startYear: number, startMonth: number) => {
      const result: { id: string; value: string }[] = [];
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      let year = startYear;
      let month = startMonth;

      while (
        year < currentYear ||
        (year === currentYear && month <= currentMonth)
      ) {
        const paddedMonth = month.toString().padStart(2, "0");
        result.push({
          id: `${year}-${paddedMonth}`,
          value: `${year}.${paddedMonth}`,
        });

        // 月を進める
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }

      setCalendar(result);
    };

    // スタッフの取得
    const fetchStaff = async () => {
      try {
        const resStaff: StaffResponse<Staff> = await client.getList<Staff>({
          endpoint: "staff",
          queries: {
            limit: 50,
          },
        });

        if (resStaff.contents.length > 0) {
          setStaff(resStaff.contents);
        }
      } catch {
        console.log("スタッフが取得できませんでした");
      }
    };

    fetchCategories();
    generateCalendar(YEAR, MONTH);
    fetchStaff();
  }, []);

  /* ページ下部までスクロールしたら、追加の記事を取得 */
  useEffect(() => {
    if (!loaderRef.current || isEnd || !hasInitialized) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // LIMITを増やすことで記事取得のuseEffectが動く
          setOffset((prev) => {
            return prev + LIMIT;
          });
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
      {searchParams && (
        <div className={`rounded text-sm ${styles.searchWord}`}>
          <p>{searchParams.category.join(" / ") || ""}</p>|
          <p>{searchParams.staff.join(" / ") || ""}</p>|
          <p>{searchParams.keyword || ""}</p>
        </div>
      )}
    </main>
  );
};

export default Home;
