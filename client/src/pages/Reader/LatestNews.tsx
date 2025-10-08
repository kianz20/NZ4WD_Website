import { useState } from "react";
import {
  Header,
  HeadlineBanner,
  LoadingSpinner,
  Navbar,
} from "../../components";
import PageTitle from "../../components/PageTitle";
import ArticleBase from "./ArticleBase";

const LatestNews = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingSpinner open={loading} />
      <Header />
      <Navbar />
      <HeadlineBanner />
      <PageTitle text={"Latest News"} />
      <ArticleBase setLoading={setLoading} articleFilter="news" />
    </>
  );
};

export default LatestNews;
