import mongoose, { Document, Schema } from "mongoose";

interface Article extends Document {
  author: string;
  title: string;
  content: string;
  thumbnail: string;
  tags: string[];
  readyToPublish: boolean;
  publishDate: Date;
  edited: boolean;
  archived: boolean;
}

const ArticleSchema: Schema<Article> = new Schema(
  {
    author: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    thumbnail: { type: String },
    tags: { type: [String], default: [] },
    readyToPublish: { type: Boolean, required: true },
    publishDate: { type: Date, required: true },
    archived: { type: Boolean, default: false },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Article = mongoose.model<Article>("Article", ArticleSchema);

export default Article;
