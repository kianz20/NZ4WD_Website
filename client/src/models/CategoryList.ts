import type { Category } from "./Category";

export interface CategoryListObject extends Category {
  _id: string;
}

export type CategoryList = CategoryListObject[];
