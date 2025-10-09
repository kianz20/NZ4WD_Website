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

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Failed to create category: ${data.error || response.statusText}`
    );
  }

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

export const updateCategory = async (
  token: string,
  id: string,
  categoryData: { category: string; parentCategory?: string }
): Promise<GenericOut> => {
  const response = await fetch(`${BACKEND_URL}/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Failed to update category: ${data.error || response.statusText}`
    );
  }

  return data;
};

export const deleteCategory = async (
  token: string,
  id: string
): Promise<GenericOut> => {
  const response = await fetch(`${BACKEND_URL}/api/categories/delete/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete category: ${response.statusText}`);
  }

  const data: GenericOut = await response.json();
  return data;
};
