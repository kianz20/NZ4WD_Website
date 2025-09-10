export interface ArticleEditOut {
  author: string;
  title: string;
  readyToPublish: boolean;
  publishDate: Date;
  content: string;
  tags: string[];
}
