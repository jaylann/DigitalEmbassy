export interface Location {
    lat: number;
    lng: number;
}

export interface NewsItem {
    id: number;
    tag: string;
    headline: string;
    description: string;
    datetime: string; // ISO 8601 string format
    location?: Location; // Optional location for the news event
    placeName?: string;
}