import React, { useEffect, useState } from "react";
import styles from "@/styles/components/atoms/SearchBox.module.css";
import { client } from "@/components/libs/microcms";
import type { Article } from "@/types/article";

type Props = {
  selectedCategories: string[];
  setSelectedCategories: (value: string[]) => void;
  selectedDates: string[];
  setSelectedDates: (value: string[]) => void;
  selectedStaffs: string[];
  setSelectedStaffs: (value: string[]) => void;
};

// フィルターセクション（カテゴリ／日付／スタッフ）
const FilterSection = ({
  label,
  items,
  selectedItems,
  setSelectedItems,
}: {
  label: string;
  items: string[];
  selectedItems: string[];
  setSelectedItems: (value: string[]) => void;
}) => {
  const handleChange = (item: string) => {
    if (selectedItems.includes(item)) {
      setSelectedItems(selectedItems.filter((i) => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  return (
    <div className={styles.searchBox}>
      <h3 className="text-[23px] border-b border-black pb-[5.29%] pt-[5.29%]">{label}</h3>
      <div className="pt-[5%] text-[17px] max-h-[220px] overflow-y-auto">
        {items.map((item) => (
          <label key={item} className="block mb-[4.8%]">
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={selectedItems.includes(item)}
              onChange={() => handleChange(item)}
            />
            {item}
          </label>
        ))}
      </div>
    </div>
  );
};

const SearchBox = ({
  selectedCategories,
  setSelectedCategories,
  selectedDates,
  setSelectedDates,
  selectedStaffs,
  setSelectedStaffs,
}: Props) => {
  const [categories, setCategories] = useState<string[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [staffs, setStaffs] = useState<string[]>([]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await client.getList<Article>({
          endpoint: "blogs", // ←エンドポイント名は実際のものに合わせて
          queries: { limit: 100 },
        });

        const categorySet = new Set<string>();
        const dateSet = new Set<string>();
        const staffSet = new Set<string>();

        res.contents.forEach((article) => {
          if (article.post_category?.category) {
            categorySet.add(article.post_category.category);
          }
          if (article.date) {
            const d = new Date(article.date);
            const ym = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
            dateSet.add(ym);
          }
          if (article.post_staff?.staff) {
            staffSet.add(article.post_staff.staff);
          }
        });

        setCategories([...categorySet]);
        setDates([...dateSet].sort((a, b) => b.localeCompare(a))); // 降順
        setStaffs([...staffSet]);
      } catch (err) {
        console.error("記事一覧の取得に失敗しました", err);
      }
    };

    fetchArticles();
  }, []);

  return (
    <>
      <FilterSection
        label="Category"
        items={categories}
        selectedItems={selectedCategories}
        setSelectedItems={setSelectedCategories}
      />
      <FilterSection
        label="Date"
        items={dates}
        selectedItems={selectedDates}
        setSelectedItems={setSelectedDates}
      />
      <FilterSection
        label="Staff"
        items={staffs}
        selectedItems={selectedStaffs}
        setSelectedItems={setSelectedStaffs}
      />
    </>
  );
};

export default SearchBox;
