import express from "express";
import Article from "../models/Article.ts";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { author, content } = req.body;

    if (!author || !content) {
      return res.status(400).json({ erorr: "Author and Content are required" });
    }

    const newArticle = new Article({ author, content });
    await newArticle.save();
    res.json({ message: "Article Created" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
});

export default router;
