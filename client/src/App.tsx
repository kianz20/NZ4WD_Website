import { Routes, Route } from "react-router-dom";

import {
  Home,
  Contact,
  Articles,
  Article,
  Reviews,
  Brands,
  About,
  LatestNews,
  ArticleEditor,
  ArticleList,
  BrandEditor,
  BrandList,
} from "./pages";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/latestNews" element={<LatestNews />} />
        <Route path="/articles" element={<Articles pageTitle="Articles" />} />
        <Route path="/articleEditor" element={<ArticleEditor />} />
        <Route path="/articleEditor/:id" element={<ArticleEditor />} />
        <Route path="/articleList" element={<ArticleList />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/brands" element={<Brands />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/brandEditor" element={<BrandEditor />} />
        <Route path="/brandEditor/:id" element={<BrandEditor />} />
        <Route path="/brandList" element={<BrandList />} />
      </Routes>
    </>
  );
};

export default App;
