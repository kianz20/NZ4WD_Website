// SearchBar.tsx
import { Autocomplete, createFilterOptions, TextField } from "@mui/material";
// ADDED: Import useRef
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as api from "../api/articleController";
import { useRequireAuth } from "../hooks";
import styles from "../styles/SearchBar.module.css";
import SearchResult from "./SearchResult";
import { ROUTES } from "../constants/routes";

export interface Article {
  _id: string;
  title: string;
  thumbnail?: string;
  shortDescription?: string;
  tags: string[];
}

const SearchBar = () => {
  const { userToken } = useRequireAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [articleList, setArticleList] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<Article | null>(null);
  // ADDED: A ref to access the input DOM element.
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userToken) {
      setLoading(true);
      api
        .getArticles(true)
        .then((data) => setArticleList(data))
        .finally(() => setLoading(false));
    }
  }, [userToken]);

  // MODIFIED: This effect now also removes focus from the text field.
  useEffect(() => {
    setInputValue("");
    setOpen(false);
    setValue(null);
    // ADDED: If the ref is attached, call blur() to remove focus.
    searchInputRef.current?.blur();
  }, [location]);

  const filter = createFilterOptions<Article>({
    stringify: (option) =>
      `${option.title} ${option.shortDescription || ""} ${option.tags.join(
        " "
      )}`,
  });

  return (
    <Autocomplete
      className={styles.searchBar}
      options={articleList}
      getOptionLabel={(option) => option.title}
      loading={loading}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      filterOptions={filter}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => {
        setInputValue(newInputValue);
        if (newInputValue.length > 0) {
          setOpen(true);
        } else {
          setOpen(false);
        }
      }}
      value={value}
      onChange={(_, newValue: Article | null) => {
        setValue(newValue);
        if (newValue) {
          navigate(ROUTES.ARTICLE.replace(":id", newValue._id));
        }
      }}
      renderOption={(props, option) => (
        <SearchResult key={option._id} option={option} props={props} />
      )}
      // MODIFIED: Attach the ref to the TextField's underlying input element.
      renderInput={(params) => (
        <TextField {...params} label="Search" inputRef={searchInputRef} />
      )}
    />
  );
};

export default SearchBar;
