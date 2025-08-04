export type Category = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  value: string;
};

export type CategoryResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type Date = {
  id: string;
  value: string;
};

export type Staff = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  value: string;
};

export type StaffResponse<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

export type SearchParams = {
  keyword: string;
  category: string[];
  date: string[];
  staff: string[];
};
