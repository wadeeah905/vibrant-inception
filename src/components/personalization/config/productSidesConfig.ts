export interface ProductSide {
  id: string;
  title: string;
  description?: string;
}

export interface ProductSidesConfig {
  id: string;
  sides: ProductSide[];
}

export const productSidesConfigs: ProductSidesConfig[] = [
  {
    id: "tshirts",
    sides: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre t-shirt"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Personnalisez le dos de votre t-shirt"
      }
    ]
  },
  {
    id: "blouses",
    sides: [
      {
        id: "front",
        title: "Face Avant",
        description: "Personnalisez la face avant de votre blouse"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Personnalisez le dos de votre blouse"
      }
    ]
  },
  {
    id: "mugs",
    sides: [
      {
        id: "front",
        title: "Face Principale",
        description: "Zone de personnalisation principale"
      }
    ]
  },
  {
    id: "flyers",
    sides: [
      {
        id: "front",
        title: "Recto",
        description: "Face avant du flyer"
      },
      {
        id: "back",
        title: "Verso",
        description: "Face arrière du flyer"
      }
    ]
  },
  {
    id: "notebooks",
    sides: [
      {
        id: "front",
        title: "Couverture",
        description: "Personnalisez la couverture de votre carnet"
      }
    ]
  },
  {
    id: "bags",
    sides: [
      {
        id: "front",
        title: "Face Avant",
        description: "Face principale du sac"
      },
      {
        id: "back",
        title: "Face Arrière",
        description: "Dos du sac"
      }
    ]
  }
];