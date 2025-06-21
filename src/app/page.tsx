// src/app/page.tsx
"use client";

import * as React from "react";
import {MapLayerMouseEvent, MapRef} from "react-map-gl/maplibre";
import { FeatureCollection as GeoJsonFeatureCollection } from 'geojson'; // Import for Area geometry

import { InteractiveMap } from "@/components/interactive-map";
import { AddInfoButton } from "@/components/add-info-button";
import { AddLandmarkForm, NewLandmarkData } from "@/components/add-landmark-form";
import { Landmark, Location as LandmarkLocation, LandmarkCategory } from "@/types/landmarks";
import { Area, AreaCategory } from "@/types/areas";

// --- INLINE SAMPLE DATA ---

const initialAppLandmarks: Landmark[] = [
  {
    id: 'lm-001-embassy-sample',
    name: 'Deutsche Botschaft (Beispiel)',
    description: 'Wichtiger Anlaufpunkt für deutsche Staatsbürger.',
    location: { lat: 35.7219, lng: 51.4215 }, // Example: Tehran
    category: 'safe_space',
    isVerified: true,
    trustLevel: 'high',
    lastUpdated: '2024-05-15T10:00:00Z',
    addedBy: 'system_initial',
    visible: true,
  },
  {
    id: 'lm-002-medical-sample',
    name: 'Feldlazarett Alpha (Beispiel)',
    description: 'Medizinische Erstversorgung.',
    location: { lat: 35.7050, lng: 51.4000 }, // Example: Tehran
    category: 'medical',
    isVerified: false,
    trustLevel: 'medium',
    lastUpdated: '2024-05-28T12:00:00Z',
    addedBy: 'user_report_123',
    visible: true,
  },
  {
    id: 'lm-003-checkpoint-sample',
    name: 'Kontrollpunkt West (Beispiel)',
    location: { lat: 35.6900, lng: 51.3800 }, // Example: Tehran
    category: 'checkpoint',
    visible: true,
  }
];

// Helper to create a GeoJSON FeatureCollection for a single polygon
const createPolygonFeatureCollection = (coordinates: number[][][]): GeoJsonFeatureCollection => ({
  type: "FeatureCollection",
  features: [{
    type: "Feature",
    properties: {}, // Can be empty if all props are in the Area interface
    geometry: {
      type: "Polygon",
      coordinates: coordinates,
    },
  }],
});

const exampleAreas: Area[] = [
  {
    id: "area-no-go-sample-1",
    name: "Sperrzone Marktviertel",
    category: 'no_go',
    geometry: createPolygonFeatureCollection([ // Outer ring
      [ // Must be an array of linear rings
        [51.420, 35.688], [51.425, 35.688],
        [51.425, 35.692], [51.420, 35.692],
        [51.420, 35.688] // Close the polygon
      ]
    ]),
    // fillColor and borderColor will use category defaults in InteractiveMap if not specified here
  },
  {
    id: "area-caution-sample-1",
    name: "Vorsicht: Regierungsgebäude Umgebung",
    category: 'caution',
    geometry: createPolygonFeatureCollection([
      [
        [51.380, 35.710], [51.385, 35.710],
        [51.385, 35.715], [51.380, 35.715],
        [51.380, 35.710]
      ]
    ]),
    fillColor: "rgba(255, 193, 7, 0.4)", // Custom yellow caution
    borderColor: "rgba(255, 193, 7, 1)",
  },
];

// --- END OF INLINE SAMPLE DATA ---


// Helper to generate a simple UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function HomePage(): React.ReactElement {
  const [allAppLandmarks, setAllAppLandmarks] = React.useState<Landmark[]>(initialAppLandmarks);
  const [areas, setAreas] = React.useState<Area[]>(exampleAreas);

  const [isAddingInfoMode, setIsAddingInfoMode] = React.useState(false);
  const [tempClickedCoords, setTempClickedCoords] = React.useState<LandmarkLocation | null>(null);
  const [isAddFormOpen, setIsAddFormOpen] = React.useState(false);

  const mapRef = React.useRef<MapRef>(null);

  const toggleAddInfoMode = () => {
    setIsAddingInfoMode(prevMode => {
      const newMode = !prevMode;
      if (!newMode) {
        setTempClickedCoords(null);
        setIsAddFormOpen(false);
        if (mapRef.current) mapRef.current.getMap().getCanvas().style.cursor = '';
      } else {
        if (mapRef.current) mapRef.current.getMap().getCanvas().style.cursor = 'crosshair';
      }
      return newMode;
    });
  };

  const handleMapClickInAddMode = (coords: LandmarkLocation) => {
    setTempClickedCoords(coords);
    setIsAddFormOpen(true);
  };

  const handleTemporaryMarkerClick = () => {
    if (tempClickedCoords) {
      setIsAddFormOpen(true);
    }
  };

  const handleActualMapClick = (event: MapLayerMouseEvent) => {
    if (isAddingInfoMode) {
      // Extract lng and lat from the event object
      const coords: LandmarkLocation = {
        lng: event.lngLat.lng,
        lat: event.lngLat.lat
      };
      setTempClickedCoords(coords);
      setIsAddFormOpen(true);
    } else {
      console.log("HomePage: Map clicked (not in add mode). Full event:", event);
      console.log("Coordinates:", event.lngLat);
      // Potentially handle clicks on existing features for popups, etc.
      const features = mapRef.current?.getMap().queryRenderedFeatures(event.point, {
        // layers: ['your-interactive-layer-id1', 'your-interactive-layer-id2']
      });
      if (features?.length) {
        console.log("Clicked feature:", features[0].properties);
        // Example: Open a popup for this feature
      }
    }

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
      addedBy: "currentUser",
      visible: true,
    };
    setAllAppLandmarks(prevLandmarks => [...prevLandmarks, newLandmark]);
    setIsAddingInfoMode(false);
    setTempClickedCoords(null);
    setIsAddFormOpen(false);
    if (mapRef.current) mapRef.current.getMap().getCanvas().style.cursor = '';
    console.log("New Landmark to be persisted:", newLandmark);
  };

  // @ts-ignore
    return (
      <main className="relative h-screen w-screen overflow-hidden bg-black">
        <InteractiveMap
            mapRef={mapRef}
            landmarks={allAppLandmarks}
            areas={areas}
            isAddingInfoMode={isAddingInfoMode}
            onMapClick={handleMapClickInAddMode}
            temporaryMarkerLocation={tempClickedCoords}
            onTemporaryMarkerClick={handleTemporaryMarkerClick}
        />

        <div className="absolute bottom-4 right-4 z-30 pointer-events-none">
          <AddInfoButton onClick={toggleAddInfoMode} isActive={isAddingInfoMode} />
        </div>

        <AddLandmarkForm
            isOpen={isAddFormOpen}
            onOpenChange={(open) => {
              setIsAddFormOpen(open);
              if (!open) {
                if (!isAddingInfoMode || !tempClickedCoords) {
                  setTempClickedCoords(null);
                }
              }
            }}
            onSubmit={handleAddLandmarkSubmit}
            clickedCoordinates={tempClickedCoords}
        />
      </main>
  );
}