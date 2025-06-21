"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPlaceToLandmark = convertPlaceToLandmark;
function convertPlaceToLandmark(place) {
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
