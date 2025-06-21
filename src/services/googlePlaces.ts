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

async function searchGooglePlaces(query: string): Promise<RawPlaceResult[]> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.error("Google Places API Key is not configured.");
    return [];
  }

  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
  )}&key=${GOOGLE_PLACES_API_KEY}`;

  try {
    const res = await axios.get(url);
    const data = res.data;

    if (data.status === 'ZERO_RESULTS') {
      // console.log(`Google API: No results for query "${query}"`);
      return [];
    }
    if (data.status !== 'OK') {
      console.error(`Google API error for query "${query}":`, data.status, data.error_message || '');
      return [];
    }

    return data.results.map((place: any) => ({
      name: place.name,
      formatted_address: place.formatted_address,
      geometry: {
        location: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        },
      },
      place_id: place.place_id,
      types: place.types, // Store the types returned by Google
    }));
  } catch (err) {
    console.error(`Failed to fetch data for query "${query}":`, err);
    return [];
  }
}

export async function getGermanEmbassiesNearby(city: string, country: string): Promise<RawPlaceResult[]> {
  const query = `German embassy in ${city}, ${country}`; // Made slightly more specific
  return searchGooglePlaces(query);
}

export async function getGermanConsulatesNearby(city: string, country: string): Promise<RawPlaceResult[]> {
  const query = `German embassy in ${city}, ${country}`;
  return searchGooglePlaces(query);
}

export async function getGoetheInstitutes(city: string, country: string): Promise<RawPlaceResult[]> {
  const query = `Goethe Institut in ${city}, ${country}`;
  return searchGooglePlaces(query);
}