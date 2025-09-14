import { Typography } from "@mui/material";
import { Header, HeadlineBanner, LoadingSpinner, Navbar } from "../components";
import { useEffect, useState } from "react";
import { useAuth, useToast } from "../hooks";
import * as api from "../api/articleController";
import { type ArticleList } from "../models";
import { ArticleGrid } from "../components";

interface ArticleProps {
  articleFilter?: "news" | "article" | "review";
}

const Articles = (props: ArticleProps) => {
  const { userToken } = useAuth();
  const { showToast } = useToast();
  const { articleFilter } = props;

  const [articles, setArticles] = useState<ArticleList>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getArticles = async () => {
      if (userToken) {
        setLoading(true);
        try {
          const response = await api.getArticles(
            userToken,
            true,
            articleFilter
          );
          setArticles(response);
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
        Articles
      </Typography>

      <ArticleGrid articleList={articles} />
    </>
  );
};

export default Articles;
