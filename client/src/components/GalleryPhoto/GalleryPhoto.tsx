import { Box } from "@mui/material";
import styles from "../../styles/GalleryPhoto.module.css";
import { useState } from "react";
import { ViewPhotoDialog } from "./ViewPhotoDialog";

interface GalleryPhotoProps {
  fileUrl: string;
}

const GalleryPhoto = (props: GalleryPhotoProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Box
        component="img"
        src={props.fileUrl}
        className={styles.galleryPhoto}
        onClick={() => setDialogOpen(true)}
      />
      <ViewPhotoDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        fileUrl={props.fileUrl}
      />
    </>
  );
};

export default GalleryPhoto;
