import { useEffect, useState } from "react";
import * as api from "../../api/analyticsController";
import { useRequireAuth, useToast } from "../../hooks";
import type { AnalyticsResponse } from "../../models";

const AnalyticsCard = () => {
  const [data, setData] = useState<AnalyticsResponse>();
  const { userToken } = useRequireAuth();
  const { showToast } = useToast();

  useEffect(() => {
    const getStats = async () => {
      if (userToken) {
        try {
          const response = await api.getAnalytics(userToken);
          setData(response);
        } catch {
          showToast("failed to get brands", "error");
        }
      }
    };
    getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  if (!data) return <>Loading...</>;

  return (
    <div>
      <h3>Pageviews (last 7 days)</h3>
      <ul>
        {data.rows?.map((row, i) => (
          <li key={i}>
            {row.dimensionValues[0].value}: {row.metricValues[0].value}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnalyticsCard;
