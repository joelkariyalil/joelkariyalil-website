export interface ImageMetadata {
  name: string;
  src: string;
  tags: string[];
  description?: string;
  date?: string;
  location?: string;
}

export interface ImageFilter {
  tags: string[];
  searchQuery: string;
} 