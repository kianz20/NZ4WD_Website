import { Typography } from "@mui/material";

interface PageTitleProps {
  text: string;
}

const PageTitle = ({ text }: PageTitleProps) => {
  return <Typography>{text}</Typography>;
};

export default PageTitle;