import express from "express";
import Article from "../models/Article.ts";
import authenticateToken from "../middleware/auth.ts";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { JSDOM } from "jsdom";

const router = express.Router();

const s3 = new S3Client({ region: "ap-southeast-2" });

router.post("/", authenticateToken, async (req, res) => {
  try {
    const {
      author,
      title,
      content,
      readyToPublish,
      publishDate,
      editedDate,
      tags,
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
      editedDate,
      tags,
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
      editedDate,
      tags,
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
        edited: true,
        editedDate: editedDate,
        tags: tags,
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

router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const articleToDelete = await Article.findById(id);

    if (!articleToDelete) {
      return res.status(404).json({ error: "Article not found" });
    }

    const dom = new JSDOM(articleToDelete.content);
    const imageURLs = Array.from(
      dom.window.document.querySelectorAll("img")
    ).map((img) => img.src);

    const bucket = "nz4wd-images";
    const prefix = `https://${bucket}.s3.ap-southeast-2.amazonaws.com/`;
    const keys = imageURLs
      .filter((url) => url.startsWith(prefix))
      .map((url) => url.replace(prefix, ""));

    await Promise.all(
      keys.map((key) =>
        s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
      )
    );

    await Article.findByIdAndDelete(id);

    res.status(200).json({
      message: "Article deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

router.put("/archive/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { archive } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    if (typeof archive !== "boolean") {
      return res
        .status(400)
        .json({ error: "Archive value must be true or false" });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { archived: archive },
      { new: true } // return the updated document
    );

    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.status(200).json({
      message: `Article ${archive ? "archived" : "unarchived"} successfully`,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

export default router;
