import { Box, Button, Checkbox, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../../api/articleController";
import { AdminNavbar, ConfirmDialog, LoadingSpinner } from "../../components";
import { useRequireAuth, useToast } from "../../hooks";
import { ArticleStateOptions } from "../../models";
import { ADMIN_ROUTES } from "../../constants/routes";

interface ArticleGridRows {
  id: string;
  title: string;
  author: string;
  publishDate: Date;
  ready: boolean;
  archived: boolean;
  state: string;
}

const draftState = "Draft ✏️";
const publishedState = "Published ✅";
const archivedState = "Archived 📦";
const scheduledState = "Scheduled 🕒";

const getArticleState = (
  article: {
    readyToPublish: boolean;
    archived: boolean;
    publishDate: Date;
  },
  now: Date
): string => {
  if (article.archived) {
    return archivedState;
  } else if (article.readyToPublish) {
    return new Date(article.publishDate) < now
      ? publishedState
      : scheduledState;
  } else {
    return draftState;
  }
};

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

  // 1. ADD NEW STATE for the ready confirmation dialog
  const [readyTargetId, setReadyTargetId] = useState<string | null>(null);

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
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === archiveTarget.id
            ? {
                ...row,
                archived: !row.archived,
                state: getArticleState(
                  {
                    ...row,
                    archived: !row.archived,
                    readyToPublish: row.ready,
                  },
                  new Date()
                ),
              }
            : row
        )
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
          const response = await api.getArticles(ArticleStateOptions.All);
          const now = new Date();
          setRows(
            response.map((article) => ({
              id: article._id,
              state: getArticleState(
                {
                  readyToPublish: article.readyToPublish,
                  archived: article.archived,
                  publishDate: article.publishDate,
                },
                now
              ),
              title: article.title,
              author: article.author,
              publishDate: new Date(article.publishDate),
              ready: article.readyToPublish,
              archived: article.archived,
            }))
          );
        } catch {
          showToast("failed to get articles", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    getArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  const handleEdit = (id: string) => {
    navigate(ADMIN_ROUTES.ARTICLE_EDITOR_WITH_ID.replace(":id", id));
  };

  // 2. CREATE a new function to process the "ready" toggle
  const processReadyToggle = async (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row || !userToken) return;

    setLoading(true);
    try {
      await api.readyArticle(userToken, id, !row.ready);
      setRows((prevRows) =>
        prevRows.map((r) => {
          if (r.id === id) {
            const newReadyState = !r.ready;
            const newState = getArticleState(
              {
                readyToPublish: newReadyState,
                archived: r.archived,
                publishDate: new Date(r.publishDate),
              },
              new Date()
            );
            return { ...r, ready: newReadyState, state: newState };
          }
          return r;
        })
      );
      showToast(
        `Article ${!row.ready ? "marked as ready" : "marked as not ready"}`,
        "success"
      );
    } catch {
      showToast("Failed to update ready status", "error");
    } finally {
      setLoading(false);
      setReadyTargetId(null); // Close the dialog if it was open
    }
  };

  // 3. MODIFY the original handler to check the date
  const handleReadyToggle = (id: string) => {
    const row = rows.find((r) => r.id === id);
    if (!row) return;

    // Check if we are setting it to "ready" AND the date is in the past
    const isPublishingImmediately =
      !row.ready && new Date(row.publishDate) < new Date();

    if (isPublishingImmediately) {
      // If so, open the confirmation dialog
      setReadyTargetId(id);
    } else {
      // Otherwise, proceed immediately
      processReadyToggle(id);
    }
  };

  const confirmReadyAndPublish = () => {
    if (readyTargetId) {
      processReadyToggle(readyTargetId);
    }
  };

  const columns: GridColDef<ArticleGridRows>[] = [
    { field: "state", headerName: "State", width: 150, editable: false },
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
          checked={params.row.ready}
          onChange={() => handleReadyToggle(params.id.toString())}
          disabled={
            params.row.state == publishedState ||
            params.row.state == archivedState
          }
        />
      ),
    },
    {
      field: "publishDate",
      headerName: "Publish Date",
      width: 200,
      editable: false,
      renderCell: (params) => (
        <Box
          color={
            params.row.publishDate < new Date() &&
            params.row.state != publishedState &&
            params.row.state != archivedState
              ? "red"
              : "black"
          }
        >
          {params.row.publishDate.toLocaleString()}
        </Box>
      ),
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
      <AdminNavbar />
      <Typography variant="h4" component="h1">
        Articles
      </Typography>
      <Box sx={{ height: 800, width: "100%" }}>
        <DataGrid<ArticleGridRows>
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

      <ConfirmDialog
        open={!!readyTargetId}
        title="Publish Article Immediately?"
        children={
          <Typography>
            This article's publish date is in the past. <br />
            Marking it as ready will publish it immediately and this action
            cannot be undone. <br /> Are you sure?
          </Typography>
        }
        onClose={() => setReadyTargetId(null)}
        onConfirm={confirmReadyAndPublish}
        confirmText="Yes, Publish"
      />
    </>
  );
};

export default ArticleList;
