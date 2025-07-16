"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/atoms/SearchBar";
import SearchBox from "@/components/atoms/SearchBox";
import Header from "@/components/layouts/Header";
import styles from "@/styles/components/organisms/SearchFilterModal.module.css";
import Image from "next/image";
import type { Viewport } from "@/types/article";

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white overflow-auto w-full md:overflow-hidden" style={{ zIndex: 100 }}>
      <div className={styles.searchHeader}>
        <Header />
      </div>

      <button className={styles.closeBtnWrap} onClick={onClose} style={{ zIndex: 100 }}>
        <div className={styles.closeBtn}>
          <span></span>
          <span></span>
        </div>
      </button>

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
    </div>
  );
};

export default SearchFilterModal;
