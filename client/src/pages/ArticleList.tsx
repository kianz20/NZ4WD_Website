import { Box, Button, Checkbox, Typography } from "@mui/material";
import { Header, Navbar } from "../components";
import { useEffect, useState } from "react";
import * as api from "../api/articleController";
import { useRequireAuth, useToast } from "../hooks";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

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

  useEffect(() => {
    const getArticles = async () => {
      try {
        if (userToken) {
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
        }
      } catch {
        showToast("failed to get articles", "error");
      }
    };
    getArticles();
  }, [showToast, userToken]);

  const handleEdit = (id: string) => {
    console.log("Edit clicked for:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete clicked for:", id);
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
          <Button onClick={() => handleDelete(params.id.toString())}>
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
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
    </>
  );
};

export default ArticleList;
