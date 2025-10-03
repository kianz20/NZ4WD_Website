import { Box, Typography } from "@mui/material";
import type { ArticleListObject } from "../models";
import styles from "../styles/ArticleGridCell.module.css";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

interface ArticleGridCellProps {
  article: ArticleListObject;
  zoom: number;
}

const ArticleGridCell = ({ article, zoom }: ArticleGridCellProps) => {
  const navigate = useNavigate();
  return (
    <>
      <Box
        className={styles.gridCell}
        sx={{ width: zoom * 5, height: zoom * 3 }}
        onClick={() => {
          navigate(ROUTES.ARTICLE.replace(":id", article._id));
        }}
      >
        <Box
          component="img"
          src={article.thumbnail}
          className={styles.thumbnail}
        />
        <Typography sx={{ fontSize: (zoom / 3) * 0.5 }}>
          {article.articleType}
        </Typography>
        <Typography
          component="h1"
          sx={{ fontWeight: "bold", fontSize: zoom / 3 }}
        >
          {article.title}
        </Typography>
        <Typography
          component="h1"
          sx={{ fontStyle: "italic", fontSize: (zoom / 3) * 0.6 }}
        >
          {article.shortDescription}
        </Typography>
        <Typography component="h1">
          Published: {new Date(article.publishDate).toLocaleString()}
        </Typography>
      </Box>
    </>
  );
};

export default ArticleGridCell;
