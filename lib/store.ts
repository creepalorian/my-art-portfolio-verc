import fs from 'fs/promises';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

export interface Artwork {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    createdAt: number;
}

export async function getArtworks(): Promise<Artwork[]> {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading data file:', error);
        return [];
    }
}

export async function saveArtworks(artworks: Artwork[]): Promise<void> {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(artworks, null, 2));
    } catch (error) {
        console.error('Error writing data file:', error);
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
