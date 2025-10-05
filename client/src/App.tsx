import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { Routes, Route } from "react-router-dom";
import ReactGA from "react-ga4";

import {
  Home,
  Contact,
  Articles,
  Article,
  Reviews,
  Brands,
  About,
  LatestNews,
} from "./pages/Reader";

import {
  ArticleEditor,
  ArticleList,
  BrandEditor,
  BrandList,
  Dashboard,
  MediaLibrary,
  Login,
} from "./pages/Admin";

import { ADMIN_ROUTES, ROUTES } from "./constants/routes";
import { GOOGLE_ANALYTICS_MEASUREMENT_ID } from "./constants/googleAnalyticsMeasurementID";
import { usePageTracking } from "./hooks";

ReactGA.initialize([{ trackingId: GOOGLE_ANALYTICS_MEASUREMENT_ID }]);

const App = () => {
  usePageTracking();
  return (
    <>
      <Routes>
        {
          //* Viewer Routes*//
        }
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LATEST_NEWS} element={<LatestNews />} />
        <Route
          path={ROUTES.ARTICLES}
          element={<Articles pageTitle="Articles" />}
        />
        <Route path={ROUTES.ARTICLE} element={<Article />} />
        <Route path={ROUTES.REVIEWS} element={<Reviews />} />
        <Route path={ROUTES.BRANDS} element={<Brands />} />
        <Route path={ROUTES.ABOUT} element={<About />} />
        <Route path={ROUTES.CONTACT} element={<Contact />} />

        {
          //* Admin Routes*//
        }
        <Route path={ADMIN_ROUTES.LOGIN} element={<Login />} />
        <Route path={ADMIN_ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ADMIN_ROUTES.BRAND_EDITOR} element={<BrandEditor />} />
        <Route
          path={ADMIN_ROUTES.BRAND_EDITOR_WITH_ID}
          element={<BrandEditor />}
        />
        <Route path={ADMIN_ROUTES.BRAND_LIST} element={<BrandList />} />
        <Route path={ADMIN_ROUTES.MEDIA_LIBRARY} element={<MediaLibrary />} />
        <Route path={ADMIN_ROUTES.ARTICLE_LIST} element={<ArticleList />} />
        <Route path={ADMIN_ROUTES.ARTICLE_EDITOR} element={<ArticleEditor />} />
        <Route
          path={ADMIN_ROUTES.ARTICLE_EDITOR_WITH_ID}
          element={<ArticleEditor />}
        />
      </Routes>
    </>
  );
};

export default App;
