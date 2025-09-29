import type { ArticleType } from "../pages/ArticleEditor";

export interface ArticleDetails {
  author: string;
  title: string;
  thumbnail?: string;
  articleType: ArticleType;
  shortDescription?: string;
  readyToPublish: boolean;
  publishDate: Date;
  content: string;
  tags: string[];
  hiddenTags: string[];
  archived: boolean;
}
