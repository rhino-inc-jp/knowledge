import styles from "@/styles/components/atoms/SearchIcon.module.css";

type Props = {
  className?: string;
  onClick?: () => void;
  isOpen?: boolean;
};

const SearchIcon = ({ className, onClick, isOpen }: Props) => (
  <div
    className={`${styles.searchIcon} ${isOpen ? styles.open : ""} ${
      className || ""
    }`}
    onClick={onClick}
  >
    <div className={styles.searchIconInner}>
      <span></span>
      <span></span>
    </div>
  </div>
);

export default SearchIcon;
