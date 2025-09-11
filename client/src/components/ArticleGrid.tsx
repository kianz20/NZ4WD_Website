import { Grid } from "@mui/material";
import type { ArticleList } from "../models";
import ArticleGridCell from "./ArticleGridCell";
import styles from "../styles/ArticleGrid.module.css";

interface ArticleGridProps {
  articleList?: ArticleList;
}

const ArticleGrid = (props: ArticleGridProps) => {
  return (
    <>
      <Grid container spacing={2} className={styles.grid}>
        {props.articleList?.map((article) => (
          <Grid key={article._id}>
            <ArticleGridCell article={article} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ArticleGrid;
