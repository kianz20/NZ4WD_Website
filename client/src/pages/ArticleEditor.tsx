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
import { Header, LoadingSpinner, Navbar } from "../components";
import Quill from "quill";
import { useEffect, useRef, useState } from "react";
import "quill/dist/quill.snow.css";
import dayjs from "dayjs";
import * as api from "../api/articleController";
import { useRequireAuth, useToast } from "../hooks";
import { useNavigate, useParams } from "react-router-dom";

type FormValues = {
  author: string;
  publishDate: dayjs.Dayjs | null;
  title: string;
  readyToPublish: boolean;
  tags: string[];
};

const ArticleEditor = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const { authorName, userToken } = useRequireAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
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
      if (editorRef.current) {
        editorRef.current.innerHTML = "";
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

  const [formValues, setFormValues] = useState<FormValues>({
    author: "",
    publishDate: dayjs(),
    title: "",
    readyToPublish: false,
    tags: [],
  });

  const handleChange = <K extends keyof FormValues>(
    field: K,
    value: FormValues[K]
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
        .getArticleEdit(userToken, id)
        .then((data) => {
          setFormValues({
            author: data.author,
            publishDate: dayjs(data.publishDate),
            readyToPublish: data.readyToPublish,
            title: data.title,
            tags: data.tags,
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
  }, [id, userToken, showToast]);

  const handleSave = async (event: React.FormEvent) => {
    if (userToken) {
      setLoading(true);

      event.preventDefault();
      const { author, publishDate, title, readyToPublish, tags } = formValues;
      const transformedData = {
        author: author,
        title: title,
        readyToPublish: readyToPublish,
        publishDate: publishDate ? publishDate.toDate() : new Date(),
        content: getContent() || "",
        tags: tags,
      };
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
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateTimePicker
            label="Publish Date"
            value={formValues.publishDate}
            onChange={(newValue) => handleChange("publishDate", newValue)}
          />
        </LocalizationProvider>
        <TextField
          label="Title"
          name="title"
          value={formValues.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
        <br />
        <br />
        <Autocomplete
          multiple
          freeSolo
          options={[]}
          value={formValues.tags}
          onChange={(_, newValue) => handleChange("tags", newValue)}
          renderInput={(params) => <TextField {...params} label="Tags" />}
        />

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
