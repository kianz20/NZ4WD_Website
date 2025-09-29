import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import articleRoutes from "./routes/article.ts";
import userRoutes from "./routes/user.ts";
import s3Routes from "./routes/s3.ts";
import brandRoutes from "./routes/brand.ts";
import categoryRoutes from "./routes/category.ts";

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/articles", articleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/s3-presign", s3Routes);
app.use("/api/brands", brandRoutes);
app.use("/api/categories", categoryRoutes);

mongoose
  .connect(process.env.MONGO_URI ?? "")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
