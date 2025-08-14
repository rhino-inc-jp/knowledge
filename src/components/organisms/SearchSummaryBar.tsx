import React from "react";
import styles from "@/styles/components/organisms/SearchSummaryBar.module.css";

type Props = {
  keyword: string;
  category: string[]; // ← IDの配列
  staff: string[];
  categoryMap: Record<string, string>; // ← ID → 表示名
  staffMap: Record<string, string>;
};

const SearchSummaryBar = ({
  keyword,
  category,
  staff,
  categoryMap,
  staffMap,
}: Props) => {
  const hasAny = keyword || category.length > 0 || staff.length > 0;

  if (!hasAny) return null;

  return (
  <div
    className={` gap-4 ${styles.searchSummaryBar}`}
  >
      {keyword && (
        <p>
          {keyword}
        </p>
      )}
      {category.length > 0 && (
        <p>
          {" "}
          {category.map((id) => categoryMap[id] || id).join(" / ")}
        </p>
      )}
      {staff.length > 0 && (
        <p>
          {" "}
          {staff.map((id) => staffMap[id] || id).join(" / ")}
        </p>
      )}
    </div>
  );
};

export default SearchSummaryBar;
