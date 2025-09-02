import React from "react";
import type { Article as ArticleType } from "@/types/article";
import Article from "@/components/atoms/Article";
import styles from "@/styles/components/organisms/articleList.module.css";
import { formatArticlesByYearAndMonth } from "@/utils/formatArticles";
import { ViewType } from "@/constants/viewTypes";

type Props = {
  articles: ArticleType[];
  viewType: ViewType;
};

const ArticleList = ({ viewType, articles }: Props) => {
  const listStyle = styles[viewType] || "";

  const formatted = formatArticlesByYearAndMonth(articles);

  const wrapBorder = (idx: number) =>
    idx > 0 ? "border-t border-t-black" : "";

  return (
    <div className={`${listStyle}`}>
      {Object.entries(formatted)
        .sort(([aYear], [bYear]) => Number(bYear) - Number(aYear))
        .map(([year, dates], idx) => {
          return (
            <section key={year} className={styles.sectionWrap}>
              <h2 className={`${styles.sectionYearTtl} font-hel`}>{year}</h2>
              <div className={`w-full ${styles.itemWrap} ${wrapBorder(idx)}`}>
                {Object.entries(dates).map(([_, article]) => (
                  <div key={article.id} className={`${styles.item} animate-in`}>
                    <Article
                      article={article}
                      viewType={viewType}
                      isSearchMode={false}
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
    </div>
  );
};

export default ArticleList;
