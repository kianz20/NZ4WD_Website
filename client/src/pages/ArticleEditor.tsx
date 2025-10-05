import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  CategoriesMultiselect,
  Header,
  ImageUpload,
  LoadingSpinner,
  Navbar,
} from "../components";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import * as api from "../api/articleController";
import { useRequireAuth, useToast } from "../hooks";
import { useNavigate, useParams } from "react-router-dom";
import type { ArticleDetails, Category } from "../models";
import { ImageResize } from "quill-image-resize-module-ts";
import { ROUTES } from "../constants/routes";
import styles from "../styles/ArticleEditor.module.css";

const articleTypeOptions = ["news", "article", "review", "brands"] as const;
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
Quill.register("modules/imageResize", ImageResize);

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
    categories: [],
    tags: [],
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
      imageResize: {
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize"], // Allows resizing and shows dimensions
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
            categories: data.categories,
            tags: data.tags,
            articleType: data.articleType,
            shortDescription: data.shortDescription,
            content: data.content,
            archived: data.archived,
            thumbnail: data.thumbnail,
          });
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
      const {
        author,
        publishDate,
        title,
        readyToPublish,
        categories,
        tags,
        articleType,
        shortDescription,
        archived,
        content, // The content is now directly from the state
        thumbnail,
      } = formValues;

      // CHANGE 7: Get plain text content from the ref for validation
      const textContent = quillRef.current?.getEditor().getText();

      if (!textContent?.trim() || !content) {
        showToast("Article content cannot be empty", "error");
        return;
      }

      if (!thumbnail) {
        showToast("You must upload a thumbnail", "error");
        return;
      }

      const transformedData: {
        author: string;
        title: string;
        thumbnail: string | undefined;
        articleType: ArticleType;
        readyToPublish: boolean;
        publishDate: Date;
        content: string;
        categories: Category[];
        tags: string[];
        shortDescription?: string;
        archived: boolean;
      } = {
        author,
        title,
        thumbnail,
        articleType,
        readyToPublish,
        publishDate,
        content, // Use content from state
        categories,
        tags,
        archived,
      };

      if (shortDescription && shortDescription.trim() !== "") {
        transformedData.shortDescription = shortDescription;
      }

      setLoading(true);

      try {
        if (id) {
          await api.updateArticle(id, transformedData, userToken);
          showToast("Article Updated", "success");
        } else {
          await api.createArticle(transformedData, userToken);
          showToast("Article Created", "success");
        }
        navigate(ROUTES.ARTICLE_LIST);
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
      <form onSubmit={handleSave}>
        <Box display="flex" alignItems="center" width="100%" mt={2}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
            flexGrow={1} // take up remaining space to allow centering
          >
            <TextField
              label="Author"
              name="author"
              value={formValues.author}
              onChange={(e) => handleChange("author", e.target.value)}
              required
            />

            <TextField
              label="Title"
              name="title"
              value={formValues.title}
              onChange={(e) => handleChange("title", e.target.value)}
              required
              sx={{ width: 925 }}
            />

            <Autocomplete
              sx={{ width: 150 }}
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
                  handleChange("articleType", "article");
                }
              }}
            />
          </Box>

          <Button variant="outlined" type="submit" sx={{ marginRight: "10px" }}>
            Save
          </Button>
        </Box>

        <Box display="flex">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={formValues.content}
            onChange={handleQuillChange}
            modules={quillModules}
            className={styles.quillEditor}
          />
          <Box>
            <Card className={styles.descriptionCard}>
              <CardContent>
                <Typography>Short Description</Typography>
                <TextField
                  sx={{ width: 445 }}
                  name="shortDescription"
                  value={formValues.shortDescription || ""}
                  multiline
                  rows={2}
                  onChange={(e) =>
                    handleChange("shortDescription", e.target.value)
                  }
                />
              </CardContent>
            </Card>
            <Card className={styles.thumbnailCard}>
              <CardContent>
                <Typography>Thumbnail / Featured Image</Typography>
                <ImageUpload
                  setOutput={(value) => {
                    if (value) handleChange("thumbnail", value);
                    else if (value === null)
                      handleChange("thumbnail", undefined);
                  }}
                  downloadFileName={`${formValues.title}-thumbnail`}
                  existingFile={formValues.thumbnail}
                  buttonLabel="Upload Thumbnail"
                />
              </CardContent>
            </Card>
            <Card className={styles.categoriesCard}>
              <CardContent>
                <Typography>Categories and Tags</Typography>
                <Box mt={2}>
                  <CategoriesMultiselect
                    setLoading={setLoading}
                    value={formValues.categories}
                    onChange={(newCategories) => {
                      handleChange("categories", newCategories);
                    }}
                  />
                </Box>
                <Box mt={2}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={[]}
                    value={formValues.tags}
                    onChange={(_, newValue) => handleChange("tags", newValue)}
                    renderInput={(params) => (
                      <TextField {...params} label="Tags" />
                    )}
                  />
                </Box>
              </CardContent>
            </Card>
            <Card className={styles.publishCard}>
              <CardContent>
                <Typography>Publish Details</Typography>
                <Box mt={2}>
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
                </Box>
                <Box mt={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="readyToPublish"
                        checked={formValues.readyToPublish}
                        onChange={(e) =>
                          handleChange("readyToPublish", e.target.checked)
                        }
                      />
                    }
                    label="Ready to Publish"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </form>
    </>
  );
};

export default ArticleEditor;
