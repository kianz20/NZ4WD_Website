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

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.body.name || !req.body.logo) {
      return res.status(400).json({ error: "Name and Logo are required" });
    }

    const brandToEdit = await Brand.findById(id);
    if (!brandToEdit) {
      return res.status(404).json({ error: "Brand not found" });
    }

    if (brandToEdit.logo && brandToEdit.logo !== req.body.logo) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: bucket,
            Key: brandToEdit.logo.replace(prefix, ""),
          })
        );
      } catch (s3Error) {
        console.error("Failed to delete old thumbnail:", s3Error);
      }
    }

    const update = {
      $set: {
        ...req.body,
      },
    };

    await Brand.findByIdAndUpdate(id, update, { new: true });

    res.json({ message: "Brand Updated" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
});

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

router.get("/brand/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }
    const brandDetails = await Brand.findById(id);
    if (!brandDetails) {
      return res.status(404).json({ error: "No brand was found" });
    }
    res.status(200).json(brandDetails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Brand: " + error });
  }
});

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
        Key: brandToDelete.logo.replace(prefix, ""),
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

export default router;
