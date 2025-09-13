import { Grid, Slider, Box } from "@mui/material";
import type { ArticleList } from "../models";
import ArticleGridCell from "./ArticleGridCell";
import styles from "../styles/ArticleGrid.module.css";
import { useState } from "react";

interface ArticleGridProps {
  articleList?: ArticleList;
}

const zoomMin = 75;
const zoomMax = 103;

const ArticleGrid = (props: ArticleGridProps) => {
  const [zoom, setZoom] = useState(30);

  const handleZoomChange = (event: Event, value: number | number[]) => {
    if (typeof value === "number") setZoom(value);
  };

  return (
    <Box className={styles.gridWrapper}>
      <Grid container spacing={2} className={styles.grid}>
        {props.articleList?.map((article) => (
          <Grid key={article._id}>
            <ArticleGridCell article={article} zoom={zoom} />
          </Grid>
        ))}
      </Grid>

      <Box className={styles.sliderContainer}>
        <Slider
          min={zoomMin}
          max={zoomMax}
          orientation="vertical"
          value={zoom}
          onChange={handleZoomChange}
          sx={{ height: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default ArticleGrid;
