import * as api from "../../api/brandController";
import { useEffect, useState } from "react";
import { useAuth, useToast } from "../../hooks";
import { Link } from "@mui/material";
import {
  LoadingSpinner,
  Header,
  Navbar,
  HeadlineBanner,
} from "../../components";
import PageTitle from "../../components/PageTitle";
import ArticleBase from "./ArticleBase";

interface BrandGridRows {
  id: string;
  name: string;
  logo: string;
}

const Brands = () => {
  const { userToken } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<BrandGridRows[]>([]);

  useEffect(() => {
    const getBrands = async () => {
      if (userToken) {
        setLoading(true);
        try {
          const response = await api.getBrands(userToken);
          setRows(
            response.map((brand) => ({
              id: brand._id,
              name: brand.name,
              logo: brand.logo,
            }))
          );
        } catch {
          showToast("failed to get brands", "error");
        } finally {
          setLoading(false);
        }
      }
    };
    getBrands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userToken]);

  return (
    <>
      <LoadingSpinner open={loading} />
      <Header />
      <Navbar />
      <HeadlineBanner />
      <PageTitle text={"Brands"} />
      {rows.map((brand) => (
        <Link href="#">{brand.name}</Link>
      ))}
      <ArticleBase setLoading={setLoading} />
    </>
  );
};

export default Brands;
