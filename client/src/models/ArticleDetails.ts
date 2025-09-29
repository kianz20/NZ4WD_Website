import type { Category } from ".";
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
  categories: Category[];
  tags: string[];
  archived: boolean;
}
