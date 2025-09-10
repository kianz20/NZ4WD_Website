export interface ArticleListObject {
  author: string;
  title: string;
  readyToPublish: boolean;
  publishDate: string;
  edited?: boolean;
  editedDate?: string;
  archived?: boolean;
  _id: string;
}

export type ArticleList = ArticleListObject[];
