
export type ProductCategory = 
  | 'dattes-fraiches'
  | 'dattes-transformees'
  | 'produits-derives'
  | 'tous';

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: ProductCategory;
  certifications: string[];
  price?: string;
  weight?: string;
  isOrganic: boolean;
  isFairTrade: boolean;
}
