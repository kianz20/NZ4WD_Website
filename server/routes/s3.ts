import express from "express";
import AWS from "aws-sdk";

const router = express.Router();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

router.post("/", async (req, res) => {
  const { filename, type } = req.body;
  const params = {
    Bucket: "my-article-images",
    Key: filename,
    Expires: 60, // URL expires in 60 seconds
    ContentType: type,
  };

  try {
    const url = await s3.getSignedUrlPromise("putObject", params);
    res.json({ url });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate presigned URL" });
  }
});

export default router;
