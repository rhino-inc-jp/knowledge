"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/atoms/SearchBar";
import SearchBox from "@/components/atoms/SearchBox";
import Header from "@/components/layouts/Header";
import styles from "@/styles/components/organisms/SearchFilterModal.module.css";
import Image from "next/image";
import type { Viewport } from "@/types/article";
import { motion, AnimatePresence } from "framer-motion"; // 変更: AnimatePresenceをインポート

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialViewType: Viewport;
  onSearch: (params: {
    keyword: string;
    category: string[];
    date: string[];
    staff: string[];
  }) => void;
};

const SearchFilterModal = ({ isOpen, onClose, initialViewType, onSearch }: Props) => {
  const [viewType] = useState<Viewport>(initialViewType);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");

  // body のスクロール制御
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
      staff: selectedStaffs,
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
          {/* <div className={styles.searchHeader}>
            <Header />
          </div> */}

          <SearchBar keyword={keyword} setKeyword={setKeyword} />

          <div className={styles.searchBoxWrap}>
            <SearchBox
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              selectedDates={selectedDates}
              setSelectedDates={setSelectedDates}
              selectedStaffs={selectedStaffs}
              setSelectedStaffs={setSelectedStaffs}
            />
          </div>

          <div className={styles.searchBtn}>
            <button className="w-[340px] bg-black text-white py-3 text-lg" onClick={handleSearch}>
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
};

export default SearchFilterModal;
