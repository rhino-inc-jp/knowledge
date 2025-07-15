import React from "react";
// import Image from "next/image";
import styles from "@/styles/components/atoms/SearchIcon.module.css";

type Props = {
    onClick?: () => void;
  };
  const SearchIon = ({ onClick }: Props) => {
    return (
      <div onClick={onClick}>
        {/* 通常画面にある検索マーク */}
        <div className={styles.searchIcon}>
                <span></span>
                <span></span>
            {/* <Image src="/icon_search.svg" alt="検索" width={13} height={13} /> */}
        </div>
      </div>
    );
  };
  
  export default SearchIon;