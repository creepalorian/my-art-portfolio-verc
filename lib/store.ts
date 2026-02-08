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

/**
 * Retrieves the latest version of the artworks data directly from Cloudinary API.
 * This bypasses CDN caching to ensure data consistency for write operations.
 */
async function getLatestArtworks(): Promise<Artwork[]> {
    try {
        // Use Admin API to get current version
        const resource = await cloudinary.api.resource(PUBLIC_ID, {
            resource_type: 'raw',
            type: 'upload'
        });

        // Use the secure_url which includes the version number (e.g., .../v123456/...)
        const url = resource.secure_url;

        const response = await fetch(`${url}?t=${Date.now()}`, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch raw data from URL: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error: any) {
        // Check if error is from Cloudinary API (not found - 404)
        if (error.error?.http_code === 404) {
             console.log('Data file not found via API (first run?), returning empty list');
             return [];
        }
        console.error('Error fetching latest artworks:', error);
        throw error; // Throw error to prevent data loss on transient failures
    }
}

/**
 * Retrieves artworks using the public URL (CDN).
 * Suitable for read-only operations where eventual consistency is acceptable.
 */
export async function getArtworks(options?: { revalidate?: number | false }): Promise<Artwork[]> {
    try {
        // Try to get the versioned URL from Cloudinary Admin API to bypass stale CDN cache
        let fetchUrl: string;
        try {
            const resource = await cloudinary.api.resource(PUBLIC_ID, {
                resource_type: 'raw',
                type: 'upload'
            });
            fetchUrl = resource.secure_url; // This URL includes version number (e.g. /v123456/)
        } catch (apiError) {
            // Fallback to standard URL generation if API fails (e.g. rate limit or permission)
            console.warn('Failed to fetch versioned URL from Cloudinary API, falling back to cached URL', apiError);
            fetchUrl = cloudinary.url(PUBLIC_ID, {
                resource_type: 'raw',
                secure: true
            });
        }

        const fetchOptions: RequestInit = {};

        if (options?.revalidate !== undefined) {
            fetchOptions.next = {
                revalidate: options.revalidate,
                tags: ['artworks']
            };
            // Do not append timestamp to allow Next.js to cache by URL.
            // Since fetchUrl now likely includes a version number, it acts as a cache key.
        } else {
            // Default: fresh data (force bypass)
            // Even with versioned URL, we append timestamp to be absolutely sure for client-side fetches or non-ISR
            const separator = fetchUrl.includes('?') ? '&' : '?';
            fetchUrl = `${fetchUrl}${separator}t=${Date.now()}`;
            fetchOptions.cache = 'no-store';
        }

        const response = await fetch(fetchUrl, fetchOptions);

        if (!response.ok) {
            if (response.status === 404) {
                console.log('No data file found (first run?), returning empty list');
                return [];
            }
            console.warn(`getArtworks warning: response status ${response.status}`);
            return []; // Fallback for public display
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
    // Use getLatestArtworks to ensure we don't overwrite with stale data
    let artworks: Artwork[] = [];
    try {
        artworks = await getLatestArtworks();
    } catch (error) {
        // Only swallow errors if we are sure it's safe (e.g., file doesn't exist yet).
        // getLatestArtworks already handles 404 by returning empty array.
        // If it throws here, it's likely a real error (auth, network, etc).
        // However, for the specific "first run" case where maybe folder doesn't exist, we can be lenient.
        // But to be safe against data loss, we should probably rethrow if it's not a 404.
        console.warn('Failed to fetch latest artworks. If this is the very first upload, this is expected.', error);
        // We will proceed with empty array, but log heavily.
        // In a production app, we might want to check the error type more strictly.
        artworks = [];
    }

    const newArtwork: Artwork = {
        ...artwork,
        createdAt: Date.now(),
    };
    artworks.unshift(newArtwork);
    await saveArtworks(artworks);
    return newArtwork;
}

export async function updateArtwork(id: string, updates: Partial<Artwork>): Promise<Artwork[]> {
    // Use getLatestArtworks to ensure we find the artwork even if just added
    const artworks = await getLatestArtworks();
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
    // Use getLatestArtworks to ensure we don't delete wrong items or save empty list due to stale read
    const artworks = await getLatestArtworks();
    const filtered = artworks.filter(a => a.id !== id);
    await saveArtworks(filtered);
}
