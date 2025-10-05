import { Box, Button, Slider } from "@mui/material";
import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImg, getFileExtensionFromKey } from "../utils/pageUtils";
import { S3PREFIX } from "../constants/s3Prefix";
import { downloadImageFromS3 } from "../services/s3Service";
import { useToast } from "../hooks";
import styles from "../styles/ImageUpload.module.css";

interface ImageUploadProps {
  setOutput: (value: string | null) => void;
  downloadFileName: string;
  existingFile?: string;
  buttonLabel?: string;
}

const ImageUpload = (props: ImageUploadProps) => {
  const { setOutput, downloadFileName, existingFile } = props;
  const [preview, setPreview] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [removed, setRemoved] = useState(false);
  const onCropComplete = async (preview: string, croppedPixels: Area) => {
    if (file && croppedPixels) {
      setOutput(await getCroppedImg(preview, croppedPixels));
    }
  };
  const { showToast } = useToast();

  const isLoaded = !!existingFile && !file && !removed;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    img.onload = () => {
      if (img.width <= 1800 && img.height <= 1200) {
        setFile(file);
        setPreview(URL.createObjectURL(file));
      } else {
        showToast("Image must be at most 1800x1200 pixels", "error");
      }
    };
    img.src = URL.createObjectURL(file);
  };

  const removeImage = () => {
    setFile(null);
    setOutput(null);
    setPreview(null);
    setRemoved(true);
  };
  return (
    <>
      {isLoaded ? (
        <>
          <Box
            component="img"
            src={existingFile}
            sx={{
              width: 442,
              height: 300,
            }}
          />
        </>
      ) : (
        <>
          {preview && (
            <>
              <Box
                mb={2}
                sx={{
                  position: "relative",
                  width: 442,
                  height: 300,
                  bgcolor: "#333",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                <Cropper
                  image={preview}
                  crop={crop}
                  zoom={zoom}
                  aspect={5 / 3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, croppedPixels) => {
                    onCropComplete(preview, croppedPixels);
                  }}
                  restrictPosition={false}
                />
              </Box>
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
            </>
          )}
        </>
      )}
      <Box className={styles.actionButtons}>
        <Button variant="contained" component="label">
          {file || isLoaded ? "Change" : "Upload"}
          <input
            hidden
            accept="image/*"
            type="file"
            onChange={handleFileChange}
          />
        </Button>
        {preview ||
          (isLoaded && (
            <Button
              onClick={() => {
                removeImage();
              }}
              variant="outlined"
              color="error"
            >
              Remove
            </Button>
          ))}

        {isLoaded && (
          <>
            <Button
              variant="outlined"
              onClick={() => {
                if (existingFile) {
                  const extension = getFileExtensionFromKey(existingFile);
                  downloadImageFromS3(
                    existingFile.replace(S3PREFIX, ""),
                    `${downloadFileName}.${extension}`
                  );
                }
              }}
            >
              Download
            </Button>
          </>
        )}
      </Box>
    </>
  );
};

export default ImageUpload;
