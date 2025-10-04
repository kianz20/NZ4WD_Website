import express from "express";
import Article from "../models/Article.ts";
import authenticateToken from "../middleware/auth.ts";
import {
  S3Client,
  DeleteObjectsCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { JSDOM } from "jsdom";
import { fromEnv } from "@aws-sdk/credential-providers";

const router = express.Router();
const bucket = process.env.REACT_APP_S3_BUCKET || "nz4wd-images";
const prefix =
  process.env.REACT_APP_S3_PREFIX ||
  `https://${bucket}.s3.ap-southeast-2.amazonaws.com/`;

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

router.post("/", authenticateToken, async (req, res) => {
  try {
    if (!req.body.author || !req.body.content) {
      return res.status(400).json({ error: "Author and Content are required" });
    }

    const newArticle = new Article({ ...req.body });
    await newArticle.save();

    res.json({ message: "Article Created" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body.author || !req.body.content) {
      return res.status(400).json({ error: "Author and Content are required" });
    }

    const articleToEdit = await Article.findById(id);
    if (!articleToEdit) {
      return res.status(404).json({ error: "Article not found" });
    }

    if (
      articleToEdit.thumbnail &&
      articleToEdit.thumbnail !== req.body.thumbnail
    ) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: articleToEdit.thumbnail.replace(prefix, ""),
          })
        );
      } catch (s3Error) {
        console.error("Failed to delete old thumbnail:", s3Error);
      }
    }

    const update = {
      $set: {
        ...req.body,
        edited: true,
      },
    };

    await Article.findByIdAndUpdate(id, update, { new: true });

    res.json({ message: "Article Updated" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

router.get("/", async (req, res) => {
  try {
    const { articleType, articleState } = req.query;
    const filter: any = {};
    const currentDate = new Date();

    if (articleType) filter.articleType = articleType;

    if (articleState) {
      switch (articleState) {
        case "draft":
          filter.readyToPublish = false;
          break;
        case "published":
          filter.readyToPublish = true;
          filter.publishDate = { $lte: currentDate };
          break;
        case "archived":
          filter.archived = true;
          break;
        case "scheduled":
          filter.readyToPublish = true;
          filter.publishDate = { $gt: currentDate };
          break;
      }
    }

    const articlesAll = await Article.find(filter).select("-content");
    console.log(articlesAll);
    res.status(200).json(articlesAll);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch articles: " + error });
  }
});

router.get("/article/:id", async (req, res) => {
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
    const { document, HTMLImageElement } = dom.window;
    const imageURLs = Array.from(document.querySelectorAll("img"))
      .filter(
        (el): el is InstanceType<typeof HTMLImageElement> =>
          el instanceof HTMLImageElement
      )
      .map((img) => img.src);

    const keys = imageURLs
      .filter((url) => url.startsWith(prefix))
      .map((url) => url.replace(prefix, ""));

    if (keys.length > 0) {
      await s3.send(
        new DeleteObjectsCommand({
          Bucket: bucket,
          Delete: {
            Objects: keys.map((Key) => ({ Key })),
            Quiet: true,
          },
        })
      );
    }

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

router.put("/ready/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { ready } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    if (typeof ready !== "boolean") {
      return res
        .status(400)
        .json({ error: "Ready value must be true or false" });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { readyToPublish: ready },
      { new: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.status(200).json({
      message: `Article ${ready ? "made ready" : "made unready"} successfully`,
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
