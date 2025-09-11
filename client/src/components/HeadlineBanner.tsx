import { Box, Typography } from "@mui/material";
import styles from "../styles/HeadlineBanner.module.css";

const HeadlineBanner = () => {
  return (
    <Box className={styles.banner}>
      <Box className={styles.scroll}>
        <div>
          <Typography>
            important headline important headline important headline important
            headline important headline important headline important headline
            important headline important headline
          </Typography>
        </div>
        <div>
          <Typography>
            important headline important headline important headline important
            headline important headline important headline important headline
            important headline important headline
          </Typography>
        </div>
      </Box>
    </Box>
  );
};

export default HeadlineBanner;
