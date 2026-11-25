import React from "react";
import type { Article as ArticleType } from "@/types/article";
import Article from "@/components/atoms/Article";
import styles from "@/styles/components/organisms/articleList.module.css";
import { formatArticlesByYearAndMonth } from "@/utils/formatArticles";
import { ViewType } from "@/constants/viewTypes";

type Props = {
  articles: ArticleType[];
  viewType: ViewType;
  // 指定すると、年月ごとに分けずに1つのまとまりで表示し、左の縦見出しをこの文字にする（例：My Page）
  title?: string;
};

const ArticleList = ({ viewType, articles, title }: Props) => {
  const listStyle = styles[viewType] || "";

  // 月ごとのホバー色に使う month を設定しつつ、年月ごとに分ける
  const byMonth = formatArticlesByYearAndMonth(articles);
  // ※下で並べ替えるため、元の配列を書き換えないようコピーする
  const formatted = title ? { [title]: [...articles] } : byMonth;

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
                {dates
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .map((article) => (
                    <div
                      key={article.id}
                      className={`${styles.item} animate-in`}
                    >
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
