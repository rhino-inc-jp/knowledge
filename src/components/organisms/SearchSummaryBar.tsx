import React from "react";

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
    <div className="px-4 py-3 text-sm flex flex-wrap gap-4">
      {keyword && (
        <p className="text-gray-800">
          {keyword}
        </p>
      )}
      {category.length > 0 && (
        <p className="text-gray-800">
          {" "}
          {category.map((id) => categoryMap[id] || id).join(" / ")}
        </p>
      )}
      {staff.length > 0 && (
        <p className="text-gray-800">
          {" "}
          {staff.map((id) => staffMap[id] || id).join(" / ")}
        </p>
      )}
    </div>
  );
};

export default SearchSummaryBar;
