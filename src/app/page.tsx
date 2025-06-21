"use client";
import Map, { Source, Layer } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { FeatureCollection } from "geojson";

// Retrieve MapTiler key: prioritize .env.local, then primary env, then fallback
const MAPTILER_KEY =
  process.env.NEXT_PUBLIC_MAPTILER_KEY_LOCAL ??
  process.env.NEXT_PUBLIC_MAPTILER_KEY

// 🔴 Example restriction zone (Berlin LEZ rectangle)
const restrictionZone: FeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            properties: { name: "No‑Go" },
            geometry: {
                type: "Polygon",
                coordinates: [
                    [
                        [13.376, 52.513],
                        [13.454, 52.513],
                        [13.454, 52.55],
                        [13.376, 52.55],
                        [13.376, 52.513]
                    ]
                ]
            }
        }
    ]
};

export default function Home() {
    return (
        <Map
            initialViewState={{ longitude: 13.405, latitude: 52.53, zoom: 12 }}
            mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
            style={{ position: "fixed", inset: 0 }}
        >
            {/* 🛑 Restriction zone overlay */}
            <Source id="zone-source" type="geojson" data={restrictionZone}>
                <Layer
                    id="zone-fill"
                    type="fill"
                    paint={{ "fill-color": "#DC2626", "fill-opacity": 0.25 }}
                />
                <Layer
                    id="zone-outline"
                    type="line"
                    paint={{ "line-color": "#DC2626", "line-width": 2 }}
                />
            </Source>
        </Map>
    );
}
