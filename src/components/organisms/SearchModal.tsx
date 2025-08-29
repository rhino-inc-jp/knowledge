"use client";

import React, { useState, useEffect } from "react";
import SearchBar from "@/components/atoms/SearchBar";
import styles from "@/styles/components/organisms/SearchFilterModal.module.css";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Category, CalnderDate, Staff } from "@/types/search";
import FilterSection from "../atoms/FilterSection";

const links = [
  {
    name: "Contact",
    icon: "mail",
    href: "/",
  },
  {
    name: "My Page",
    icon: "heart",
    href: "/",
  },
];

type Props = {
  categories: Category[];
  calendar: CalnderDate[];
  staff: Staff[];
  isOpen: boolean;
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
  onSearch,
}: Props) => {
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
          className="fixed inset-0 bg-white overflow-auto w-full md:overflow-y-auto no-scrollbar z-[200]"
          initial={{ x: "100%" }} // 初期状態: 画面の右外に配置
          animate={{ x: 0 }} // アニメーション中: 画面内にスライドイン
          exit={{ x: "100%" }} // 閉じるとき: 画面外にスライドアウト
          transition={{
            duration: 0.4, // アニメーションの時間を0.4秒に短縮
            ease: [0.25, 0.46, 0.45, 0.94], // イージングを調整し、スムーズでバウンド感を追加
          }}
        >
          <div className="p-[75px_15px_40px] md:p-[60px_15px_50px] md:m-auto">
            <div className="max-md:p-[0_22px]">
              <div className="mb-[28px] md:pr-[102px]">
                <ul className="max-md:[&>:not(:last-child)]:mb-[25px] md:[&>:not(:last-child)]:mr-[17px] md:flex md:items-center md:justify-end">
                  {links.map(({ name, icon, href }) => (
                    <li key={name}>
                      <a
                        className="flex items-center text-[17px] leading-none"
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Image
                          src={`/icon_${icon}.svg`}
                          width={19.5}
                          height={17}
                          className="md:w-[22px] max-md:mr-[20px]"
                          alt=""
                        />
                        <span className="hidden">{name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
