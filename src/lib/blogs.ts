import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeSlug from 'rehype-slug';
import rehypeHighlight from 'rehype-highlight';

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  coverImage: string;
  excerpt: string;
  content: string;
  htmlContent?: string;
  isFeatured?: boolean;
  showTags?: boolean;
  techStack?: string[];
}

const blogsDirectory = path.join(process.cwd(), 'content/blogs');

function validateImagePath(imagePath: string, postSlug: string): string | null {
  // If the path is absolute (starts with /), return as is
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // If the path starts with ./, remove it
  const cleanPath = imagePath.startsWith('./') ? imagePath.slice(2) : imagePath;
  
  // Construct the full path
  const fullPath = path.join(blogsDirectory, postSlug, cleanPath);
  
  // Check if the file exists
  if (fs.existsSync(fullPath)) {
    // Return the path that will be served by the API
    return `/content/blogs/${postSlug}/${cleanPath}`;
  }

  return null;
}

// Process markdown content and handle image paths
async function processMarkdown(content: string, slug: string): Promise<string> {
  // First, replace relative image paths in the content
  const processedContent = content.replace(
    /!\[([^\]]*)\]\(\.\/([^)]+)\)/g,
    (_match, alt, imagePath) => {
      const fullImagePath = `/content/blogs/${slug}/${imagePath}`;
      return `![${alt}](${fullImagePath})`;
    }
  );

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(processedContent);
  
  return result.toString();
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
  try {
    const fullPath = path.join(blogsDirectory, slug, 'index.md');
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Blog post file not found: ${fullPath}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Ensure required fields have default values
    const title = data.title || 'Untitled Post';
    const date = data.date || new Date().toISOString().split('T')[0];
    const excerpt = data.excerpt || '';

    // Handle cover image
    let coverImage = null;
    if (data.coverImage) {
      coverImage = validateImagePath(data.coverImage, slug);
    }
    
    // If no valid cover image is found, try the default locations
    if (!coverImage) {
      const possiblePaths = [
        path.join(blogsDirectory, slug, 'assets/cover.jpg'),
        path.join(blogsDirectory, slug, 'assets/cover.png'),
        path.join(blogsDirectory, slug, 'cover.jpg'),
        path.join(blogsDirectory, slug, 'cover.png')
      ];

      for (const imgPath of possiblePaths) {
        if (fs.existsSync(imgPath)) {
          const relativePath = path.relative(path.join(blogsDirectory, slug), imgPath);
          coverImage = `/content/blogs/${slug}/${relativePath}`;
          break;
        }
      }
    }

    // If still no cover image, use a default
    if (!coverImage) {
      coverImage = '/images/default-blog-cover.svg';
    }

    // Process markdown content
    const htmlContent = await processMarkdown(content || '', slug);

    return {
      slug,
      title,
      date,
      excerpt,
      coverImage,
      content: content || '',
      htmlContent,
      isFeatured: Boolean(data.isFeatured),
      showTags: Boolean(data.showTags),
      techStack: Array.isArray(data.techStack) ? data.techStack : []
    };
  } catch (error) {
    console.error(`Error loading blog post ${slug}:`, error);
    // Return a default blog post object if there's an error
    return {
      slug,
      title: 'Error Loading Post',
      date: new Date().toISOString().split('T')[0],
      excerpt: 'This post could not be loaded.',
      coverImage: '/images/default-blog-cover.svg',
      content: '',
      htmlContent: '',
      isFeatured: false,
      showTags: false,
      techStack: []
    };
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const slugs = fs.readdirSync(blogsDirectory)
      .filter(slug => fs.existsSync(path.join(blogsDirectory, slug, 'index.md')));

    const posts = await Promise.all(
      slugs.map(slug => getBlogPostBySlug(slug))
    );

    // Filter out any null or undefined posts and sort by date
    return posts
      .filter(Boolean)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export function getAllTechStacks(): string[] {
  try {
    const techStacks = fs.readdirSync(blogsDirectory)
      .filter(slug => fs.existsSync(path.join(blogsDirectory, slug, 'index.md')))
      .map(slug => {
        try {
          const fullPath = path.join(blogsDirectory, slug, 'index.md');
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContents);
          return Array.isArray(data.techStack) ? data.techStack : [];
        } catch {
          return [];
        }
      })
      .flat();

    return Array.from(new Set(techStacks)).sort();
  } catch (error) {
    console.error('Error loading tech stacks:', error);
    return [];
  }
} 