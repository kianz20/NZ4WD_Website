import { Box, Button, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../../api/brandController";
import { AdminNavbar, ConfirmDialog, LoadingSpinner } from "../../components";
import { useRequireAuth, useToast } from "../../hooks";
import { ADMIN_ROUTES } from "../../constants/routes";

interface BrandGridRows {
  id: string;
  name: string;
  logo: string;
}

const BrandList = () => {
  const { userToken } = useRequireAuth();
  const { showToast } = useToast();
  const [rows, setRows] = useState<BrandGridRows[]>([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name });
  };

  const confirmDelete = async () => {
    if (!deleteTarget || !userToken) return;

    setLoading(true);
    try {
      await api.deleteBrand(userToken, deleteTarget.id);
      showToast("Brand Successfully Deleted", "success");
      setRows(rows.filter((row) => row.id !== deleteTarget.id));
    } catch {
      showToast("Failed to delete brand", "error");
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
          const response = await api.getBrands(userToken);
          setRows(
            response.map((brand) => ({
              id: brand._id,
              name: brand.name,
              logo: brand.logo,
            }))
          );
        } catch {
          showToast("failed to get brands", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    getBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  const handleEdit = (id: string) => {
    navigate(ADMIN_ROUTES.BRAND_EDITOR_WITH_ID.replace(":id", id));
  };

  const columns: GridColDef<BrandGridRows>[] = [
    { field: "name", headerName: "Name", width: 150, editable: false },
    {
      field: "logo",
      headerName: "Logo",
      width: 150,
      editable: false,
      renderCell: (params) => (
        <Box component="img" src={params.row.logo} sx={{ width: "80px" }} />
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
          <Button
            onClick={() => handleDelete(params.id.toString(), params.row.name)}
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
      <AdminNavbar />
      <Typography variant="h4" component="h1">
        Brands
      </Typography>
      <Box sx={{ height: 800, width: "100%" }}>
        <DataGrid<BrandGridRows>
          rows={rows}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Brand"
        children={
          <Typography>
            Are you sure you want to delete {deleteTarget?.name}
          </Typography>
        }
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        confirmText="Delete"
      />
    </>
  );
};

export default BrandList;
