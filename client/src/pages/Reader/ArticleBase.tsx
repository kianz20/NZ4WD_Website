import { useEffect, useState } from "react";
import * as api from "../../api/articleController";
import { ArticleGrid } from "../../components";
import { useToast } from "../../hooks";
import { ArticleStateOptions, type ArticleList } from "../../models";
import type { ArticleType } from "../Admin/ArticleEditor";

interface ArticleBaseProps {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  articleType?: ArticleType;
  categoriesFilter?: string;
}

const ArticleBase = (props: ArticleBaseProps) => {
  const { showToast } = useToast();
  const { articleType, setLoading, categoriesFilter } = props;

  const [articles, setArticles] = useState<ArticleList>();

  useEffect(() => {
    const getArticles = async () => {
      setLoading(true);
      try {
        const response = await api.getArticles({
          articleState: ArticleStateOptions.Published,
          articleType,
          categoriesFilter,
        });
        setArticles(response);
      } catch {
        showToast("failed to get articles", "error");
      } finally {
        setLoading(false);
      }
    };
    getArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoriesFilter]);

  return <ArticleGrid articleList={articles} />;
};

export default ArticleBase;
