export type AreaCategory = 'no_go' | 'caution' | 'safe';

import type { FeatureCollection, Feature } from 'geojson';

export interface Area {
    id: string;
    name: string;
    /**
     * GeoJSON geometry describing this area. Allows a single Feature or a
     * FeatureCollection so both simple and complex shapes can be used.
     */
    geometry: FeatureCollection | Feature;
    category: AreaCategory;
    /** Optional custom colors to override the category defaults */
    fillColor?: string;
    borderColor?: string;
}
