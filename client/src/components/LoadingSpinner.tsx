import { Backdrop, CircularProgress } from "@mui/material";

interface LoadingSpinnerProps {
  open: boolean;
}

const LoadingSpinner = ({ open }: LoadingSpinnerProps) => {
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default LoadingSpinner;
