import React from "react";
import type { Article as ArticleType } from "@/types/article";
import Article from "@/components/atoms/Article";
import styles from "@/styles/components/organisms/articleList.module.css";
import { formatArticlesByYearAndDate } from "@/utils/formatArticles";
import { ViewType } from "@/constants/viewTypes";

type Props = {
  articles: ArticleType[];
  viewType: ViewType;
  isSearchMode: boolean;
};

const ArticleList = ({ viewType, articles, isSearchMode }: Props) => {
  const listStyle = styles[viewType] || "";

  const formatted = formatArticlesByYearAndDate(articles); // { [YYYY]: { [MM.DD]: Article[] } }

  return (
    <div>
      {Object.entries(formatted)
        .sort(([aYear], [bYear]) => Number(bYear) - Number(aYear))
        .map(([year, dates]) => (
          <section key={year} className={styles.sectionWrap}>
            {/* ✅ 通常モードのみ 年表示 */}
            {!isSearchMode && (
              <h2 className={styles.sectionYearTtl}>{year}</h2>
            )}

            <div className={styles.articlesWrap}>
              {Object.entries(dates).map(([date, articles]) => {
                const displayDate = isSearchMode
                  ? `${year}.${date.split(".")[0]}`
                  : date;

                return (
                  <section key={date} className={styles.sectionDate}>
                    {/* ✅ 常に h3 に日付表示（形式を出し分け） */}
                    <h3 className={styles.sectionDateTtl}>{displayDate}</h3>

                    <div
                      className={`${styles.itemWrap} ${listStyle} ${
                        isSearchMode ? styles.searchMode : ""
                      }`}
                    >
                      {articles.map((article) => (
                        <div key={article.id} className={styles.item}>
                          <Article
                            article={article}
                            viewType={viewType}
                            isSearchMode={isSearchMode}
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </section>
        ))}
    </div>
  );
};

export default ArticleList;
