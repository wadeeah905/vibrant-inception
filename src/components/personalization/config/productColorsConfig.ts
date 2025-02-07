
export interface ProductColor {
  sideId: string;
  color: string;
  imageUrl: string;
}

export interface ProductColors {
  productId: string;
  colors: ProductColor[];
}

// Only include colors that have corresponding images
export const colorPalette = [
  "#000000", // Black
  "#ffffff", // White
  "#ff0000", // Red
  "#ffff00", // Yellow
];

export const productColors: ProductColors[] = [
  {
    productId: "tshirt",
    colors: [
      {
        sideId: "front",
        color: "#000000",
        imageUrl: "/ProductImages/BlackTshirt.png"
      },
      {
        sideId: "back",
        color: "#000000",
        imageUrl: "/ProductImages/BlackTshirtArriere.png"
      },
      {
        sideId: "front",
        color: "#ffffff",
        imageUrl: "/ProductImages/WhiteTshirt.png"
      },
      {
        sideId: "back",
        color: "#ffffff",
        imageUrl: "/ProductImages/WhiteTshirtArriere.png"
      }
    ]
  },
  {
    productId: "buttons-tshirt",
    colors: [
      {
        sideId: "front",
        color: "#000000",
        imageUrl: "/ProductImages/BlackButtonsTshirt.png"
      },
      {
        sideId: "back",
        color: "#000000",
        imageUrl: "/ProductImages/BlackButtonsTshirtArriere.png"
      },
      {
        sideId: "front",
        color: "#ffffff",
        imageUrl: "/ProductImages/WhiteButtonsTshirts.png"
      }
    ]
  },
  {
    productId: "tablier",
    colors: [
      {
        sideId: "front",
        color: "#000000",
        imageUrl: "/ProductImages/BlackTablier.png"
      },
      {
        sideId: "front",
        color: "#ffffff",
        imageUrl: "/ProductImages/WhiteTabllier.png"
      }
    ]
  },
  {
    productId: "mug",
    colors: [
      {
        sideId: "front",
        color: "#000000",
        imageUrl: "/ProductImages/BlackMug.png"
      },
      {
        sideId: "front",
        color: "#ffffff",
        imageUrl: "/ProductImages/WhiteMug.png"
      }
    ]
  }
];
