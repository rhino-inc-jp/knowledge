import { Article } from "@/types/article"

/**
 * microCMSから取得した記事のリストを
 * 年・日でセクションを作れるようにデータを整形します
 */

export type FormattedArticles = {
  [year: string]: {
    [date: string]: Article[]
  }
}

export const formatArticlesByYearAndDate = (articles: Article[]): FormattedArticles => {
  const formatted: FormattedArticles = {};

  articles.forEach(article => {
    const dateObj = new Date(article.date);
    const year = dateObj.getFullYear().toString();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const displayDate = `${month}.${day}`;

    if (!formatted[year]) {
      formatted[year] = {};
    }
    if (!formatted[year][displayDate]) {
      formatted[year][displayDate] = [];
    }
    
    formatted[year][displayDate].push(article)
  });

  return formatted;
};