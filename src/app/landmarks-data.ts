import { Landmark, LandmarkCategory } from '@/types/landmarks'; // Adjust the path if your types are elsewhere

// This is an array of predefined Landmark objects.
// In a real application, this data might come from a CMS, a database,
// or be curated by administrators. For this example, it's hardcoded.

export const predefinedLandmarks: Landmark[] = [
    {
        id: 'lm-001-embassy-teh', // Unique ID (e.g., UUID or a descriptive hash)
        name: 'Deutsche Botschaft Teheran',
        description: 'Offizielle Vertretung Deutschlands im Iran. Bietet konsularische Dienste und Nothilfe für deutsche Staatsbürger.',
        location: { lat: 35.7219, lng: 51.4215 }, // Coordinates: Latitude, Longitude
        category: 'safe_space', // From your LandmarkCategory enum
        isVerified: true,
        trustLevel: 'high',
        lastUpdated: '2024-05-01T10:00:00Z', // ISO 8601 Date string
        addedBy: 'official_source',
        visible: true,
    },
    {
        id: 'lm-002-hospital-pars',
        name: 'Pars Hospital (Teheran)',
        description: 'Privatkrankenhaus mit Notaufnahme und internationaler Abteilung.',
        location: { lat: 35.7093, lng: 51.3934 },
        category: 'medical',
        isVerified: true,
        trustLevel: 'high',
        lastUpdated: '2024-04-15T12:30:00Z',
        visible: true,
    },
    {
        id: 'lm-003-checkpoint-north',
        name: 'Checkpoint Nord (Evakuierungsroute)',
        description: 'Wichtiger Kontrollpunkt auf der nördlichen Evakuierungsroute. Kann zeitweise überlastet sein.',
        location: { lat: 35.7500, lng: 51.4100 },
        category: 'checkpoint',
        isVerified: false, // Could be less verified if it's a dynamic point
        trustLevel: 'medium',
        lastUpdated: '2024-05-20T08:00:00Z',
        addedBy: 'user_report_xyz',
        visible: true,
    },
    {
        id: 'lm-004-danger-zone-market',
        name: 'Basarbereich (Gefahrenzone)',
        description: 'Zone mit erhöhter Instabilität und unübersichtlicher Sicherheitslage. Meiden empfohlen.',
        // For a 'danger_zone', the location might represent a central point,
        // but ideally, 'danger_zone' would be a Polygon, not a Point.
        // If your Landmark type only supports Point locations, this is how you'd represent its center.
        location: { lat: 35.6892, lng: 51.4200 },
        category: 'danger_zone',
        isVerified: true,
        trustLevel: 'high',
        lastUpdated: '2024-05-29T14:00:00Z',
        visible: true,
    },
    {
        id: 'lm-005-satellite-phone-hotel',
        name: 'Satellitentelefon (Hotel Espinas)',
        description: 'Öffentlich zugängliches Satellitentelefon im Notfall, ggf. gegen Gebühr.',
        location: { lat: 35.7610, lng: 51.4020 },
        category: 'satellite_phone',
        isVerified: false,
        trustLevel: 'medium',
        lastUpdated: '2024-03-10T17:00:00Z',
        visible: true,
    },
    {
        id: 'lm-006-trusted-contact-shop',
        name: 'Vertrauensperson Ahmed (Teppichladen)',
        description: 'Ahmed spricht Deutsch und Englisch, kann in Notlagen eventuell weiterhelfen. Diskretion wahren.',
        location: { lat: 35.7000, lng: 51.4250 },
        category: 'trusted_contact',
        isVerified: false,
        trustLevel: 'low', // Example of a less verified, user-contributed contact
        lastUpdated: '2024-05-05T09:20:00Z',
        addedBy: 'user_report_abc',
        visible: true,
    },
    {
        id: 'lm-007-hidden-medical-clinic',
        name: 'Versteckte medizinische Versorgung',
        description: 'Nur für absolute Notfälle, wenn offizielle Stellen nicht erreichbar sind.',
        location: { lat: 35.7150, lng: 51.3850 },
        category: 'medical',
        isVerified: false,
        trustLevel: 'medium',
        lastUpdated: '2024-05-18T22:00:00Z',
        addedBy: 'trusted_source_internal',
        visible: false, // Example of a landmark that is initially not visible on the map
    }
    // Add more predefined landmarks as needed
];