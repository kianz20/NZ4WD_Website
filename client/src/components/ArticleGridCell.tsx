import { Box, Typography } from "@mui/material";
import type { ArticleListObject } from "../models";
import styles from "../styles/ArticleGridCell.module.css";
import { useNavigate } from "react-router-dom";

interface ArticleGridcellProps {
  article: ArticleListObject;
}

const ArticleGridCell = (props: ArticleGridcellProps) => {
  const { article } = props;
  const navigate = useNavigate();
  return (
    <>
      <Box
        className={styles.gridCell}
        onClick={() => {
          console.log("Cell clicked!", article._id);
          navigate(`/article/${article._id}`);
          // You can navigate or do anything here
        }}
      >
        <Box
          component="img"
          src={article.thumbnail}
          className={styles.thumbnail}
        />
        <Typography component="h1" sx={{ fontWeight: "bold" }}>
          {article.title}
        </Typography>
        <Typography component="h1" sx={{ fontStyle: "italic" }}>
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
