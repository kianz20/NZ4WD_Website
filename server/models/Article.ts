import mongoose, { Document, Schema } from "mongoose";

interface Article extends Document {
  author: string;
  content: string;
  edited: boolean;
}

const ArticleSchema: Schema<Article> = new Schema({
  author: { type: String, required: true },
  content: { type: String, required: true },
  edited: { type: Boolean, required: true },
});

const Article = mongoose.model<Article>("Article", ArticleSchema);

export default Article;
