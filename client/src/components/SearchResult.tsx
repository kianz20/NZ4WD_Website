// SearchResult.tsx
import { Box, Typography } from "@mui/material";
import styles from "../styles/SearchResult.module.css";
import type { Article } from "./SearchBar";

interface SearchResultProps {
  option: Article;
  props: React.HTMLAttributes<HTMLLIElement>;
}

// This is now a simple "presentational" component
const SearchResult = ({ option, props }: SearchResultProps) => {
  return (
    <Box
      component="li"
      sx={{ display: "flex", alignItems: "center", gap: 1.5 }}
      {...props} // Spread props to handle clicks, focus, etc.
    >
      <Box
        component="img"
        src={option.thumbnail || "/placeholder.png"}
        alt={option.title}
        loading="lazy"
        className={styles.thumbnail}
      />
      <Box>
        <Typography variant="body1">{option.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {option.shortDescription}
        </Typography>
      </Box>
    </Box>
  );
};

export default SearchResult;
