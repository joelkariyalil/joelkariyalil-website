import type { ImageMetadata, ImageFilter } from '@/types/image';

// Filter images based on tags and search query
export function filterImages(images: ImageMetadata[], filter: ImageFilter): ImageMetadata[] {
  return images.filter(image => {
    // Filter by tags if any are selected
    if (filter.tags.length > 0 && !filter.tags.every(tag => image.tags.includes(tag))) {
      return false;
    }

    // Filter by search query if provided
    if (filter.searchQuery) {
      const searchLower = filter.searchQuery.toLowerCase();
      return (
        image.name.toLowerCase().includes(searchLower) ||
        image.description?.toLowerCase().includes(searchLower) ||
        image.location?.toLowerCase().includes(searchLower) ||
        image.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    return true;
  });
} 