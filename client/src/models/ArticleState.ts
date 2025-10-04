export const ArticleStateOptions = {
  Draft: "draft",
  Published: "published",
  Archived: "archived",
  Scheduled: "scheduled",
  All: "all",
} as const;

export type ArticleState =
  (typeof ArticleStateOptions)[keyof typeof ArticleStateOptions];
