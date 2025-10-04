import { Box, Paper } from "@mui/material";
import styles from "../styles/InfoCard.module.css";
import PageTitle from "./PageTitle";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
}

const InfoCard = ({ title, children }: InfoCardProps) => {
  return (
    <Paper className={styles.card} sx={{ height: "100%", width: "100%" }}>
      <PageTitle text={title} fontsize={30} />
      <Box>{children}</Box>
    </Paper>
  );
};

export default InfoCard;
