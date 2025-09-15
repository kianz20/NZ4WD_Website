import { BACKEND_URL } from "../constants/backendURL";
import type { BrandDetails, GenericOut } from "../models";
import { uploadImageSrcToS3 } from "../utils/apiUtil";

export const createBrand = async (
  brand: BrandDetails,
  token: string
): Promise<GenericOut> => {
  const { name, logo } = brand;
  const updatedLogo = await uploadImageSrcToS3(logo, `${name}-logo`, "brand");
  const response = await fetch(`${BACKEND_URL}/api/brands`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: brand.name,
      logo: updatedLogo,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create brand: ${response.statusText}`);
  }

  const data: GenericOut = await response.json();
  return data;
};
