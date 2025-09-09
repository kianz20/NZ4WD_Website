import mongoose, { Document, Schema } from "mongoose";

interface Article extends Document {
  author: string;
  content: string;
  publishDate: Date;
  edited: boolean;
  editedDate?: Date;
}

const ArticleSchema: Schema<Article> = new Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  publishDate: { type: Date, required: true },
  edited: { type: Boolean, required: false },
  editedDate: { type: Date, required: false },
});

const Article = mongoose.model<Article>("Article", ArticleSchema);

export default Article;
