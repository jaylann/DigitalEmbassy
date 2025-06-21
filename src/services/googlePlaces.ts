import axios from 'axios';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_API_KEY || '';

export interface RawPlaceResult {
  name: string;
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
}

export async function getGermanEmbassiesNearby(city: string, country: string): Promise<RawPlaceResult[]> {
  const query = `German embassy near ${city}, ${country}`;
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    query
  )}&key=${GOOGLE_PLACES_API_KEY}`;

  try {
    const res = await axios.get(url);
    const data = res.data;
    if (data.status !== 'OK') {
      console.error('Google API error:', data.status);
      return [];
    }

    return (data.results as RawPlaceResult[]).map((place) => ({
      name: place.name,
      formatted_address: place.formatted_address,
      geometry: {
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
      },
      place_id: place.place_id,
    }));
  } catch (err) {
    console.error('Failed to fetch embassy data:', err);
    return [];
  }
}