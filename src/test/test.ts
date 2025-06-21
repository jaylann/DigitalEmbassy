import { getGermanEmbassiesNearby } from '../services/googlePlaces';
import { convertPlaceToLandmark } from '../utils/landmarkAdapters';
import * as dotenv from 'dotenv'; 

dotenv.config(); // Loads API key from .env

async function test() {
    try {
        const raw = await getGermanEmbassiesNearby('Nairobi', 'Kenya');
        const landmarks = raw.map(function (place) {
            return convertPlaceToLandmark(place);
        });
        console.log(landmarks);
    } catch (err) {
        console.error('Error fetching embassies:', err);
    }
}

test();