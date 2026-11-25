"use client";

import { useState, useEffect } from "react";
import SearchBar from "@/components/atoms/SearchBar";
import styles from "@/styles/components/organisms/SearchFilterModal.module.css";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Category, CalnderDate, Staff, SearchParams } from "@/types/search";
import FilterSection from "../atoms/FilterSection";

type Props = {
  categories: Category[];
  calendar: CalnderDate[];
  staff: Staff[];
  isOpen: boolean;
  // いま表示中の検索条件（モーダルを開いたときのチェック状態に使う）
  activeParams: SearchParams;
  onSearch: (params: {
    keyword: string;
    category: string[];
    date: string[];
    staff: string[];
  }) => void;
};

const SearchModal = ({
  categories,
  calendar,
  staff,
  isOpen,
  activeParams,
  onSearch,
}: Props) => {
  // 検索展開時のbodyのスクロール制御
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-white overflow-auto w-full md:overflow-y-auto no-scrollbar z-[200]"
          initial={{ scale: 1.02, opacity: 0 }} // 初期状態
          animate={{ scale: 1, opacity: 1 }} // アニメーション中
          exit={{ scale: 1.05, opacity: 0 }} // 閉じるとき
          transition={{
            duration: 0.2, // アニメーションの時間
            ease: [0.25, 0.46, 0.45, 0.94], // イージング
          }}
        >
          <SearchModalBody
            categories={categories}
            calendar={calendar}
            staff={staff}
            activeParams={activeParams}
            onSearch={onSearch}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * モーダルの中身
 * 開くたびに作り直されるので、チェック状態は「いま表示中の検索条件」から始まる
 * （共有URLから開いたときや、ブラウザの「戻る」の後も、画面と一致させるため）
 */
const SearchModalBody = ({
  categories,
  calendar,
  staff,
  activeParams,
  onSearch,
}: Omit<Props, "isOpen">) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    activeParams.category
  );
  const [selectedDates, setSelectedDates] = useState<string[]>(
    activeParams.date
  );
  const [selectedStaff, setSelectedStaff] = useState<string[]>(
    activeParams.staff
  );
  const [keyword, setKeyword] = useState(activeParams.keyword);

  // 🔍 検索実行（親に渡す）
  const handleSearch = () => {
    onSearch({
      keyword,
      category: selectedCategories,
      date: selectedDates,
      staff: selectedStaff,
    });
  };

  return (
    <div className="p-[75px_15px_40px] md:p-[60px_15px_50px] md:m-auto">
      <div className="max-md:p-[0_22px]">
        <div className="mb-[48px] md:mb-[68px]">
          <SearchBar keyword={keyword} setKeyword={setKeyword} />
        </div>
        <div className={`${styles.searchBoxWrap} mb-[47px]`}>
          <FilterSection
            label="Category"
            items={categories}
            selectedItems={selectedCategories}
            setSelectedItems={setSelectedCategories}
          />
          <FilterSection
            label="Date"
            items={calendar}
            selectedItems={selectedDates}
            setSelectedItems={setSelectedDates}
          />
          <FilterSection
            label="Staff"
            items={staff}
            selectedItems={selectedStaff}
            setSelectedItems={setSelectedStaff}
          />
        </div>

        <div className={`${styles.searchBtn}`}>
          <button
            className="w-[340px] bg-black text-white py-3 md:py-4 text-lg md:text-[23px]"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <p className="text-right mt-[45px] md:mt-[70px]">
          <Image
            className="inline-block md:w-[120px] md:h-[20px]"
            src="/logo_rhino-inc.svg"
            width={76}
            height={12.5}
            alt="&copy; Rhino Inc."
          />
        </p>
      </div>
    </div>
  );
};

export default SearchModal;
