import express from "express";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const router = express.Router();
const propertyID = process.env.GOOGLE_ANALYTICS_PROPERTY_ID || "507495832";

const client = new BetaAnalyticsDataClient({
  keyFile: "./nz4wd-website-6bf6f44990bf.json",
});

router.get("/pageviews", async (req, res) => {
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyID}`,
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }],
      dateRanges: [{ startDate: "7daysAgo", endDate: "today" }],
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
