// src/app/page.tsx
"use client";

import * as React from "react";
import { MapRef, MapLayerMouseEvent } from "react-map-gl/maplibre"; // MapLayerMouseEvent might not be needed if InteractiveMap handles its own specific click logic
import type { FeatureCollection, LineString } from "geojson"; // Keep if restrictionZone/sampleRoute use it (they do in this example)
import { InteractiveMap } from "@/components/interactive-map";
import type { Area, AreaCategory } from "@/types/areas"; // Ensure AreaCategory is imported if used for sample data
import { Landmark, Location as LandmarkLocation, LandmarkCategory } from "@/lib/types";
import type { Route } from "@/types/routes";


// Import the form for adding landmarks
import { AddLandmarkForm, NewLandmarkData } from "@/components/add-landmark-form";
// Marker and MapPin are no longer needed here as the temp map-click marker is removed

// Import NewsItem type and the initial news data (exported from news/page.tsx)
import { NewsItem } from "@/types/news-item"; // Adjust path if needed
// Import the EXPORTED initial static news items from news/page.tsx
import { initialStaticNewsItems } from "@/app/news/page"; // Ensure this export exists in news/page.tsx


// --- Sample Data Defined Directly in this File (if needed for initial state) ---
// If you want the app to start completely empty, initialize with empty arrays below.
// Otherwise, you can put a few sample items here.

const sampleInitialLandmarks: Landmark[] = [
  {
    id: 'sample-lm-1',
    name: 'Sample Safe Space',
    location: { lat: 35.720, lng: 51.420 }, // Example coords
    category: 'safe_space',
    isVerified: true,
    visible: true,
    lastUpdated: new Date().toISOString(),
  },
  {
    id: 'sample-lm-2',
    name: 'Sample Medical Point',
    location: { lat: 35.715, lng: 51.415 }, // Example coords
    category: 'medical',
    visible: true,
    lastUpdated: new Date().toISOString(),
  }
];

// Helper to create a GeoJSON FeatureCollection for a single polygon
const createPolygonFeatureCollection = (coordinates: number[][][]): FeatureCollection => ({
  type: "FeatureCollection",
  features: [{
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: coordinates,
    },
  }],
});

const sampleInitialAreas: Area[] = [
  {
    id: "sample-area-caution-1",
    name: "Sample Caution Zone",
    category: 'caution',
    geometry: createPolygonFeatureCollection([
      [
        [51.380, 35.710], [51.385, 35.710],
        [51.385, 35.715], [51.380, 35.715],
        [51.380, 35.710]
      ]
    ]),
    fillColor: "rgba(245, 158, 11, 0.4)", // amber-500 with opacity
    borderColor: "rgba(245, 158, 11, 0.8)",
  }
];

const sampleInitialRoutes: Route[] = [
  // {
  //     id: "sample-route-1",
  //     name: "Sample Evacuation Route Alpha",
  //     description: "Primary west-to-east evacuation path.",
  //     path: {
  //         type: "LineString",
  //         coordinates: [ [51.30, 35.70], [51.32, 35.71], [51.34, 35.705] ]
  //     },
  //     category: "evacuation", // Assuming Route type has a category
  //     lineColor: "#007bff",
  //     lineWidth: 3,
  // }
];

// Sample animated route (can be kept if used)
const sampleAnimatedRoute: LineString = {
  type: "LineString",
  coordinates: [
    [51.325, 35.715], [51.330, 35.720], [51.335, 35.722],
    [51.338, 35.723], [51.339, 35.7245], [51.340, 35.725],
  ],
};
// --- END OF SAMPLE DATA ---


// Helper to generate a simple UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
// Helper to generate numeric IDs for news items
function generateNumericId(existingItems: {id: number}[]): number {
  if (!existingItems || !existingItems.length) return 1;
  const numericIds = existingItems.map(item => Number(item.id)).filter(id => !isNaN(id));
  if (!numericIds.length) return 1;
  return Math.max(...numericIds) + 1;
}

const NEWS_UPDATED_EVENT = 'newsUpdated';

