import type { ArticleDetails } from "./ArticleDetails";

export interface ArticleListObject extends ArticleDetails {
  _id: string;
}

export type ArticleList = ArticleListObject[];
