// src/utils/landmarkAdapter.ts
import { RawPlaceResult } from '../services/googlePlaces';
import { Landmark } from '../types/landmarks';

export function convertPlaceToLandmark(place: RawPlaceResult): Landmark {
    return {
        id: place.place_id,
        name: place.name,
        location: {
            lat: place.geometry.location.lat,
            lng: place.geometry.location.lng
        },
        category: 'trusted_contact',
        description: place.formatted_address,
        trustLevel: 'high',
        isVerified: true,
        lastUpdated: new Date().toISOString()
    };
}