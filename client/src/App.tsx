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
  Dashboard,
  MediaLibrary,
} from "./pages";
import { ROUTES } from "./constants/routes";

const App = () => {
  return (
    <>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LATEST_NEWS} element={<LatestNews />} />
        <Route
          path={ROUTES.ARTICLES}
          element={<Articles pageTitle="Articles" />}
        />
        <Route path={ROUTES.ARTICLE_EDITOR} element={<ArticleEditor />} />
        <Route
          path={ROUTES.ARTICLE_EDITOR_WITH_ID}
          element={<ArticleEditor />}
        />
        <Route path={ROUTES.ARTICLE_LIST} element={<ArticleList />} />
        <Route path={ROUTES.ARTICLE} element={<Article />} />
        <Route path={ROUTES.REVIEWS} element={<Reviews />} />
        <Route path={ROUTES.BRANDS} element={<Brands />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />
        <Route path={ROUTES.BRAND_EDITOR} element={<BrandEditor />} />
        <Route path={ROUTES.BRAND_EDITOR_WITH_ID} element={<BrandEditor />} />
        <Route path={ROUTES.BRAND_LIST} element={<BrandList />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.MEDIA_LIBRARY} element={<MediaLibrary />} />
      </Routes>
    </>
  );
};

export default App;
