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
    featured?: boolean;
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

async function getStoreArtworks(): Promise<Artwork[]> {
    console.log('Fetching store artworks...');
    try {
        // Use Admin API to check existence and get latest version URL
        // This bypasses CDN cache but requires Admin API permissions
        const resource = await cloudinary.api.resource(PUBLIC_ID, {
            resource_type: 'raw'
        });

        console.log('Admin API resource found:', resource.secure_url);

        // resource.secure_url should be the versioned URL
        const response = await fetch(resource.secure_url, { cache: 'no-store' });

        if (!response.ok) {
             throw new Error(`Failed to fetch content: ${response.statusText}`);
        }

        return await response.json();
    } catch (error: any) {
        // Check if resource not found (404)
        if (error?.http_code === 404 || error?.message?.includes('not found') || error?.error?.http_code === 404) {
            console.log('Store file not found (404), returning empty list.');
            return [];
        }

        console.warn('Admin API failed or blocked, attempting fallback to CDN fetch...', error.message);

        // Fallback: Fetch directly from CDN with cache-busting
        // This is less robust against CDN caching but works if Admin API is restricted
        try {
             const url = cloudinary.url(PUBLIC_ID, {
                resource_type: 'raw',
                secure: true
            });
            const fallbackResponse = await fetch(`${url}?t=${Date.now()}`, {
                cache: 'no-store'
            });

            if (fallbackResponse.ok) {
                console.log('Fallback fetch succeeded.');
                return await fallbackResponse.json();
            } else if (fallbackResponse.status === 404) {
                 console.log('Fallback fetch returned 404, returning empty list.');
                 return [];
            }

             console.error('Fallback fetch failed with status:', fallbackResponse.status);
        } catch (fallbackError) {
             console.error('Fallback fetch threw error:', fallbackError);
        }

        // If both fail, re-throw the original error to be safe
        console.error('All fetch attempts failed. Original error:', error);
        throw error;
    }
}

export async function saveArtworks(artworks: Artwork[]): Promise<void> {
    try {
        const jsonString = JSON.stringify(artworks, null, 2);
        const buffer = Buffer.from(jsonString);

        await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    public_id: PUBLIC_ID,
                    resource_type: 'raw',
                    overwrite: true,
                    // removed invalidate: true to avoid potential permission issues
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        reject(new Error(error.message || 'Cloudinary upload failed'));
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
    const artworks = await getStoreArtworks();
    const newArtwork: Artwork = {
        ...artwork,
        createdAt: Date.now(),
    };
    artworks.unshift(newArtwork);
    await saveArtworks(artworks);
    return newArtwork;
}

export async function updateArtwork(id: string, updates: Partial<Artwork>): Promise<Artwork[]> {
    const artworks = await getStoreArtworks();
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
    const artworks = await getStoreArtworks();
    const filtered = artworks.filter(a => a.id !== id);
    await saveArtworks(filtered);
}
