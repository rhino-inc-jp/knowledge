import styles from "@/styles/components/atoms/SearchBox.module.css";
import { Category, Date, Staff } from "@/types/search";

// フィルターセクション（カテゴリ／日付／スタッフ）
export default function FilterSection({
  label,
  items,
  selectedItems,
  setSelectedItems,
}: {
  label: string;
  items: Category[] | Date[] | Staff[];
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
      <h3 className="text-[23px] border-b border-black pb-[5.29%] pt-[5.29%]">
        {label}
      </h3>
      <div className="pt-[5%] text-[17px] min-h-[160px] max-h-[160px] overflow-y-auto md:min-h-[200px] md:max-h-[200px]">
        {items.map(({ id, value }) => (
          <label key={id} className="block mb-[5.3%]">
            <input
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
