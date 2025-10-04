import { useEffect, useState } from "react";
import { ArticleStateOptions } from "../../models";
import { useRequireAuth, useToast } from "../../hooks";
import * as api from "../../api/articleController";

const ScheduledArticlesCard = () => {
  const userToken = useRequireAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getArticles = async () => {
      if (userToken) {
        setLoading(true);
        try {
          const response = await api.getArticles(ArticleStateOptions.Scheduled);
          const now = new Date();
        } catch {
          showToast("failed to get articles", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    getArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <>Test</>;
};

export default ScheduledArticlesCard;
