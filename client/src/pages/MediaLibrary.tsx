import { Typography } from "@mui/material";
import { GalleryPhoto, Header, HeadlineBanner, Navbar } from "../components";
import { useRequireAuth } from "../hooks";
import { useEffect, useState } from "react";
import { getAllMedia } from "../services/s3Service";

const MediaLibrary = () => {
  const [files, setFiles] = useState<{ key: string; url: string }[]>([]);
  const [, setNextContinuationToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getMedia = async () => {
      const { files: newFiles, nextContinuationToken: token } =
        await getAllMedia();
      setFiles(newFiles);
      setNextContinuationToken(token);
    };
    getMedia();
  }, []);

  useRequireAuth();

  return (
    <>
      <Header />
      <Navbar />
      <HeadlineBanner />
      <Typography variant="h4" component="h1">
        Media Library
      </Typography>
      {files.map((file) => {
        return <GalleryPhoto fileUrl={file.url} />;
      })}
    </>
  );
};

export default MediaLibrary;
