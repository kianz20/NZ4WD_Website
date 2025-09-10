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

  useEffect(() => {
    const getArticles = async () => {
      if (userToken) {
        setLoading(true);
        try {
          const response = await api.getArticles(userToken);
          setRows(
            response.map((article) => {
              const date = new Date(article.publishDate);
              return {
                id: article._id,
                title: article.title,
                author: article.author,
                publishDate: date.toLocaleString(),
                ready: article.readyToPublish,
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
    { field: "title", headerName: "Title", width: 150, editable: false },
    { field: "author", headerName: "Author", width: 150, editable: false },
    {
      field: "ready",
      headerName: "Ready",
      width: 150,
      editable: false,
      renderCell: (params) => (
        <Checkbox
          name="readyToPublish"
          checked={params.row.ready} // use checked instead of value
          disabled
        />
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
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box display="flex" flexDirection={"row"} sx={{ height: "100%" }}>
          <Button onClick={() => handleEdit(params.id.toString())}>Edit</Button>
          <Button
            onClick={() => handleDelete(params.id.toString(), params.row.title)}
          >
            Delete
          </Button>
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
    </>
  );
};

export default ArticleList;
