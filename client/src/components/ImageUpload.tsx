import { Box, Button, Slider, Typography } from "@mui/material";
import { useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { getCroppedImg, getFileExtensionFromKey } from "../utils/pageUtils";
import { s3prefix } from "../constants/s3Prefix";
import { downloadImageFromS3 } from "../services/s3Service";

interface ImageUploadProps {
  setOutput: (value: string | null) => void;
  downloadFileName: string;
  headingText: string;
  existingFile?: string;
}

const ImageUpload = (props: ImageUploadProps) => {
  const { setOutput, downloadFileName, headingText, existingFile } = props;
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

  const isLoadedMode = !!existingFile && !file && !removed;

  const removeImage = () => {
    setOutput(null);
    setRemoved(true);
  };

  return (
    <>
      {isLoadedMode ? (
        <>
          <Typography>{headingText}</Typography>
          <Box component="img" src={existingFile} />
          <Button
            onClick={() => {
              removeImage();
            }}
          >
            Remove
          </Button>
          <Button
            onClick={() => {
              if (existingFile) {
                const extension = getFileExtensionFromKey(existingFile);
                downloadImageFromS3(
                  existingFile.replace(s3prefix, ""),
                  `${downloadFileName}.${extension}`
                );
              }
            }}
          >
            Download
          </Button>
        </>
      ) : (
        <>
          <Box mb={2}>
            <Button variant="contained" component="label">
              Upload Image
              <input
                hidden
                accept="image/*"
                type="file"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    setFile(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </Button>
          </Box>
          {preview && (
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
          )}
          {/* Zoom Slider */}
          {preview && (
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
        </>
      )}
    </>
  );
};

export default ImageUpload;
