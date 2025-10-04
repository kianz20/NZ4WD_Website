import { Header, HeadlineBanner, LoadingSpinner, Navbar } from "../components";
import { useEffect, useState } from "react";
import { useToast } from "../hooks";
import * as api from "../api/articleController";
import { ArticleStateOptions, type ArticleList } from "../models";
import { ArticleGrid } from "../components";
import PageTitle from "../components/PageTitle";
import type { ArticleType } from "./ArticleEditor";

interface ArticleProps {
  pageTitle: string;
  articleFilter?: ArticleType;
}

const Articles = (props: ArticleProps) => {
  const { showToast } = useToast();
  const { articleFilter } = props;

  const [articles, setArticles] = useState<ArticleList>();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const response = await api.getArticles(
          ArticleStateOptions.Published,
          articleFilter
        );
        setArticles(response);
      } catch {
        showToast("failed to get articles", "error");
      } finally {
        setLoading(false);
      }
    };
    getArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <LoadingSpinner open={loading} />
      <Header />
      <Navbar />
      <HeadlineBanner />
      <PageTitle text={props.pageTitle} />
      <ArticleGrid articleList={articles} />
    </>
  );
};

export default Articles;
