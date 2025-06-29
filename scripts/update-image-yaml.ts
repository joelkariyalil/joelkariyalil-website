import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import exifr from 'exifr';

interface ImageMetadata {
  name: string;
  src: string;
  tags: string[];
  description: string;
  date: string;
  location: string;
}

async function getImageMetadata(imagePath: string): Promise<ImageMetadata> {
  // Extract EXIF data if available
  let exif;
  try {
    exif = await exifr.parse(imagePath);
  } catch (e) {
    console.warn(`Could not read EXIF data for ${imagePath}`);
  }

  // Generate a readable name from the filename
  const filename = path.basename(imagePath);
  const nameWithoutExt = path.parse(filename).name;
  const readableName = nameWithoutExt
    .split(/[-_]/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Get file creation/modification date
  const stats = fs.statSync(imagePath);
  const date = exif?.DateTimeOriginal || stats.mtime;

  return {
    name: readableName,
    src: `/images/clicks/${filename}`,
    tags: ['photography'], // Default tag, can be customized later
    description: readableName, // Can be customized later
    date: date.toISOString().split('T')[0],
    location: exif?.GPSLatitude ? 'Location from EXIF' : 'Unknown Location'
  };
}

async function updateImagesYaml() {
  const clicksDir = path.join(process.cwd(), 'public', 'images', 'clicks');
  const yamlPath = path.join(process.cwd(), 'content', 'images.yaml');

  // Get all image files
  const imageFiles = fs.readdirSync(clicksDir)
    .filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file));

  // Generate metadata for each image
  const imageMetadata: ImageMetadata[] = [];
  for (const file of imageFiles) {
    const metadata = await getImageMetadata(path.join(clicksDir, file));
    imageMetadata.push(metadata);
  }

  // Sort by date
  imageMetadata.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Create YAML content
  const yamlContent = yaml.dump({ images: imageMetadata }, {
    indent: 2,
    lineWidth: -1,
    quotingType: '"'
  });

  // Write to file
  fs.writeFileSync(yamlPath, yamlContent, 'utf8');
  console.log(`Updated ${yamlPath} with ${imageMetadata.length} images`);
}

// Run the script
updateImagesYaml().catch(console.error); 