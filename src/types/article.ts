export type Article = {
  id: string;
  title: string;
  publishshedAt: string;
  post_staff: {
    id: string;
    value: string;
  };
  post_category: {
    value: string;
  };
  date: string;
  article_url: string;
  description: string;
  thumb: {
    url: string;
  };
  comment: string;
  publishedAt?: string;
};

export type ListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};
