import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getContentPath, slugify } from './utils';

export interface PostMeta {
  slug: string;
  title: string;
  published: string;
  categories: string[];
  description?: string;
}

export interface Post extends PostMeta {
  content: string;
}

export function getAllPosts(): PostMeta[] {
  const postsDir = getContentPath('posts');
  if (!fs.existsSync(postsDir)) return [];

  const slugs = fs.readdirSync(postsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  return slugs
    .map(slug => getPostMeta(slug))
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => new Date(b.published).getTime() - new Date(a.published).getTime());
}

export function getAllPostSlugs(): string[] {
  const postsDir = getContentPath('posts');
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

export function getPostMeta(slug: string): PostMeta | null {
  try {
    const filePath = getContentPath('posts', slug, 'index.md');
    if (!fs.existsSync(filePath)) return null;
    const source = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(source);
    return {
      slug,
      title: data.title || slug,
      published: data.published || '',
      categories: data.categories || [],
      description: data.description || '',
    };
  } catch {
    return null;
  }
}

export function getPost(slug: string): Post | null {
  try {
    const filePath = getContentPath('posts', slug, 'index.md');
    if (!fs.existsSync(filePath)) return null;
    const source = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(source);
    return {
      slug,
      title: data.title || slug,
      published: data.published || '',
      categories: data.categories || [],
      description: data.description || '',
      content,
    };
  } catch {
    return null;
  }
}

export function savePost(slug: string, frontmatter: Record<string, unknown>, content: string) {
  const dir = getContentPath('posts', slug);
  fs.mkdirSync(dir, { recursive: true });
  const filePath = path.join(dir, 'index.md');
  const matterString = matter.stringify(content, frontmatter);
  fs.writeFileSync(filePath, matterString, 'utf-8');
}

export function deletePost(slug: string) {
  const dir = getContentPath('posts', slug);
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true });
  }
}

export function createPost(title: string, categories: string[]): string {
  const slug = slugify(title);
  const published = new Date().toISOString().split('T')[0];
  const frontmatter = { title, published, categories, description: '' };
  savePost(slug, frontmatter, '# ' + title + '\n\nStart writing...');
  return slug;
}
