import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const DATA_FILE_KEY = 'art-portfolio-data.json';

export interface Artwork {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    medium: string;
    date: string;
    dimensions: string;
    createdAt: number;
}

export async function getArtworks(): Promise<Artwork[]> {
    try {
        // Construct the URL for the raw file
        const url = cloudinary.url(DATA_FILE_KEY, {
            resource_type: 'raw',
            secure: true
        });

        // Add a cache-busting timestamp to prevent caching issues
        const response = await fetch(`${url}?t=${Date.now()}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            console.log('No data file found (first run?), returning empty list');
            return [];
        }

        return await response.json();
    } catch (error) {
        console.error('Error reading data from Cloudinary:', error);
        return [];
    }
}

export async function saveArtworks(artworks: Artwork[]): Promise<void> {
    try {
        const jsonString = JSON.stringify(artworks, null, 2);
        const buffer = Buffer.from(jsonString);

        await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    public_id: DATA_FILE_KEY,
                    resource_type: 'raw',
                    overwrite: true,
                    invalidate: true // Important to clear CDN cache
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });
    } catch (error) {
        console.error('Error saving data to Cloudinary:', error);
        throw error;
    }
}

export async function addArtwork(artwork: Omit<Artwork, 'createdAt'>): Promise<Artwork> {
    const artworks = await getArtworks();
    const newArtwork: Artwork = {
        ...artwork,
        createdAt: Date.now(),
    };
    artworks.unshift(newArtwork);
    await saveArtworks(artworks);
    return newArtwork;
}

export async function deleteArtwork(id: string): Promise<void> {
    const artworks = await getArtworks();
    const filtered = artworks.filter(a => a.id !== id);
    await saveArtworks(filtered);
}
