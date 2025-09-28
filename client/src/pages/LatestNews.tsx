import PageTitle from "../components/PageTitle";
import Articles from "./Articles";

const LatestNews = () => {
  return (
    <>
      <Articles articleFilter="news" pageTitle={"Latest News"} />
    </>
  );
};

export default LatestNews;
