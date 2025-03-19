import type { Product, ProductCategory } from '../types/product';

export const PRODUCT_CATEGORIES: Record<ProductCategory, string> = {
  'dattes-fraiches': 'Dattes Fraîches',
  'dattes-transformees': 'Dattes Transformées',
  'produits-derives': 'Produits Dérivés',
  'figues-sechees': 'Figues Séchées',
  'cafe-dattes': 'Café de Dattes',
  'sucre-dattes': 'Sucre de Dattes',
  'sirop-dattes': 'Sirop de Dattes',
  'tous': 'Tous les Produits'
};

export const NAVIGATION_STRUCTURE = [
  {
    type: 'dattes',
    items: [
      { category: 'dattes-fraiches', image: '/produits/PaquetDattes.png' },
      { category: 'dattes-transformees', image: '/produits/braquette500gram.png' }
    ]
  },
  {
    type: 'produits-derives',
    items: [
      { category: 'cafe-dattes', image: '/produits/cafe-dattes.png' },
      { category: 'sucre-dattes', image: '/produits/sucre-dattes.png' },
      { category: 'sirop-dattes', image: '/produits/sirop-dattes.png' }
    ]
  },
  {
    type: 'figues',
    items: [
      { category: 'figues-sechees', image: '/produits/figues-sechees.png' }
    ]
  }
];

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Paquet Dattes 1kg',
    description: 'Notre paquet de dattes Deglet Nour de 1kg offre des fruits charnus et sucrés, soigneusement sélectionnés dans les palmeraies tunisiennes. Récoltées à maturité optimale, ces dattes premium sont naturellement riches en minéraux et glucides, idéales pour une consommation quotidienne ou pour enrichir vos préparations culinaires.',
    image: '/produits/PaquetDattes.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-fraiches',
    subcategory: 'paquet',
    certifications: ['Bio', 'Fair Trade'],
    weight: '1kg',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie 100% naturelles',
      'Sans additifs ni conservateurs',
      'Non traitées après récolte',
      'Conditionnées dans un environnement contrôlé'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '2',
    title: 'Paquet Dattes 500g',
    description: 'Format pratique de 500g de nos dattes Deglet Nour, idéal pour les petites familles ou une consommation modérée. Ces dattes tunisiennes de première qualité se distinguent par leur texture moelleuse et leur saveur caramélisée naturelle. Parfait comme en-cas nutritif ou pour agrémenter vos pâtisseries et plats salés-sucrés.',
    image: '/produits/PaquetDattes.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-fraiches',
    subcategory: 'paquet',
    certifications: ['Bio', 'Fair Trade'],
    weight: '500g',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie 100% naturelles',
      'Sans additifs ni conservateurs',
      'Non traitées après récolte',
      'Emballées sous atmosphère protectrice'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  
  // Dattes - Coffrets
  {
    id: '3',
    title: 'Coffret Dattes 1kg (Bleu)',
    description: 'Notre coffret premium bleu contient 1kg de dattes Deglet Nour d\'exception, soigneusement sélectionnées pour leur taille, leur brillance et leur saveur incomparable. Présentées dans un écrin élégant, ces dattes sont le cadeau parfait pour les occasions spéciales. Chaque fruit est charnu, avec une texture mielleuse et des notes subtiles de caramel naturel.',
    image: '/produits/PaquetDattesBlue.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-fraiches',
    subcategory: 'coffret-cadeaux',
    certifications: ['Bio', 'Fair Trade'],
    weight: '1kg',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour premium de Tunisie sélection supérieure',
      'Sans additifs ni conservateurs',
      'Conditionnées à la main',
      'Récoltées à pleine maturité et triées individuellement'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '4',
    title: 'Coffret Dattes 500g (Vert)',
    description: 'Élégant coffret vert renfermant 500g de nos dattes Deglet Nour les plus exquises. Ce format raffiné est conçu pour les amateurs de saveurs authentiques et les occasions spéciales. Chaque datte est sélectionnée pour sa texture parfaite, son goût équilibré et sa chair généreuse, faisant de ce coffret un plaisir gustatif et visuel parfait à offrir.',
    image: '/produits/PaquetDattesVerte.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-fraiches',
    subcategory: 'coffret-cadeaux',
    certifications: ['Bio', 'Fair Trade'],
    weight: '500g',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour premium de Tunisie sélection supérieure',
      'Sans additifs ni conservateurs',
      'Conditionnées à la main',
      'Récoltées à pleine maturité et triées individuellement'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  
  // Dattes Transformées - Barquettes
  {
    id: '5',
    title: 'Barquette Dattes Dénoyautées 500g',
    description: 'Barquette pratique de 500g de dattes Deglet Nour dénoyautées, idéale pour une consommation directe ou pour vos préparations culinaires. Ces dattes soigneusement préparées conservent toute leur saveur et leur moelleux, tout en vous offrant un gain de temps considérable. Parfaites pour vos smoothies, pâtisseries ou comme en-cas énergétique.',
    image: '/produits/braquette500gram.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-transformees',
    subcategory: 'barquette',
    certifications: ['Bio', 'Fair Trade'],
    weight: '500g',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie dénoyautées',
      'Sans additifs ni conservateurs',
      'Préparées dans des conditions d\'hygiène optimales',
      'Emballées sous atmosphère protectrice pour préserver leur fraîcheur'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '6',
    title: 'Barquette Dattes Dénoyautées 200g',
    description: 'Format compact de 200g de dattes dénoyautées en barquette, parfait pour une consommation individuelle ou pour précisément doser vos recettes. Ces dattes Deglet Nour sans noyau sont prêtes à l\'emploi pour vos créations culinaires ou comme collation naturellement sucrée. Leur texture fondante et leur goût authentique sont préservés grâce à notre processus de dénoyautage soigneux.',
    image: '/produits/BarquetteDattesDen2.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'dattes-transformees',
    subcategory: 'barquette',
    certifications: ['Bio', 'Fair Trade'],
    weight: '200g',
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie dénoyautées',
      'Sans additifs ni conservateurs',
      'Préparées dans des conditions d\'hygiène optimales',
      'Conditionnement hermétique pour une fraîcheur maximale'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '7',
    title: 'Dattes Standard Dénoyautées 5kg/10kg',
    description: 'Conditionnement professionnel de dattes dénoyautées disponible en formats 5kg ou 10kg, spécialement conçu pour les restaurants, les pâtisseries et les professionnels de l\'alimentation. Ces dattes Deglet Nour de qualité standard sont soigneusement dénoyautées et préparées pour une utilisation efficace en restauration. Idéales pour la préparation de desserts traditionnels, pâtisseries ou créations culinaires innovantes à grande échelle.',
    image: '/produits/DattesStandard.png',
    isOrganic: false,
    isFairTrade: true,
    category: 'dattes-transformees',
    certifications: ['Fair Trade'],
    calories: {
      value: 306,
      unit: 'kcal/1279kJ',
      per: '100g'
    },
    ingredients: [
      'Dattes Deglet Nour de Tunisie dénoyautées qualité standard',
      'Sans conservateurs artificiels',
      'Préparées selon les normes d\'hygiène professionnelles',
      'Conditionnement spécial pour usage professionnel'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '306', 
        unit: 'kcal/1279kJ',
        dailyValue: '15.3%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '70', 
        unit: 'g',
        dailyValue: '26.9%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '70', 
        unit: 'g',
        dailyValue: '77.8%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '2.2', 
        unit: 'g',
        dailyValue: '4.4%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '0.3%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  
  // Figues Séchées
  {
    id: '9',
    title: 'Figues ZIDI 200g',
    description: 'Nos figues séchées de 200g sont un trésor de saveurs méditerranéennes, délicatement séchées au soleil selon des méthodes traditionnelles tunisiennes. Naturellement sucrées et charnues, ces figues conservent tous leurs nutriments et leur goût authentique. Riches en fibres et minéraux, elles constituent un en-cas sain ou un ingrédient parfait pour vos salades, desserts et plats mijotés.',
    image: '/produits/zidi-figues.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'figues-sechees',
    certifications: ['Bio', 'Fair Trade'],
    weight: '200g',
    calories: {
      value: 252,
      unit: 'kcal/1054kJ',
      per: '100g'
    },
    ingredients: [
      'Figues de Tunisie séchées au soleil',
      'Sans additifs ni conservateurs',
      'Sans sucre ajouté',
      'Séchées selon des méthodes traditionnelles respectueuses de l\'environnement'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '252', 
        unit: 'kcal/1054kJ',
        dailyValue: '12.6%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '50', 
        unit: 'g',
        dailyValue: '19.2%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '50', 
        unit: 'g',
        dailyValue: '55.6%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '3.4', 
        unit: 'g',
        dailyValue: '6.8%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '1.2', 
        unit: 'g',
        dailyValue: '1.7%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  {
    id: '10',
    title: 'Figues Séchées en Vrac',
    description: 'Nos figues séchées en vrac sont idéales pour les amateurs de fruits secs qui souhaitent une solution économique et écologique. Ces figues tunisiennes, séchées naturellement au soleil, offrent une texture tendre et un goût concentré caractéristique. Excellentes pour la cuisine, les salades, les tajines ou simplement comme collation nutritive, elles sont disponibles en différents conditionnements selon vos besoins de consommation.',
    image: '/produits/figuesvrac.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'figues-sechees',
    certifications: ['Bio', 'Fair Trade'],
    calories: {
      value: 252,
      unit: 'kcal/1054kJ',
      per: '100g'
    },
    ingredients: [
      'Figues de Tunisie séchées au soleil',
      'Sans additifs ni conservateurs',
      'Sans sucre ajouté',
      'Sélectionnées à la main pour garantir leur qualité'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '252', 
        unit: 'kcal/1054kJ',
        dailyValue: '12.6%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '50', 
        unit: 'g',
        dailyValue: '19.2%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '50', 
        unit: 'g',
        dailyValue: '55.6%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '3.4', 
        unit: 'g',
        dailyValue: '6.8%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '1.2', 
        unit: 'g',
        dailyValue: '1.7%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  
  // Figues Toujane product
  {
    id: '14',
    title: 'Figues Toujane 200g',
    description: 'Nos figues Toujane de 200g sont un trésor de saveurs méditerranéennes, délicatement séchées au soleil selon des méthodes traditionnelles tunisiennes. Naturellement sucrées et charnues, ces figues conservent tous leurs nutriments et leur goût authentique. Riches en fibres et minéraux, elles constituent un en-cas sain ou un ingrédient parfait pour vos salades, desserts et plats mijotés.',
    image: '/produits/toujane-figues.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'figues-sechees',
    certifications: ['Bio', 'Fair Trade'],
    weight: '200g',
    calories: {
      value: 252,
      unit: 'kcal/1054kJ',
      per: '100g'
    },
    ingredients: [
      'Figues Toujane de Tunisie séchées au soleil',
      'Sans additifs ni conservateurs',
      'Sans sucre ajouté',
      'Séchées selon des méthodes traditionnelles respectueuses de l\'environnement'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '252', 
        unit: 'kcal/1054kJ',
        dailyValue: '12.6%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '50', 
        unit: 'g',
        dailyValue: '19.2%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '50', 
        unit: 'g',
        dailyValue: '55.6%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '3.4', 
        unit: 'g',
        dailyValue: '6.8%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '1.2', 
        unit: 'g',
        dailyValue: '1.7%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  
  // New Figues djebaa product
  {
    id: '15',
    title: 'Figues djebaa 200g',
    description: 'Nos figues djebaa de 200g sont un trésor de saveurs méditerranéennes, délicatement séchées au soleil selon des méthodes traditionnelles tunisiennes. Naturellement sucrées et charnues, ces figues conservent tous leurs nutriments et leur goût authentique. Riches en fibres et minéraux, elles constituent un en-cas sain ou un ingrédient parfait pour vos salades, desserts et plats mijotés.',
    image: '/produits/djebba-figues.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'figues-sechees',
    certifications: ['Bio', 'Fair Trade'],
    weight: '200g',
    calories: {
      value: 252,
      unit: 'kcal/1054kJ',
      per: '100g'
    },
    ingredients: [
      'Figues djebaa de Tunisie séchées au soleil',
      'Sans additifs ni conservateurs',
      'Sans sucre ajouté',
      'Séchées selon des méthodes traditionnelles respectueuses de l\'environnement'
    ],
    nutritionFacts: [
      { 
        name: 'Énergie / Energie', 
        value: '252', 
        unit: 'kcal/1054kJ',
        dailyValue: '12.6%' 
      },
      { 
        name: 'Glucides / Carbohydrates', 
        value: '50', 
        unit: 'g',
        dailyValue: '19.2%' 
      },
      { 
        name: 'dont Sucres / Of which sugars', 
        value: '50', 
        unit: 'g',
        dailyValue: '55.6%' 
      },
      { 
        name: 'Fibres / Fiber', 
        value: '6.25', 
        unit: 'g',
        dailyValue: '25%' 
      },
      { 
        name: 'Protéines / Protein', 
        value: '3.4', 
        unit: 'g',
        dailyValue: '6.8%' 
      },
      { 
        name: 'Matières grasses / Fat', 
        value: '1.2', 
        unit: 'g',
        dailyValue: '1.7%' 
      },
      { 
        name: 'dont Acides gras saturés / Saturated fatty acids', 
        value: '0.2', 
        unit: 'g',
        dailyValue: '1%' 
      },
      { 
        name: 'Sel / Salt', 
        value: '0', 
        unit: 'g',
        dailyValue: '—' 
      }
    ]
  },
  
  // Produits Dérivés
  {
    id: '11',
    title: 'Café de Noyaux de Dattes 200g',
    description: 'Notre café de noyaux de dattes est une alternative naturelle et sans caféine au café traditionnel. Préparé à partir de noyaux de dattes torréfiés et moulus avec soin selon un savoir-faire ancestral tunisien, cette boisson offre des notes douces, légèrement caramélisées avec une touche de noisette. Parfait pour les personnes sensibles à la caféine ou celles recherchant une boisson chaude originale aux vertus digestives.',
    image: '/produits/cafe-dattes.png',
    isOrganic: true,
    isFairTrade: true,
    category: 'cafe-dattes',
    certifications: ['Bio', 'Fair Trade'],
    weight: '200g',
    calories: {
      value: 15,
      unit: 'kcal/63kJ',
      per: '100g'
    },
    ingredients: [
      'Noyaux de dattes Deglet Nour torréfiés et finement moulus (100%)',
