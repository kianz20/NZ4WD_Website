import mongoose, { Document, Schema } from "mongoose";

interface Brand extends Document {
  name: string;
}

const BrandSchema: Schema<Brand> = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Brand = mongoose.model<Brand>("Brand", BrandSchema);

export default Brand;
