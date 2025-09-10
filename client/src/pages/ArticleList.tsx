import { Box, Button, Checkbox, Typography } from "@mui/material";
import { ConfirmDialog, Header, LoadingSpinner, Navbar } from "../components";
import { useEffect, useState } from "react";
import * as api from "../api/articleController";
import { useRequireAuth, useToast } from "../hooks";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

interface ArticleGridRows {
  id: string;
  title: string;
  author: string;
  publishDate: string;
  ready: boolean;
}

const ArticleList = () => {
  const { userToken } = useRequireAuth();
  const { showToast } = useToast();
  const [rows, setRows] = useState<ArticleGridRows[]>([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const [archiveTarget, setArchiveTarget] = useState<{
    id: string;
    title: string;
    archived: boolean;
  } | null>(null);

  const handleDelete = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !userToken) return;

    setLoading(true);
    try {
      await api.deleteArticle(userToken, deleteTarget.id);
      showToast("Article Successfully Deleted", "success");
      setRows(rows.filter((row) => row.id !== deleteTarget.id));
    } catch {
      showToast("Failed to delete article", "error");
    } finally {
      setLoading(false);
      setDeleteTarget(null);
    }
  };

  const handleArchive = (id: string, title: string, archived: boolean) => {
    setArchiveTarget({ id, title, archived });
  };

  const confirmArchive = async () => {
    if (!archiveTarget || !userToken) return;

    setLoading(true);
    try {
      await api.archiveArticle(
        userToken,
        archiveTarget.id,
        !archiveTarget.archived
      );
      showToast(
        `Article Successfully ${
          archiveTarget?.archived ? "Unarchived" : "Archived"
        }`,
        "success"
      );
    } catch {
      showToast("Failed to archive/unarchive article", "error");
    } finally {
      setLoading(false);
      setArchiveTarget(null);
    }
  };

  useEffect(() => {
    const getArticles = async () => {
      if (userToken) {
        setLoading(true);
        try {
          const response = await api.getArticles(userToken);
          setRows(
            response.map((article) => {
              const date = new Date(article.publishDate);
              let articleState = "";
              if (article.archived) {
                articleState = "Archived 📦";
              } else {
                if (article.readyToPublish) {
                  if (date < new Date()) {
                    articleState = "Published ✅";
                  } else {
                    articleState = "Scheduled 🕒";
                  }
                } else {
                  articleState = "Draft ✏️";
                }
              }
              return {
                id: article._id,
                state: articleState,
                title: article.title,
                author: article.author,
                publishDate: date.toLocaleString(),
                ready: article.readyToPublish,
                archived: article.archived,
              };
            })
          );
        } catch {
          showToast("failed to get articles", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    getArticles();
  }, [showToast, userToken]);

  const handleEdit = (id: string) => {
    navigate(`/articleEditor/${id}`);
  };

  const columns: GridColDef[] = [
    { field: "state", headerName: "State", width: 150, editable: false },
    { field: "title", headerName: "Title", width: 150, editable: false },
    { field: "author", headerName: "Author", width: 150, editable: false },
    {
      field: "ready",
      headerName: "Ready",
      width: 150,
      editable: false,
      renderCell: (params) => (
        <Checkbox name="readyToPublish" checked={params.row.ready} disabled />
      ),
    },
    {
      field: "publishDate",
      headerName: "Publish Date",
      width: 200,
      editable: false,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" flexDirection={"row"} sx={{ height: "100%" }}>
          <Button onClick={() => handleEdit(params.id.toString())}>Edit</Button>
          {!params.row.ready ? (
            <Button
              onClick={() =>
                handleDelete(params.id.toString(), params.row.title)
              }
            >
              Delete
            </Button>
          ) : (
            <Button
              onClick={() =>
                handleArchive(
                  params.id.toString(),
                  params.row.title,
                  params.row.archived
                )
              }
            >
              {params.row.archived ? "Unarchive" : "Archive"}
            </Button>
          )}
        </Box>
      ),
    },
  ];

  return (
    <>
      <LoadingSpinner open={loading} />
      <Header />
      <Navbar />
      <Typography variant="h4" component="h1">
        Articles
      </Typography>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Article"
        children={
          <Typography>
            Are you sure you want to delete {deleteTarget?.title}
          </Typography>
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirmText="Delete"
      />
      <ConfirmDialog
        open={!!archiveTarget}
        title={`${archiveTarget?.archived ? "Unarchive" : "Archive"} Article`}
        children={
          <Typography>
            Are you sure you want to{" "}
            {archiveTarget?.archived ? "Unarchive" : "Archive"}{" "}
            {archiveTarget?.title}
          </Typography>
        }
        onClose={() => setArchiveTarget(null)}
        onConfirm={confirmArchive}
        confirmText={archiveTarget?.archived ? "Unarchive" : "Archive"}
      />
    </>
  );
};

export default ArticleList;
