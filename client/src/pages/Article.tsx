import { Box, Button, Typography } from "@mui/material";
import { Header, HeadlineBanner, LoadingSpinner, Navbar } from "../components";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useRequireAuth } from "../hooks";
import * as api from "../api/articleController";
import { type ArticleDetails } from "../models";
import DOMPurify from "dompurify";

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const { userToken } = useRequireAuth();
  const [loading, setLoading] = useState(false);

  const [article, setArticle] = useState<ArticleDetails>();

  useEffect(() => {
    if (id && userToken) {
      setLoading(true);
      api
        .getArticle(userToken, id)
        .then((data) => {
          setArticle(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, userToken]);
  return (
    <>
      <LoadingSpinner open={loading} />
      <Header />
      <Navbar />
      <HeadlineBanner />
      <Typography variant="h4" component="h1">
        Article
      </Typography>
      {article ? (
        <>
          <Typography variant="h4" component="h1">
            {article.title}
          </Typography>
          <Typography component="h1" sx={{ fontStyle: "italic" }}>
            {article.shortDescription}
          </Typography>
          <Typography sx={{ fontStyle: "italic", fontSize: "13px" }}>
            {`Published by ${article.author} on ${article.publishDate}`}
          </Typography>
          <Box component="img" src={article.thumbnail} />
          <Typography
            sx={{ fontSize: "13px" }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(article.content),
            }}
          />
        </>
      ) : (
        <>
          <Typography variant="h4" component="h1">
            Article Not Found
          </Typography>
          <Button component={Link} to="/">
            Return Home
          </Button>
        </>
      )}
    </>
  );
};

export default Article;
