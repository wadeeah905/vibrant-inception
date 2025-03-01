
import type { Product, ProductType, ProductCategory } from '../types';

export const PRODUCT_TYPES: Record<ProductType, string> = {
  'dattes': 'Dattes',
  'figues-sechees': 'Figues Séchées',
  'sirops': 'Sirops de Fruits',
  'sucre-dattes': 'Sucre de Dattes'
};

export const PRODUCT_CATEGORIES: Record<ProductCategory, string> = {
  'coffret-cadeaux': 'Coffret Cadeaux',
  'paquets': 'Paquets',
  'dattes-en-vrac': 'Dattes en Vrac',
  'coffrets-en-bois': 'Coffrets en Bois',
  'figues-sechees-huile-olive': 'Figues Séchées à l\'Huile d\'Olive',
  'figues-sechees-en-vrac': 'Figues Séchées en Vrac',
  'sirop-dattes': 'Sirop de Dattes',
  'sirop-figues': 'Sirop de Figues',
  'sucre-dattes': 'Sucre de Dattes',
  'tous': 'Tous les Produits'
};

// Products for each category
export const PRODUCTS: Product[] = [
  // Dattes - Coffret Cadeaux
  {
    id: '1',
    title: 'Coffret Premium Dattes',
    description: 'Magnifique coffret de dattes premium, idéal pour les cadeaux et occasions spéciales.',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    isOrganic: true,
    isFairTrade: true,
    type: 'dattes',
    category: 'coffret-cadeaux'
  },
  {
    id: '2',
    title: 'Coffret Dégustation Dattes',
    description: 'Une sélection variée de nos meilleures dattes dans un coffret élégant pour les connaisseurs.',
    image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838',
    isOrganic: true,
    isFairTrade: true,
    type: 'dattes',
    category: 'coffret-cadeaux'
  },
  {
    id: '3',
    title: 'Coffret Luxe Dattes Fourrées',
    description: 'Dattes de qualité supérieure fourrées aux amandes et noisettes dans un coffret artisanal.',
    image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d',
    isOrganic: false,
    isFairTrade: true,
    type: 'dattes',
    category: 'coffret-cadeaux'
  },
  
  // Dattes - Paquets
  {
    id: '4',
    title: 'Dattes Premium 500g',
    description: 'Paquet de 500g de dattes sélectionnées, parfaites pour la consommation quotidienne.',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    isOrganic: true,
    isFairTrade: true,
    type: 'dattes',
    category: 'paquets'
  },
  {
    id: '5',
    title: 'Dattes Deglet Nour 1kg',
    description: 'Nos fameuses dattes Deglet Nour en format familial de 1kg, idéal pour le Ramadan.',
    image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838',
    isOrganic: true,
    isFairTrade: true,
    type: 'dattes',
    category: 'paquets'
  },
  {
    id: '6',
    title: 'Assortiment Dattes 250g',
    description: 'Petit paquet d\'assortiment de dattes variées, parfait pour découvrir nos saveurs.',
    image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d',
    isOrganic: true,
    isFairTrade: true,
    type: 'dattes',
    category: 'paquets'
  },
  
  // Dattes - Dattes en Vrac
  {
    id: '7',
    title: 'Dattes Medjool en Vrac',
    description: 'Nos dattes Medjool d\'exception en vrac, cultivées et sélectionnées avec soin.',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    isOrganic: true,
    isFairTrade: true,
    type: 'dattes',
    category: 'dattes-en-vrac'
  },
  {
    id: '8',
    title: 'Dattes Deglet Nour en Vrac',
    description: 'Les traditionnelles dattes Deglet Nour en vrac, parfaites pour la cuisine et la pâtisserie.',
    image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838',
    isOrganic: true,
    isFairTrade: true,
    type: 'dattes',
    category: 'dattes-en-vrac'
  },
  {
    id: '9',
    title: 'Dattes Khouat Allig en Vrac',
    description: 'Variété rare de dattes tunisiennes Khouat Allig en vrac, au goût incomparable.',
    image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d',
    isOrganic: false,
    isFairTrade: true,
    type: 'dattes',
    category: 'dattes-en-vrac'
  },
  
  // Figues Séchées - Coffrets en Bois
  {
    id: '10',
    title: 'Coffret Bois Figues Premium',
    description: 'Élégant coffret en bois artisanal contenant nos meilleures figues séchées sélectionnées.',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    isOrganic: true,
    isFairTrade: true,
    type: 'figues-sechees',
    category: 'coffrets-en-bois'
  },
  {
    id: '11',
    title: 'Coffret Dégustation Figues',
    description: 'Collection de figues séchées variées présentées dans un coffret en bois gravé à la main.',
    image: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151',
    isOrganic: true,
    isFairTrade: true,
    type: 'figues-sechees',
    category: 'coffrets-en-bois'
  },
  {
    id: '12',
    title: 'Coffret Cadeau Figues Nobles',
    description: 'Nos figues séchées les plus nobles dans un coffret en bois d\'olivier, idéal comme cadeau raffiné.',
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
    isOrganic: true,
    isFairTrade: true,
    type: 'figues-sechees',
    category: 'coffrets-en-bois'
  },
  
  // Figues Séchées - Figues Séchées à l'Huile d'Olive
  {
    id: '13',
    title: 'Figues à l\'Huile d\'Olive 200g',
    description: 'Figues séchées marinées dans notre huile d\'olive extra vierge, un délice méditerranéen.',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    isOrganic: true,
    isFairTrade: true,
    type: 'figues-sechees',
    category: 'figues-sechees-huile-olive'
  },
  {
    id: '14',
    title: 'Figues Épicées à l\'Huile d\'Olive',
    description: 'Figues séchées relevées d\'épices et marinées dans l\'huile d\'olive, parfaites avec le fromage.',
    image: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151',
    isOrganic: true,
    isFairTrade: true,
    type: 'figues-sechees',
    category: 'figues-sechees-huile-olive'
  },
  {
    id: '15',
    title: 'Figues Premium à l\'Huile Infusée',
    description: 'Figues séchées dans notre huile d\'olive infusée aux herbes de Provence, une explosion de saveurs.',
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
    isOrganic: false,
    isFairTrade: true,
    type: 'figues-sechees',
    category: 'figues-sechees-huile-olive'
  },
  
  // Figues Séchées - Figues Séchées en Vrac
  {
    id: '16',
    title: 'Figues Séchées en Vrac 500g',
    description: 'Nos figues séchées traditionnelles en vrac, un en-cas sain et délicieux.',
    image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07',
    isOrganic: true,
    isFairTrade: true,
    type: 'figues-sechees',
    category: 'figues-sechees-en-vrac'
  },
  {
    id: '17',
    title: 'Figues Séchées Biologiques en Vrac',
    description: 'Figues séchées biologiques certifiées, cultivées sans pesticides et séchées naturellement.',
    image: 'https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151',
    isOrganic: true,
    isFairTrade: true,
    type: 'figues-sechees',
    category: 'figues-sechees-en-vrac'
  },
  {
    id: '18',
    title: 'Figues Séchées Premium 1kg',
    description: 'Grand format de nos figues séchées de qualité premium, idéal pour les familles et la pâtisserie.',
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1',
    isOrganic: true,
    isFairTrade: true,
    type: 'figues-sechees',
    category: 'figues-sechees-en-vrac'
  },
  
  // Sirops de Fruits - Sirop de Dattes
  {
    id: '19',
    title: 'Sirop de Dattes Naturel 250ml',
    description: 'Sirop 100% naturel extrait de nos meilleures dattes, une alternative saine au sucre raffiné.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    isOrganic: true,
    isFairTrade: true,
    type: 'sirops',
    category: 'sirop-dattes'
  },
  {
    id: '20',
    title: 'Sirop de Dattes Premium 500ml',
    description: 'Format familial de notre sirop de dattes premium, parfait pour la cuisine et les boissons.',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    isOrganic: true,
    isFairTrade: true,
    type: 'sirops',
    category: 'sirop-dattes'
  },
  {
    id: '21',
    title: 'Sirop de Dattes à la Vanille',
    description: 'Notre sirop de dattes infusé à la vanille de Madagascar, idéal pour les desserts raffinés.',
    image: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4',
    isOrganic: false,
    isFairTrade: true,
    type: 'sirops',
    category: 'sirop-dattes'
  },
  
  // Sirops de Fruits - Sirop de Figues
  {
    id: '22',
    title: 'Sirop de Figues Naturel 250ml',
    description: 'Sirop de figues 100% naturel, doux et parfumé, parfait pour napper vos desserts.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    isOrganic: true,
    isFairTrade: true,
    type: 'sirops',
    category: 'sirop-figues'
  },
  {
    id: '23',
    title: 'Sirop de Figues Épicé',
    description: 'Sirop de figues avec une touche de cannelle et d\'anis étoilé, idéal pour les boissons chaudes.',
    image: 'https://images.unsplash.com/photo-1500673922987-e212871fec22',
    isOrganic: true,
    isFairTrade: true,
    type: 'sirops',
    category: 'sirop-figues'
  },
  {
    id: '24',
    title: 'Sirop de Figues Premium 500ml',
    description: 'Grand format de notre sirop de figues premium, polyvalent en cuisine comme en pâtisserie.',
    image: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4',
    isOrganic: false,
    isFairTrade: true,
    type: 'sirops',
    category: 'sirop-figues'
  },
  
  // Sucre de Dattes
  {
    id: '25',
    title: 'Sucre de Dattes Bio 250g',
    description: 'Alternative naturelle au sucre raffiné, fait à partir de dattes biologiques tunisiennes.',
    image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9',
    isOrganic: true,
    isFairTrade: true,
    type: 'sucre-dattes',
    category: 'sucre-dattes'
  },
  {
    id: '26',
    title: 'Sucre de Dattes en Poudre 500g',
    description: 'Sucre de dattes finement moulu, facile à utiliser dans toutes vos recettes.',
    image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838',
    isOrganic: true,
    isFairTrade: true,
    type: 'sucre-dattes',
    category: 'sucre-dattes'
  },
  {
    id: '27',
    title: 'Sachet de Sucre de Dattes 1kg',
    description: 'Format économique de notre sucre de dattes premium, pour les amateurs de pâtisserie.',
    image: 'https://images.unsplash.com/photo-1466721591366-2d5fba72006d',
    isOrganic: true,
    isFairTrade: true,
    type: 'sucre-dattes',
    category: 'sucre-dattes'
  }
];

