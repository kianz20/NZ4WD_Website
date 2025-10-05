import { useEffect, useState } from "react";
import * as api from "../../api/analyticsController";
import { useRequireAuth, useToast } from "../../hooks";
import type { AnalyticsResponse } from "../../models";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Box,
} from "@mui/material";

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
          showToast("Failed to get analytics", "error");
        }
      }
    };
    getStats();
  }, [userToken]);

  if (!data)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Pageviews (last 7 days)
      </Typography>
      <Box sx={{ width: "100%", height: "90%", overflowY: "auto" }}>
        <List disablePadding>
          {data.rows?.map((row, i) => (
            <Box key={i} sx={{ width: "100%", height: "100%" }}>
              <ListItem>
                <ListItemText
                  primary={
                    row.dimensionValues[0].value.replace("/", "") || "home"
                  }
                  secondary={`Views: ${row.metricValues[0].value}`}
                />
              </ListItem>
              {data.rows && i < data.rows.length - 1 && <Divider />}
            </Box>
          ))}
        </List>
      </Box>
    </>
  );
};

export default AnalyticsCard;
