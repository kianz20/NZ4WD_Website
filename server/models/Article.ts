import mongoose, { Document, Schema } from "mongoose";

interface Article extends Document {
  author: string;
  title: string;
  content: string;
  readyToPublish: boolean;
  publishDate: string;
  edited: boolean;
  editedDate?: Date;
}

const ArticleSchema: Schema<Article> = new Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  readyToPublish: { type: Boolean, required: true },
  publishDate: { type: String, required: true },
  edited: { type: Boolean, required: false },
  editedDate: { type: Date, required: false },
});

const Article = mongoose.model<Article>("Article", ArticleSchema);

export default Article;
