import styles from "@/styles/components/atoms/Headline.module.css";
import { SearchParams } from "@/types/search";

type Props = {
  searchParams: SearchParams;
};

const StickyResult = ({ searchParams }: Props) => (
  <div className={`rounded text-sm ${styles.searchWord}`}>
    <p>{searchParams.category.join(" / ") || ""}</p>|
    <p>{searchParams.staff.join(" / ") || ""}</p>|
    <p>{searchParams.keyword || ""}</p>
  </div>
);

export default StickyResult;
