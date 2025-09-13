import type { ArticleDetails } from "./ArticleDetails";

export interface ArticleListObject extends Omit<ArticleDetails, "content"> {
  _id: string;
}

export type ArticleList = ArticleListObject[];
