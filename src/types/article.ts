export type Article = {
  id: string;
  publishshedAt: string;
  post_staff: {
    id: string;
    value: string;
  };
  post_staff_multiple: {
    id: string;
    value: string;
  }[];
  post_category: {
    value: string;
  };
  date: string;
  month: number;
  article_url: string;
  comment: string;
  publishedAt?: string;

  title: string;
  description: string;
  thumb: {
    url: string;
  };

  // apiで取得するmeta情報
  metaTitle?: string;
  metaDescription?: string;
  metaImage?: string;
  // OGP を取得中かどうか（取得中は No Image を出さずに待つ）
  isMetaLoading?: boolean;

  editor: string;
};

export type ListResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};
