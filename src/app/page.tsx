// src/app/page.tsx

"use client";

import * as React from "react";
import type { FeatureCollection, LineString } from "geojson";
import { InteractiveMap } from "@/components/interactive-map";
import type { Area } from "@/types/areas";
import {Landmark} from "@/lib/types";
import defaultLandmarks from "../../data/landmarks.json";
import defaultAreas from "../../data/areas.json";

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
  const [landmarks, setLandmarks] = React.useState<Landmark[]>([]);
  const [areas, setAreas] = React.useState<Area[]>([]);

  // Load default data and any stored user data on first render
  React.useEffect(() => {
    try {
      const storedLandmarks = localStorage.getItem('landmarks');
      if (storedLandmarks) {
        setLandmarks(JSON.parse(storedLandmarks));
      } else {
        setLandmarks(defaultLandmarks as Landmark[]);
      }
    } catch {
      setLandmarks(defaultLandmarks as Landmark[]);
    }

    try {
      const storedAreas = localStorage.getItem('areas');
      if (storedAreas) {
        setAreas(JSON.parse(storedAreas));
      } else {
        setAreas(defaultAreas as Area[]);
      }
    } catch {
      setAreas(defaultAreas as Area[]);
    }
  }, []);

  // Persist landmarks and areas whenever they change
  React.useEffect(() => {
    if (landmarks.length) {
      localStorage.setItem('landmarks', JSON.stringify(landmarks));
    }
  }, [landmarks]);

  React.useEffect(() => {
    if (areas.length) {
      localStorage.setItem('areas', JSON.stringify(areas));
    }
  }, [areas]);

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
        description: "User added area",
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
