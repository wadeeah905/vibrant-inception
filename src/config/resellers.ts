export interface Reseller {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  image: string;
}

export interface Supplier {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  coordinates: [number, number];
  suppliers: string[];
}

export const RESELLERS_DATA: Reseller[] = [
  {
    id: 1,
    name: "Tazart Store Tunis Centre",
    address: "123 Avenue Habib Bourguiba, Tunis",
    phone: "+216 71 123 456",
    email: "tunis@tazart.tn",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "Tazart La Marsa",
    address: "45 Avenue de la Plage, La Marsa",
    phone: "+216 71 789 012",
    email: "marsa@tazart.tn",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Tazart Sousse",
    address: "78 Avenue du 14 Janvier, Sousse",
    phone: "+216 73 456 789",
    email: "sousse@tazart.tn",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

export const suppliers: Supplier[] = [
  {
    id: 'founashop',
    name: 'Founashop',
    logo: 'https://www.tazart.tn/images/partners/founashop.webp',
    description: 'Votre partenaire de confiance pour les équipements professionnels'
  },
  {
    id: 'jenaina',
    name: 'Jenaina',
    logo: 'https://www.tazart.tn/images/partners/jenaina.webp',
    description: 'Solutions complètes pour les professionnels de la restauration'
  },
  {
    id: 'viveznature',
    name: 'Vivez Nature',
    logo: 'https://www.tazart.tn/images/partners/viveznature.webp',
    description: 'Produits eco-responsables pour professionnels'
  }
];

export const stores: Store[] = [
  {
    id: 1,
    name: "Store Tunis Centre",
    address: "123 Avenue Habib Bourguiba, Tunis",
    coordinates: [36.8065, 10.1815], // Latitude, Longitude
    suppliers: ['founashop', 'jenaina']
  },
  {
    id: 2,
    name: "Store La Marsa",
    address: "45 Avenue de la Plage, La Marsa",
    coordinates: [36.8892, 10.3229],
    suppliers: ['jenaina', 'viveznature']
  },
  {
    id: 3,
    name: "Store Sousse",
    address: "78 Avenue du 14 Janvier, Sousse",
    coordinates: [35.8288, 10.6405],
    suppliers: ['founashop', 'viveznature']
  }
];