export default function HomePage() {
  // Initialize state: try localStorage first, then sample data, then empty array as last resort.
  const [landmarks, setLandmarks] = React.useState<Landmark[]>([]);
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [routes, setRoutes] = React.useState<Route[]>([]);
  const [currentNews, setCurrentNews] = React.useState<NewsItem[]>([]);

  const [isAddFormOpen, setIsAddFormOpen] = React.useState(false);
  const [isButtonActiveForAddInfo, setIsButtonActiveForAddInfo] = React.useState(false);

  const mapRef = React.useRef<MapRef>(null); // Keep for potential future map interactions

  // Load initial data from localStorage or use defined samples/empty arrays
  React.useEffect(() => {
    try {
      const storedLandmarks = localStorage.getItem('landmarks');
      setLandmarks(storedLandmarks ? JSON.parse(storedLandmarks) : sampleInitialLandmarks);
    } catch { setLandmarks(sampleInitialLandmarks); }

    try {
      const storedAreas = localStorage.getItem('areas');
      setAreas(storedAreas ? JSON.parse(storedAreas) : sampleInitialAreas);
    } catch { setAreas(sampleInitialAreas); }

    try {
      const storedRoutes = localStorage.getItem('routes');
      setRoutes(storedRoutes ? JSON.parse(storedRoutes) : sampleInitialRoutes);
    } catch { setRoutes(sampleInitialRoutes); }

    try {
      const storedNews = localStorage.getItem('newsItems');
      setCurrentNews(storedNews ? JSON.parse(storedNews) : initialStaticNewsItems);
    } catch { setCurrentNews(initialStaticNewsItems); }
  }, []);

  // Persist data to localStorage when it changes
  React.useEffect(() => { localStorage.setItem('landmarks', JSON.stringify(landmarks)); }, [landmarks]);
  React.useEffect(() => { localStorage.setItem('areas', JSON.stringify(areas)); }, [areas]);
  React.useEffect(() => { localStorage.setItem('routes', JSON.stringify(routes)); }, [routes]);
  React.useEffect(() => {
    localStorage.setItem('newsItems', JSON.stringify(currentNews));
    window.dispatchEvent(new CustomEvent(NEWS_UPDATED_EVENT));
  }, [currentNews]);


  const handleOpenAddInfoForm = () => {
    setIsAddFormOpen(true);
    setIsButtonActiveForAddInfo(true);
  };

  const handleAddLandmarkSubmit = (formData: NewLandmarkData) => {
    const newLandmark: Landmark = {
      id: generateUUID(),
      name: formData.name,
      description: formData.description,
      location: formData.location,
      category: formData.category,
      isVerified: false,
      trustLevel: 'medium',
      lastUpdated: new Date().toISOString(),
      addedBy: 'user',
      visible: true,
    };
    setLandmarks(prev => [newLandmark, ...prev].sort((a,b) => new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime()));


    const newNewsEntry: NewsItem = {
      id: generateNumericId(currentNews),
      tag: formData.category === 'danger_zone' || formData.category === 'medical' || formData.category === 'checkpoint' ? 'Alert' : 'Info',
      headline: `New Report: ${formData.name}`,
      description: formData.description || `A new '${formatCategoryName(formData.category)}' has been reported at Lat: ${formData.location.lat.toFixed(4)}, Lng: ${formData.location.lng.toFixed(4)}.`,
      datetime: new Date().toISOString(),
      location: formData.location,
      placeName: formData.name,
    };
    // Add to beginning and keep sorted by date (most recent first)
    setCurrentNews(prevNews => [newNewsEntry, ...prevNews].sort((a,b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime()));

    setIsAddFormOpen(false);
    setIsButtonActiveForAddInfo(false);
  };

  const formatCategoryName = (category: LandmarkCategory): string => {
    return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
      <>
        <InteractiveMap
            landmarks={landmarks}
            areas={areas}
            routes={routes}
            route={sampleAnimatedRoute} // Using the defined sample animated route
            mapRef={mapRef}
            onAddInfoButtonClickCallback={handleOpenAddInfoForm}
            isButtonActiveForAddInfo={isButtonActiveForAddInfo}
        />

        <AddLandmarkForm
            isOpen={isAddFormOpen}
            onOpenChange={(open) => {
              setIsAddFormOpen(open);
              if (!open) setIsButtonActiveForAddInfo(false);
            }}
            onSubmit={handleAddLandmarkSubmit}
        />
      </>
  );
}