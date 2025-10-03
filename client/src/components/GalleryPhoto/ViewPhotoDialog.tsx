import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import styles from "../../styles/GalleryPhoto.module.css";

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
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xl">
      <DialogTitle>View Media</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <Box component="img" src={fileUrl} className={styles.focusedImage} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
