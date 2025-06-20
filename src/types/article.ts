export type Article = {
  id: string;
  title: string;
  publishshedAt: string;
  post_staff: {
    id: string;
    staff: string;
  };
  post_category: {
    category: string;
  };
  date: string;
  article_url: string;
  description: string;
  thumb: {
    url: string;
  };
  comment: string;
}

export type ListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

export type ArticleListProps = {
  data: ListResponse<Article>
}