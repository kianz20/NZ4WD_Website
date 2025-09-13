import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import * as api from "../api/articleController";
import {
  ArticleGrid,
  Header,
  HeadlineBanner,
  LoadingSpinner,
  Navbar,
} from "../components";
import { useRequireAuth, useToast } from "../hooks";
import type { ArticleList } from "../models";

const Reviews = () => {
  const { userToken } = useRequireAuth();
  const { showToast } = useToast();

  const [reviews, setReviews] = useState<ArticleList>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getArticles = async () => {
      if (userToken) {
        setLoading(true);
        try {
          const response = await api.getArticles(userToken, true, "review");
          setReviews(response);
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
        Reviews
      </Typography>
      <ArticleGrid articleList={reviews} />
    </>
  );
};

export default Reviews;
