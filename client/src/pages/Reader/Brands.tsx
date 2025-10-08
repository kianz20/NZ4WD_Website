import * as api from "../../api/brandController";
import { useEffect, useState } from "react";
import { useAuth, useToast } from "../../hooks";
import { Box } from "@mui/material";
import {
  LoadingSpinner,
  Header,
  Navbar,
  HeadlineBanner,
} from "../../components";
import PageTitle from "../../components/PageTitle";
import ArticleBase from "./ArticleBase";
import { Chip, Stack } from "@mui/material";

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
  const hashCategory = window.location.hash.slice(1);
  const [chosenCategory, setChosenCategory] = useState(hashCategory || "");

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
  }, [userToken]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setChosenCategory(hash);
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <>
      <LoadingSpinner open={loading} />
      <Header />
      <Navbar />
      <HeadlineBanner />
      <PageTitle text={"Brands"} />
      <Box display="flex" flexDirection="column" alignItems="center">
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", mb: 2 }}>
          {rows.map((brand) => (
            <Chip
              key={brand.id}
              label={brand.name}
              clickable
              color={brand.name === chosenCategory ? "primary" : "default"}
              onClick={() => {
                setChosenCategory(brand.name);
                window.location.hash = brand.name;
              }}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
      </Box>
      <ArticleBase setLoading={setLoading} categoriesFilter={chosenCategory} />
    </>
  );
};

export default Brands;
