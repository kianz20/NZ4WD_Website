export interface ArticleDetails {
  author: string;
  title: string;
  thumbnail?: string;
  articleType: "news" | "article" | "review";
  readyToPublish: boolean;
  publishDate: Date;
  content: string;
  tags: string[];
}
