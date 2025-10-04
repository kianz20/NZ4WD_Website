import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import styles from "../../styles/GalleryPhoto.module.css";
import { getFileExtensionFromKey } from "../../utils/pageUtils";
import { downloadImageFromS3 } from "../../services/s3Service";
import { S3PREFIX } from "../../constants/s3Prefix";

interface ViewPhotoDialogProps {
  open: boolean;
  onClose: () => void;
  fileUrl: string;
}

export const ViewPhotoDialog = ({
  open,
  onClose,
  fileUrl,
}: ViewPhotoDialogProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          sx: { width: "85vw", maxWidth: "none" },
        },
      }}
    >
      <DialogTitle>View Media</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <Box component="img" src={fileUrl} className={styles.focusedImage} />
        <Button
          onClick={() => {
            if (fileUrl) {
              const urlWithoutQuery = fileUrl.split("?")[0];
              const extension = getFileExtensionFromKey(urlWithoutQuery);
              downloadImageFromS3(
                urlWithoutQuery.replace(S3PREFIX, ""),
                `GalleryDownload.${extension}`
              );
            }
          }}
        >
          Download
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
