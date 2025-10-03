import express from "express";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-providers";
const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const bucket = process.env.REACT_APP_S3_BUCKET || "nz4wd-images";

router.post("/", async (req, res) => {
  const { filename, type } = req.body;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: filename,
    ContentType: type,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60 seconds
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
});

router.get("/download", async (req, res) => {
  const { key } = req.query;
  if (!key) return res.status(400).json({ error: "Missing key" });

  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key as string,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn: 60 }); // 60 seconds
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const { continuationToken, maxKeys } = req.query;

    const command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: "article/",
      ContinuationToken: continuationToken as string | undefined,
      MaxKeys: maxKeys ? parseInt(maxKeys as string, 10) : 100,
    });

    const data = await s3.send(command);

    if (!data.Contents) {
      return res.json({ files: [], nextContinuationToken: null });
    }

    // Map keys to presigned URLs
    const files = await Promise.all(
      data.Contents.filter((obj) => obj.Key).map(async (obj) => {
        const url = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: bucket,
            Key: obj.Key!,
          }),
          { expiresIn: 60 }
        );
        return { key: obj.Key!, url };
      })
    );

    res.json({
      files,
      nextContinuationToken: data.IsTruncated
        ? data.NextContinuationToken
        : null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to list media" });
  }
});

export default router;
