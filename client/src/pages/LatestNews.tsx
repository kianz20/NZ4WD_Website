import { Typography } from "@mui/material";
import {
  ArticleGrid,
  Header,
  HeadlineBanner,
  LoadingSpinner,
  Navbar,
} from "../components";
import { useEffect, useState } from "react";
import { useRequireAuth, useToast } from "../hooks";
import * as api from "../api/articleController";
import type { ArticleList } from "../models";

const LatestNews = () => {
  const { userToken } = useRequireAuth();
  const { showToast } = useToast();

  const [news, setNews] = useState<ArticleList>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getArticles = async () => {
      if (userToken) {
        setLoading(true);
        try {
          const response = await api.getArticles(userToken, true, "news");
          setNews(response);
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
      <LoadingSpinner open={loading} />
      <Header />
      <Navbar />
      <HeadlineBanner />
      <Typography variant="h4" component="h1">
        LatestNews
      </Typography>
      <ArticleGrid articleList={news} />
    </>
  );
};

export default LatestNews;
