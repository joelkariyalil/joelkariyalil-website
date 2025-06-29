import Image from 'next/image';
import Layout from '@/components/Layout';

interface Photo {
  id: string;
  src: string;
  width: number;
  height: number;
}

export default function ClicksPage() {
  // Using local images from public directory
  const photos: Photo[] = Array.from({ length: 30 }, (_, i) => ({
    id: String(i + 1),
    src: `/images/clicks/${i + 1}.jpg`,
    width: 800,
    height: 600,
  }));

  // Function to generate random sizes for the collage
  const getRandomSize = () => {
    // Just vary the container size, maintain aspect ratio
    const sizes = ['regular', 'large'];
    return sizes[Math.floor(Math.random() * sizes.length)];
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold mb-8">Clicks</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map((photo) => {
            const size = getRandomSize();
            return (
              <div
                key={photo.id}
                className={`relative aspect-[4/3] ${
                  size === 'large' ? 'sm:col-span-2' : ''
                } transition-transform duration-300 hover:scale-[1.02]`}
              >
                <Image
                  src={photo.src}
                  alt={`Photo ${photo.id}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover rounded-lg"
                  priority={parseInt(photo.id) <= 4}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
} 