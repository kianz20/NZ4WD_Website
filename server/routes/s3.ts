import express from "express";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-providers";
const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

router.post("/", async (req, res) => {
  const { filename, type } = req.body;

  const command = new PutObjectCommand({
    Bucket: "nz4wd-images",
    Key: filename,
    ContentType: type,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60 seconds
    res.json({ url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
});

export default router;
