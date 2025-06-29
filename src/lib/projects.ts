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
  htmlContent?: string;
  tags: string[];
  isFeatured?: boolean;
  githubUrl?: string;
  demoUrl?: string;
}

const projectsDirectory = path.join(process.cwd(), 'content/projects');

function validateImagePath(imagePath: string, projectSlug: string): string | null {
  // If the path is absolute (starts with /), return as is
  if (imagePath.startsWith('/')) {
    return imagePath;
  }

  // If the path starts with ./, remove it
  const cleanPath = imagePath.startsWith('./') ? imagePath.slice(2) : imagePath;
  
  // Construct the full path
  const fullPath = path.join(projectsDirectory, projectSlug, cleanPath);
  
  // Check if the file exists
  if (fs.existsSync(fullPath)) {
    // Return the path that will be served by the API
    return `/content/projects/${projectSlug}/${cleanPath}`;
  }

  return null;
}

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

    // Handle cover image
    let coverImage = null;
    if (data.coverImage) {
      coverImage = validateImagePath(data.coverImage, slug);
    }
    
    // If no valid cover image is found, try the default locations
    if (!coverImage) {
      const possiblePaths = [
        path.join(projectsDirectory, slug, 'assets/cover.jpg'),
        path.join(projectsDirectory, slug, 'assets/cover.png'),
        path.join(projectsDirectory, slug, 'cover.jpg'),
        path.join(projectsDirectory, slug, 'cover.png')
      ];

      for (const imgPath of possiblePaths) {
        if (fs.existsSync(imgPath)) {
          const relativePath = path.relative(path.join(projectsDirectory, slug), imgPath);
          coverImage = `/content/projects/${slug}/${relativePath}`;
          break;
        }
      }
    }

    // If still no cover image, use a default
    if (!coverImage) {
      coverImage = '/images/default-project-cover.svg';
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
      tags: Array.isArray(data.tags) ? data.tags : [],
      isFeatured: Boolean(data.isFeatured),
      githubUrl: data.githubUrl || null,
      demoUrl: data.demoUrl || null
    };
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error);
    // Return a default project object if there's an error
    return {
      slug,
      title: 'Error Loading Project',
      date: new Date().toISOString().split('T')[0],
      excerpt: 'This project could not be loaded.',
      coverImage: '/images/default-project-cover.svg',
      content: '',
      htmlContent: '',
      tags: [],
      isFeatured: false
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