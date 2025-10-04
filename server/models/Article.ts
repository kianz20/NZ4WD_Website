import mongoose, { Document, Schema } from "mongoose";

interface Category {
  category: string;
  parentCategory?: string;
}

interface Article extends Document {
  author: string;
  title: string;
  content: string;
  thumbnail: string;
  categories: Category[];
  tags: string[];
  articleType: "news" | "article" | "review" | "brands";
  shortDescription?: string;
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
    categories: {
      type: [
        {
          category: { type: String, required: true },
          parentCategory: { type: String },
        },
      ],
      default: [],
    },
    tags: { type: [String], default: [] },
    articleType: {
      type: String,
      enum: ["news", "article", "review", "brands"],
      required: true,
    },
    shortDescription: { type: String, required: false },
    readyToPublish: { type: Boolean, required: true },
    publishDate: { type: Date, required: true },
    archived: { type: Boolean, default: false },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Article = mongoose.model<Article>("Article", ArticleSchema);

export default Article;
