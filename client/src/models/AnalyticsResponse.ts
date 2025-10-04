export interface AnalyticsResponse {
  dimensionHeaders: Array<{ name: string }>;
  metricHeaders: Array<{ name: string; type: string }>;
  rows?: Array<{
    dimensionValues: Array<{ value: string }>;
    metricValues: Array<{ value: string }>;
  }>;
  totals?: Array<{ value: string }>;
  rowCount: number;
  propertyQuota?: {
    tokensPerProjectPerHour: number;
    tokensConsumed: number;
    tokensRemaining: number;
  };
}
