import { Routes, Route } from "react-router-dom";

import {
  Home,
  ContactUs,
  Articles,
  Article,
  Reviews,
  Brands,
  AboutUs,
  LatestNews,
  ArticleEditor,
  ArticleList,
} from "./pages";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/latestNews" element={<LatestNews />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/article" element={<ArticleEditor />} />
        <Route path="/articleList" element={<ArticleList />} />
        <Route path="/articles/:id" element={<Article />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
      </Routes>
    </>
  );
};

export default App;
