"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/atoms/SearchBar";
import styles from "@/styles/components/organisms/SearchFilterModal.module.css";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Category, Date, Staff } from "@/types/search";
import FilterSection from "../atoms/FilterSection";

type Props = {
  categories: Category[];
  calendar: Date[];
  staff: Staff[];
  isOpen: boolean;
  onSearch: (params: {
    keyword: string;
    category: string[];
    date: string[];
    staff: string[];
  }) => void;
};

export default function SearchFilterModal({
  categories,
  calendar,
  staff,
  isOpen,
  onSearch,
}: Props) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");

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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-white overflow-auto w-full md:overflow-hidden"
          style={{ zIndex: 300 }}
          initial={{ x: "100%" }} // 初期状態: 画面の右外に配置
          animate={{ x: 0 }} // アニメーション中: 画面内にスライドイン
          exit={{ x: "100%" }} // 閉じるとき: 画面外にスライドアウト
          transition={{
            duration: 0.4, // アニメーションの時間を0.4秒に短縮
            ease: [0.25, 0.46, 0.45, 0.94], // イージングを調整し、スムーズでバウンド感を追加
          }}
        >
          <SearchBar keyword={keyword} setKeyword={setKeyword} />

          <div className={styles.searchBoxWrap}>
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

          <div className={styles.searchBtn}>
            <button
              className="w-[340px] bg-black text-white py-3 text-lg"
              onClick={handleSearch}
            >
              Search
            </button>
          </div>

          <p className={styles.logoWrapper}>
            <Image src="/logo_rhino-inc.svg" fill alt="&copy; Rhino Inc." />
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
