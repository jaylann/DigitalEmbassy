// src/app/page.tsx

"use client";

import * as React from "react";
import type { FeatureCollection, LineString } from "geojson";
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
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <button
          onClick={addLandmark}
          className="rounded bg-blue-600 px-3 py-2 text-white"
        >
          Add Landmark
        </button>
        <button
          onClick={addArea}
          className="rounded bg-blue-600 px-3 py-2 text-white"
        >
          Add Area
        </button>
      </div>
    </>
  );
}

