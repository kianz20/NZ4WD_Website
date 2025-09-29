import { BACKEND_URL } from "../constants/backendURL";
import type { Category, CategoryList, GenericOut } from "../models";

export const createCategory = async (
  categoryInput: Category,
  token: string
): Promise<GenericOut> => {
  const { category, parentCategory } = categoryInput;
  const response = await fetch(`${BACKEND_URL}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      category: category,
      parentCategory: parentCategory,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create category: ${response.statusText}`);
  }

  const data: GenericOut = await response.json();
  return data;
};

export const getCategories = async (token: string): Promise<CategoryList> => {
  const url = new URL(`${BACKEND_URL}/api/categories/`);

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`);
  }

  return (await response.json()) as CategoryList;
};
