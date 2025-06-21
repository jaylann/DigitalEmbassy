// src/app/page.tsx

import type { FeatureCollection } from "geojson";
import { InteractiveMap } from "@/components/interactive-map";
import type { Landmark } from "@/types/landmarks";
import type { Area } from "@/types/areas";

// Example restriction zones (centered on initial view at lon: 51.3347, lat: 35.7219)
const restrictionZone: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "No‑Go Zone" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [51.33, 35.70],
            [51.33, 35.745],
            [51.35, 35.75],
            [51.355, 35.72],
            [51.345, 35.695],
            [51.33, 35.70]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: { name: "Caution Zone" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [51.32, 35.71],
            [51.34, 35.74],
            [51.36, 35.71],
            [51.34, 35.68],
            [51.32, 35.71]
          ]
        ]
      }
    }
  ]
};

const sampleLandmarks: Landmark[] = [
  {
    id: "checkpoint-a",
    name: "Checkpoint A",
    location: { lat: 35.722, lng: 51.335 },
    category: "checkpoint",
  },
  {
    id: "medical-1",
    name: "Medical Center",
    location: { lat: 35.725, lng: 51.34 },
    category: "medical",
  },
];

const sampleAreas: Area[] = [
  {
    id: "restriction",
    name: "Restriction Zones",
    geometry: restrictionZone,
    category: "no_go",
  },
];

export default function Home() {
  return <InteractiveMap landmarks={sampleLandmarks} areas={sampleAreas} />;
}

