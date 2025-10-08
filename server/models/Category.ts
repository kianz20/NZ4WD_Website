import mongoose, { Document, Schema, Types } from "mongoose";

interface Category extends Document {
  _id: Types.ObjectId;
  category: string;
  parentCategory?: string;
}

const CategorySchema: Schema<Category> = new Schema(
  {
    category: { type: String, required: true },
    parentCategory: { type: String },
  },
  { timestamps: true }
);

const Category = mongoose.model<Category>("Category", CategorySchema);

export default Category;
