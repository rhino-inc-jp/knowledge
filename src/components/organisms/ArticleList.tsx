import React from 'react'

import type { ArticleListProps } from '@/types/article'

import Article from '@/components/atoms/Article'

const Articlelist: React.FC<ArticleListProps> = ({ data }) => {

  return (
    <div className="article-list">
      <div className="article-list__container flex flex-wrap">

        <section className="section-year">
          <h2 className="section-year__ttl">2025</h2>

          <section className="section-date">
            <h3 className="section-date__ttl">04.04</h3>
            <div className="section-date__container">

              {data.contents.map((article) => (
                <Article key={article.id} article={article} />
              ))}

            </div>
          </section>

        </section>

      </div>
    </div>
  )
}

export default Articlelist;
