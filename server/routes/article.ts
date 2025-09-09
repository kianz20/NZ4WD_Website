import express from "express";
import Article from "../models/Article.ts";
import authenticateToken from "../middleware/auth.ts";

const router = express.Router();

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      author,
      title,
      content,
      readyToPublish,
      publishDate,
      edited,
      editedDate,
    } = req.body;

    if (!author || !content) {
      return res.status(400).json({ error: "Author and Content are required" });
    }

    const newArticle = new Article({
      author,
      title,
      content,
      publishDate,
      readyToPublish,
      edited,
      editedDate,
    });
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

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      author,
      title,
      content,
      readyToPublish,
      publishDate,
      edited,
      editedDate,
    } = req.body;

    if (!author || !content) {
      return res.status(400).json({ error: "Author and Content are required" });
    }

    const query = { _id: id.toString() };

    const update = {
      $set: {
        author: author,
        title: title,
        content: content,
        readyToPublish: readyToPublish,
        publishDate: publishDate,
        edited: edited,
        editedDate: editedDate,
      },
    };

    const options = { new: true };
    const updatedArticle = await Article.findOneAndUpdate(
      query,
      update,
      options
    );

    if (!updatedArticle) {
      return res
        .status(404)
        .json({ error: "Article ID does not match a product" });
    }

    res.json({ message: "Article Updated" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
});

router.get("/", authenticateToken, async (req, res) => {
  try {
    const articles = await Article.find().select("-content");
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles: " + error });
  }
});

router.get("/getEditDetails/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const articleEditDetails = await Article.findById(id);
    if (!articleEditDetails) {
      return res.status(404).json({ error: "No article was found" });
    }
    res.status(200).json(articleEditDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch article: " + error });
  }
});

export default router;
