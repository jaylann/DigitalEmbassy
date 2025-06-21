export type LandmarkCategory =
    | 'safe_space'
    | 'dangerous_spot'
    | 'communication'
    | 'trusted_contact'
    | 'medical'
    | 'checkpoint';

export interface Location {
    lat: number;
    lng: number;
}

export interface Landmark {
    id: string; // UUID or hash
    name: string;
    description?: string;
    location: Location;
    category: LandmarkCategory;

    // Optional metadata
    trustLevel?: 'high' | 'medium' | 'low'; // for crowd-sourced updates
    lastUpdated?: string; // ISO date string
    addedBy?: string; // public key or user id
    isVerified?: boolean; // for trusted sources
    visible?: boolean; // for toggling local visibility
}