// src/app/page.tsx

import type { FeatureCollection, LineString } from "geojson";
import { InteractiveMap } from "@/components/interactive-map";
import type { Area } from "@/types/areas";
import {Landmark} from "@/lib/types";

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
    description: "Primary checkpoint for authorized personnel only",
    trustLevel: "high",
    lastUpdated: "2025-06-21T10:00:00Z",
    addedBy: "user-admin-001",
    isVerified: true,
    visible: true,
  },
  {
    id: "medical-1",
    name: "Medical Center",
    location: { lat: 35.725, lng: 51.34 },
    category: "medical",
    description: "On-site medical center providing emergency care",
    trustLevel: "medium",
    lastUpdated: "2025-06-20T15:30:00Z",
    addedBy: "user-medic-042",
    isVerified: false,
    visible: true,
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

const sampleRoute: LineString = {
  type: "LineString",
  coordinates: [
    [51.33, 35.72],
    [51.335, 35.723],
    [51.34, 35.726],
    [51.345, 35.729],
    [51.35, 35.732],
  ],
};

export default function Home() {
  return (
    <InteractiveMap
      landmarks={sampleLandmarks}
      areas={sampleAreas}
      route={sampleRoute}
    />
  );
}
