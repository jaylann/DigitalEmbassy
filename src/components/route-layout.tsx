/**
 * Experimental map view showing a sample route layer.
 */

'use client';
import { useState, useEffect } from 'react';
import Map, { Source, Layer } from 'react-map-gl/maplibre'; // works identically with Mapbox
import 'maplibre-gl/dist/maplibre-gl.css';
import * as GeoJSON from 'geojson';

export default function RouteLayer() {
    const [routeGeoJSON, setRoute] = useState<GeoJSON.FeatureCollection | null>(null);

    useEffect(() => {
        (async () => {
            // WKT polygon for the Berlin low-emission zone
            const noGo = 'POLYGON((13.376 52.513,13.454 52.513,13.454 52.55,13.376 52.55,13.376 52.513))';

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_OSRM}/route/v1/driving/13.37,52.52;13.46,52.53` +
                `?overview=full&geometries=geojson&obstacles=${encodeURIComponent(noGo)}`
            );
            const json = await res.json();
            setRoute(json.routes[0].geometry);
        })();
    }, []);

    return (
        <Map
            initialViewState={{ longitude: 13.42, latitude: 52.52, zoom: 12 }}
            mapStyle="https://demotiles.maplibre.org/style.json" // or any Mapbox style
        >
            {routeGeoJSON && (
                <Source id="route" type="geojson" data={routeGeoJSON}>
                    <Layer
                        id="route-line"
                        type="line"
                        paint={{ 'line-width': 5, 'line-color': '#2563EB' }}
                    />
                </Source>
            )}
        </Map>
    );
}
