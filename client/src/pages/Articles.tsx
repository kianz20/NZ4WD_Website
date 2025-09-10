import { Typography } from "@mui/material";
import { Header, Navbar } from "../components";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRequireAuth, useToast } from "../hooks";
import * as api from "../api/articleController";

const Articles = () => {
  const { userToken } = useRequireAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getArticles = async () => {
      if (userToken) {
        setLoading(true);
        try {
          const response = await api.getArticles(userToken);
          console.log(response);
        } catch {
          showToast("failed to get articles", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    getArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);
  return (
    <>
      <Header />
      <Navbar />
      <Typography variant="h4" component="h1">
        Articles
      </Typography>
    </>
  );
};

export default Articles;
