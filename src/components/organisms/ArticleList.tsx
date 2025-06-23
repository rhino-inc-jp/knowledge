import React from 'react'

import type { Viewport, ListResponse, Article as ArticleType } from '@/types/article'

import Article from '@/components/atoms/Article'

import styles from '@/styles/components/organisms/articleList.module.css'

type Props = {
  data: ListResponse<ArticleType>;
  viewType: Viewport;
}

const Articlelist: React.FC<Props> = ({ data, viewType }) => {

  const listStyle = styles[viewType]

  return (
    <div>
      <section className="relative">

        <h2 className={`top-[185px] ${styles.sectionYearTtl}`}>2025</h2>

        <section className={`${styles.sectionDate} mx-common-sp md:mx-common-pc`}>
          <h3 className={`top-[185px] ${styles.sectionDateTtl}`}>04.04</h3>
          <div className={`pl-[35px] ${listStyle}`}>
            {data.contents.map((article) => (
            <div key={article.id} className={`${styles.item}`}>
              <Article article={article} viewType={viewType} />
            </div>
            ))}
          </div>
        </section>

      </section>
    </div>
  )
}

export default Articlelist;
