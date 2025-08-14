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

  if (isSearchMode) {
    // 🔍 検索モードは YYYY.MM 単位でグループ化し直す
    const grouped: Record<string, ArticleType[]> = {};

    articles.forEach((article) => {
      const date = article.publishedAt
        ? new Date(article.publishedAt)
        : new Date();
      const yyyyMM = `${date.getFullYear()}.${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      if (!grouped[yyyyMM]) grouped[yyyyMM] = [];
      grouped[yyyyMM].push(article);
    });

    return (
      <div>
        {Object.entries(grouped)
          .sort(([a], [b]) => b.localeCompare(a)) // YYYY.MM 降順
          .map(([yyyyMM, group]) => (
            <section
              key={yyyyMM}
              className={`${styles.sectionDate} ${styles.searchModeSectionDate}`}
            >
              <h3 className={styles.sectionDateTtl}>{yyyyMM}</h3>
              <div
                className={`${styles.itemWrap} ${listStyle} ${styles.searchMode}`}
              >
                {group.map((article) => (
                  <div key={article.id} className={styles.item}>
                    <Article
                      article={article}
                      viewType={viewType}
                      isSearchMode={true}
                    />
                  </div>
                ))}
              </div>
            </section>
          ))}
      </div>
    );
  }

  // 📄 通常モードは年→日単位で構造化（既存の形式）
  const formatted = formatArticlesByYearAndDate(articles);

  return (
    <div>
      {Object.entries(formatted)
        .sort(([aYear], [bYear]) => Number(bYear) - Number(aYear))
        .map(([year, dates]) => (
          <section key={year} className={styles.sectionWrap}>
            <h2 className={styles.sectionYearTtl}>{year}</h2>
            <div className={styles.articlesWrap}>
              {Object.entries(dates).map(([date, group]) => (
                <section key={date} className={styles.sectionDate}>
                  <h3 className={styles.sectionDateTtl}>{date}</h3>
                  <div className={`${styles.itemWrap} ${listStyle}`}>
                    {group.map((article) => (
                      <div key={article.id} className={styles.item}>
                        <Article
                          article={article}
                          viewType={viewType}
                          isSearchMode={false}
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
