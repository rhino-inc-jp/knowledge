import React from 'react'

import type { Viewport, Article as ArticleType } from '@/types/article'

import Article from '@/components/atoms/Article'

import styles from '@/styles/components/organisms/articleList.module.css'

import { formatArticlesByYearAndDate } from '@/utils/formatArticles';

type Props = {
  articles: ArticleType[];
  viewType: Viewport;
}

const Articlelist: React.FC<Props> = ({ viewType, articles }) => {

  // リストの表示レイアウト
  const listStyle = styles[viewType]

  // 年・日でセクションを分ける
  const formatted = formatArticlesByYearAndDate(articles);

  return (
    <div>
      {
        Object.entries(formatted)
          .sort(([aYear], [bYear]) => Number(bYear) - Number(aYear))
          .map(([year, month]) => (
            // yearのセクションを生成
            <section key={year} className="relative">
              <h2 className={`top-[185px] ${styles.sectionYearTtl}`}>{year}</h2>
              {
                /* 日付毎のセクションを生成 */
                Object.entries(month).map(([date, articles]) => (
                  <section key={date} className={`${styles.sectionDate} mx-common-sp md:mx-common-pc`}>
                    <h3 className={`top-[185px] ${styles.sectionDateTtl}`}>{date}</h3>
                    <div className={`pl-[35px] ${listStyle}`}>
                      { /* 日付の記事一覧 */
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
            </section>
          ))
      }
    </div>
  );
};

export default Articlelist;
