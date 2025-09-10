export interface ArticleCreateIn {
  author: string;
  title: string;
  thumbnail?: string;
  readyToPublish: boolean;
  publishDate: Date;
  content: string;
  tags: string[];
}
