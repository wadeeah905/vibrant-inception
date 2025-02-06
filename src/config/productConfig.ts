export interface ProductFace {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  startingPrice: string;
  image: string;
  faces: ProductFace[];
}

export const products: Product[] = [
  {
    id: "tshirts",
    name: "T-shirts",
    description: "T-shirts confortables avec votre design unique. Tissu de haute qualité pour un confort optimal.",
    startingPrice: "35.00",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    faces: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre t-shirt",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Personnalisez le dos de votre t-shirt",
        imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&h=500&fit=crop"
      }
    ]
  },
  {
    id: "blouses",
    name: "Blouses de travail",
    description: "Blouses professionnelles personnalisées. Adaptées à tous les environnements de travail.",
    startingPrice: "45.00",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop",
    faces: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre blouse",
        imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Personnalisez le dos de votre blouse",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop"
      }
    ]
  },
  {
    id: "mugs",
    name: "Tasses",
    description: "Tasses personnalisées pour votre café quotidien. Design unique et qualité premium garantie.",
    startingPrice: "25.00",
    image: "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=500&h=500&fit=crop",
    faces: [
      {
        id: "front",
        title: "Face Principale",
        description: "Zone de personnalisation principale",
        imageUrl: "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=500&h=500&fit=crop"
      }
    ]
  },
  {
    id: "flyers",
    name: "Flyers",
    description: "Flyers promotionnels sur mesure. Impression haute qualité pour un impact maximal.",
    startingPrice: "15.00",
    image: "https://images.unsplash.com/photo-1531685250784-7569952593d2?w=500&h=500&fit=crop",
    faces: [
      {
        id: "front",
        title: "Recto",
        description: "Face avant du flyer",
        imageUrl: "https://images.unsplash.com/photo-1531685250784-7569952593d2?w=500&h=500&fit=crop"
      },
      {
        id: "back",
        title: "Verso",
        description: "Face arrière du flyer",
        imageUrl: "https://images.unsplash.com/photo-1531685250784-7569952593d2?w=500&h=500&fit=crop"
      }
    ]
  },
  {
    id: "notebooks",
    name: "Carnets",
    description: "Carnets personnalisés pour vos notes. Papier de qualité et finition professionnelle.",
    startingPrice: "20.00",
    image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&h=500&fit=crop",
    faces: [
      {
        id: "front",
        title: "Couverture",
        description: "Personnalisez la couverture de votre carnet",
        imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&h=500&fit=crop"
      }
    ]
  },
  {
    id: "bags",
    name: "Sacs",
    description: "Sacs personnalisés pour tous les jours. Matériaux durables et design élégant.",
    startingPrice: "30.00",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    faces: [
      {
        id: "front",
        title: "Face Avant",
        description: "Face principale du sac",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Dos du sac",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
      }
    ]
  }
];