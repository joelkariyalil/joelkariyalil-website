import fs from 'fs';
import path from 'path';

interface ContentItem {
  type: 'blog' | 'project';
  slug: string;
  assetsDir: string;
}

function scanContentDirectory(): ContentItem[] {
  const items: ContentItem[] = [];
  
  // Scan blogs
  const blogsDir = path.join(process.cwd(), 'content', 'blogs');
  fs.readdirSync(blogsDir).forEach(slug => {
    const assetsDir = path.join(blogsDir, slug, 'assets');
    if (fs.existsSync(path.join(blogsDir, slug, 'index.md'))) {
      items.push({ type: 'blog', slug, assetsDir });
    }
  });

  // Scan projects
  const projectsDir = path.join(process.cwd(), 'content', 'projects');
  fs.readdirSync(projectsDir).forEach(slug => {
    const assetsDir = path.join(projectsDir, slug, 'assets');
    if (fs.existsSync(path.join(projectsDir, slug, 'index.md'))) {
      items.push({ type: 'project', slug, assetsDir });
    }
  });

  return items;
}

function ensureAssetsDirectories(items: ContentItem[]) {
  items.forEach(item => {
    if (!fs.existsSync(item.assetsDir)) {
      fs.mkdirSync(item.assetsDir, { recursive: true });
      console.log(`Created assets directory for ${item.type} "${item.slug}"`);
    }
  });
}

function validateImages(items: ContentItem[]) {
  items.forEach(item => {
    const mdPath = path.join(process.cwd(), 'content', item.type + 's', item.slug, 'index.md');
    const mdContent = fs.readFileSync(mdPath, 'utf8');
    
    // Find all image references in markdown
    const imageRegex = /!\[.*?\]\((.*?)\)/g;
    let match;
    
    while ((match = imageRegex.exec(mdContent)) !== null) {
      const imagePath = match[1];
      if (!imagePath.startsWith('http')) {
        const fullPath = path.join(path.dirname(mdPath), imagePath);
        if (!fs.existsSync(fullPath)) {
          console.warn(`Warning: Image "${imagePath}" not found in ${item.type} "${item.slug}"`);
        }
      }
    }

    // Check for cover image in frontmatter
    const coverImageMatch = mdContent.match(/cover:\s*["']?(.*?)["']?\n/);
    if (coverImageMatch) {
      const coverPath = coverImageMatch[1];
      if (!coverPath.startsWith('http')) {
        const fullPath = path.join(path.dirname(mdPath), coverPath);
        if (!fs.existsSync(fullPath)) {
          console.warn(`Warning: Cover image "${coverPath}" not found in ${item.type} "${item.slug}"`);
        }
      }
    }
  });
}

function main() {
  console.log('Scanning content directories...');
  const items = scanContentDirectory();
  
  console.log('Ensuring assets directories exist...');
  ensureAssetsDirectories(items);
  
  console.log('Validating image references...');
  validateImages(items);
  
  console.log('Done!');
}

main(); 