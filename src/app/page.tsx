"use client";
import Map from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY ?? "INSERT_YOUR_KEY";
export default function Home() {
  return (
      <Map
          initialViewState={{ longitude: 13.405, latitude: 52.52, zoom: 11 }}
          mapStyle={`https://api.maptiler.com/maps/streets-v2/style.json?key=${MAPTILER_KEY}`}
          style={{ position: "fixed", inset: 0 }}
      />
  );
}
