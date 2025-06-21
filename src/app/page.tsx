// src/app/page.tsx
"use client";

import * as React from "react";
import { MapRef, MapLayerMouseEvent } from "react-map-gl/maplibre";
import type { FeatureCollection, LineString } from "geojson";
import { InteractiveMap } from "@/components/interactive-map"; // Path to your InteractiveMap
import type { Area } from "@/types/areas";
import { Landmark, Location as LandmarkLocation, LandmarkCategory } from "@/lib/types"; // Ensure correct path
import defaultLandmarks from "../../data/landmarks.json"; // Path to your JSON data
import defaultAreas from "../../data/areas.json";   // Path to your JSON data

// Import the form for adding landmarks
import { AddLandmarkForm, NewLandmarkData } from "@/components/add-landmark-form"; // Adjust path if needed
// Marker for temporary pin
import { Marker } from "react-map-gl/maplibre";
import { MapPin } from "lucide-react";


// Example restriction zones (from your original page.tsx)
const restrictionZone: FeatureCollection = {
  type: "FeatureCollection",
  features: [ /* ... your restriction zone features ... */
    {
      type: "Feature",
      properties: { name: "No‑Go Zone" },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [51.33, 35.70], [51.33, 35.745], [51.35, 35.75],
            [51.355, 35.72], [51.345, 35.695], [51.33, 35.70]
          ]
        ]
      }
    },
  ]
};
const sampleRoute: LineString = {  /* ... your sampleRoute data ... */
  type: "LineString",
  coordinates: [
    [51.325, 35.715], [51.330, 35.720], [51.335, 35.722],
    [51.338, 35.723], [51.339, 35.7245], [51.340, 35.725],
  ],
};

// Helper to generate a simple UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function HomePage() {
  const [landmarks, setLandmarks] = React.useState<Landmark[]>([]);
  const [areas, setAreas] = React.useState<Area[]>([]);

  // State for "Add Info" functionality
  const [isAddingInfoMode, setIsAddingInfoMode] = React.useState(false);
  const [tempClickedCoords, setTempClickedCoords] = React.useState<LandmarkLocation | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = React.useState(false);

  const mapRef = React.useRef<MapRef>(null);

  // Load initial data (from your original page.tsx)
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

  // Persist data (from your original page.tsx)
  React.useEffect(() => {
    if (landmarks.length || localStorage.getItem('landmarks')) { // Persist even if cleared to empty array
      localStorage.setItem('landmarks', JSON.stringify(landmarks));
    }
  }, [landmarks]);

  React.useEffect(() => {
    if (areas.length || localStorage.getItem('areas')) { // Persist even if cleared
      localStorage.setItem('areas', JSON.stringify(areas));
    }
  }, [areas]);

  // Function to toggle "Add Info" mode
  const toggleAddInfoMode = () => {
    setIsAddingInfoMode(prevMode => {
      const newMode = !prevMode;
      if (!newMode) { // If exiting add mode
        setTempClickedCoords(null);
        setIsAddFormOpen(false);
      }
      return newMode;
    });
  };

  // Unified map click handler passed to InteractiveMap
  const handleMapInteractionClick = (event: MapLayerMouseEvent) => {
    if (isAddingInfoMode) {
      setTempClickedCoords({ lng: event.lngLat.lng, lat: event.lngLat.lat });
      // Don't open form immediately from map click. User clicks temp pin.
    } else {
      // InteractiveMap handles its own AreaPopup logic based on its interactiveLayerIds
      // If HomePage needed to react to other clicks, logic would go here.
      console.log("HomePage: Map clicked (not in add mode)", event.lngLat);
    }
  };

  // Handler for when the temporary "Add here?" pin is clicked
  const handleTemporaryMarkerClick = () => {
    if (tempClickedCoords) {
      setIsAddFormOpen(true); // Open the form
    }
  };

  // Handler for submitting the new landmark form
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
    setLandmarks(prev => [...prev, newLandmark]);
    toggleAddInfoMode(); // Exit add mode and clear temp states
  };

  // Your original addLandmark and addArea for dev testing can be re-added here if needed
  // const addLandmark = () => { /* ... */ };
  // const addArea = () => { /* ... */ };

  return (
      <>
        <InteractiveMap
            landmarks={landmarks}
            areas={areas}
            route={sampleRoute}
            mapRef={mapRef}
            isAddingInfoMode={isAddingInfoMode}
            onMapInteractionClick={handleMapInteractionClick}
            temporaryMarkerLocation={tempClickedCoords}
            onTemporaryMarkerClick={handleTemporaryMarkerClick}
            onAddInfoButtonClickCallback={toggleAddInfoMode}
        />

        {isAddingInfoMode && tempClickedCoords && !isAddFormOpen && (
            <Marker longitude={tempClickedCoords.lng} latitude={tempClickedCoords.lat} anchor="bottom">
              <div
                  className="flex flex-col items-center cursor-pointer p-2 bg-background rounded-md shadow-lg hover:bg-muted"
                  onClick={handleTemporaryMarkerClick}
              >
                <MapPin className="h-8 w-8 text-primary animate-pulse" />
                <span className="text-xs text-foreground mt-1">Add to this location?</span>
              </div>
            </Marker>
        )}

        <AddLandmarkForm
            isOpen={isAddFormOpen}
            onOpenChange={(open) => {
              setIsAddFormOpen(open);
              if (!open && isAddingInfoMode) {
                // If form is cancelled while still in add mode, keep temp pin
              } else if (!open) { // Form closed and not in add mode (or submitted)
                setTempClickedCoords(null);
              }
            }}
            onSubmit={handleAddLandmarkSubmit}
            clickedCoordinates={tempClickedCoords}
        />
      </>
  );
}