import { useState, useMemo } from 'react';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { filterImages } from '@/lib/images';
import { getAllImageTags, getImageMetadata } from '@/lib/server/images';
import type { ImageMetadata } from '@/types/image';
import { GetStaticProps } from 'next';

interface ClicksPageProps {
  allTags: string[];
  images: ImageMetadata[];
}

export default function ClicksPage({ allTags, images }: ClicksPageProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter images based on selected tags and search query
  const filteredImages = useMemo<ImageMetadata[]>(() => {
    return filterImages(images, {
      tags: selectedTags,
      searchQuery: searchQuery,
    });
  }, [images, selectedTags, searchQuery]);

  // Function to toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Function to generate random sizes for the collage
  const getRandomSize = () => {
    const sizes = ['regular', 'large'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Clicks</h1>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter
          </button>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image) => {
                const size = getRandomSize();
                return (
                  <div
                    key={image.src}
                    className={`group relative aspect-[4/3] ${
                      size === 'large' ? 'sm:col-span-2' : ''
                    } transition-transform duration-300 hover:scale-[1.02]`}
                  >
                    <Image
                      src={image.src}
                      alt={image.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover rounded-lg"
                      priority={image.src.includes('1.jpg') || image.src.includes('2.jpg')}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 rounded-lg" />
                    <div className="absolute inset-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                      <h3 className="text-lg font-semibold">{image.name}</h3>
                      {image.location && (
                        <p className="text-sm">{image.location}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {image.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-medium bg-white/20 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Panel */}
          <div
            className={`fixed right-0 top-0 bottom-0 w-80 bg-white border-l border-gray-200 p-6 transform transition-transform duration-300 ease-in-out ${
              isFilterOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            style={{ marginTop: '64px' }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search images..."
              />
            </div>

            {/* Tags Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
              <div className="space-y-2">
                {allTags.map((tag) => (
                  <label key={tag} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => toggleTag(tag)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">{tag}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const allTags = getAllImageTags();
  const images = getImageMetadata();

  return {
    props: {
      images,
      allTags,
    },
  };
}; 