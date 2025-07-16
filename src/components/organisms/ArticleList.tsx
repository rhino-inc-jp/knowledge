import React from "react";

import type { Viewport, Article as ArticleType } from "@/types/article";

import Article from "@/components/atoms/Article";

import styles from "@/styles/components/organisms/articleList.module.css";

import { formatArticlesByYearAndDate } from "@/utils/formatArticles";


type Props = {
  articles: ArticleType[];
  viewType: Viewport;
};

const Articlelist = ({ viewType, articles }: Props) => {
  // リストの表示レイアウト
  const listStyle = styles[viewType] || "";

  // 年・日でセクションを分ける
  const formatted = formatArticlesByYearAndDate(articles);

  

  return (
    <div>
      
      {Object.entries(formatted)
        .sort(([aYear], [bYear]) => Number(bYear) - Number(aYear))
        .map(([year, dates]) => (
          // yearのセクションを生成
          <section key={year} className={`relative border-solid ${styles.sectionWrap}`}>
            <h2 className={`${styles.sectionYearTtl}`}>{year}</h2>
            <div className={`w-[100%] relative ${styles.articlesWrap}`}>
              {
                /* 日付毎のセクションを生成 */
                Object.entries(dates).map(([date, articles]) => (
                  <section
                    key={date}
                    className={`${styles.sectionDate}`}
                  >
                    <h3 className={styles.sectionDateTtl}>
                      {date}
                    </h3>
                    <div className={`${listStyle} ${styles.itemWrap}`}>
                      {
                        /* 日付の記事一覧 */
                        articles.map((article) => (
                          <div key={article.id} className={`${styles.item}`}>
                            <Article article={article} viewType={viewType} />
                          </div>
                        ))
                      }
                    </div>
                  </section>
                ))
              }
            </div>
          </section>
        ))}
    </div>
  );
};

export default Articlelist;
