import React from "react";
import type { Article as ArticleType } from "@/types/article";
import Article from "@/components/atoms/Article";
import styles from "@/styles/components/organisms/articleList.module.css";
import { formatArticlesByYearAndDate } from "@/utils/formatArticles";
import { ViewType } from "@/constants/viewTypes";

type Props = {
  articles: ArticleType[];
  viewType: ViewType;
  isSearchMode: boolean; // ← 追加
};

const ArticleList = ({ viewType, articles, isSearchMode }: Props) => {
  // リストの表示レイアウト（リスト／画像）
  const listStyle = styles[viewType] || "";

  if (isSearchMode) {
    return (
      <div
        className={`${styles.itemWrap} ${listStyle} ${styles.searchMode}`}
      >
        {articles.map((article) => (
          <div key={article.id} className={styles.item}>
            <Article
              article={article}
              viewType={viewType}
              isSearchMode={true}
            />
          </div>
        ))}
      </div>
    );
  }


  // 📆 通常モード：年・日付でセクション分け
  const formatted = formatArticlesByYearAndDate(articles);

  return (
    <div>
      {Object.entries(formatted)
        .sort(([aYear], [bYear]) => Number(bYear) - Number(aYear))
        .map(([year, dates]) => (
          <section key={year} className={styles.sectionWrap}>
            <h2 className={styles.sectionYearTtl}>{year}</h2>
            <div className={styles.articlesWrap}>
              {Object.entries(dates).map(([date, articles]) => (
                <section key={date} className={styles.sectionDate}>
                  <h3 className={styles.sectionDateTtl}>{date}</h3>
                  <div className={`${styles.itemWrap} ${listStyle}`}>
                    {articles.map((article) => (
                      <div key={article.id} className={styles.item}>
                        <Article
                          article={article}
                          viewType={viewType}
                          isSearchMode={false} // 明示的でもOK
                        />
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </section>
        ))}
    </div>
  );
};

export default ArticleList;
