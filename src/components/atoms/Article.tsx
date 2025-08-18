import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { Article as ArticleType } from "@/types/article";
import styles from "@/styles/components/atoms/article.module.css";
import { ViewType } from "@/constants/viewTypes";

type Props = {
  article: ArticleType;
  viewType: ViewType;
  isSearchMode?: boolean;
  displayDate?: string; // ← 追加
};

const Article = ({
  article,
  viewType,
  isSearchMode = false,
  displayDate,
}: Props) => {
  const {
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

  return (
    <a
      ref={containerRef}
      href={article_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.article} ${styles[viewType]} ${
        isSearchMode && styles.searchMode
      }`}
    >
      {viewType === "image" && (
        <div className={`${styles.articleThumb} mb-[10px]`}>
          {/* Next/Imageだと特定のドメインでエラーになるのでimgタグに変更 */}
          {metaImage && (
            <img
              className="object-cover absolute
             top-0 left-0"
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

      <h4 className={styles.articleTtl}>{metaTitle}</h4>
      <p className={styles.article__desc}>{metaDescription}</p>

      <div className={styles.article__bottom}>
        <p className={styles.articleStaff}>{post_staff.value}</p>
        <div className={styles.article__bottom__btns}>
          <button
            type="button"
            className="article__comment-opener relative"
            onClick={handleCommentToggle}
          >
            <Image
              src="/icon_message.svg"
              width={20}
              height={20}
              className="object-cover"
              alt=""
            />
          </button>
          <button type="button">
            <Image
              src="/icon_heart.svg"
              width={20}
              height={20}
              className="object-cover"
              alt=""
            />
          </button>
        </div>
      </div>

      <div
        className={`${styles.article__cover} ${
          isCommentVisible ? styles.visible : ""
        }`}
      >
        <p className={styles.article__comment}>{comment}</p>
      </div>
    </a>
  );
};

export default Article;
