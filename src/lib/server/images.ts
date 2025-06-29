import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import type { ImageMetadata } from '@/types/image';

// Read and parse the images.yaml file
export function getImageMetadata(): ImageMetadata[] {
  const filePath = path.join(process.cwd(), 'content', 'images.yaml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const data = yaml.parse(fileContents);
  return data.images;
}

// Get all unique tags from images
export function getAllImageTags(): string[] {
  const images = getImageMetadata();
  const tagSet = new Set<string>();
  
  images.forEach(image => {
    image.tags.forEach(tag => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

// Get image by filename
export function getImageByFilename(filename: string): ImageMetadata | null {
  const images = getImageMetadata();
  const image = images.find(img => img.src.endsWith(`/${filename}`));
  return image || null;
} 