import { Box, Button, Typography } from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  useGridApiRef,
  type GridRowModesModel,
  GridRowModes,
  type GridRowId,
} from "@mui/x-data-grid";
// ⬇️ 1. Import useMemo
import { useEffect, useMemo, useState } from "react";
import * as api from "../../api/categoryController";
import { AdminNavbar, ConfirmDialog, LoadingSpinner } from "../../components";
import { useRequireAuth, useToast } from "../../hooks";

interface CategoriesGridRows {
  id: string;
  category: string;
  parentCategory?: string;
}

const CategoriesList = () => {
  const { userToken } = useRequireAuth();
  const { showToast } = useToast();
  const [rows, setRows] = useState<CategoriesGridRows[]>([]);
  const [loading, setLoading] = useState(false);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const apiRef = useGridApiRef();

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    category: string;
    parentCategory?: string;
  } | null>(null);

  // ⬇️ 2. Create a memoized list of parent category options
  // This filters the rows to find categories that are themselves parents (i.e., have no parentCategory)
  // and adds an empty string option to allow unsetting the parent category.
  const parentCategoryOptions = useMemo(
    () => [
      "",
      ...rows.filter((row) => !row.parentCategory).map((row) => row.category),
    ],
    [rows]
  );

  const handleDelete = (id: string, category: string) => {
    setDeleteTarget({ id, category });
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !userToken) return;

    setLoading(true);
    try {
      // await api.deleteCategory(userToken, deleteTarget.id);
      showToast("Category Successfully Deleted", "success");
      setRows(rows.filter((row) => row.id !== deleteTarget.id));
    } catch {
      showToast("Failed to delete category", "error");
    } finally {
      setLoading(false);
      setDeleteTarget(null);
    }
  };

  useEffect(() => {
    const getBrands = async () => {
      if (userToken) {
        setLoading(true);
        try {
          const response = await api.getCategories(userToken);
          setRows(
            response.map((category) => ({
              id: category._id,
              category: category.category,
              parentCategory: category.parentCategory,
            }))
          );
        } catch {
          showToast("failed to get categories", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    getBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  const handleEdit = (id: GridRowId) => {
    const isEditing = rowModesModel[id]?.mode === GridRowModes.Edit;

    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: {
        mode: isEditing ? GridRowModes.View : GridRowModes.Edit,
        ...(isEditing && { ignoreModifications: true }),
      },
    }));
  };

  const handleProcessRowUpdate = async (
    newRow: CategoriesGridRows,
    oldRow: CategoriesGridRows
  ) => {
    if (!userToken) {
      showToast("Authentication error", "error");
      return oldRow;
    }

    if (JSON.stringify(newRow) === JSON.stringify(oldRow)) {
      return oldRow;
    }

    setLoading(true);
    try {
      await api.updateCategory(userToken, newRow.id, {
        category: newRow.category,
        parentCategory: newRow.parentCategory,
      });
      showToast("Category updated successfully", "success");
      return newRow;
    } catch (error) {
      showToast(`${error}`, "error");
      return oldRow;
    } finally {
      setLoading(false);
    }
  };

  // ⬇️ 3. Modify the column definition for 'parentCategory'
  const columns: GridColDef<CategoriesGridRows>[] = [
    { field: "category", headerName: "Category", width: 150, editable: true },
    {
      field: "parentCategory",
      headerName: "Parent Category",
      width: 150,
      editable: true,
      type: "singleSelect", // Use a dropdown for editing
      valueOptions: parentCategoryOptions, // Provide the dynamic list of options
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isEditing = rowModesModel[params.id]?.mode === "edit";

        return (
          <Box display="flex" flexDirection="row" sx={{ height: "100%" }}>
            <Button
              onClick={() => handleEdit(params.id.toString())}
              color={isEditing ? "error" : "primary"}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            {isEditing ? (
              <Button
                onClick={() => {
                  apiRef.current?.stopRowEditMode({
                    id: params.id,
                    ignoreModifications: false,
                  });
                }}
                color="success"
              >
                Save
              </Button>
            ) : (
              <Button
                onClick={() =>
                  handleDelete(params.id.toString(), params.row.category)
                }
              >
                Delete
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <LoadingSpinner open={loading} />
      <AdminNavbar />
      <Typography variant="h4" component="h1">
        Brands
      </Typography>
      <Box sx={{ height: 800, width: "100%" }}>
        <DataGrid<CategoriesGridRows>
          apiRef={apiRef}
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          editMode="row"
          processRowUpdate={handleProcessRowUpdate}
          rowModesModel={rowModesModel}
          onRowModesModelChange={setRowModesModel}
        />
      </Box>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Category"
        children={
          <Typography>
            Are you sure you want to delete {deleteTarget?.category}
          </Typography>
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirmText="Delete"
      />
    </>
  );
};

export default CategoriesList;
