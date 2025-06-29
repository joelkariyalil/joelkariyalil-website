import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeHighlight from 'rehype-highlight';
import readingTime from 'reading-time';

export interface TableOfContents {
  id: string;
  text: string;
  level: number;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author?: {
    name: string;
    picture: string;
  };
  ogImage?: {
    url: string;
  };
  readingTime: string;
  tableOfContents: Array<{
    text: string;
    id: string;
    level: number;
  }>;
  techStack?: string[];
  isFeatured?: boolean;
  showTags?: boolean;
}

const postsDirectory = path.join(process.cwd(), 'content/blogs');

function getAssetsList(postPath: string): string[] {
  const assetsPath = path.join(postPath, 'assets');
  if (!fs.existsSync(assetsPath)) return [];

  const getFiles = (dir: string): string[] => {
    const files = fs.readdirSync(dir);
    let fileList: string[] = [];

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        fileList = fileList.concat(getFiles(filePath));
      } else {
        fileList.push(filePath.replace(assetsPath + '/', ''));
      }
    });

    return fileList;
  };

  return getFiles(assetsPath);
}

function isValidBlogPost(data: any): data is BlogPost {
  return (
    typeof data.slug === 'string' &&
    typeof data.title === 'string' &&
    typeof data.date === 'string' &&
    typeof data.excerpt === 'string' &&
    typeof data.content === 'string' &&
    (data.coverImage === null || typeof data.coverImage === 'string') &&
    Array.isArray(data.techStack) &&
    typeof data.isFeatured === 'boolean' &&
    typeof data.showTags === 'boolean' &&
    typeof data.readingTime === 'string' &&
    Array.isArray(data.tableOfContents) &&
    (data.author === null || (
      typeof data.author === 'object' &&
      data.author !== null &&
      (data.author.name === null || typeof data.author.name === 'string') &&
      (data.author.picture === null || typeof data.author.picture === 'string')
    )) &&
    (data.ogImage === null || (
      typeof data.ogImage === 'object' &&
      data.ogImage !== null &&
      (data.ogImage.url === null || typeof data.ogImage.url === 'string')
    ))
  );
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, slug, 'index.md');
    const postPath = path.dirname(fullPath);
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.warn(`Blog post file not found: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Get list of available assets
    const availableAssets = getAssetsList(postPath);

    // Transform relative image paths to API routes
    let coverImage = data.coverImage;
    if (coverImage?.startsWith('./')) {
      const assetPath = coverImage.slice(2); // Remove './'
      if (!availableAssets.includes(assetPath.replace('assets/', ''))) {
        console.warn(`Cover image not found: ${assetPath} in post ${slug}`);
        coverImage = null;
      } else {
        coverImage = `/api/content/blogs/${slug}/${assetPath}`;
      }
    }

    // Process markdown content
    const processedContent = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeAutolinkHeadings)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(content);

    // Extract table of contents from headings
    const headings: TableOfContents[] = [];
    const contentStr = processedContent.toString();
    const headingRegex = /<h([1-6])\s+id="([^"]+)"[^>]*>([^<]+)<\/h[1-6]>/g;
    let match;
    while ((match = headingRegex.exec(contentStr)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        id: match[2],
        text: match[3],
      });
    }

    // Calculate reading time
    const readingTimeResult = readingTime(content);

    // Validate and transform asset paths in content
    let processedContentStr = contentStr;
    const assetRegex = /(?:src|poster)="\.\/assets\/([^"]+)"/g;
    while ((match = assetRegex.exec(contentStr)) !== null) {
      const assetPath = match[1];
      if (!availableAssets.includes(assetPath)) {
        console.warn(`Asset not found: ${assetPath} in post ${slug}`);
      }
    }

    const post = {
      slug,
      title: data.title || null,
      date: data.date || null,
      excerpt: data.excerpt || null,
      coverImage: coverImage || null,
      content: processedContentStr || '',
      techStack: data.techStack || [],
      isFeatured: data.isFeatured ?? false,
      showTags: data.showTags !== false,
      readingTime: readingTimeResult.text,
      tableOfContents: headings,
      author: data.author ? {
        name: data.author.name || null,
        picture: data.author.picture || null
      } : null,
      ogImage: data.ogImage ? {
        url: data.ogImage.url || null
      } : null
    };

    if (!isValidBlogPost(post)) {
      console.warn(`Invalid blog post data for ${slug}:`, post);
      return null;
    }

    return post;
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const slugs = fs.readdirSync(postsDirectory);
    const postsPromises = slugs
      .filter(slug => fs.existsSync(path.join(postsDirectory, slug, 'index.md')))
      .map(slug => getPostBySlug(slug));
    
    const posts = (await Promise.all(postsPromises)).filter((post): post is BlogPost => post !== null);
    return posts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

// Function to get all unique tags from blog posts
export async function getAllBlogTags(): Promise<string[]> {
  try {
    const posts = await getAllPosts();
    const tagSet = new Set<string>();
    
    posts.forEach(post => {
      if (post.techStack) {
        post.techStack.forEach(tag => tagSet.add(tag));
      }
    });

    return Array.from(tagSet).sort();
  } catch (error) {
    console.error('Error getting blog tags:', error);
    return [];
  }
} 