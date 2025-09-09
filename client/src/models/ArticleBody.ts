export interface ArticleBody {
  author: string;
  title: string;
  publishDate: string;
  content: string;
  edited?: boolean;
  editedDate?: Date;
}
