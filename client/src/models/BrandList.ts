import type { BrandDetails } from "./BrandDetails";

export interface BrandListObject extends BrandDetails {
  _id: string;
}

export type BrandList = BrandListObject[];
