import { Button, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as api from "../../api/brandController";
import {
  AdminNavbar,
  HeadlineBanner,
  ImageUpload,
  LoadingSpinner,
} from "../../components";
import { ADMIN_ROUTES } from "../../constants/routes";
import { useRequireAuth, useToast } from "../../hooks";
import type { BrandDetails } from "../../models";

const BrandEditor = () => {
  const { userToken } = useRequireAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);

  const [formValues, setFormValues] = useState<BrandDetails>({
    name: "",
    logo: "",
  });

  const handleChange = <K extends keyof BrandDetails>(
    field: K,
    value: BrandDetails[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (id && userToken) {
      setLoading(true);
      api
        .getBrand(id)
        .then((data) => {
          setFormValues({
            name: data.name,
            logo: data.logo,
          });
        })
        .catch(() => {
          showToast("Failed to load article", "error");
        })
        .finally(() => {
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userToken]);

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formValues.logo) {
      showToast("You must provide a logo", "error");
      return;
    }

    const transformedData: { name: string; logo: string } = {
      name: formValues.name,
      logo: formValues.logo,
    };

    if (userToken) {
      try {
        if (id) {
          await api.updateBrand(id, transformedData, userToken);
        } else {
          await api.createBrand(transformedData, userToken);
        }
        navigate(ADMIN_ROUTES.BRAND_LIST);
      } catch {
        showToast("Save failed", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <LoadingSpinner open={loading} />
      <AdminNavbar />
      <HeadlineBanner />
      <Typography variant="h4" component="h1">
        New Brand
      </Typography>
      <form onSubmit={handleSave}>
        <TextField
          label="Brand Name"
          name="name"
          value={formValues.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <ImageUpload
          setOutput={(value) => {
            if (value) handleChange("logo", value);
          }}
          downloadFileName={`${formValues.name}-logo`}
          existingFile={formValues.logo}
        />

        <Button variant="outlined" type="submit">
          Save
        </Button>
      </form>
    </>
  );
};

export default BrandEditor;
