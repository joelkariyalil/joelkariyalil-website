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
  const fullPath = path.join(projectsDirectory, slug, 'index.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Transform relative image paths to API routes
  let coverImage = data.coverImage;
  if (coverImage?.startsWith('./')) {
    coverImage = `/content/projects/${slug}/${coverImage.slice(2)}`;
  }

  // Process markdown content
  const htmlContent = await processMarkdown(content);

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    coverImage: coverImage,
    content,
    htmlContent,
    tags: data.tags || [], // Default to empty array if no tags
    isFeatured: data.isFeatured ?? false, // Default to false if not specified
  };
}

export async function getAllProjects(): Promise<Project[]> {
  const slugs = fs.readdirSync(projectsDirectory);
  const projects = await Promise.all(
    slugs
      .filter(slug => fs.existsSync(path.join(projectsDirectory, slug, 'index.md')))
      .map(slug => getProjectBySlug(slug))
  );

  return projects;
}

// New function to get all unique tags
export function getAllTags(): string[] {
  const projects = fs.readdirSync(projectsDirectory)
    .filter(slug => fs.existsSync(path.join(projectsDirectory, slug, 'index.md')))
    .map(slug => {
      const fullPath = path.join(projectsDirectory, slug, 'index.md');
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return data.tags || [];
    })
    .flat();

  return Array.from(new Set(projects)).sort();
} 