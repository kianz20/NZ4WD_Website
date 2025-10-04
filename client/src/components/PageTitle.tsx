import { Typography } from "@mui/material";
import styles from "../styles/PageTitle.module.css";

interface PageTitleProps {
  text: string;
  fontsize?: number;
}

const PageTitle = ({ text, fontsize }: PageTitleProps) => {
  return (
    <Typography
      className={styles.pageTitle}
      sx={{ fontSize: fontsize ? `${fontsize}px !important ` : "inherit" }}
    >
      {text}
    </Typography>
  );
};

export default PageTitle;
