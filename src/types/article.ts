export type Article = {
  id: string;
  publishshedAt: string;
  post_staff: {
    id: string;
    value: string;
  };
  post_category: {
    value: string;
  };
  date: string;
  month: number;
  article_url: string;
  comment: string;
  publishedAt?: string;

  // apiで取得するmeta情報
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: string;
};

export type ListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};
