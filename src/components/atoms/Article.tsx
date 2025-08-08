import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { Article as ArticleType } from "@/types/article";
import styles from "@/styles/components/atoms/article.module.css";
import { ViewType } from "@/constants/viewTypes";
import { format } from "date-fns"; // ← 日付整形ライブラリをインポート

type Props = {
  article: ArticleType;
  viewType: ViewType;
  isSearchMode?: boolean; // ← 検索時の表示切り替え用
};

const Article = ({ article, viewType, isSearchMode = false }: Props) => {
  const {
    article_url,
    post_staff,
    description,
    title,
    thumb,
    comment,
    publishedAt, // ← 型に追加した前提
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
    e.preventDefault(); // aタグ遷移防止
    e.stopPropagation();
    setIsCommentVisible(!isCommentVisible);
  };

  // 🔍 検索モード中のみ、公開日を整形して表示
  const formattedDate =
    isSearchMode && publishedAt
      ? format(new Date(publishedAt), "yyyy.MM")
      : null;

  return (
    <a
      ref={containerRef}
      href={article_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.article} ${styles[viewType]}`}
    >
      {viewType === "image" && (
        <div className={`${styles.articleThumb} mb-[10px]`}>
          <Image src={thumb.url} fill alt="" />
        </div>
      )}

      {/* 🔍 検索モードのみ日付を表示 */}
      {formattedDate && (
        <p className={styles.articleDate}>{formattedDate}</p>
      )}

      <h4 className={styles.articleTtl}>{title}</h4>
      <p className={styles.article__desc}>{description}</p>

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
