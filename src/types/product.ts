
export type ProductCategory = 
  | 'dattes-fraiches'
  | 'dattes-transformees'
  | 'produits-derives'
  | 'figues-sechees'
  | 'cafe-dattes'
  | 'sucre-dattes'
  | 'sirop-dattes'
  | 'tous';

export interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  category: ProductCategory;
  subcategory?: string;
  certifications: string[];
  price?: string;
  weight?: string;
  isOrganic: boolean;
  isFairTrade: boolean;
  calories?: {
    value: number;
    unit: string;
    per: string;
  };
  nutritionFacts?: {
    name: string;
    value: string;
    unit: string;
    dailyValue?: string;
  }[];
  ingredients?: string[];
}
