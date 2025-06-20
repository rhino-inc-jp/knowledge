import React from 'react'

import type { Viewport, ListResponse, Article as ArticleType } from '@/types/article'

import Article from '@/components/atoms/Article'

import styles from '@/styles/components/organisms/articleList.module.scss'

type Props = {
  data: ListResponse<ArticleType>;
  viewType: Viewport;
}

const Articlelist: React.FC<Props> = ({ data, viewType }) => {

  const listStyle = styles[viewType]

  return (
    <div className="article-list">
      <div className="article-list__container">

        <section className={styles.sectionYear}>
          <h2 className={styles.sectionYearTtl}>2025</h2>

          <section className={`${styles.sectionDate} mx-common-sp md:mx-common-pc`}>
            <h3 className={styles.sectionDateTtl}>04.04</h3>
            <div className={`${styles.listWrapper} ${listStyle}`}>
              {data.contents.map((article) => (
              <div key={article.id} className={`${styles.item}`}>
                <Article article={article} viewType={viewType} />
              </div>
              ))}

            </div>
          </section>

          <section className={`${styles.sectionDate} mx-common-sp md:mx-common-pc`}>
            <h3 className={styles.sectionDateTtl}>03.01</h3>
            <div className={`${styles.listWrapper} ${listStyle}`}>
              {data.contents.map((article) => (
              <div key={article.id} className={`${styles.item}`}>
                <Article article={article} viewType={viewType} />
              </div>
              ))}

            </div>
          </section>

        </section>

        <section className={styles.sectionYear}>
          <h2 className={styles.sectionYearTtl}>2024</h2>

          <section className={`${styles.sectionDate} mx-common-sp md:mx-common-pc`}>
            <h3 className={styles.sectionDateTtl}>12.04</h3>
            <div className={`${styles.listWrapper} ${listStyle}`}>
              {data.contents.map((article) => (
              <div key={article.id} className={`${styles.item}`}>
                <Article article={article} viewType={viewType} />
              </div>
              ))}

            </div>
          </section>

          <section className={`${styles.sectionDate} mx-common-sp md:mx-common-pc`}>
            <h3 className={styles.sectionDateTtl}>03.01</h3>
            <div className={`${styles.listWrapper} ${listStyle}`}>
              {data.contents.map((article) => (
              <div key={article.id} className={`${styles.item}`}>
                <Article article={article} viewType={viewType} />
              </div>
              ))}

            </div>
          </section>

        </section>

      </div>
    </div>
  )
}

export default Articlelist;
