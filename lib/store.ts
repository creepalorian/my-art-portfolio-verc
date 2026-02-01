import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use a folder path for better organization and matching image behavior
const DATA_FILE_KEY = 'art-portfolio/data.json';
const PUBLIC_ID = 'art-portfolio/data.json'; // Public ID usually includes folder

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

export async function getDebugInfo() {
    // Generate URL for debugging
    const url = cloudinary.url(PUBLIC_ID, {
        resource_type: 'raw',
        secure: true
    });
    return { url, publicId: PUBLIC_ID };
}

export async function getArtworks(): Promise<Artwork[]> {
    try {
        const url = cloudinary.url(PUBLIC_ID, {
            resource_type: 'raw',
            secure: true
        });

        // Add cache busting
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
                    public_id: PUBLIC_ID,  // Explicitly set the public ID
                    resource_type: 'raw',
                    overwrite: true,
                    invalidate: true
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(error);
                    } else {
                        console.log('Saved data to Cloudinary:', result?.secure_url);
                        resolve(result);
                    }
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

export async function updateArtwork(id: string, updates: Partial<Artwork>): Promise<Artwork[]> {
    const artworks = await getArtworks();
    const index = artworks.findIndex(a => a.id === id);

    if (index === -1) {
        throw new Error('Artwork not found');
    }

    // Merge updates
    artworks[index] = { ...artworks[index], ...updates };

    await saveArtworks(artworks);
    return artworks;
}

export async function deleteArtwork(id: string): Promise<void> {
    const artworks = await getArtworks();
    const filtered = artworks.filter(a => a.id !== id);
    await saveArtworks(filtered);
}
