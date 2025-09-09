export interface ArticleBody {
  author: string;
  title: string;
  readyToPublish: boolean;
  publishDate: string;
  content: string;
  edited?: boolean;
  editedDate?: string;
}
