"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import type { Article, Viewport } from "@/types/article";
import { client } from "@/components/libs/microcms";
import ArticleComponent from "@/components/atoms/Article";
import SwitchBtns from "@/components/atoms/SwitchBtns";
import SearchFilterModal from "@/components/organisms/SearchFilterModal"; 
import SearchIcon from "@/components/atoms/SearchIcon"; 


const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  // 検索条件取得
  const keyword = searchParams.get("keyword") || "";
  const categories = (searchParams.get("category") || "").split(",").filter(Boolean);
  const dates = (searchParams.get("date") || "").split(",").filter(Boolean);
  const staffs = (searchParams.get("staff") || "").split(",").filter(Boolean);

  const rawView = searchParams.get("view");
  const initialViewType: Viewport = rawView === "image" ? "image" : "list";

  const [articles, setArticles] = useState<Article[]>([]);
  const [view, setView] = useState<Viewport>(initialViewType);

  // 🔍 モーダル開閉管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchArticles = async () => {
      const res = await client.getList<Article>({
        endpoint: "blogs",
        queries: { limit: 100 },
      });

      const filtered = res.contents.filter((article) => {
        const matchKeyword =
          !keyword ||
          article.title?.includes(keyword) ||
          article.description?.includes(keyword);

        const matchCategory =
          categories.length === 0 ||
          categories.includes(article.post_category?.category || "");

        const matchDate =
          dates.length === 0 ||
          dates.includes(new Date(article.date).toISOString().slice(0, 7).replace("-", "."));

        const matchStaff =
          staffs.length === 0 ||
          staffs.includes(article.post_staff?.staff || "");

        return matchKeyword && matchCategory && matchDate && matchStaff;
      });

      setArticles(filtered);
    };

    fetchArticles();
  }, [keyword, categories, dates, staffs]);

  return (
    <div className="pt-[5%] px-[20px]">
      {/* 表示切り替え */}
      <SwitchBtns viewType={view} setViewType={setView} />
  
      {/* 検索ボタン */}
      <button
        className="fixed top-0 right-0 mt-[3.3%] mr-[3.3%] md:mt-[2.2%] md:mr-[2.2%] z-50"
        onClick={handleOpenModal}
      >
        <SearchIcon />
      </button>
  
      {/* 検索モーダル */}
      <SearchFilterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialViewType={view}
      />
  
      {/* 検索条件の表示 */}
<div className="mb-4">
  {keyword && (
    <p className="text-sm text-gray-600">
      「{keyword}」
    </p>
  )}
  {categories.length > 0 && (
    <p className="text-sm text-gray-600">
      {categories.join(" / ")}
    </p>
  )}
  
  {staffs.length > 0 && (
    <p className="text-sm text-gray-600">
      {staffs.join(" / ")}
    </p>
  )}
</div>
<div>
    {dates.length > 0 && (
        <p className="text-sm text-gray-600">
        {dates.join(" / ")}|
        </p>
    )}
</div>

  
      {/* 検索結果表示 */}
      <div className="grid gap-4">
        {articles.map((article) => (
          <ArticleComponent key={article.id} article={article} viewType={view} />
        ))}
      </div>
    </div>
  );
  
};

export default SearchPage;
