import { Box, Button, Typography } from "@mui/material";
import { Header, HeadlineBanner, LoadingSpinner, Navbar } from "../components";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as api from "../api/articleController";
import { type ArticleDetails } from "../models";
import DOMPurify from "dompurify";
import styles from "../styles/Article.module.css";

const Article = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const [article, setArticle] = useState<ArticleDetails>();

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .getArticle(id)
        .then((data) => {
          setArticle(data);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);
  return (
    <>
      <LoadingSpinner open={loading} />
      <Header />
      <Navbar />
      <HeadlineBanner />
      {article ? (
        <>
          <Typography className={styles.title}>
            {article.title}
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
