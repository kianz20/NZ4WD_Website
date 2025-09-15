import { BACKEND_URL } from "../constants/backendURL";
import type { BrandDetails, BrandList, GenericOut } from "../models";
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

export const updateBrand = async (
  id: string,
  brand: BrandDetails,
  token: string
): Promise<GenericOut> => {
  const { name, logo } = brand;
  const updatedLogo = await uploadImageSrcToS3(logo, `${name}-logo`, "brand");
  const response = await fetch(`${BACKEND_URL}/api/brands/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: brand.name,
      logo: updatedLogo,
    }),
  });
  if (!response.ok)
    throw new Error(`Failed to update brand: ${response.statusText}`);
  return response.json();
};

export const getBrands = async (token: string): Promise<BrandList> => {
  const url = new URL(`${BACKEND_URL}/api/brands/`);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch brands: ${response.statusText}`);
  }

  return (await response.json()) as BrandList;
};

export const getBrand = async (id: string): Promise<BrandDetails> => {
  const response = await fetch(`${BACKEND_URL}/api/brands/brand/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch brand: ${response.statusText}`);
  }

  const data: BrandDetails = await response.json();
  return data;
};

export const deleteBrand = async (
  token: string,
  id: string
): Promise<GenericOut> => {
  const response = await fetch(`${BACKEND_URL}/api/brands/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete article: ${response.statusText}`);
  }

  const data: GenericOut = await response.json();
  return data;
};
