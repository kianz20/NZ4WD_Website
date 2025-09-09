export interface ArticleResponse {
  author: string;
  title: string;
  readyToPublish: boolean;
  publishDate: string;
  content: string;
  edited?: boolean;
  editedDate?: string;
  _id: string;
}
