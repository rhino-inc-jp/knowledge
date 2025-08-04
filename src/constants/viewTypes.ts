export const VIEW_TYPES = {
  LIST: "list",
  IMAGE: "image",
} as const;

export type ViewType = (typeof VIEW_TYPES)[keyof typeof VIEW_TYPES];
