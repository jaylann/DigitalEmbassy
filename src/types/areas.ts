export type AreaCategory = 'no_go' | 'caution' | 'safe';

export interface Area {
    id: string;
    name: string;
    geometry: GeoJSON.FeatureCollection;
    category: AreaCategory;
    fillColor?: string;
    borderColor?: string;
}
