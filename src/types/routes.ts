import type { LineString } from 'geojson';

/**
 * Represents a navigational route displayed on the map.
 */
export interface Route {
    /** Unique identifier for the route */
    id: string;
    /** Human-readable name of the route */
    name: string;
    /** Optional descriptive text */
    description?: string;
    /** GeoJSON LineString defining the path */
    path: LineString;
    /** Optional styling information */
    lineColor?: string;
    lineWidth?: number;
    /** Metadata fields */
    lastUpdated?: string; // ISO date string
    addedBy?: string;
}
