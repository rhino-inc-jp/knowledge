import React from 'react'
import Image from 'next/image'

import type { Article as ArticleType, Viewport } from '@/types/article'

import styles from '@/styles/components/atoms/article.module.scss'

type Props = {
  article: ArticleType;
  viewType: Viewport;
}

const Article: React.FC<Props> = ({ article, viewType }) => {
  const { article_url, post_staff, description, title, thumb, comment } = article

  return (
    <a href={article_url} target="_blank" rel="noopener noreferrer" className={`${styles.article} ${styles[viewType]}`}>

      {
        viewType === "image" && (
          <div className={`${styles.articleThumb}`}>
            <Image
              src={thumb.url}
              fill
              alt=""
            />
          </div>
        )
      }

      <h4 className={`${styles.articleTtl}`}>{title}</h4>

      {/* spのみ */}
      <p className="article__desc">{description}</p> 

      <div className="article__bottom">
        <p className={styles.articleStaff}>{post_staff.staff}</p>
        <div className="article__bottom__btns">
          <button type="button" className="article__comment-opener relative">
            <Image
              src="/icon_message.svg"
              width={20}
              height={20}
              className="object-cover"
              alt=""
            />
          </button>
          <button type="button" className="">
            <Image
              src="/icon_heart.svg"
              width={20}
              height={20}
              className="object-cover"
              alt=""
            />
          </button>
        </div>
      </div>

      <div className="article__cover">
        <p className="article__comment">{comment}</p>
      </div>
    </a>
  )
}

export default Article;
