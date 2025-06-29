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
  excerpt: string;
  coverImage?: string;
  content: string;
  techStack?: string[];  // Array of technology tags
  isFeatured?: boolean;  // Whether the post should be featured
  showTags?: boolean;    // Whether to show tags for this post
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
    (data.coverImage === undefined || typeof data.coverImage === 'string') &&
    (data.techStack === undefined || Array.isArray(data.techStack)) &&
    (data.isFeatured === undefined || typeof data.isFeatured === 'boolean') &&
    (data.showTags === undefined || typeof data.showTags === 'boolean')
  );
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, slug, 'index.md');
    
    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      console.warn(`Blog post file not found: ${fullPath}`);
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Transform relative image paths to API routes
    let coverImage = data.coverImage;
    if (coverImage?.startsWith('./')) {
      coverImage = `/api/content/blogs/${slug}/${coverImage.slice(2)}`;
    }

    const post = {
      slug,
      title: data.title || null,
      date: data.date || null,
      excerpt: data.excerpt || null,
      coverImage,
      content,
      techStack: data.techStack || [],
      isFeatured: data.isFeatured ?? false,
      showTags: data.showTags !== false, // Default to true
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

export function getAllPosts(): BlogPost[] {
  try {
    const slugs = fs.readdirSync(postsDirectory);
    const posts = slugs
      .filter(slug => fs.existsSync(path.join(postsDirectory, slug, 'index.md')))
      .map(slug => getPostBySlug(slug))
      .filter((post): post is BlogPost => post !== null);

    return posts;
  } catch (error) {
    console.error('Error reading blog posts:', error);
    return [];
  }
}

// Function to get all unique tags from blog posts
export function getAllBlogTags(): string[] {
  try {
    const posts = getAllPosts();
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