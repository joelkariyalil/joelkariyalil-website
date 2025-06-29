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
  tags: string[];  // Array of technology/topic tags
  isFeatured?: boolean;  // Whether the project should be featured
}

const projectsDirectory = path.join(process.cwd(), 'content/projects');

function getAssetsList(projectPath: string): string[] {
  const assetsPath = path.join(projectPath, 'assets');
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

export function getProjectBySlug(slug: string): Project {
  const fullPath = path.join(projectsDirectory, slug, 'index.md');
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  // Transform relative image paths to API routes
  let coverImage = data.coverImage;
  if (coverImage?.startsWith('./')) {
    coverImage = `/content/projects/${slug}/${coverImage.slice(2)}`;
  }

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    coverImage: coverImage,
    content,
    tags: data.tags || [], // Default to empty array if no tags
    isFeatured: data.isFeatured ?? false, // Default to false if not specified
  };
}

export function getAllProjects(): Project[] {
  const slugs = fs.readdirSync(projectsDirectory);
  const projects = slugs
    .filter(slug => fs.existsSync(path.join(projectsDirectory, slug, 'index.md')))
    .map(slug => getProjectBySlug(slug));

  return projects;
}

// New function to get all unique tags
export function getAllTags(): string[] {
  const projects = getAllProjects();
  const tagSet = new Set<string>();
  
  projects.forEach(project => {
    project.tags.forEach(tag => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
} 