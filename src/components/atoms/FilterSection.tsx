import styles from "@/styles/components/atoms/SearchBox.module.css";
import { Category, CalnderDate, Staff } from "@/types/search";

// フィルターセクション（カテゴリ／日付／スタッフ）
export default function FilterSection({
  label,
  items,
  selectedItems,
  setSelectedItems,
}: {
  label: string;
  items: Category[] | CalnderDate[] | Staff[];
  selectedItems: string[];
  setSelectedItems: (value: string[]) => void;
}) {
  const handleChange = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((i) => i !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className={styles.searchBox}>
      <h3 className="text-[17px] md:text-[23px] border-b border-black p-[13px_2px_14px] md:p-[18px_3px_25px]">
        {label}
      </h3>
      <div className="p-[11px_0_15.5px] md:p-[16px_4px_21px] max-h-[200px] md:max-h-[220px] overflow-y-auto [&>:not(:last-child)]:mb-[12.5px] md:[&>:not(:last-child)]:mb-[16.5px]">
        {items.map(({ id, value }) => (
          <label
            key={id}
            className="block text-[13px] md:text-[17px] leading-[1]"
          >
            <input
              name={id}
              type="checkbox"
              className={styles.checkbox}
              checked={selectedItems.includes(id)}
              onChange={() => handleChange(id)}
            />
            {value}
          </label>
        ))}
      </div>
    </div>
  );
}
