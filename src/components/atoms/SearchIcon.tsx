// SearchIcon.tsx
import React from "react";
import styles from "@/styles/components/atoms/SearchIcon.module.css"; // CSSモジュールをインポート

type Props = {
  className?: string;
  onClick?: () => void;
  isOpen?: boolean; // isOpenをプロパティとして受け取る
};

const SearchIcon = ({ className, onClick, isOpen }: Props) => (
  <div
    className={`${styles.searchIcon} ${isOpen ? styles.open : ""} ${className || ""}`} // isOpen に基づいて open クラスを追加
    onClick={onClick} // クリック時に親コンポーネントのonClickを呼び出す
  >
    <div className={styles.searchIconInner}>
      <span></span>
      <span></span>
    </div>
  </div>
);

export default SearchIcon;
