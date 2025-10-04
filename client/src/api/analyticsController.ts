import { BACKEND_URL } from "../constants/backendURL";
import type { AnalyticsResponse } from "../models";

export const getAnalytics = async (
  token: string
): Promise<AnalyticsResponse> => {
  const response = await fetch(`${BACKEND_URL}/api/analytics/pageviews`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get analytics: ${response.statusText}`);
  }

  const data: AnalyticsResponse = await response.json();
  return data;
};
