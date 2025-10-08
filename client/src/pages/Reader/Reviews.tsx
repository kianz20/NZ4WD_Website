import { useState } from "react";
import {
  Header,
  HeadlineBanner,
  LoadingSpinner,
  Navbar,
} from "../../components";
import PageTitle from "../../components/PageTitle";
import ArticleBase from "./ArticleBase";

const Reviews = () => {
  const [loading, setLoading] = useState(false);

  return (
    <>
      <LoadingSpinner open={loading} />
      <Header />
      <Navbar />
      <HeadlineBanner />
      <PageTitle text={"Reviews"} />
      <ArticleBase setLoading={setLoading} articleType="review" />
    </>
  );
};

export default Reviews;
