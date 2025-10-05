import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES } from "../../../constants/routes";

const QuickActionsCard = () => {
  const navigate = useNavigate();
  return (
    <>
      <Button
        onClick={() => navigate(`${ADMIN_ROUTES.ARTICLE_EDITOR}`)}
        onMouseDown={(e) => e.stopPropagation()}
        variant="contained"
      >
        New Article
      </Button>
    </>
  );
};

export default QuickActionsCard;