export const NAVIGATION_STRUCTURE = [
  {
    label: 'Dattes',
    type: 'dattes' as ProductType,
    items: [
      { label: 'Coffret Cadeaux', href: 'products', category: 'coffret-cadeaux' as ProductCategory },
      { label: 'Paquets', href: 'products', category: 'paquets' as ProductCategory },
      { label: 'Dattes en Vrac', href: 'products', category: 'dattes-en-vrac' as ProductCategory }
    ]
  },
  {
    label: 'Figues Séchées',
    type: 'figues-sechees' as ProductType,
    items: [
      { label: 'Coffrets en Bois', href: 'products', category: 'coffrets-en-bois' as ProductCategory },
      { label: 'Figues Séchées à l\'Huile d\'Olive', href: 'products', category: 'figues-sechees-huile-olive' as ProductCategory },
      { label: 'Figues Séchées en Vrac', href: 'products', category: 'figues-sechees-en-vrac' as ProductCategory }
    ]
  },
  {
    label: 'Sirops de Fruits',
    type: 'sirops' as ProductType,
    items: [
      { label: 'Sirop de Dattes', href: 'products', category: 'sirop-dattes' as ProductCategory },
      { label: 'Sirop de Figues', href: 'products', category: 'sirop-figues' as ProductCategory }
    ]
  },
  {
    label: 'Sucre de Dattes',
    type: 'sucre-dattes' as ProductType,
    items: [
      { label: 'Sucre de Dattes', href: 'products', category: 'sucre-dattes' as ProductCategory }
    ]
  }
];
