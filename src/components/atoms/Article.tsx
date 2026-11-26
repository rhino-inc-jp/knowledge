import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { Article as ArticleType } from "@/types/article";
import styles from "@/styles/components/atoms/article.module.css";
import { ViewType } from "@/constants/viewTypes";
import { useFavorite } from "@/hooks/useFavorites";
import { openLinksInNewTab } from "@/utils/openLinksInNewTab";

// ハートの形（public/icon_heart.svg と同じ）
const HEART_PATH =
  "M19.1774 1.85052C18.6609 1.39857 18.1443 1.07574 17.4987 0.817484C16.853 0.559224 16.272 0.494659 15.6263 0.494659C14.9807 0.494659 14.335 0.623789 13.7539 0.817484C13.1083 1.07574 12.5918 1.39857 12.0752 1.85052L10.7839 3.07726L9.49264 1.85052C8.97612 1.39857 8.4596 1.07574 7.81395 0.817484C7.1683 0.559224 6.58721 0.494659 5.94156 0.494659C5.29591 0.494659 4.65026 0.623789 4.06918 0.817484C3.42353 1.07574 2.90701 1.39857 2.39049 1.85052C1.87397 2.36704 1.42202 2.94813 1.16376 3.52921C0.905496 4.17486 0.776367 4.82051 0.776367 5.46616C0.776367 6.11181 0.905496 6.75746 1.16376 7.40311C1.42202 8.04876 1.87397 8.62985 2.39049 9.14636L10.7839 16.8296L19.1774 9.14636C19.6939 8.62985 20.1459 8.04876 20.4041 7.40311C20.6624 6.75746 20.7915 6.11181 20.7915 5.46616C20.7915 4.82051 20.6624 4.17486 20.4041 3.52921C20.1459 2.88356 19.6939 2.30248 19.1774 1.85052Z";

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
    date,
    month,
    article_url,
    post_staff,
    post_staff_multiple,
    post_category,
    title,
    description,
    thumb,
    metaTitle,
    metaDescription,
    metaImage,
    isMetaLoading,
    editor,
  } = article;

  const staffText =
    Array.isArray(post_staff_multiple) && post_staff_multiple.length > 0
      ? post_staff_multiple
          .map((s) => s?.value)
          .filter(Boolean)
          .join(" / ")
      : post_staff?.value ?? "";

  const [isCommentVisible, setIsCommentVisible] = useState(false);
  const containerRef = useRef<HTMLAnchorElement>(null);

  // お気に入り（ハート）
  const { isFavorite, toggle: toggleFavorite } = useFavorite(article.id);
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    // カード全体がリンクなので、記事が開かないように止める
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite();
  };

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

  {
    /** サムネイルの画像を決定 */
    /* 記事投稿に設定した画像（最優先で表示） */
    /* スクレイピングで取得した画像（次点で表示） */
    /* どちらもない場合はno_image.jpgを表示（OGP取得中は何も出さずに待つ） */
  }
  const imgSrc =
    thumb?.url || metaImage || (isMetaLoading ? "" : "/no_image.jpg");

  // microCMS の画像だけ、WebP かつ表示幅に合ったサイズ（横800px）で配信してもらう
  // ※外部サイトの画像に付けると URL が壊れることがあるため付けない
  const optimizedSrc = imgSrc.startsWith("https://images.microcms-assets.io/")
    ? `${imgSrc}${imgSrc.includes("?") ? "&" : "?"}fm=webp&w=800`
    : imgSrc;

  // List表示でマウスを乗せたときに出すサムネイル
  // （実際の画像があるときだけ。No Image は出さない）
  const hoverSrc = thumb?.url || metaImage ? optimizedSrc : "";

  // スマホ・タブレット（タッチ操作）：List表示で、指が行に触れている間だけサムネイルを出す
  // （マウスの「乗せる」の代わり。見た目は CSS の .touching）
  const isListThumb = viewType === "list" && !!hoverSrc;
  const [isTouching, setIsTouching] = useState(false);
  const handleTouchStart = (e: React.TouchEvent) => {
    // 吹き出し・ハートなどのボタンを押したとき、コメント表示中は出さない
    if ((e.target as HTMLElement).closest("button") || isCommentVisible) return;
    setIsTouching(true);
  };
  const handleTouchEnd = () => setIsTouching(false);
  // 長押ししたときに、端末のリンクメニューがサムネイルを隠さないようにする
  const handleContextMenu = (e: React.MouseEvent) => {
    if (isTouching) e.preventDefault();
  };

  return (
    <a
      ref={containerRef}
      href={article_url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${styles.article} ${listStyle} ${
        isSearchMode && styles.searchMode
      } ${monthColors[month]} ${isTouching ? styles.touching : ""}`}
      // 一覧側の CSS（articleList.module.css）から「触れている行」を見分けるための目印
      data-touching={isTouching || undefined}
      {...(isListThumb && {
        onTouchStart: handleTouchStart,
        onTouchEnd: handleTouchEnd,
        onTouchCancel: handleTouchEnd,
        onContextMenu: handleContextMenu,
      })}
    >
      {viewType === "image" && (
        <div
          className={`${styles.articleThumb} mb-[8px] ${
            isMetaLoading ? "bg-[#f2f2f2]" : ""
          }`}
        >
          {/* Next/Imageだと特定のドメインでエラーになるのでimgタグに変更 */}
          {/* 画面に近づいてから読み込む（lazy）ことで、最初の表示を速くする */}
          {optimizedSrc && (
            <img
              className="object-contain absolute
             top-0 left-0 w-[100%] h-[100%]"
              src={optimizedSrc}
              loading="lazy"
              decoding="async"
              onError={(e) => (e.currentTarget.src = "/no_image.jpg")}
              alt=""
            />
          )}
        </div>
      )}

      {/* List表示：行にマウスを乗せるとサムネイルが出る（PC・マウス操作のときだけ。見た目は CSS） */}
      {viewType === "list" && hoverSrc && (
        <span className={styles.listHoverThumb} aria-hidden="true">
          <img
            src={hoverSrc}
            loading="lazy"
            decoding="async"
            // 画像が読めなかったときは、枠ごと出さない
            onError={(e) => {
              e.currentTarget.parentElement!.style.display = "none";
            }}
            alt=""
          />
        </span>
      )}

      {/* グループ先頭だけに年月を表示（検索時） */}
      {displayDate && <p className={styles.articleDate}>{displayDate}</p>}

      <h4 className={`${styles.articleTtl}`}>
        {title?.length > 0 ? title : metaTitle}
      </h4>
      <p className={styles.articleDesc}>
        {description?.length > 0 ? description : metaDescription}
      </p>

      <p className={styles.articleDateList}>
        {new Date(date).toLocaleDateString("ja-JP", {
          timeZone: "Asia/Tokyo",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </p>

      <div className={styles.articleBottom}>
        <p className={`${styles.articleDateList} ${styles.articleDateListPc}`}>
          {new Date(date).toLocaleDateString("ja-JP", {
            timeZone: "Asia/Tokyo",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })}
        </p>
        <p className={`${styles.articleCategory} ${post_category.value === "Portfolio" ? styles.articleCategoryRed : ""}`}>#{post_category.value}</p>
        <p className={styles.articleStaff}>{staffText}</p>
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
            <span className={styles.articleDateList}>
              {new Date(date).toLocaleDateString("ja-JP", {
                timeZone: "Asia/Tokyo",
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
          </button>

          {/* お気に入り：押すとマイページに追加（黒く塗られる）。もう一度押すと解除 */}
          <button
            type="button"
            className="ml-[10px] md:ml-[12px] leading-[0]"
            onClick={handleFavoriteToggle}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "お気に入りから外す" : "お気に入りに追加"}
          >
            <svg
              viewBox="0 0 22 18"
              className="w-[19px] h-auto md:w-[24px]"
              aria-hidden="true"
            >
              <path
                d={HEART_PATH}
                fill={isFavorite ? "#000" : "none"}
                stroke="#000"
                strokeMiterlimit="10"
              />
            </svg>
          </button>
        </div>
      </div>

      <div
        className={`${styles.articleCover} ${
          isCommentVisible ? styles.visible : ""
        } z-10`}
        onClick={(e) => {
          if (e.target !== e.currentTarget) return;
          handleCommentToggle(e);
        }}
      >
        <div
          className={styles.articleComment}
          // コメント内のリンクは、入力の仕方に関係なく新しいタブで開く
          dangerouslySetInnerHTML={{ __html: openLinksInNewTab(editor ?? "") }}
        />
      </div>
    </a>
  );
};

export default Article;
