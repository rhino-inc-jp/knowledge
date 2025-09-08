import { Article } from "@/types/article";

/**
 * microCMSから取得した記事のリストを
 * 年・月でセクションを作れるようにデータを整形します
 */

export type FormattedArticles = {
  [year: string]: Article[];
};

export const formatArticlesByYearAndMonth = (
  articles: Article[]
): FormattedArticles => {
  const formatted: FormattedArticles = {};

  articles.forEach((article) => {
    const dateObj = new Date(article.date);
    const year = dateObj.getFullYear().toString();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");

    const key = `${year}.${month}`;

    article.month = Number(month);

    (formatted[key] ??= []).push(article);
  });

  return formatted;
};
