import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { Article as ArticleType } from "@/types/article";
import styles from "@/styles/components/atoms/article.module.css";
import { ViewType } from "@/constants/viewTypes";

type Props = {
  article: ArticleType;
  viewType: ViewType;
  isSearchMode?: boolean;
  displayDate?: string;
};

/*　月毎のホバーカラー　*/
const monthColors: Record<number, string> = {
  1: "hover:bg-[#FF948D]",
  2: "hover:bg-[#FFB995]",
  3: "hover:bg-[#FFD384]",
  4: "hover:bg-[#FFF171]",
  5: "hover:bg-[#CCFF6A]",
  6: "hover:bg-[#92FF8D]",
  7: "hover:bg-[#99FFD8]",
  8: "hover:bg-[#9AF3FF]",
  9: "hover:bg-[#71C4FF]",
  10: "hover:bg-[#8DA9FF]",
  11: "hover:bg-[#CC8DFF]",
  12: "hover:bg-[#FFA5B8]",
};

const Article = ({
  article,
  viewType,
  isSearchMode = false,
  displayDate,
}: Props) => {
  const {
    month,
    article_url,
    post_staff,
    comment,
    metaTitle,
    metaDescription,
    metaImage,
  } = article;

  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const containerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsCommentVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleCommentToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsCommentVisible(!isCommentVisible);
  };

  const listStyle = styles[viewType] || "";

  return (
    <a
      ref={containerRef}
      href={article_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.article} ${listStyle} ${
        isSearchMode && styles.searchMode
      } ${monthColors[month]}`}
    >
      {viewType === "image" && (
        <div className={`${styles.articleThumb} mb-[8px]`}>
          {/* Next/Imageだと特定のドメインでエラーになるのでimgタグに変更 */}
          {metaImage && (
            <img
              className="object-contain absolute
             top-0 left-0 w-[100%] h-[100%]"
              src={metaImage}
              alt=""
            />
          )}

          {/* OGP画像がない場合はno_image.jpgを表示 */}
          {!metaImage && (
            <img
              className="object-cover absolute
            top-0 left-0"
              src="/no_image.jpg"
              alt=""
            />
          )}
        </div>
      )}

      {/* グループ先頭だけに年月を表示（検索時） */}
      {displayDate && <p className={styles.articleDate}>{displayDate}</p>}

      <h4 className={`${styles.articleTtl}`}>{metaTitle}</h4>
      <p className={styles.articleDesc}>{metaDescription}</p>

      <div className={styles.articleBottom}>
        <p className={styles.articleStaff}>{post_staff.value}</p>
        <div className={`${styles.articleBottomBtns}`}>
          <button
            type="button"
            className="relative"
            onClick={handleCommentToggle}
          >
            <Image
              src="/icon_message.svg"
              width={17}
              height={17}
              className="md:w-[22px]"
              alt=""
            />
          </button>
          {/* <button type="button">
            <Image
              src="/icon_heart.svg"
              width={17}
              height={17}
              className="md:w-[22px]"
              alt=""
            />
          </button> */}
        </div>
      </div>

      <div
        className={`${styles.articleCover} ${
          isCommentVisible ? styles.visible : ""
        }`}
        onClick={handleCommentToggle}
      >
        <p className={styles.articleComment}>{comment}</p>
      </div>
    </a>
  );
};

export default Article;
