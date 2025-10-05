import { useEffect, useState } from "react";
import { ArticleStateOptions } from "../../../models";
import { useRequireAuth, useToast } from "../../../hooks";
import * as api from "../../../api/articleController";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { ConfirmDialog } from "../../../components";
import Typography from "@mui/material/Typography";

interface ScheduledArticleGridRows {
  id: string;
  title: string;
  publishDate: Date;
  ready: boolean;
}

const ScheduledArticlesCard = () => {
  const { userToken } = useRequireAuth();
  const { showToast } = useToast();
  const [rows, setRows] = useState<ScheduledArticleGridRows[]>([]);
  const [readyTargetId, setReadyTargetId] = useState<string | null>(null);

  useEffect(() => {
    const getArticles = async () => {
      if (userToken) {
        try {
          const response = await api.getArticles(ArticleStateOptions.Scheduled);
          setRows(
            response.map((article) => ({
              id: article._id,
              title: article.title,
              publishDate: new Date(article.publishDate),
              ready: article.readyToPublish,
            }))
          );
        } catch {
          showToast("failed to get articles", "error");
        }
      }
    };
    getArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  const handleReadyToggle = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;
    setReadyTargetId(id);
  };

  const confirmReadyAndPublish = () => {
    if (readyTargetId) {
      processReadyToggle(readyTargetId);
    }
  };

  const processReadyToggle = async (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row || !userToken || !row.ready) return; // only allow unready

    try {
      await api.readyArticle(userToken, id, false);
      setRows((prevRows) => prevRows.filter((r) => r.id !== id));
      showToast("Article marked as not ready", "success");
    } catch {
      showToast("Failed to update ready status", "error");
    } finally {
      setReadyTargetId(null);
    }
  };

  const columns: GridColDef<ScheduledArticleGridRows>[] = [
    { field: "title", headerName: "Title", flex: 1, editable: false },
    {
      field: "publishDate",
      headerName: "Publish Date",
      flex: 1,
      editable: false,
      renderCell: (params) => (
        <Box>{params.row.publishDate.toLocaleString()}</Box>
      ),
    },
    {
      field: "ready",
      headerName: "Ready",
      flex: 1,
      editable: false,
      renderCell: (params) => (
        <Checkbox
          name="readyToPublish"
          checked={params.row.ready}
          onChange={() => handleReadyToggle(params.id.toString())}
          onMouseDown={(e) => e.stopPropagation()}
        />
      ),
    },
  ];
  return (
    <>
      <Box sx={{ width: "100%", height: "100%" }}>
        <DataGrid<ScheduledArticleGridRows>
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      <ConfirmDialog
        open={!!readyTargetId}
        title="Unready Article?"
        children={<Typography>This will remove it from this list.</Typography>}
        onClose={() => setReadyTargetId(null)}
        onConfirm={confirmReadyAndPublish}
        confirmText="Unready"
      />
    </>
  );
};

export default ScheduledArticlesCard;
