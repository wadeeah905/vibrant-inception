export interface ProductSideImage {
  sideId: string;
  imageUrl: string;
}

export interface ProductSideImages {
  productId: string;
  sides: ProductSideImage[];
}

export const productSideImages: ProductSideImages[] = [
  {
    productId: "tshirts",
    sides: [
      {
        sideId: "front",
        imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop"
      },
      {
        sideId: "back",
        imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=500&h=500&fit=crop"
      }
    ]
  },
  {
    productId: "blouses",
    sides: [
      {
        sideId: "front",
        imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&h=500&fit=crop"
      },
      {
        sideId: "back",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop"
      }
    ]
  },
  {
    productId: "mugs",
    sides: [
      {
        sideId: "front",
        imageUrl: "https://images.unsplash.com/photo-1481833761820-0509d3217039?w=500&h=500&fit=crop"
      }
    ]
  },
  {
    productId: "flyers",
    sides: [
      {
        sideId: "front",
        imageUrl: "https://images.unsplash.com/photo-1531685250784-7569952593d2?w=500&h=500&fit=crop"
      },
      {
        sideId: "back",
        imageUrl: "https://images.unsplash.com/photo-1531685250784-7569952593d2?w=500&h=500&fit=crop"
      }
    ]
  },
  {
    productId: "notebooks",
    sides: [
      {
        sideId: "front",
        imageUrl: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500&h=500&fit=crop"
      }
    ]
  },
  {
    productId: "bags",
    sides: [
      {
        sideId: "front",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
      },
      {
        sideId: "back",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop"
      }
    ]
  }
];