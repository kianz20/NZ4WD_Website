import { Typography } from "@mui/material";
import styles from "../styles/PageTitle.module.css";

interface PageTitleProps {
  text: string;
}

const PageTitle = ({ text }: PageTitleProps) => {
  return <Typography className={styles.pageTitle}>{text}</Typography>;
};

export default PageTitle;
