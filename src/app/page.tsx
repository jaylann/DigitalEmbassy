// src/app/page.tsx

"use client";

import * as React from "react";
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

const cautionZone: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Caution Zone" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [51.36, 35.72],
            [51.37, 35.73],
            [51.38, 35.72],
            [51.37, 35.71],
            [51.36, 35.72],
          ],
        ],
      },
    },
  ],
};

const safeZone: FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Safe Zone" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [51.32, 35.715],
            [51.33, 35.715],
            [51.33, 35.705],
            [51.32, 35.705],
            [51.32, 35.715],
          ],
        ],
      },
    },
  ],
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
  {
    id: "caution",
    name: "Caution Area",
    geometry: cautionZone,
    category: "caution",
  },
  {
    id: "safe",
    name: "Safe Area",
    geometry: safeZone,
    category: "safe",
  },
];

// --- REVISED AND IMPROVED ROUTE ---
const sampleRoute: LineString = {
  type: "LineString",
  coordinates: [
    // 1. Start southwest of the main area of interest
    [51.325, 35.715],
    // 2. Head northeast towards the checkpoint
    [51.330, 35.720],
    // 3. Pass directly through "Checkpoint A" landmark
    [51.335, 35.722],
    // 4. Make a sharp turn east to avoid the western edge of the "No-Go Zone"
    [51.338, 35.723],
    // 5. Curve northwards on a final approach to the destination
    [51.339, 35.7245],
    // 6. Arrive precisely at the "Medical Center" landmark
    [51.340, 35.725],
  ],
};

export default function Home() {
  const [landmarks, setLandmarks] = React.useState<Landmark[]>(sampleLandmarks);
  const [areas, setAreas] = React.useState<Area[]>(sampleAreas);

  const addLandmark = () => {
    setLandmarks((prev) => [
      ...prev,
      {
        id: `dynamic-lm-${prev.length}`,
        name: `Landmark ${prev.length}`,
        location: { lat: 35.72 + prev.length * 0.002, lng: 51.335 },
        category: "checkpoint",
      },
    ]);
  };

  const addArea = () => {
    setAreas((prev) => [
      ...prev,
      {
        id: `dynamic-area-${prev.length}`,
        name: `Area ${prev.length}`,
        geometry: restrictionZone,
        category: "caution",
      },
    ]);
  };

  return (
    <>
      <InteractiveMap
        landmarks={landmarks}
        areas={areas}
        route={sampleRoute}
      />
    </>
  );
}
