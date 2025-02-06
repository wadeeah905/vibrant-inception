interface Zone {
  left: number;
  top: number;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
}

interface ProductFaceZone {
  sideId: string;
  zone: Zone;
}

export interface ProductZoneConfig {
  id: string;
  faces: ProductFaceZone[];
}

// Using percentage-based calculations for consistent zones
const calculateZone = (baseSize: number) => ({
  left: baseSize * 0.3,    // 30% from left
  top: baseSize * 0.3,     // 30% from top
  width: baseSize * 0.4,   // 40% of canvas width
  height: baseSize * 0.4,  // 40% of canvas height
});

export const productZoneConfigs: ProductZoneConfig[] = [
  {
    id: "tshirts",
    faces: [
      {
        sideId: "front",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      },
      {
        sideId: "back",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      }
    ]
  },
  {
    id: "blouses",
    faces: [
      {
        sideId: "front",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      },
      {
        sideId: "back",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      }
    ]
  },
  {
    id: "mugs",
    faces: [
      {
        sideId: "front",
        zone: {
          ...calculateZone(500),
          height: 150, // Special case for mugs
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      }
    ]
  },
  {
    id: "flyers",
    faces: [
      {
        sideId: "front",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      },
      {
        sideId: "back",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      }
    ]
  },
  {
    id: "notebooks",
    faces: [
      {
        sideId: "front",
        zone: {
          ...calculateZone(500),
          height: 250, // Special case for notebooks
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      }
    ]
  },
  {
    id: "bags",
    faces: [
      {
        sideId: "front",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      },
      {
        sideId: "back",
        zone: {
          ...calculateZone(500),
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "#cccccc",
          borderWidth: 1
        }
      }
    ]
  }
];