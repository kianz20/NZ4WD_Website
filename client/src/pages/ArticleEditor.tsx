import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Header, ImageUpload, LoadingSpinner, Navbar } from "../components";
import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import dayjs from "dayjs";
import * as api from "../api/articleController";
import { useRequireAuth, useToast } from "../hooks";
import { useNavigate, useParams } from "react-router-dom";
import type { ArticleDetails } from "../models";

const articleTypeOptions = ["news", "article", "review"] as const;
export type ArticleType = (typeof articleTypeOptions)[number];

const ArticleEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const { authorName, userToken } = useRequireAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const editorNode = editorRef.current;
    if (editorNode && !quillRef.current) {
      quillRef.current = new Quill(editorNode, {
        theme: "snow",
        modules: {
          toolbar: {
            container: "#toolbar",
            handlers: {
              image: () => {
                const input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.click();

                input.onchange = () => {
                  const file = input.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      const quill = quillRef.current;
                      if (quill) {
                        const range = quill.getSelection();
                        const index = range ? range.index : quill.getLength();
                        quill.insertEmbed(index, "image", reader.result);
                        quill.setSelection(index + 1);
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                };
              },
            },
          },
        },
      });
    }

    return () => {
      if (editorNode) {
        editorNode.innerHTML = "";
      }
      quillRef.current = null;
    };
  }, []);

  const getContent = () => {
    if (quillRef.current) {
      const html = quillRef.current.root.innerHTML;
      return html;
    }
  };

  const getTextContent = () => {
    if (quillRef.current) {
      const textContent = quillRef.current.root.textContent;
      return textContent;
    }
  };

  const [formValues, setFormValues] = useState<ArticleDetails>({
    author: "",
    publishDate: dayjs().toDate(),
    title: "",
    readyToPublish: false,
    tags: [],
    hiddenTags: [],
    articleType: "article",
    content: "",
    archived: false,
  });

  const handleChange = <K extends keyof ArticleDetails>(
    field: K,
    value: ArticleDetails[K]
  ) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (authorName) {
      setFormValues((prev) => ({ ...prev, author: authorName }));
    }
  }, [authorName]);

  useEffect(() => {
    if (id && userToken) {
      setLoading(true);
      api
        .getArticle(id)
        .then((data) => {
          setFormValues({
            author: data.author,
            publishDate: data.publishDate,
            readyToPublish: data.readyToPublish,
            title: data.title,
            tags: data.tags,
            hiddenTags: data.tags,
            articleType: data.articleType,
            shortDescription: data.shortDescription,
            content: data.content,
            archived: data.archived,
            thumbnail: data.thumbnail,
          });
          if (quillRef.current && data.content) {
            quillRef.current.clipboard.dangerouslyPasteHTML(data.content);
          }
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
    if (userToken) {
      setLoading(true);

      const {
        author,
        publishDate,
        title,
        readyToPublish,
        tags,
        hiddenTags,
        articleType,
        shortDescription,
        archived,
      } = formValues;

      const textContent = getTextContent();
      const htmlContent = getContent();

      if (!textContent?.trim() || !htmlContent) {
        showToast("Article content cannot be empty", "error");
        setLoading(false);
        return;
      }

      const transformedData: {
        author: string;
        title: string;
        thumbnail: string | undefined;
        articleType: "news" | "article" | "review";
        readyToPublish: boolean;
        publishDate: Date;
        content: string;
        tags: string[];
        hiddenTags: string[];
        shortDescription?: string;
        archived: boolean;
      } = {
        author,
        title,
        thumbnail: formValues.thumbnail ?? undefined,
        articleType,
        readyToPublish,
        publishDate: publishDate ? publishDate : new Date(),
        content: htmlContent,
        tags,
        hiddenTags,
        archived,
      };

      if (shortDescription && shortDescription.trim() !== "") {
        transformedData.shortDescription = shortDescription;
      }

      try {
        if (id) {
          await api.updateArticle(id, transformedData, userToken);
          showToast("Article Updated", "success");
        } else {
          await api.createArticle(transformedData, userToken);
          showToast("Article Created", "success");
        }

        navigate("/articleList");
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
      <Header />
      <Navbar />
      <Typography variant="h4" component="h1">
        New Article
      </Typography>
      <br />
      <form onSubmit={handleSave}>
        <TextField
          label="Author"
          name="author"
          value={formValues.author}
          onChange={(e) => handleChange("author", e.target.value)}
          required
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Publish Date"
            value={dayjs(formValues.publishDate)}
            onChange={(newValue) =>
              handleChange(
                "publishDate",
                newValue ? newValue.toDate() : new Date()
              )
            }
          />
        </LocalizationProvider>
        <TextField
          label="Title"
          name="title"
          value={formValues.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
        <br />
        <br />
        <Autocomplete
          sx={{ width: 500 }}
          multiple
          freeSolo
          options={[]}
          value={formValues.tags}
          onChange={(_, newValue) => handleChange("tags", newValue)}
          renderInput={(params) => <TextField {...params} label="Tags" />}
        />
        <br />
        <Autocomplete
          sx={{ width: 500 }}
          multiple
          freeSolo
          options={[]}
          value={formValues.hiddenTags}
          onChange={(_, newValue) => handleChange("hiddenTags", newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Hidden Tags" />
          )}
        />
        <br />
        <Autocomplete
          sx={{ width: 500 }}
          options={articleTypeOptions}
          renderInput={(params) => (
            <TextField {...params} label="Article Type" />
          )}
          value={formValues.articleType}
          onChange={(_, newValue) => {
            if (
              newValue &&
              articleTypeOptions.includes(newValue as ArticleType)
            ) {
              handleChange("articleType", newValue as ArticleType);
            } else {
              handleChange("articleType", "article"); // fallback
            }
          }}
        />
        <br />
        <TextField
          sx={{ width: 500 }}
          label="Short Description"
          name="shortDescription"
          value={formValues.shortDescription || ""}
          multiline
          rows={2}
          onChange={(e) => handleChange("shortDescription", e.target.value)}
          required
        />
        <br />
        <FormControlLabel
          control={
            <Checkbox
              name="readyToPublish"
              checked={formValues.readyToPublish} // use checked instead of value
              onChange={(e) => handleChange("readyToPublish", e.target.checked)}
            />
          }
          label="Ready to Publish"
        />
        <ImageUpload
          setOutput={(value) => {
            if (value) handleChange("thumbnail", value);
          }}
          downloadFileName={`${formValues.title}-thumbnail`}
          headingText="Thumbnail"
          existingFile={formValues.thumbnail}
        />
        <br />

        <div id="toolbar">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          {/* <select className="ql-header">
          <option value="1">Heading 1</option>
          <option value="2">Heading 2</option>
          <option value="">Normal</option>
        </select> */}
          <button className="ql-image" />
          <button className="ql-code-block" />
        </div>

        <div ref={editorRef} style={{ height: 400 }} />

        <br />
        <Button variant="outlined" type="submit">
          Save
        </Button>
      </form>
    </>
  );
};

export default ArticleEditor;
