import { useEffect, useState } from "react";
import * as api from "../../api/articleController";
import { ArticleGrid } from "../../components";
import { useToast } from "../../hooks";
import { ArticleStateOptions, type ArticleList } from "../../models";
import type { ArticleType } from "../Admin/ArticleEditor";

interface ArticleBaseProps {
  articleFilter?: ArticleType;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ArticleBase = (props: ArticleBaseProps) => {
  const { showToast } = useToast();
  const { articleFilter, setLoading } = props;

  const [articles, setArticles] = useState<ArticleList>();

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

  return <ArticleGrid articleList={articles} />;
};

export default ArticleBase;
