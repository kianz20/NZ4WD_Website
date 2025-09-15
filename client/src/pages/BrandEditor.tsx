import { Box, Button, Slider, TextField, Typography } from "@mui/material";
import { Header, HeadlineBanner, LoadingSpinner, Navbar } from "../components";
import { useState } from "react";
import type { BrandDetails } from "../models";
import { useRequireAuth, useToast } from "../hooks";
import * as api from "../api/brandController";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImg } from "../utils/pageUtils";
import { useNavigate } from "react-router-dom";

const BrandEditor = () => {
  const { userToken } = useRequireAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

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

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();

    let croppedLogo;

    if (!formValues.logo) {
      if (logoFile && croppedAreaPixels) {
        croppedLogo = await getCroppedImg(logoPreview!, croppedAreaPixels);
      }
    }

    const logoToUse = formValues.logo
      ? formValues.logo
      : croppedLogo ?? undefined;

    if (!formValues.name) {
      showToast("You must specify brand name", "error");
      return;
    }

    if (!logoToUse) {
      showToast("you must specify brand logo", "error");
      return;
    }

    const transformedData: { name: string; logo: string } = {
      name: formValues.name,
      logo: logoToUse,
    };

    if (userToken) {
      try {
        await api.createBrand(transformedData, userToken);
        navigate("/brandList");
      } catch (error) {
        console.log(error);
        showToast("Save failed", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <LoadingSpinner open={loading} />
      <Header />
      <Navbar />
      <HeadlineBanner />
      <Typography variant="h4" component="h1">
        New Brand
      </Typography>
      <form onSubmit={handleSave}>
        <TextField
          label="Title"
          name="title"
          value={formValues.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
        <Box mb={2}>
          <Button variant="contained" component="label">
            Upload Logo
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  setLogoFile(file);
                  setLogoPreview(URL.createObjectURL(file));
                }
              }}
            />
          </Button>
        </Box>
        {logoPreview && (
          <Box
            mb={2}
            sx={{
              position: "relative",
              width: 500,
              height: 300,
              bgcolor: "#333",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            <Cropper
              image={logoPreview}
              crop={crop}
              zoom={zoom}
              aspect={5 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedPixels) =>
                setCroppedAreaPixels(croppedPixels)
              }
              restrictPosition={false}
            />
          </Box>
        )}
        {/* Zoom Slider */}
        {logoPreview && (
          <Box mb={2}>
            <Slider
              value={zoom}
              min={0.3}
              max={3}
              step={0.1}
              onChange={(_, value) => setZoom(value as number)}
              valueLabelDisplay="auto"
              marks
            />
          </Box>
        )}
        <Button variant="outlined" type="submit">
          Save
        </Button>
      </form>
    </>
  );
};

export default BrandEditor;
