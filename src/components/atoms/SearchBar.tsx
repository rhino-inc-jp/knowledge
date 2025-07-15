"use client";

import React from "react";
import Image from "next/image";
import styles from "@/styles/components/atoms/SearchBar.module.css";

type Props = {
  keyword: string;
  setKeyword: (value: string) => void;
};

const SearchBar = ({ keyword, setKeyword }: Props) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // 検索処理は親コンポーネントに任せるため削除またはイベントで通知してもよい
      console.log("Enterキーで検索:", keyword);
    }
  };

  return (
    <div className={styles.searchBar}>
      <div className="relative w-full border-b border-black">
        {/* アイコン */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[13px] h-[13px]">
          <Image src="/icon_search.svg" alt="検索" width={13} height={13} />
        </div>

        {/* 入力欄 */}
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full pl-[30px] py-1 text-black text-[16px] bg-transparent outline-none"
        />
      </div>
    </div>
  );
};

export default SearchBar;
