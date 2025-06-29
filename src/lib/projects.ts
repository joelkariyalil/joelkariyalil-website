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

export interface Project {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  coverImage: string;
  content: string;
  htmlContent?: string;  // Add HTML content field
  tags: string[];  // Array of technology/topic tags
  isFeatured?: boolean;  // Whether the project should be featured
}

const projectsDirectory = path.join(process.cwd(), 'content/projects');

async function processMarkdown(content: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content);
  
  return result.toString();
}

export async function getProjectBySlug(slug: string): Promise<Project> {
  try {
    const fullPath = path.join(projectsDirectory, slug, 'index.md');
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Project file not found: ${fullPath}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    // Ensure required fields have default values
    const title = data.title || 'Untitled Project';
    const date = data.date || new Date().toISOString().split('T')[0];
    const excerpt = data.excerpt || '';

    // Transform relative image paths to API routes
    let coverImage = data.coverImage;
    if (coverImage?.startsWith('./')) {
      coverImage = `/content/projects/${slug}/${coverImage.slice(2)}`;
    } else if (!coverImage) {
      coverImage = '/images/default-project-cover.jpg'; // Provide a default cover image
    }

    // Process markdown content
    const htmlContent = await processMarkdown(content || '');

    return {
      slug,
      title,
      date,
      excerpt,
      coverImage,
      content: content || '',
      htmlContent,
      tags: Array.isArray(data.tags) ? data.tags : [], // Ensure tags is always an array
      isFeatured: Boolean(data.isFeatured), // Ensure boolean value
    };
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    // Return a default project object if there's an error
    return {
      slug,
      title: 'Error Loading Project',
      date: new Date().toISOString().split('T')[0],
      excerpt: 'This project could not be loaded.',
      coverImage: '/images/default-project-cover.jpg',
      content: '',
      htmlContent: '',
      tags: [],
      isFeatured: false,
    };
  }
}

export async function getAllProjects(): Promise<Project[]> {
  try {
    const slugs = fs.readdirSync(projectsDirectory)
      .filter(slug => fs.existsSync(path.join(projectsDirectory, slug, 'index.md')));

    const projects = await Promise.all(
      slugs.map(slug => getProjectBySlug(slug))
    );

    // Filter out any null or undefined projects and sort by date
    return projects
      .filter(Boolean)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error loading projects:', error);
    return [];
  }
}

// New function to get all unique tags
export function getAllTags(): string[] {
  try {
    const projects = fs.readdirSync(projectsDirectory)
      .filter(slug => fs.existsSync(path.join(projectsDirectory, slug, 'index.md')))
      .map(slug => {
        try {
          const fullPath = path.join(projectsDirectory, slug, 'index.md');
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data } = matter(fileContents);
          return Array.isArray(data.tags) ? data.tags : [];
        } catch {
          return [];
        }
      })
      .flat();

    return Array.from(new Set(projects)).sort();
  } catch (error) {
    console.error('Error loading tags:', error);
    return [];
  }
} 