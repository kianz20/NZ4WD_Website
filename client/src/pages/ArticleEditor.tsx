import { Box, Button, Typography } from "@mui/material";
import { Header, Navbar } from "../components";
import Quill from "quill";
import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";

const ArticleEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      if (!editorRef.current.hasChildNodes()) {
        // prevents double init
        quillRef.current = new Quill(editorRef.current, {
          theme: "snow",
          modules: {
            toolbar: [
              [{ header: [1, 2, false] }],
              ["bold", "italic", "underline"],
              ["image", "code-block"],
            ],
          },
        });
      }
    }
  }, []);

  const getContent = () => {
    if (quillRef.current) {
      const html = quillRef.current.root.innerHTML;
      const delta = quillRef.current.getContents();
      console.log("HTML:", html);
      console.log("Delta:", delta);
    }
  };

  return (
    <>
      <Header />
      <Navbar />
      <Typography variant="h4" component="h1">
        Article Editor
      </Typography>

      <Box ref={editorRef} style={{ height: 400 }} />

      <Button onClick={getContent}>Get Content</Button>
    </>
  );
};

export default ArticleEditor;
