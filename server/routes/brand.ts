import express from "express";
import authenticateToken from "../middleware/auth.ts";
import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { fromEnv } from "@aws-sdk/credential-providers";
import Brand from "../models/Brand.ts";
import { JSDOM } from "jsdom";

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
    if (!req.body.name || !req.body.logo) {
      return res.status(400).json({ error: "Name and Logo are required" });
    }

    const newBrand = new Brand({ ...req.body });
    await newBrand.save();

    res.json({ message: "Brand Created" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

// router.put("/:id", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!req.body.author || !req.body.content) {
//       return res.status(400).json({ error: "Author and Content are required" });
//     }

//     const articleToEdit = await Article.findById(id);
//     if (!articleToEdit) {
//       return res.status(404).json({ error: "Article not found" });
//     }

//     if (
//       articleToEdit.thumbnail &&
//       articleToEdit.thumbnail !== req.body.thumbnail
//     ) {
//       try {
//         await s3.send(
//           new DeleteObjectCommand({
//             Bucket: bucket,
//             Key: articleToEdit.thumbnail.replace(prefix, ""),
//           })
//         );
//       } catch (s3Error) {
//         console.error("Failed to delete old thumbnail:", s3Error);
//       }
//     }

//     const update = {
//       $set: {
//         ...req.body,
//         edited: true,
//       },
//     };

//     await Article.findByIdAndUpdate(id, update, { new: true });

//     res.json({ message: "Article Updated" });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     }
//   }
// });

router.get("/", authenticateToken, async (req, res) => {
  try {
    const { includeHidden } = req.query;
    const filter: any = {};

    const brands = await Brand.find(filter);
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch brands: " + error });
  }
});

// router.get("/article/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ error: "ID is required" });
//     }
//     const articleEditDetails = await Article.findById(id);
//     if (!articleEditDetails) {
//       return res.status(404).json({ error: "No article was found" });
//     }
//     res.status(200).json(articleEditDetails);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch article: " + error });
//   }
// });

router.delete("/delete/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const brandToDelete = await Brand.findById(id);

    if (!brandToDelete) {
      return res.status(404).json({ error: "Brand not found" });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: brandToDelete.name.replace(prefix, ""),
      })
    );

    await Brand.findByIdAndDelete(id);

    res.status(200).json({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unexpected error occurred" });
    }
  }
});

// router.put("/archive/:id", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { archive } = req.body;

//     if (!id) {
//       return res.status(400).json({ error: "ID is required" });
//     }

//     if (typeof archive !== "boolean") {
//       return res
//         .status(400)
//         .json({ error: "Archive value must be true or false" });
//     }

//     const updatedArticle = await Article.findByIdAndUpdate(
//       id,
//       { archived: archive },
//       { new: true } // return the updated document
//     );

//     if (!updatedArticle) {
//       return res.status(404).json({ error: "Article not found" });
//     }

//     res.status(200).json({
//       message: `Article ${archive ? "archived" : "unarchived"} successfully`,
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "An unexpected error occurred" });
//     }
//   }
// });

// router.put("/ready/:id", authenticateToken, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { ready } = req.body;

//     if (!id) {
//       return res.status(400).json({ error: "ID is required" });
//     }

//     if (typeof ready !== "boolean") {
//       return res
//         .status(400)
//         .json({ error: "Ready value must be true or false" });
//     }

//     const updatedArticle = await Article.findByIdAndUpdate(
//       id,
//       { readyToPublish: ready },
//       { new: true }
//     );

//     if (!updatedArticle) {
//       return res.status(404).json({ error: "Article not found" });
//     }

//     res.status(200).json({
//       message: `Article ${ready ? "made ready" : "made unready"} successfully`,
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       res.status(500).json({ error: error.message });
//     } else {
//       res.status(500).json({ error: "An unexpected error occurred" });
//     }
//   }
// });

export default router;
