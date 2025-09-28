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
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import * as api from "../api/articleController";
import { useRequireAuth, useToast } from "../hooks";
import { useNavigate, useParams } from "react-router-dom";
import type { ArticleDetails } from "../models";

const articleTypeOptions = ["news", "article", "review"] as const;
export type ArticleType = (typeof articleTypeOptions)[number];

const Quill = ReactQuill.Quill;

const icons = Quill.import("ui/icons") as Record<string, string>;
icons["hr"] = "―";

// 2. Get the base class for block-level embeds
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BlockEmbed = Quill.import("blots/block/embed") as any;

// 3. Define your custom HR blot
class HorizontalRule extends BlockEmbed {
  static blotName = "hr";
  static tagName = "hr";
}

// 4. Register the new blot with Quill
Quill.register(HorizontalRule);

const ArticleEditor = () => {
  const quillRef = useRef<ReactQuill | null>(null);
  const { authorName, userToken } = useRequireAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

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

  const handleQuillChange = (content: string) => {
    handleChange("content", content);
  };

  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          // This line adds the color and background/highlight options
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "hr"],
          ["clean"],
        ],
        handlers: {
          hr: () => {
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection();
              const index = range ? range.index : quill.getLength();
              // Insert <hr> as HTML
              quill.insertEmbed(index, "hr", true, "user");
              quill.setSelection(index + 1, 0);
            }
          },
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
                  // Get the editor instance from the ref
                  const quill = quillRef.current?.getEditor();
                  if (quill) {
                    const range = quill.getSelection();
                    const index = range ? range.index : quill.getLength();
                    // Insert the image as a base64 string
                    quill.insertEmbed(index, "image", reader.result);
                    quill.setSelection(index + 1, 0);
                  }
                };
                reader.readAsDataURL(file);
              }
            };
          },
        },
      },
    }),
    []
  );

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
            content: data.content, // CHANGE 6: Simply set the content in state
            archived: data.archived,
            thumbnail: data.thumbnail,
          });
          // The line for `dangerouslyPasteHTML` is no longer needed.
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
        content, // The content is now directly from the state
      } = formValues;

      // CHANGE 7: Get plain text content from the ref for validation
      const textContent = quillRef.current?.getEditor().getText();

      if (!textContent?.trim() || !content) {
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
        content, // Use content from state
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
        {id ? "Edit Article" : "New Article"}
      </Typography>
      <br />
      <form onSubmit={handleSave}>
        {/* All form fields remain the same */}
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
        />
        <br />
        <FormControlLabel
          control={
            <Checkbox
              name="readyToPublish"
              checked={formValues.readyToPublish}
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

        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={formValues.content}
          onChange={handleQuillChange}
          modules={quillModules}
          style={{ height: 400, marginBottom: "50px" }}
        />

        <Button variant="outlined" type="submit">
          Save
        </Button>
      </form>
    </>
  );
};

export default ArticleEditor;
